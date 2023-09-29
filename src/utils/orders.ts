import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumberish } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcSigner } from '@ethersproject/providers';
import { ERC721ABI, FlowExchangeABI, FlowOBComplicationABI } from '@infinityxyz/lib-frontend/abi';
import {
  ChainNFTs,
  ChainOBOrder,
  FirestoreOrderItem,
  OBOrder,
  OBOrderItem,
  SignedOBOrder
} from '@infinityxyz/lib-frontend/types/core';
import { DEFAULT_MAX_GAS_PRICE_WEI, FLOW_ORDER_EIP_712_TYPES } from './constants';
import { getExchangeAddress, getOBComplicationAddress, trimLowerCase } from '@infinityxyz/lib-frontend/utils';

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
