import { defaultAbiCoder } from '@ethersproject/abi';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { splitSignature } from '@ethersproject/bytes';
import { MaxUint256 } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { keccak256 } from '@ethersproject/keccak256';
import { JsonRpcSigner } from '@ethersproject/providers';
import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity';
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
  ETHEREUM_WETH_ADDRESS,
  getCurrentOBOrderPrice,
  getExchangeAddress,
  getOBComplicationAddress,
  getTxnCurrencyAddress,
  nowSeconds,
  NULL_ADDRESS,
  trimLowerCase
} from '@infinityxyz/lib-frontend/utils';
import { MerkleTree } from 'merkletreejs';
import { toastError } from 'src/components/common';
import { DEFAULT_MAX_GAS_PRICE_WEI, FLOW_ORDER_EIP_712_TYPES, ORDER_ROOT_EIP712_TYPES } from './constants';

export async function signOrders(
  signer: JsonRpcSigner,
  chainId: string,
  orders: OBOrder[]
): Promise<SignedOBOrder[] | undefined> {
  // sign
  const infinityExchangeAddress = getExchangeAddress(chainId.toString());
  const infinityExchange = new Contract(infinityExchangeAddress, InfinityExchangeABI, signer);
  const preSignedOrders: SignedOBOrder[] = [];
  for (const order of orders) {
    const preparedOrder = await prepareOBOrder(chainId, signer, order, infinityExchange);
    if (!preparedOrder) {
      throw new Error('Failed to prepare order');
    }
    preSignedOrders.push({ ...order, signedOrder: preparedOrder });
  }

  let fullySignedOrders: SignedOBOrder[] | undefined = [];

  if (preSignedOrders.length === 1) {
    fullySignedOrders = await signSingleOrder(signer, chainId, preSignedOrders);
  } else if (preSignedOrders.length > 1) {
    fullySignedOrders = await signBulkOrders(signer, chainId, preSignedOrders);
  }

  return fullySignedOrders;
}

// Order book orders
async function prepareOBOrder(
  chainId: string,
  signer: JsonRpcSigner,
  order: OBOrder,
  infinityExchange: Contract
): Promise<ChainOBOrder | undefined> {
  // grant approvals
  const approvals = await grantApprovals(order, signer, infinityExchange.address);
  if (!approvals) {
    return undefined;
  }

  const validOrder = await isOrderValid(order, infinityExchange, signer);
  if (!validOrder) {
    return undefined;
  }

  const constraints = [
    order.numItems,
    parseEther(String(order.startPriceEth)),
    parseEther(String(order.endPriceEth)),
    Math.floor(order.startTimeMs / 1000),
    Math.floor(order.endTimeMs / 1000),
    order.nonce,
    order.maxGasPriceWei
  ];
  if ('isTrustedExec' in order && order.isTrustedExec) {
    constraints.push(1);
  }

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

  const orderToSign: ChainOBOrder = {
    isSellOrder: order.isSellOrder,
    signer: order.makerAddress,
    constraints: constraints.map((item) => item.toString()),
    nfts,
    execParams,
    extraParams,
    sig: ''
  };

  return orderToSign;
}

async function isOrderValid(order: OBOrder, infinityExchange: Contract, signer: JsonRpcSigner): Promise<boolean> {
  const user = signer._address;
  // check timestamps
  if (Date.now() > order.endTimeMs) {
    console.error('Order timestamps are not valid');
    return false;
  }

  // check if nonce is valid
  const isNonceValid = await infinityExchange.isNonceValid(user, order.nonce);
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

async function grantApprovals(order: OBOrder, signer: JsonRpcSigner, exchange: string): Promise<boolean> {
  if (!order.isSellOrder) {
    // approve currencies
    const currentPrice = getCurrentOBOrderPrice(order);
    await approveERC20(order.execParams.currencyAddress, currentPrice, signer, exchange);

    // check if user has enough balance to fulfill this order
    await checkERC20Balance(order.execParams.currencyAddress, currentPrice, signer);
  } else {
    // approve collections
    await approveERC721(order.nfts, signer, exchange);
  }
  return true;
}

async function checkERC20Balance(currencyAddress: string, price: BigNumberish, signer: JsonRpcSigner) {
  const user = signer._address;
  if (currencyAddress !== NULL_ADDRESS) {
    const contract = new Contract(currencyAddress, ERC20ABI, signer);
    const balance = BigNumber.from(await contract.balanceOf(user));
    if (balance.lt(price)) {
      let msg = `Insufficient ERC20 balance to place order`;
      if (currencyAddress === ETHEREUM_WETH_ADDRESS) {
        msg = `Insufficient WETH balance to place order`;
      }
      throw new Error(msg);
    }
  }
}

async function approveERC20(
  currencyAddress: string,
  price: BigNumberish,
  signer: JsonRpcSigner,
  infinityExchangeAddress: string
) {
  try {
    const user = signer._address;
    if (currencyAddress !== NULL_ADDRESS) {
      const contract = new Contract(currencyAddress, ERC20ABI, signer);
      const allowance = BigNumber.from(await contract.allowance(user, infinityExchangeAddress));
      if (allowance.lt(price)) {
        await contract.approve(infinityExchangeAddress, MaxUint256);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('failed granting erc20 approvals');
    throw new Error(e);
  }
}

async function approveERC721ForChainNFTs(items: ChainNFTs[], signer: JsonRpcSigner, exchange: string) {
  try {
    const user = signer._address;
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

async function approveERC721(items: OBOrderItem[], signer: JsonRpcSigner, exchange: string) {
  try {
    const user = signer._address;
    for (const item of items) {
      const collection = item.collectionAddress;
      const contract = new Contract(collection, ERC721ABI, signer);
      const isApprovedForAll = await contract.isApprovedForAll(user, exchange);
      if (!isApprovedForAll) {
        await contract.setApprovalForAll(exchange, true);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('failed granting erc721 approvals');
    throw new Error(e);
  }
}

async function checkOnChainOwnership(user: string, order: OBOrder, signer: JsonRpcSigner): Promise<boolean> {
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

async function checkERC721Ownership(user: string, contract: Contract, tokenId: BigNumberish): Promise<boolean> {
  try {
    const owner = trimLowerCase(await contract.ownerOf(tokenId));
    if (owner !== trimLowerCase(user)) {
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

export const signSingleOrder = async (
  signer: JsonRpcSigner,
  chainId: string,
  preSignedOrders: SignedOBOrder[]
): Promise<SignedOBOrder[] | undefined> => {
  const orderToSign = preSignedOrders[0];
  let complicationAddress = orderToSign.execParams.complicationAddress;
  if (!complicationAddress) {
    complicationAddress = getOBComplicationAddress(chainId.toString());
  }

  const domain = {
    name: 'FlowComplication',
    version: '1',
    chainId: chainId,
    verifyingContract: complicationAddress
  };

  try {
    const sig = await signer._signTypedData(domain, FLOW_ORDER_EIP_712_TYPES, orderToSign.signedOrder);
    const splitSig = splitSignature(sig ?? '');
    const encodedSig = defaultAbiCoder.encode(['bytes32', 'bytes32', 'uint8'], [splitSig.r, splitSig.s, splitSig.v]);
    const signedOrder = {
      ...orderToSign,
      signedOrder: {
        ...orderToSign.signedOrder,
        sig: encodedSig
      }
    };
    return [signedOrder];
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const signBulkOrders = async (
  signer: JsonRpcSigner,
  chainId: string,
  preparedOrders: SignedOBOrder[]
): Promise<SignedOBOrder[] | undefined> => {
  const firstOrder = preparedOrders[0];
  let complicationAddress = firstOrder.execParams.complicationAddress;
  if (!complicationAddress) {
    complicationAddress = getOBComplicationAddress(chainId.toString());
  }

  const domain = {
    name: 'FlowComplication',
    version: '1',
    chainId: chainId,
    verifyingContract: complicationAddress
  };

  const preSignedOrders: SignedOBOrder[] = preparedOrders.map((order) => {
    const constraints = [
      order.numItems,
      parseEther(String(order.startPriceEth)),
      parseEther(String(order.endPriceEth)),
      Math.floor(order.startTimeMs / 1000),
      Math.floor(order.endTimeMs / 1000),
      order.nonce,
      order.maxGasPriceWei
    ];
    if ('isTrustedExec' in order && order.isTrustedExec) {
      constraints.push(1);
    }

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
      constraints: constraints.map((item) => item.toString()),
      nfts,
      execParams,
      extraParams,
      sig: ''
    };

    return { ...order, signedOrder: orderToSign };
  });

  const { tree, root } = await getOrderTreeRoot(preSignedOrders);

  const signedOrders: SignedOBOrder[] = [];
  try {
    const sig = await signer._signTypedData(domain, ORDER_ROOT_EIP712_TYPES, { root });
    const splitSig = splitSignature(sig ?? '');

    // sign each order
    for (let index = 0; index < preSignedOrders.length; index++) {
      const order = preSignedOrders[index].signedOrder;
      const hash = orderHash(order);
      const merkleProof = tree.getHexProof(hash);
      order.sig = defaultAbiCoder.encode(
        ['bytes32', 'bytes32', 'uint8', 'bytes32[]'],
        [splitSig.r, splitSig.s, splitSig.v, merkleProof]
      );

      signedOrders.push(preSignedOrders[index]);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }

  return signedOrders;
};

async function getOrderTreeRoot(orders: SignedOBOrder[]) {
  const leaves = await Promise.all(
    orders.map((order) => {
      return orderHash(order.signedOrder);
    })
  );
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  const root = tree.getHexRoot();
  return { tree, root };
}

function orderHash(order: ChainOBOrder): string {
  const fnSign =
    'Order(bool isSellOrder,address signer,uint256[] constraints,OrderItem[] nfts,address[] execParams,bytes extraParams)OrderItem(address collection,TokenInfo[] tokens)TokenInfo(uint256 tokenId,uint256 numTokens)';
  const orderTypeHash = solidityKeccak256(['string'], [fnSign]);

  const constraints = order.constraints;
  const execParams = order.execParams;
  const extraParams = order.extraParams;

  const typesArr = [];
  for (let i = 0; i < constraints.length; i++) {
    typesArr.push('uint256');
  }
  const constraintsHash = keccak256(defaultAbiCoder.encode(typesArr, constraints));

  const orderItemsHash = nftsHash(order.nfts);
  const execParamsHash = keccak256(defaultAbiCoder.encode(['address', 'address'], execParams));

  const calcEncode = defaultAbiCoder.encode(
    ['bytes32', 'bool', 'address', 'bytes32', 'bytes32', 'bytes32', 'bytes32'],
    [
      orderTypeHash,
      order.isSellOrder,
      order.signer,
      constraintsHash,
      orderItemsHash,
      execParamsHash,
      keccak256(extraParams)
    ]
  );

  return keccak256(calcEncode);
}

function nftsHash(nfts: ChainNFTs[]): string {
  const fnSign = 'OrderItem(address collection,TokenInfo[] tokens)TokenInfo(uint256 tokenId,uint256 numTokens)';
  const typeHash = solidityKeccak256(['string'], [fnSign]);

  const hashes: string[] = [];
  for (const nft of nfts) {
    const hash = keccak256(
      defaultAbiCoder.encode(['bytes32', 'uint256', 'bytes32'], [typeHash, nft.collection, tokensHash(nft.tokens)])
    );
    hashes.push(hash);
  }
  const encodeTypeArray = hashes.map(() => 'bytes32');
  const nftsHash = keccak256(defaultAbiCoder.encode(encodeTypeArray, hashes));

  return nftsHash;
}

function tokensHash(tokens: ChainNFTs['tokens']): string {
  const fnSign = 'TokenInfo(uint256 tokenId,uint256 numTokens)';
  const typeHash = solidityKeccak256(['string'], [fnSign]);

  const hashes: string[] = [];
  for (const token of tokens) {
    const hash = keccak256(
      defaultAbiCoder.encode(['bytes32', 'uint256', 'uint256'], [typeHash, token.tokenId, token.numTokens])
    );
    hashes.push(hash);
  }
  const encodeTypeArray = hashes.map(() => 'bytes32');
  const tokensHash = keccak256(defaultAbiCoder.encode(encodeTypeArray, hashes));
  return tokensHash;
}

const getCurrentChainOBOrderPrice = (order: ChainOBOrder): BigNumber => {
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

export async function sendSingleNft(
  signer: JsonRpcSigner,
  collectionAddress: string,
  tokenId: string,
  toAddress: string
) {
  const erc721 = new Contract(collectionAddress, ERC721ABI, signer);
  // perform send
  const from = await signer.getAddress();
  const transferResult = await erc721['safeTransferFrom(address,address,uint256)'](from, toAddress, tokenId);
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
  // grant approvals
  await approveERC721ForChainNFTs(orderItems, signer, exchangeAddress);
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
  makerOrders: ChainOBOrder[]
): Promise<'staleOwner' | 'cannotExecute' | 'yes' | 'no' | 'notOwner'> {
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
      const currentUser = trimLowerCase(await signer.getAddress());
      if (makerOrder.isSellOrder) {
        for (const nft of makerOrder.nfts) {
          const collectionAddress = nft.collection;
          for (const token of nft.tokens) {
            const tokenId = token.tokenId;
            const erc721 = new Contract(collectionAddress, ERC721ABI, signer);
            const owner = trimLowerCase(await erc721.ownerOf(tokenId));
            if (makerOrder.isSellOrder && owner !== trimLowerCase(makerOrder.signer)) {
              return 'staleOwner';
            }
            if (!makerOrder.isSellOrder && owner !== currentUser) {
              return 'notOwner';
            }
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

export async function takeOrders(
  signer: JsonRpcSigner,
  chainId: string,
  makerOrders: ChainOBOrder[],
  takerItems: ChainNFTs[][]
) {
  const exchangeAddress = getExchangeAddress(chainId);
  const infinityExchange = new Contract(exchangeAddress, InfinityExchangeABI, signer);
  const totalPrice = makerOrders
    .map((order) => getCurrentChainOBOrderPrice(order))
    .reduce((acc, curr) => acc.add(curr), BigNumber.from(0));

  // it is assumed that all orders have these value same, so no need to check. Contract throws if this is not the case.
  const isSellOrder = makerOrders[0].isSellOrder;
  const isCurrencyETH = makerOrders[0].execParams[1] === NULL_ADDRESS;

  if (isSellOrder && !isCurrencyETH) {
    toastError('Listing currency is not ETH. Cannot execute');
    return { hash: '' };
  }

  const gasLimit = 300_000 * makerOrders.length;
  // perform exchange
  // if fulfilling a sell order, send ETH
  if (isSellOrder) {
    const options = {
      value: totalPrice,
      gasLimit
    };
    const result = await infinityExchange.takeOrders(makerOrders, takerItems, options);
    // const options = {
    //   value: totalPrice
    // };
    // const result = await submitTransaction(infinityExchange, 'takeOrders', [makerOrders, takerItems], options);

    return {
      hash: result?.hash ?? ''
    };
  } else {
    // approve ERC721
    const nfts = takerItems.flatMap((takerItem) => takerItem);
    const approvalResults = await approveERC721ForChainNFTs(nfts, signer, exchangeAddress);

    for (const approval of approvalResults) {
      /**
       * wait one at a time in case there are a lot of approvals
       */
      const { hash } = approval as { hash: string };
      await signer.provider?.waitForTransaction(hash);
    }

    const result = await infinityExchange.takeOrders(makerOrders, takerItems, { gasLimit });
    // const result = await submitTransaction(infinityExchange, 'takeOrders', [makerOrders, takerItems]);
    return {
      hash: result?.hash ?? ''
    };
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
  const isCurrencyETH = makerOrders[0].execParams[1] === NULL_ADDRESS;
  const gasLimit = 300_000 * makerOrders.length;
  if (isSellOrder && !isCurrencyETH) {
    toastError('Listing currency is not ETH. Cannot execute');
    return { hash: '' };
  }

  // perform exchange
  // if fulfilling a sell order, send ETH
  if (isSellOrder) {
    const options = {
      value: totalPrice,
      gasLimit
    };
    const result = await infinityExchange.takeMultipleOneOrders(makerOrders, options);
    // const result = await submitTransaction(infinityExchange, 'takeMultipleOneOrders', [makerOrders], {
    //   value: totalPrice
    // });

    return {
      hash: result?.hash ?? ''
    };
  } else {
    // approve ERC721
    const nfts = makerOrders.flatMap((order) => order.nfts);
    const approvalResults = await approveERC721ForChainNFTs(nfts, signer, exchangeAddress);

    for (const approval of approvalResults) {
      /**
       * wait one at a time in case there are a lot of approvals
       */
      const { hash } = approval as { hash: string };
      await signer.provider?.waitForTransaction(hash);
    }

    const result = await infinityExchange.takeMultipleOneOrders(makerOrders, { gasLimit });
    // const result = await submitTransaction(infinityExchange, 'takeMultipleOneOrders', [makerOrders]);
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

// export const submitTransaction = async (
//   contract: Contract,
//   method: string,
//   methodArgs: unknown[],
//   _options: { value?: BigNumberish } = {}
// ) => {
//   const options: {
//     value?: BigNumberish;
//     gasLimit?: BigNumberish;
//   } = {
//     ..._options
//   };

//   console.log(`Preparing to submit transaction on contract ${contract.address} for method ${method}`);

//   const args = [...methodArgs, options];
//   const gasLimit = await contract.estimateGas[method](...args);

//   console.log(`Estimated gas limit: ${gasLimit.toString()}`);

//   options.gasLimit = gasLimit.mul(GAS_LIMIT_BUFFER * 1000).div(1000);

//   console.log(
//     `Submitting transaction on contract ${
//       contract.address
//     } for method ${method} with gas limit ${options.gasLimit.toString()}`
//   );

//   const result = await contract[method](...args);

//   console.log(`Transaction submitted with hash ${result.hash}`);

//   return result;
// };
