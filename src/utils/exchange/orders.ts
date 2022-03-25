import { BigNumber, BigNumberish, BytesLike, constants, Contract } from 'ethers';
import { defaultAbiCoder, keccak256, solidityKeccak256, splitSignature, _TypedDataEncoder } from 'ethers/lib/utils';
import { NULL_ADDRESS } from '../constants';
import { ProviderManager } from '../providers/ProviderManager';
import { OBOrder, Item, ExtraParams, ExecParams, SignedOBOrder } from '@infinityxyz/lib/types/core';
import { infinityExchangeAbi } from '../../abi/infinityExchange';
import { User } from '../context/AppContext';
import { erc721Abi } from '../../abi/erc721';
import { getCurrentOrderPrice, nowSeconds, trimLowerCase } from '@infinityxyz/lib/utils';
import { erc20Abi } from '../../abi/erc20';
import { JsonRpcSigner } from '@ethersproject/providers';

// constants
// todo: move to constants
const exchange = '0x9E545E3C0baAB3E08CdfD552C960A1050f373042'.toLowerCase();
const complicationAddress = '0xffa7CA1AEEEbBc30C874d32C7e22F052BbEa0429';
const collections = ['0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E'];
const ORDER_NONCE = 1;

// Orderbook orders

export async function prepareOBOrder(
  user: User,
  chainId: BigNumberish,
  signer: JsonRpcSigner,
  order: OBOrder
): Promise<SignedOBOrder | undefined> {
  const infinityExchange = new Contract(exchange, infinityExchangeAbi, signer);

  // todo: should be from order
  const nfts: Item[] = [
    {
      collection: collections[0],
      tokenIds: []
    }
  ];
  const execParams: ExecParams = { complicationAddress, currencyAddress: NULL_ADDRESS };
  const extraParams: ExtraParams = {};

  // todo: dont hardcode this
  const orderId = solidityKeccak256(['address', 'uint256', 'uint256'], [user.address, ORDER_NONCE, chainId]);
  const obOrder: OBOrder = {
    id: orderId,
    chainId,
    isSellOrder: false,
    signerAddress: user.address,
    numItems: order.numItems,
    startPrice: order.startPrice,
    endPrice: order.endPrice,
    startTime: order.startTime,
    endTime: order.endTime,
    minBpsToSeller: 9000,
    nonce: ORDER_NONCE,
    nfts,
    execParams,
    extraParams
  };

  // check if order is still valid
  const validOrder = await isOrderValid(user, obOrder, infinityExchange, signer);
  if (!validOrder) {
    return undefined;
  }

  // grant approvals
  const approvals = await grantApprovals(user, obOrder, signer);
  if (!approvals) {
    return undefined;
  }

  // coonstruct order
  const constructedOBOrder = await constructOBOrder(chainId, exchange, signer, obOrder);
  const isSigValid = await infinityExchange.verifyOrderSig(constructedOBOrder);
  console.log('Sig valid:', isSigValid);
  return constructedOBOrder;
}

export async function isOrderValid(
  user: User,
  order: OBOrder,
  infinityExchange: Contract,
  signer: JsonRpcSigner
): Promise<boolean> {
  // check timestamps
  const startTime = BigNumber.from(order.startTime);
  const endTime = BigNumber.from(order.endTime);
  const now = nowSeconds();
  if (now.lt(startTime) || now.gt(endTime)) {
    console.error('Order timestamps are not valid');
    return false;
  }

  // todo: check if nonce is valid
  const isNonceValid = await infinityExchange.isNonceValid(user.address, order.nonce);
  console.log('Nonce valid:', isNonceValid);
  if (!isNonceValid) {
    console.error('Order nonce is not valid');
    return false;
  }

  // check on chain ownership
  const isCurrentOwner = await checkOnChainOwnership(user, order, signer);
  if (!isCurrentOwner) {
    return false;
  }

  // default
  return true;
}

export async function grantApprovals(user: User, order: OBOrder, signer: JsonRpcSigner): Promise<boolean> {
  try {
    // approve currencies
    await approveERC20(user, order, signer);
    // approve collections
    await approveERC721(user, order, signer);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function approveERC20(user: User, order: OBOrder, signer: JsonRpcSigner) {
  try {
    const currencyAddress = order.execParams.currencyAddress;
    if (currencyAddress !== NULL_ADDRESS) {
      const contract = new Contract(currencyAddress, erc20Abi, signer);
      const allowance = BigNumber.from(await contract.allowance(user.address, exchange));
      if (allowance.lt(getCurrentOrderPrice(order))) {
        await contract.approve(exchange, constants.MaxUint256);
      }
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('failed granting erc20 approvals');
    throw new Error(e);
  }
}

export async function approveERC721(user: User, order: OBOrder, signer: JsonRpcSigner) {
  try {
    for (const nft of order.nfts) {
      const collection = nft.collection;
      const contract = new Contract(collection, erc721Abi, signer);
      const isApprovedForAll = await contract.isApprovedForAll(user.address, exchange);
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

export async function checkOnChainOwnership(user: User, order: OBOrder, signer: JsonRpcSigner): Promise<boolean> {
  let result = true;
  for (const nft of order.nfts) {
    const collection = nft.collection;
    const contract = new Contract(collection, erc721Abi, signer);
    for (const tokenId of nft.tokenIds) {
      result = result && (await checkERC721Ownership(user, contract, tokenId));
    }
  }
  return result;
}

export async function checkERC721Ownership(user: User, contract: Contract, tokenId: BigNumberish): Promise<boolean> {
  try {
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

export async function constructOBOrder(
  chainId: BigNumberish,
  contractAddress: string,
  signer: JsonRpcSigner,
  order: OBOrder
): Promise<SignedOBOrder> {
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
      { name: 'dataHash', type: 'bytes32' },
      { name: 'extraParams', type: 'bytes' }
    ]
  };

  // const calcDigest = _getCalculatedDigest(chainId, contractAddress, order);
  const constraints = [
    order.numItems,
    order.startPrice,
    order.endPrice,
    order.startTime,
    order.endTime,
    order.minBpsToSeller,
    order.nonce
  ];
  const constraintsHash = keccak256(
    defaultAbiCoder.encode(['uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'], constraints)
  );

  let encodedItems = '';
  for (const item of order.nfts) {
    const collection = item.collection;
    const tokenIds = item.tokenIds;
    encodedItems += defaultAbiCoder.encode(['address', 'uint256[]'], [collection, tokenIds]);
  }
  const encodedItemsHash = keccak256(encodedItems);

  const execParams = [order.execParams.complicationAddress, order.execParams.currencyAddress];
  const execParamsHash = keccak256(defaultAbiCoder.encode(['address', 'address'], execParams));

  const dataHash = keccak256(
    defaultAbiCoder.encode(['bytes32', 'bytes32', 'bytes32'], [constraintsHash, encodedItemsHash, execParamsHash])
  );

  const extraParams = defaultAbiCoder.encode(['address'], [order.extraParams.buyer ?? NULL_ADDRESS]);

  const orderToSign = {
    isSellOrder: order.isSellOrder,
    signer: order.signerAddress,
    dataHash,
    extraParams
  };

  const signedOrder: SignedOBOrder = {
    ...orderToSign,
    nfts: order.nfts,
    constraints,
    execParams,
    sig: ''
  };

  // _printTypeEncodedData(domain, types, orderToSign);

  // sign order
  try {
    const sig = await signer._signTypedData(domain, types, orderToSign);
    const splitSig = splitSignature(sig ?? '');
    const encodedSig = defaultAbiCoder.encode(['bytes32', 'bytes32', 'uint8'], [splitSig.r, splitSig.s, splitSig.v]);
    signedOrder.sig = encodedSig;
  } catch (e) {
    console.error('Error signing order', e);
  }

  // return
  return signedOrder;
}

// ================================= Below functions are for reference & testing only =====================================
// ================================= Below functions are for reference & testing only =====================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _getCalculatedDigest(chainId: BigNumberish, exchangeAddr: string, order: OBOrder): BytesLike {
  const fnSign = 'Order(bool isSellOrder,address signer,bytes32 dataHash,bytes extraParams)';
  const orderTypeHash = solidityKeccak256(['string'], [fnSign]);
  console.log('Order type hash', orderTypeHash);

  const constraints = [
    order.numItems,
    order.startPrice,
    order.endPrice,
    order.startTime,
    order.endTime,
    order.minBpsToSeller,
    order.nonce
  ];
  const constraintsHash = keccak256(
    defaultAbiCoder.encode(['uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'], constraints)
  );

  let encodedItems = '';
  for (const item of order.nfts) {
    const collection = item.collection;
    const tokenIds = item.tokenIds;
    encodedItems += defaultAbiCoder.encode(['address', 'uint256[]'], [collection, tokenIds]);
  }
  const encodedItemsHash = keccak256(encodedItems);

  const execParams = [order.execParams.complicationAddress, order.execParams.currencyAddress];
  const execParamsHash = keccak256(defaultAbiCoder.encode(['address', 'address'], execParams));

  const dataHash = keccak256(
    defaultAbiCoder.encode(['bytes32', 'bytes32', 'bytes32'], [constraintsHash, encodedItemsHash, execParamsHash])
  );

  const extraParams = defaultAbiCoder.encode(['address'], [order.extraParams.buyer ?? NULL_ADDRESS]);

  const orderHash = keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'bool', 'address', 'bytes32', 'bytes32'],
      [orderTypeHash, order.isSellOrder, order.signerAddress, dataHash, keccak256(extraParams)]
    )
  );

  console.log('calculated orderHash', orderHash);
  const digest = _getDigest(chainId, exchangeAddr, orderHash);
  console.log('calculated digest', digest);
  return digest;
}

function _getDigest(chainId: BigNumberish, exchangeAddr: BytesLike | string, orderHash: string | BytesLike): BytesLike {
  const domainSeparator = _getDomainSeparator(chainId, exchangeAddr);
  return solidityKeccak256(['string', 'bytes32', 'bytes32'], ['\x19\x01', domainSeparator, orderHash]);
}

function _getDomainSeparator(chainId: BigNumberish, exchangeAddr: BytesLike): BytesLike {
  const domainSeparator = keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [
        solidityKeccak256(
          ['string'],
          ['EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)']
        ),
        solidityKeccak256(['string'], ['InfinityExchange']),
        solidityKeccak256(['string'], ['1']), // for versionId = 1
        chainId,
        exchangeAddr
      ]
    )
  );
  console.log('domainSeparator:', domainSeparator);
  return domainSeparator;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
function _printTypeEncodedData(domain: any, types: any, orderToSign: any) {
  const domainSeparator = _TypedDataEncoder.hashDomain(domain);
  const typedDataEncoder = _TypedDataEncoder.from(types);
  const primaryType = typedDataEncoder.primaryType;
  const primary = typedDataEncoder.encodeType(primaryType);
  const hashedType = solidityKeccak256(['string'], [primary]);
  console.log('primary type:', primaryType);
  console.log('domain separator:', domainSeparator);
  console.log('type hash:', hashedType);
  const encodedData = typedDataEncoder.encode(orderToSign);
  const hashedEncoded = typedDataEncoder.hash(orderToSign);
  console.log('encoded typed data:', encodedData);
  console.log('typed data hash:', hashedEncoded);

  const orderDigest = _TypedDataEncoder.hash(domain, types, orderToSign);
  console.log('typed data digest', orderDigest);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function testHash(chainId: BigNumberish, contractAddress: string, providerManager: ProviderManager | undefined) {
  const types = {
    Base: [{ name: 'isSellOrder', type: 'bool' }]
  };

  const typesWithDomain = {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ],
    Base: [{ name: 'isSellOrder', type: 'bool' }]
  };

  const fnSign = 'Base(bool isSellOrder)';
  const baseTypeHash = solidityKeccak256(['string'], [fnSign]);

  const message = { isSellOrder: false };
  const orderHash = keccak256(defaultAbiCoder.encode(['bytes32', 'bool'], [baseTypeHash, message]));
  console.log('Base', baseTypeHash, orderHash);

  const typedDataEncoder = _TypedDataEncoder.from(types);
  const primaryType = typedDataEncoder.primaryType;
  const primary = typedDataEncoder.encodeType(primaryType);
  const hashedType = solidityKeccak256(['string'], [primary]);
  const hashedEncoded = typedDataEncoder.hash(message);
  console.log(primaryType, hashedType, hashedEncoded);

  const domain = {
    name: 'InfinityExchange',
    version: '1',
    chainId: chainId,
    verifyingContract: contractAddress
  };
  const msgParams = JSON.stringify({
    domain,
    primaryType: 'Base',
    types: typesWithDomain,
    message
  });

  const signer = providerManager?.getEthersProvider().getSigner();
  const sig = await providerManager
    ?.getEthersProvider()
    .send('eth_signTypedData_v4', [await signer?.getAddress(), msgParams]);
  console.log('sig raw method', sig);

  const payload = JSON.stringify(_TypedDataEncoder.getPayload(domain, types, message));
  const sig2 = await signer?._signTypedData(domain, types, message);
  console.log('sig ethers method', sig2);

  console.log('msgParams', msgParams, 'payload', payload);
}
