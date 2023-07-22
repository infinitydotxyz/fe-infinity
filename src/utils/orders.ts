import { defaultAbiCoder } from '@ethersproject/abi';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { hexConcat } from '@ethersproject/bytes';
import { MaxUint256 } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { keccak256 } from '@ethersproject/keccak256';
import { JsonRpcSigner } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { ERC20ABI, ERC721ABI, FlowExchangeABI, FlowOBComplicationABI } from '@infinityxyz/lib-frontend/abi';
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
  NULL_ADDRESS,
  getExchangeAddress,
  getOBComplicationAddress,
  getTxnCurrencyAddress,
  nowSeconds,
  trimLowerCase
} from '@infinityxyz/lib-frontend/utils';
import { _TypedDataEncoder } from 'ethers/lib/utils.js';
import { MerkleTree } from 'merkletreejs';
import { DEFAULT_MAX_GAS_PRICE_WEI, FLOW_ORDER_EIP_712_TYPES, ZERO_ADDRESS, ZERO_HASH } from './constants';

export async function checkERC20Balance(currencyAddress: string, price: BigNumberish, signer: JsonRpcSigner) {
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

export async function approveERC20(
  currencyAddress: string,
  price: BigNumberish,
  signer: JsonRpcSigner,
  flowExchangeAddress: string
): Promise<TransactionResponse | null> {
  try {
    const user = signer._address;
    if (currencyAddress !== NULL_ADDRESS) {
      const contract = new Contract(currencyAddress, ERC20ABI, signer);
      const allowance = BigNumber.from(await contract.allowance(user, flowExchangeAddress));
      if (allowance.lt(price)) {
        const txn: TransactionResponse = await contract.approve(flowExchangeAddress, MaxUint256);
        return txn;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('failed granting erc20 approvals');
    throw new Error(e);
  }
  return null;
}

export async function approveERC721ForChainNFTs(
  items: ChainNFTs[],
  signer: JsonRpcSigner,
  exchange: string
): Promise<TransactionResponse[]> {
  try {
    const user = signer._address;
    const collectionsChecked = new Set<string>();
    const results: TransactionResponse[] = [];
    for (const item of items) {
      const collection = item.collection;
      if (!collectionsChecked.has(collection)) {
        const contract = new Contract(collection, ERC721ABI, signer);
        const isApprovedForAll = await contract.isApprovedForAll(user, exchange);
        if (!isApprovedForAll) {
          const result: TransactionResponse = await contract.setApprovalForAll(exchange, true);
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

export async function approveERC721(
  items: OBOrderItem[],
  signer: JsonRpcSigner,
  exchange: string
): Promise<TransactionResponse[]> {
  try {
    const user = signer._address;
    const results: TransactionResponse[] = [];
    for (const item of items) {
      const collection = item.collectionAddress;
      const contract = new Contract(collection, ERC721ABI, signer);
      const isApprovedForAll = await contract.isApprovedForAll(user, exchange);
      if (!isApprovedForAll) {
        const result: TransactionResponse = await contract.setApprovalForAll(exchange, true);
        results.push(result);
      }
    }
    return results;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('failed granting erc721 approvals');
    throw new Error(e);
  }
}

export async function checkOnChainOwnership(user: string, order: OBOrder, signer: JsonRpcSigner): Promise<boolean> {
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
      // future-todo: adi should continue to check if other nfts are owned
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
    const signedOrder = {
      ...orderToSign,
      signedOrder: {
        ...orderToSign.signedOrder,
        sig
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
    } else {
      constraints.push(0);
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

  const { signatureData, proofs } = getBulkSignatureDataWithProofs(
    chainId,
    complicationAddress,
    preSignedOrders.map((order) => order.signedOrder)
  );

  const signature = await signer._signTypedData(signatureData.domain, signatureData.types, signatureData.value);

  preSignedOrders.forEach((order, i) => {
    order.signedOrder.sig = hexConcat([
      signature,
      `0x${i.toString(16).padStart(6, '0')}`,
      defaultAbiCoder.encode([`uint256[${proofs[i].length}]`], [proofs[i]])
    ]);
  });

  return preSignedOrders;
};

function getBulkSignatureDataWithProofs(
  chainId: BigNumberish,
  verifyingContractAddress: string,
  orders: ChainOBOrder[]
) {
  const domain = {
    name: 'FlowComplication',
    version: '1',
    chainId: chainId,
    verifyingContract: verifyingContractAddress
  };

  const height = Math.max(Math.ceil(Math.log2(orders.length)), 1);
  const size = Math.pow(2, height);

  const types = { ...FLOW_ORDER_EIP_712_TYPES };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (types as any).BulkOrder = [{ name: 'tree', type: `Order${`[2]`.repeat(height)}` }];
  const encoder = _TypedDataEncoder.from(types);

  const hashElement = (element: Omit<ChainOBOrder, 'sig'>) => encoder.hashStruct('Order', element);

  const elements: Omit<ChainOBOrder, 'sig'>[] = orders.map((o) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sig, ...order } = o;
    return order;
  });
  const leaves = elements.map((e) => hashElement(e));

  const defaultElement: Omit<ChainOBOrder, 'sig'> = {
    isSellOrder: false,
    signer: ZERO_ADDRESS,
    constraints: [],
    nfts: [],
    execParams: [],
    extraParams: ZERO_HASH
  };
  const defaultLeaf = hashElement(defaultElement);

  // Ensure the tree is complete
  while (elements.length < size) {
    elements.push(defaultElement);
    leaves.push(defaultLeaf);
  }

  const hexToBuffer = (value: string) => Buffer.from(value.slice(2), 'hex');
  const bufferKeccak = (value: string) => hexToBuffer(keccak256(value));

  const tree = new MerkleTree(leaves.map(hexToBuffer), bufferKeccak, {
    complete: true,
    sort: false,
    hashLeaves: false,
    fillDefaultHash: hexToBuffer(defaultLeaf)
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let chunks: any[] = [...elements];
  while (chunks.length > 2) {
    const newSize = Math.ceil(chunks.length / 2);
    chunks = Array(newSize)
      .fill(0)
      .map((_, i) => chunks.slice(i * 2, (i + 1) * 2));
  }

  return {
    signatureData: {
      signatureKind: 'eip712',
      domain,
      types: types,
      value: { tree: chunks }
    },
    proofs: orders.map((_, i) => tree.getHexProof(leaves[i], i))
  };
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

export async function cancelAllOrders(signer: JsonRpcSigner, chainId: string, minOrderNonce: number) {
  const exchangeAddress = getExchangeAddress(chainId);
  const flowExchange = new Contract(exchangeAddress, FlowExchangeABI, signer);
  const cancelResult = await flowExchange.cancelAllOrders(minOrderNonce);
  return {
    hash: cancelResult?.hash ?? ''
  };
}

export async function cancelMultipleOrders(signer: JsonRpcSigner, chainId: string, nonces: number[]) {
  const exchangeAddress = getExchangeAddress(chainId);
  const flowExchange = new Contract(exchangeAddress, FlowExchangeABI, signer);
  const cancelResult = await flowExchange.cancelMultipleOrders(nonces);
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
      // future-todo: adi other complications in future
      const complication = new Contract(complicationAddress, FlowOBComplicationABI, signer);
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
  const flowExchange = new Contract(exchangeAddress, FlowExchangeABI, signer);
  const totalPrice = makerOrders
    .map((order) => getCurrentChainOBOrderPrice(order))
    .reduce((acc, curr) => acc.add(curr), BigNumber.from(0));

  // it is assumed that all orders have these value same, so no need to check. Contract throws if this is not the case.
  const isSellOrder = makerOrders[0].isSellOrder;
  const isCurrencyETH = makerOrders[0].execParams[1] === NULL_ADDRESS;

  if (isSellOrder && !isCurrencyETH) {
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
    const result = await flowExchange.takeOrders(makerOrders, takerItems, options);
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

    const result = await flowExchange.takeOrders(makerOrders, takerItems, { gasLimit });
    // const result = await submitTransaction(infinityExchange, 'takeOrders', [makerOrders, takerItems]);
    return {
      hash: result?.hash ?? ''
    };
  }
}

export async function takeMultipleOneOrders(signer: JsonRpcSigner, chainId: string, makerOrders: ChainOBOrder[]) {
  const exchangeAddress = getExchangeAddress(chainId);
  const flowExchange = new Contract(exchangeAddress, FlowExchangeABI, signer);
  const totalPrice = makerOrders
    .map((order) => getCurrentChainOBOrderPrice(order))
    .reduce((acc, curr) => acc.add(curr), BigNumber.from(0));

  // it is assumed that all orders have these value same, so no need to check. Contract throws if this is not the case.
  const isSellOrder = makerOrders[0].isSellOrder;
  const isCurrencyETH = makerOrders[0].execParams[1] === NULL_ADDRESS;
  const gasLimit = 300_000 * makerOrders.length;
  if (isSellOrder && !isCurrencyETH) {
    return { hash: '' };
  }

  // perform exchange
  // if fulfilling a sell order, send ETH
  if (isSellOrder) {
    const options = {
      value: totalPrice,
      gasLimit
    };
    const result = await flowExchange.takeMultipleOneOrders(makerOrders, options);
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

    const result = await flowExchange.takeMultipleOneOrders(makerOrders, { gasLimit });
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
