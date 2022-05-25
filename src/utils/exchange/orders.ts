import { defaultAbiCoder } from '@ethersproject/abi';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { splitSignature } from '@ethersproject/bytes';
import { MaxUint256 } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcSigner } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { ChainOBOrder, OBOrder, OBOrderItem, SignedOBOrder } from '@infinityxyz/lib/types/core';
import {
  getCurrentOBOrderPrice,
  getExchangeAddress,
  getFeeTreasuryAddress,
  getOBComplicationAddress,
  getTxnCurrencyAddress,
  NULL_ADDRESS,
  trimLowerCase
} from '@infinityxyz/lib/utils';
import { infinityExchangeAbi } from 'src/abi/infinityExchange';
import { erc20Abi } from '../../abi/erc20';
import { erc721Abi } from '../../abi/erc721';
import { User } from '../context/AppContext';

export async function getSignedOBOrder(
  user: User,
  chainId: BigNumberish,
  signer: JsonRpcSigner,
  order: OBOrder
): Promise<SignedOBOrder | undefined> {
  // sign
  const infinityExchangeAddress = getExchangeAddress(chainId.toString());
  const infinityFeeTreasuryAddress = getFeeTreasuryAddress(chainId.toString());
  const infinityExchange = new Contract(infinityExchangeAddress, infinityExchangeAbi, signer);
  const signedOrder = await prepareOBOrder(user, chainId, signer, order, infinityExchange, infinityFeeTreasuryAddress);
  if (!signedOrder) {
    const msg = 'signOBSpecOrder: failed to sign order';
    console.error(msg);
    throw msg;
    return undefined;
  }
  const signedOBOrder: SignedOBOrder = { ...order, signedOrder };
  return signedOBOrder;
}

// Orderbook orders
export async function prepareOBOrder(
  user: User,
  chainId: BigNumberish,
  signer: JsonRpcSigner,
  order: OBOrder,
  infinityExchange: Contract,
  infinityFeeTreasuryAddress: string
): Promise<ChainOBOrder | undefined> {
  // check if order is still valid

  // todo: uncomment below code when contracts are deployed; remove log
  console.log(infinityFeeTreasuryAddress);
  // // grant approvals
  // const approvals = await grantApprovals(user, order, signer, infinityExchange.address, infinityFeeTreasuryAddress);
  // if (!approvals) {
  //   return undefined;
  // }

  // const validOrder = await isOrderValid(user, order, infinityExchange, signer);
  // if (!validOrder) {
  //   return undefined;
  // }

  // sign order
  const chainOBOrder = await signOBOrder(chainId, infinityExchange.address, order, signer);

  console.log('Verifying signature');
  // todo: remove this
  // const isSigValid = await infinityExchange.verifyOrderSig(signedOBOrder);
  // if (!isSigValid) {
  //   console.error('Signature is invalid');
  //   return undefined;
  // } else {
  //   console.log('Signature is valid');
  // }
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
  exchange: string,
  infinityFeeTreasuryAddress: string
): Promise<boolean> {
  try {
    console.log('Granting approvals');
    if (!order.isSellOrder) {
      // approve currencies
      const currentPrice = getCurrentOBOrderPrice(order);
      await approveERC20(
        user.address,
        order.execParams.currencyAddress,
        currentPrice,
        signer,
        infinityFeeTreasuryAddress
      );
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
  infinityFeeTreasuryAddress: string
) {
  try {
    console.log('Granting ERC20 approval');
    if (currencyAddress !== NULL_ADDRESS) {
      const contract = new Contract(currencyAddress, erc20Abi, signer);
      const allowance = BigNumber.from(await contract.allowance(user, infinityFeeTreasuryAddress));
      if (allowance.lt(price)) {
        await contract.approve(infinityFeeTreasuryAddress, MaxUint256);
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

export async function approveERC721(user: string, items: OBOrderItem[], signer: JsonRpcSigner, exchange: string) {
  try {
    console.log('Granting ERC721 approval');
    for (const item of items) {
      const collection = item.collectionAddress;
      const contract = new Contract(collection, erc721Abi, signer);
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
    const contract = new Contract(collection, erc721Abi, signer);
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
      // todo: should continue to check if other nfts are owned
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
  contractAddress: string,
  order: OBOrder,
  signer: JsonRpcSigner
): Promise<ChainOBOrder | undefined> {
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

  const constraints = [
    order.numItems,
    parseEther(String(order.startPriceEth)),
    parseEther(String(order.endPriceEth)),
    Math.floor(order.startTimeMs / 1000),
    Math.floor(order.endTimeMs / 1000),
    order.minBpsToSeller,
    order.nonce
  ];

  const nfts = [];
  for (const nft of order.nfts) {
    const collection = nft.collectionAddress;
    const tokens = [];
    for (const token of nft.tokens) {
      tokens.push({
        tokenId: token.tokenId,
        numTokens: token.numTokens
      });
    }
    nfts.push({
      collection,
      tokens
    });
  }
  // don't use ?? operator here
  const complicationAddress = getOBComplicationAddress(chainId.toString());
  const currencyAddress = getTxnCurrencyAddress(chainId.toString());
  const execParams = [
    order.execParams.complicationAddress || complicationAddress,
    order.execParams.currencyAddress || currencyAddress
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
