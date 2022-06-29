import { defaultAbiCoder } from '@ethersproject/abi';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { BytesLike, splitSignature } from '@ethersproject/bytes';
import { MaxUint256 } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcSigner } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
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
  jsonString,
  nowSeconds,
  NULL_ADDRESS,
  trimLowerCase
} from '@infinityxyz/lib-frontend/utils';
import { InfinityExchangeABI, ERC20ABI, ERC721ABI } from '@infinityxyz/lib-frontend/abi';
import { User } from '../context/AppContext';
import { keccak256, solidityKeccak256 } from 'ethers/lib/utils';

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
    const msg = 'signOBSpecOrder: failed to sign order';
    console.error(msg);
    throw msg;
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
  const chainOBOrder = await signOBOrder(chainId, infinityExchange.address, order, signer);

  console.log('Verifying signature');
  // todo: adi remove this
  const isSigValid = await infinityExchange.verifyOrderSig(chainOBOrder);
  if (!isSigValid) {
    console.error('Signature is invalid');
    return undefined;
  } else {
    console.log('Signature is valid');
  }
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
  infinityFeeTreasuryAddress: string
) {
  try {
    console.log('Granting ERC20 approval');
    if (currencyAddress !== NULL_ADDRESS) {
      const contract = new Contract(currencyAddress, ERC20ABI, signer);
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

export async function takeOrder(signer: JsonRpcSigner, chainId: string, makerOrder: ChainOBOrder) {
  const user = await signer.getAddress();
  const exchangeAddress = getExchangeAddress(chainId);
  const infinityExchange = new Contract(exchangeAddress, InfinityExchangeABI, signer);

  const takerOrderSide = !makerOrder.isSellOrder;
  const constraints = makerOrder.constraints;
  const nfts = makerOrder.nfts;
  const execParams = makerOrder.execParams;
  const extraParams = makerOrder.extraParams;
  const salePrice = getCurrentChainOBOrderPrice(makerOrder);

  const takerOrder: ChainOBOrder = {
    isSellOrder: takerOrderSide,
    signer: user,
    extraParams,
    nfts,
    constraints,
    execParams,
    sig: makerOrder.sig
  };

  // perform exchange
  const options = {
    value: salePrice,
    gasLimit: BigNumber.from(200000)
  };

  // Error: invalid value for array (argument="value", value={"isSellOrder":true,"signer":"0x24c24F9DDCe175039136bae9B3943b5B051A1514",
  // "extraParams":"0x0000000000000000000000000000000000000000000000000000000000000000","nfts":[{"collection":"0x142c5b3a5689ba0871903c53dacf235a28cb21f0",
  // "tokens":[{"tokenId":"529","numTokens":1},{"numTokens":1,"tokenId":"530"},{"numTokens":1,"tokenId":"531"}]}],"constraints":
  // [3,{"hex":"0x470de4df820000","type":"BigNumber"},{"type":"BigNumber","hex":"0x470de4df820000"},1656452854,1657057654,"279","100000000000000000"],
  // "execParams":["0x6deb5e1a056975e0f2024f3d89b6d2465bde22af","0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"],
  // "sig":"0xe40fefdd61f36b731379f0f83916c91e4f1ff315b925edf27aab4eb605d502106b4d41b6759e97d01576271e05c7800a4a0b2444085c0d73aab
  // 35eb23f8c7f24000000000000000000000000000000000000000000000000000000000000001c"}, code=INVALID_ARGUMENT, version=contracts/5.6.2)

  // TODO(SNG): crashed here, market page click sell
  const gasEstimate = await infinityExchange.estimateGas.takeOrders([makerOrder], [takerOrder], options);
  options.gasLimit = gasEstimate;
  console.log('gasEstimate', gasEstimate.toString());
  console.log(jsonString(makerOrder));
  console.log(jsonString(takerOrder));
  const canTake = await canTakeOrders(infinityExchange, makerOrder, takerOrder);
  if (canTake) {
    // todo: adi function sig changed
    await infinityExchange.takeOrders([makerOrder], [takerOrder], options);
  } else {
    console.error('Cannot take order');
  }
}

export async function canTakeOrders(
  infinityExchange: Contract,
  makerOrder: ChainOBOrder,
  takerOrder: ChainOBOrder
): Promise<boolean> {
  const makerOrderHash = _orderHash(makerOrder);
  const result = await infinityExchange.verifyTakeOrders(makerOrderHash, makerOrder, takerOrder);
  return result;
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
    nonce: '',
    maxGasPriceWei: '1e12', // todo: adi get from backend
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _orderHash(order: ChainOBOrder): BytesLike {
  const fnSign =
    'Order(bool isSellOrder,address signer,uint256[] constraints,OrderItem[] nfts,address[] execParams,bytes extraParams)OrderItem(address collection,TokenInfo[] tokens)TokenInfo(uint256 tokenId,uint256 numTokens)';
  const orderTypeHash = solidityKeccak256(['string'], [fnSign]);

  const constraints = order.constraints;
  const execParams = order.execParams;
  const extraParams = order.extraParams;

  // todo: adi constraints has new length
  const constraintsHash = keccak256(
    defaultAbiCoder.encode(['uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'], constraints)
  );

  const nftsHash = _getNftsHash(order.nfts);
  const execParamsHash = keccak256(defaultAbiCoder.encode(['address', 'address'], execParams));

  const calcEncode = defaultAbiCoder.encode(
    ['bytes32', 'bool', 'address', 'bytes32', 'bytes32', 'bytes32', 'bytes32'],
    [orderTypeHash, order.isSellOrder, order.signer, constraintsHash, nftsHash, execParamsHash, keccak256(extraParams)]
  );

  return keccak256(calcEncode);
}

function _getNftsHash(nfts: ChainNFTs[]): BytesLike {
  const fnSign = 'OrderItem(address collection,TokenInfo[] tokens)TokenInfo(uint256 tokenId,uint256 numTokens)';
  const typeHash = solidityKeccak256(['string'], [fnSign]);

  const hashes = [];
  for (const nft of nfts) {
    const hash = keccak256(
      defaultAbiCoder.encode(['bytes32', 'uint256', 'bytes32'], [typeHash, nft.collection, _getTokensHash(nft.tokens)])
    );
    hashes.push(hash);
  }
  const encodeTypeArray = hashes.map(() => 'bytes32');
  const nftsHash = keccak256(defaultAbiCoder.encode(encodeTypeArray, hashes));

  return nftsHash;
}

function _getTokensHash(tokens: ChainNFTs['tokens']): BytesLike {
  const fnSign = 'TokenInfo(uint256 tokenId,uint256 numTokens)';
  const typeHash = solidityKeccak256(['string'], [fnSign]);

  const hashes = [];
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
