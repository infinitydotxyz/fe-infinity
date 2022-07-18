import { defaultAbiCoder } from '@ethersproject/abi';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { splitSignature } from '@ethersproject/bytes';
import { MaxUint256 } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcSigner } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { ERC20ABI, ERC721ABI, InfinityExchangeABI, InfinityOBComplicationABI } from '@infinityxyz/lib-frontend/abi';
import {
  ChainNFTs,
  ChainOBOrder,
  FirestoreOrderItem,
  OBOrder,
  OBOrderItem,
  SignedOBOrder
} from '@infinityxyz/lib-frontend/types/core';
import {
  getCurrentOBOrderPrice,
  getExchangeAddress,
  getOBComplicationAddress,
  getTxnCurrencyAddress,
  nowSeconds,
  NULL_ADDRESS,
  trimLowerCase
} from '@infinityxyz/lib-frontend/utils';
import { DEFAULT_MAX_GAS_PRICE_WEI } from '../constants';
import { User } from '../context/AppContext';

export async function getSignedOBOrder(
  user: User,
  chainId: BigNumberish,
  signer: JsonRpcSigner,
  order: OBOrder
): Promise<SignedOBOrder | undefined> {
  // sign
  const infinityExchangeAddress = getExchangeAddress(chainId.toString());
  const infinityExchange = new Contract(infinityExchangeAddress, InfinityExchangeABI, signer);
  const signedOrder = await prepareOBOrder(user, chainId, signer, order, infinityExchange);
  if (!signedOrder) {
    const msg = 'Failed to sign order';
    console.error(msg);
    throw msg;
  }
  const signedOBOrder: SignedOBOrder = { ...order, signedOrder };
  return signedOBOrder;
}

// Order book orders
export async function prepareOBOrder(
  user: User,
  chainId: BigNumberish,
  signer: JsonRpcSigner,
  order: OBOrder,
  infinityExchange: Contract
): Promise<ChainOBOrder | undefined> {
  // grant approvals
  const approvals = await grantApprovals(user, order, signer, infinityExchange.address);
  if (!approvals) {
    return undefined;
  }

  const validOrder = await isOrderValid(user, order, infinityExchange, signer);
  if (!validOrder) {
    return undefined;
  }

  // sign order
  const chainOBOrder = await signOBOrder(chainId, order, signer);
  return chainOBOrder;
}

export async function isOrderValid(
  user: User,
  order: OBOrder,
  infinityExchange: Contract,
  signer: JsonRpcSigner
): Promise<boolean> {
  // check timestamps
  if (Date.now() > order.endTimeMs) {
    console.error('Order timestamps are not valid');
    return false;
  }

  // check if nonce is valid
  const isNonceValid = await infinityExchange.isNonceValid(user.address, order.nonce);
  console.log('Nonce valid:', isNonceValid);
  if (!isNonceValid) {
    console.error('Order nonce is not valid');
    return false;
  }

  // check on chain ownership
  if (order.isSellOrder) {
    const isCurrentOwner = await checkOnChainOwnership(user, order, signer);
    if (!isCurrentOwner) {
      return false;
    }
  }

  // default
  return true;
}

export async function grantApprovals(
  user: User,
  order: OBOrder,
  signer: JsonRpcSigner,
  exchange: string
): Promise<boolean> {
  try {
    console.log('Granting approvals');
    if (!order.isSellOrder) {
      // approve currencies
      const currentPrice = getCurrentOBOrderPrice(order);
      await approveERC20(user.address, order.execParams.currencyAddress, currentPrice, signer, exchange);
    } else {
      // approve collections
      await approveERC721(user.address, order.nfts, signer, exchange);
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function approveERC20(
  user: string,
  currencyAddress: string,
  price: BigNumberish,
  signer: JsonRpcSigner,
  infinityExchangeAddress: string
) {
  try {
    console.log('Granting ERC20 approval');
    if (currencyAddress !== NULL_ADDRESS) {
      const contract = new Contract(currencyAddress, ERC20ABI, signer);
      const allowance = BigNumber.from(await contract.allowance(user, infinityExchangeAddress));
      if (allowance.lt(price)) {
        await contract.approve(infinityExchangeAddress, MaxUint256);
      } else {
        console.log('ERC20 approval already granted');
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('failed granting erc20 approvals');
    throw new Error(e);
  }
}

export async function approveERC721ForChainNFTs(
  user: string,
  items: ChainNFTs[],
  signer: JsonRpcSigner,
  exchange: string
) {
  try {
    console.log('Granting ERC721 approval');
    const collectionsChecked = new Set<string>();
    const results: unknown[] = [];
    for (const item of items) {
      const collection = item.collection;
      if (!collectionsChecked.has(collection)) {
        const contract = new Contract(collection, ERC721ABI, signer);
        const isApprovedForAll = await contract.isApprovedForAll(user, exchange);
        if (!isApprovedForAll) {
          const result = await contract.setApprovalForAll(exchange, true);
          results.push(result);
        } else {
          console.log('Already approved for all');
        }
        collectionsChecked.add(collection);
      }
    }
    return results;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('failed granting erc721 approvals');
    throw new Error(e);
  }
}

export async function approveERC721(user: string, items: OBOrderItem[], signer: JsonRpcSigner, exchange: string) {
  try {
    console.log('Granting ERC721 approval');
    for (const item of items) {
      const collection = item.collectionAddress;
      const contract = new Contract(collection, ERC721ABI, signer);
      const isApprovedForAll = await contract.isApprovedForAll(user, exchange);
      if (!isApprovedForAll) {
        await contract.setApprovalForAll(exchange, true);
      } else {
        console.log('Already approved for all');
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('failed granting erc721 approvals');
    throw new Error(e);
  }
}

export async function checkOnChainOwnership(user: User, order: OBOrder, signer: JsonRpcSigner): Promise<boolean> {
  console.log('Checking on chain ownership');
  let result = true;
  for (const nft of order.nfts) {
    const collection = nft.collectionAddress;
    const contract = new Contract(collection, ERC721ABI, signer);
    for (const token of nft.tokens) {
      result = result && (await checkERC721Ownership(user, contract, token.tokenId));
    }
  }
  return result;
}

export async function checkERC721Ownership(user: User, contract: Contract, tokenId: BigNumberish): Promise<boolean> {
  try {
    console.log('Checking ERC721 on chain ownership');
    const owner = trimLowerCase(await contract.ownerOf(tokenId));
    if (owner !== trimLowerCase(user.address)) {
      // todo: adi should continue to check if other nfts are owned
      console.error('Order on chain ownership check failed');
      return false;
    }
  } catch (e) {
    console.error('Failed on chain ownership check; is collection ERC721 ?', e);
    return false;
  }
  return true;
}

export async function signOBOrder(
  chainId: BigNumberish,
  order: OBOrder,
  signer: JsonRpcSigner
): Promise<ChainOBOrder | undefined> {
  const domain = {
    name: 'InfinityComplication',
    version: '1',
    chainId: chainId,
    verifyingContract: order.execParams.complicationAddress || getOBComplicationAddress(chainId.toString())
  };

  const types = {
    Order: [
      { name: 'isSellOrder', type: 'bool' },
      { name: 'signer', type: 'address' },
      { name: 'constraints', type: 'uint256[]' },
      { name: 'nfts', type: 'OrderItem[]' },
      { name: 'execParams', type: 'address[]' },
      { name: 'extraParams', type: 'bytes' }
    ],
    OrderItem: [
      { name: 'collection', type: 'address' },
      { name: 'tokens', type: 'TokenInfo[]' }
    ],
    TokenInfo: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'numTokens', type: 'uint256' }
    ]
  };

  const constraints = [
    order.numItems,
    parseEther(String(order.startPriceEth)),
    parseEther(String(order.endPriceEth)),
    Math.floor(order.startTimeMs / 1000),
    Math.floor(order.endTimeMs / 1000),
    order.nonce,
    order.maxGasPriceWei
  ];

  const nfts: ChainNFTs[] = order.nfts.reduce((acc: ChainNFTs[], { collectionAddress, tokens }) => {
    let nft = acc.find(({ collection }) => collection === collectionAddress);
    if (!nft) {
      nft = { collection: collectionAddress, tokens: [] };
      acc.push(nft);
    }
    const chainTokens = [];
    for (const token of tokens) {
      chainTokens.push({
        tokenId: token.tokenId,
        numTokens: token.numTokens
      });
    }
    nft.tokens.push(...chainTokens);
    return acc;
  }, [] as ChainNFTs[]);

  // don't use ?? operator here
  const execParams = [
    order.execParams.complicationAddress || getOBComplicationAddress(chainId.toString()),
    order.execParams.currencyAddress || getTxnCurrencyAddress(chainId.toString())
  ];
  // don't use ?? operator here
  const extraParams = defaultAbiCoder.encode(['address'], [order.extraParams.buyer || NULL_ADDRESS]);

  const orderToSign = {
    isSellOrder: order.isSellOrder,
    signer: order.makerAddress,
    constraints,
    nfts,
    execParams,
    extraParams
  };

  // sign order
  try {
    const sig = await signer._signTypedData(domain, types, orderToSign);
    const splitSig = splitSignature(sig ?? '');
    const encodedSig = defaultAbiCoder.encode(['bytes32', 'bytes32', 'uint8'], [splitSig.r, splitSig.s, splitSig.v]);
    const signedOrder: ChainOBOrder = { ...orderToSign, sig: encodedSig };
    return signedOrder;
  } catch (e) {
    console.error('Error signing order', e);
  }
}

export const getCurrentChainOBOrderPrice = (order: ChainOBOrder): BigNumber => {
  const startPrice = BigNumber.from(order.constraints[1]);
  const endPrice = BigNumber.from(order.constraints[2]);
  const startTime = BigNumber.from(order.constraints[3]);
  const endTime = BigNumber.from(order.constraints[4]);
  const duration = endTime.sub(startTime);
  let priceDiff = BigNumber.from(0);
  if (startPrice.gt(endPrice)) {
    priceDiff = startPrice.sub(endPrice);
  } else {
    priceDiff = endPrice.sub(startPrice);
  }
  if (priceDiff.eq(0) || duration.eq(0)) {
    return startPrice;
  }
  const elapsedTime = BigNumber.from(nowSeconds()).sub(startTime);
  const precision = 10000;
  const portion = elapsedTime.gt(duration) ? precision : elapsedTime.mul(precision).div(duration);
  priceDiff = priceDiff.mul(portion).div(precision);
  let currentPrice = BigNumber.from(0);
  if (startPrice.gt(endPrice)) {
    currentPrice = startPrice.sub(priceDiff);
  } else {
    currentPrice = startPrice.add(priceDiff);
  }
  return currentPrice;
};

export async function signChainOBOrder(
  chainId: BigNumberish,
  contractAddress: string,
  order: ChainOBOrder,
  signer: JsonRpcSigner
): Promise<string> {
  const domain = {
    name: 'InfinityExchange',
    version: '1',
    chainId: chainId,
    verifyingContract: contractAddress
  };

  const types = {
    Order: [
      { name: 'isSellOrder', type: 'bool' },
      { name: 'signer', type: 'address' },
      { name: 'constraints', type: 'uint256[]' },
      { name: 'nfts', type: 'OrderItem[]' },
      { name: 'execParams', type: 'address[]' },
      { name: 'extraParams', type: 'bytes' }
    ],
    OrderItem: [
      { name: 'collection', type: 'address' },
      { name: 'tokens', type: 'TokenInfo[]' }
    ],
    TokenInfo: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'numTokens', type: 'uint256' }
    ]
  };

  // remove sig
  const orderToSign = {
    isSellOrder: order.isSellOrder,
    signer: order.signer,
    constraints: order.constraints,
    nfts: order.nfts,
    execParams: order.execParams,
    extraParams: order.extraParams
  };

  // sign order
  try {
    const sig = await signer._signTypedData(domain, types, orderToSign);
    const splitSig = splitSignature(sig ?? '');
    const encodedSig = defaultAbiCoder.encode(['bytes32', 'bytes32', 'uint8'], [splitSig.r, splitSig.s, splitSig.v]);
    return encodedSig;
  } catch (e) {
    console.error('Error signing order', e);
  }
  return '';
}

export async function sendSingleNft(
  signer: JsonRpcSigner,
  chainId: string,
  collectionAddress: string,
  tokenId: string,
  toAddress: string
) {
  const erc721 = new Contract(collectionAddress, ERC721ABI, signer);
  // perform send
  const from = await signer.getAddress();
  const transferResult = await erc721['safeTransferFrom(address,address,uint256)'](from, toAddress, tokenId);
  console.log('transferResult', transferResult);
  return {
    hash: transferResult?.hash ?? ''
  };
}

export async function sendMultipleNfts(
  signer: JsonRpcSigner,
  chainId: string,
  orderItems: ChainNFTs[],
  toAddress: string
) {
  const exchangeAddress = getExchangeAddress(chainId);
  const infinityExchange = new Contract(exchangeAddress, InfinityExchangeABI, signer);
  const from = await signer.getAddress();
  // grant approvals
  await approveERC721ForChainNFTs(from, orderItems, signer, exchangeAddress);
  // perform send
  const transferResult = await infinityExchange.transferMultipleNFTs(toAddress, orderItems);
  return {
    hash: transferResult?.hash ?? ''
  };
}

export async function cancelAllOrders(signer: JsonRpcSigner, chainId: string, minOrderNonce: number) {
  const exchangeAddress = getExchangeAddress(chainId);
  const infinityExchange = new Contract(exchangeAddress, InfinityExchangeABI, signer);
  // perform cancel
  const cancelResult = await infinityExchange.cancelAllOrders(minOrderNonce);
  return {
    hash: cancelResult?.hash ?? ''
  };
}

export async function cancelMultipleOrders(signer: JsonRpcSigner, chainId: string, nonces: number[]) {
  const exchangeAddress = getExchangeAddress(chainId);
  const infinityExchange = new Contract(exchangeAddress, InfinityExchangeABI, signer);
  // perform cancel
  const cancelResult = await infinityExchange.cancelMultipleOrders(nonces);
  return {
    hash: cancelResult?.hash ?? ''
  };
}

export async function canTakeMultipleOneOrders(
  signer: JsonRpcSigner,
  chainId: string,
  makerOrders: ChainOBOrder[]
): Promise<'staleOwner' | 'cannotExecute' | 'yes' | 'no'> {
  try {
    // check if maker orders are valid and can be executed
    for (const makerOrder of makerOrders) {
      const complicationAddress = makerOrder.execParams[0];
      // todo: adi other complications in future
      const complication = new Contract(complicationAddress, InfinityOBComplicationABI, signer);
      const canExec = await complication.canExecTakeOneOrder(makerOrder);
      if (!canExec) {
        return 'cannotExecute';
      }

      // check ownership of nfts while taking sell orders
      for (const nft of makerOrder.nfts) {
        const collectionAddress = nft.collection;
        for (const token of nft.tokens) {
          const tokenId = token.tokenId;
          const erc721 = new Contract(collectionAddress, ERC721ABI, signer);
          const owner = trimLowerCase(await erc721.ownerOf(tokenId));
          if (owner !== trimLowerCase(makerOrder.signer)) {
            return 'staleOwner';
          }
        }
      }
    }
    return 'yes';
  } catch (e) {
    console.error('Error checking if can take multiple orders', e);
    return 'no';
  }
}

export async function takeMultipleOneOrders(signer: JsonRpcSigner, chainId: string, makerOrders: ChainOBOrder[]) {
  const exchangeAddress = getExchangeAddress(chainId);
  const infinityExchange = new Contract(exchangeAddress, InfinityExchangeABI, signer);
  const totalPrice = makerOrders
    .map((order) => getCurrentChainOBOrderPrice(order))
    .reduce((acc, curr) => acc.add(curr), BigNumber.from(0));

  // it is assumed that all orders have these value same, so no need to check. Contract throws if this is not the case.
  const isSellOrder = makerOrders[0].isSellOrder;

  const gasLimit = 200_000 * makerOrders.length;
  // perform exchange
  // if fulfilling a sell order, send ETH
  if (isSellOrder) {
    const options = {
      value: totalPrice,
      gasLimit
    };
    const result = await infinityExchange.takeMultipleOneOrders(makerOrders, options);
    return {
      hash: result?.hash ?? ''
    };
  } else {
    // approve ERC721
    const user = await signer.getAddress();
    const nfts = makerOrders.flatMap((order) => order.nfts);
    const approvalResults = await approveERC721ForChainNFTs(user, nfts, signer, exchangeAddress);

    for (const approval of approvalResults) {
      /**
       * wait one at a time in case there are a lot of approvals
       */
      const { hash } = approval as { hash: string };
      await signer.provider?.waitForTransaction(hash);
    }
    const result = await infinityExchange.takeMultipleOneOrders(makerOrders, { gasLimit });
    return {
      hash: result?.hash ?? ''
    };
  }
}

export function getOBOrderFromFirestoreOrderItem(firestoreOrderItem: FirestoreOrderItem | null | undefined) {
  const ord: OBOrder = {
    id: firestoreOrderItem?.id ?? '',
    chainId: firestoreOrderItem?.chainId ?? '',
    isSellOrder: firestoreOrderItem?.isSellOrder ?? false,
    numItems: firestoreOrderItem?.numItems ?? 0,
    makerUsername: firestoreOrderItem?.makerAddress ?? '',
    makerAddress: firestoreOrderItem?.makerAddress ?? '',
    startPriceEth: firestoreOrderItem?.startPriceEth ?? 0,
    endPriceEth: firestoreOrderItem?.endPriceEth ?? 0,
    startTimeMs: firestoreOrderItem?.startTimeMs ?? 0,
    endTimeMs: firestoreOrderItem?.endTimeMs ?? 0,
    nonce: 0,
    maxGasPriceWei: DEFAULT_MAX_GAS_PRICE_WEI,
    nfts: [],
    execParams: {
      currencyAddress: '',
      complicationAddress: ''
    },
    extraParams: {
      buyer: ''
    }
  };
  return ord;
}
