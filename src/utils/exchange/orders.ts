import { JsonRpcSigner } from '@ethersproject/providers';
import {
  getCurrentOrderSpecPrice,
  OBOrder,
  OBOrderSpec,
  OrderItem,
  SignedOBOrder,
  SignedOBOrderSpec
} from '@infinityxyz/lib/types/core';
import { nowSeconds, trimLowerCase } from '@infinityxyz/lib/utils';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { MaxUint256 } from '@ethersproject/constants';
import { defaultAbiCoder } from '@ethersproject/abi';
import { splitSignature } from '@ethersproject/bytes';
import { erc20Abi } from '../../abi/erc20';
import { erc721Abi } from '../../abi/erc721';
import { NULL_ADDRESS, WETH_ADDRESS } from '../constants';
import { User } from '../context/AppContext';
import { infinityExchangeAbi } from 'src/abi/infinityExchange';

// constants
// todo: move to constants
const infinityExchangeAddress = '0x9E545E3C0baAB3E08CdfD552C960A1050f373042'.toLowerCase();
const infinityFeeTreasuryAddress = '0x9E545E3C0baAB3E08CdfD552C960A1050f373042'.toLowerCase();
const complicationAddress = '0xffa7CA1AEEEbBc30C874d32C7e22F052BbEa0429';
const currencyAddress = WETH_ADDRESS;
// const collections = ['0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E'];
// const ORDER_NONCE = 1;

export async function signOBSpecOrder(
  user: User,
  chainId: BigNumberish,
  signer: JsonRpcSigner,
  order: OBOrderSpec
): Promise<SignedOBOrderSpec | undefined> {
  // parse OBOrder
  const obOrder: OBOrder = {
    id: order.id,
    chainId: order.chainId,
    isSellOrder: order.isSellOrder,
    signerAddress: order.signerAddress,
    numItems: order.numItems,
    startPrice: order.startPrice,
    endPrice: order.endPrice,
    startTime: order.startTime,
    endTime: order.endTime,
    minBpsToSeller: order.minBpsToSeller,
    nonce: order.nonce,
    nfts: order.nfts,
    execParams: order.execParams,
    extraParams: order.extraParams
  };
  // sign
  const infinityExchange = new Contract(infinityExchangeAddress, infinityExchangeAbi, signer);
  const signedOrder = await prepareOBOrder(
    user,
    chainId,
    signer,
    obOrder,
    infinityExchange,
    infinityFeeTreasuryAddress
  );
  if (!signedOrder) {
    console.error('signOBSpecOrder: failed to sign order');
    return undefined;
  }
  const signedOBOrderSpec: SignedOBOrderSpec = { ...order, signedOrder };
  return signedOBOrderSpec;
}

// Orderbook orders
export async function prepareOBOrder(
  user: User,
  chainId: BigNumberish,
  signer: JsonRpcSigner,
  order: OBOrder,
  infinityExchange: Contract,
  infinityFeeTreasuryAddress: string
): Promise<SignedOBOrder | undefined> {
  // check if order is still valid

  console.log(infinityFeeTreasuryAddress);
  // todo: uncomment below code when contracts are deployed
  // const validOrder = await isOrderValid(user, order, infinityExchange, signer);
  // if (!validOrder) {
  //   return undefined;
  // }

  // // grant approvals
  // const approvals = await grantApprovals(user, order, signer, infinityExchange.address, infinityFeeTreasuryAddress);
  // if (!approvals) {
  //   return undefined;
  // }

  // sign order
  const signedOBOrder = await signOBOrder(chainId, infinityExchange.address, order, signer);

  console.log('Verifying signature');
  // todo: remove this
  // const isSigValid = await infinityExchange.verifyOrderSig(signedOBOrder);
  // if (!isSigValid) {
  //   console.error('Signature is invalid');
  //   return undefined;
  // } else {
  //   console.log('Signature is valid');
  // }
  return signedOBOrder;
}

export async function isOrderValid(
  user: User,
  order: OBOrder,
  infinityExchange: Contract,
  signer: JsonRpcSigner
): Promise<boolean> {
  // check timestamps
  const endTime = BigNumber.from(order.endTime);
  const now = nowSeconds();
  if (now.gt(endTime)) {
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
      const currentPrice = getCurrentOrderSpecPrice(order);
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

export async function approveERC721(user: string, items: OrderItem[], signer: JsonRpcSigner, exchange: string) {
  try {
    console.log('Granting ERC721 approval');
    for (const item of items) {
      const collection = item.collection;
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
    const collection = nft.collection;
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
): Promise<SignedOBOrder | undefined> {
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
    order.startPrice,
    order.endPrice,
    order.startTime,
    order.endTime,
    order.minBpsToSeller,
    order.nonce
  ];
  // don't use ?? operator here
  const execParams = [
    order.execParams.complicationAddress || complicationAddress,
    order.execParams.currencyAddress || currencyAddress
  ];
  const extraParams = defaultAbiCoder.encode(['address'], [order.extraParams.buyer || NULL_ADDRESS]); // don't use ?? operator here

  const orderToSign = {
    isSellOrder: order.isSellOrder,
    signer: order.signerAddress,
    constraints,
    nfts: order.nfts,
    execParams,
    extraParams
  };

  // _printTypeEncodedData(domain, types, orderToSign);

  // sign order
  try {
    console.log('Signing order');
    const sig = await signer._signTypedData(domain, types, orderToSign);
    const splitSig = splitSignature(sig ?? '');
    const encodedSig = defaultAbiCoder.encode(['bytes32', 'bytes32', 'uint8'], [splitSig.r, splitSig.s, splitSig.v]);
    const signedOrder: SignedOBOrder = { ...orderToSign, sig: encodedSig };
    return signedOrder;
  } catch (e) {
    console.error('Error signing order', e);
  }
}

export async function signFormattedOrder(
  chainId: BigNumberish,
  contractAddress: string,
  order: SignedOBOrder,
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
    console.log('Signing order');
    const sig = await signer._signTypedData(domain, types, orderToSign);
    const splitSig = splitSignature(sig ?? '');
    // console.log('splitSig', splitSig);
    const encodedSig = defaultAbiCoder.encode(['bytes32', 'bytes32', 'uint8'], [splitSig.r, splitSig.s, splitSig.v]);
    return encodedSig;
  } catch (e) {
    console.error('Error signing order', e);
  }

  return '';
}
