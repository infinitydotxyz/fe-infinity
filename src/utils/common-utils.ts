import { getAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber/lib/bignumber';
import { Provider } from '@ethersproject/providers';
import { BaseToken, Erc721Token, OrdersSnippet, OwnerInfo, TokenStandard } from '@infinityxyz/lib-frontend/types/core';
import { CreationFlow } from '@infinityxyz/lib-frontend/types/core/Collection';
import {
  ETHEREUM_CHAIN_SCANNER_BASE,
  Env,
  GOERLI_CHAIN_SCANNER_BASE,
  POLYGON_CHAIN_SCANNER_BASE,
  trimLowerCase
} from '@infinityxyz/lib-frontend/utils';
import { formatUnits, parseUnits } from 'ethers/lib/utils.js';
import { normalize } from 'path';
import { ReactNode } from 'react';
import {
  ERC721CollectionCartItem,
  ERC721OrderCartItem,
  ERC721TokenCartItem,
  ORDER_EXPIRY_TIME,
  ReservoirTokenV6
} from 'src/utils/types';
import { CartType } from './context/CartContext';

export const base64Encode = (data: string) => Buffer.from(data).toString('base64');

export const base64Decode = (data?: string) => Buffer.from(data ?? '', 'base64').toString();

export const isServer = () => typeof window === 'undefined';

export const isLocalhost = () => !isServer() && (window?.location?.host || '').indexOf('localhost') >= 0;

export const isProd = () => process.env.NODE_ENV === 'production';

export enum CollectionPageTabs {
  Buy = 'Buy Now',
  Analytics = 'Analytics',
  Bid = 'Place Bids',
  LiveBids = 'Live Bids'
}

export enum ProfileTabs {
  Items = 'Items',
  Orders = 'Orders',
  Send = 'Send'
}

export const displayTypeToProps = (displayType: string | undefined): { isCover: boolean; padding: string } => {
  let isCover = true;
  let padding = '';

  switch (displayType) {
    case 'cover':
      isCover = true;
      break;
    case 'contain':
      isCover = false;
      break;
    case 'padded':
      padding = 'p-2';
      isCover = false;
      break;
    default:
      break;
  }

  return { isCover, padding };
};

export const cl = (data: unknown) => {
  console.log(JSON.stringify(data, null, 2));
};

export const toChecksumAddress = (address?: string): string => {
  if (address) {
    let result = address;

    try {
      // this crashes if the address isn't valid
      result = getAddress(address);
    } catch (err) {
      // do nothing
    }

    return result;
  }

  return '';
};

export const getCartType = (path: string, selectedProfileTab: string, selectedCollectionTab: string): CartType => {
  const isTrendingPage = path.includes('trending');
  const isCollectionPage = path.includes('collection');
  const isProfilePage = path.includes('profile');

  const isProfileItems = selectedProfileTab === ProfileTabs.Items.toString();
  const isProfileSend = selectedProfileTab === ProfileTabs.Send.toString();
  const isProfileOrders = selectedProfileTab === ProfileTabs.Orders.toString();

  const isCollectionBidTab = selectedCollectionTab === CollectionPageTabs.Bid.toString();
  const isCollectionBuyTab = selectedCollectionTab === CollectionPageTabs.Buy.toString();

  const isCollectionBidCart = isTrendingPage;
  const isTokenListCart = isProfilePage && isProfileItems;
  const isTokenBidCart = isCollectionPage && isCollectionBidTab;
  const isTokenBuyCart = isCollectionPage && isCollectionBuyTab;
  const isSendCart = isProfilePage && isProfileSend;
  const isCancelCart = isProfilePage && isProfileOrders;

  if (isCollectionBidCart) {
    return CartType.CollectionBid;
  } else if (isTokenBuyCart) {
    return CartType.TokenBuy;
  } else if (isTokenListCart) {
    return CartType.TokenList;
  } else if (isSendCart) {
    return CartType.Send;
  } else if (isCancelCart) {
    return CartType.Cancel;
  } else if (isTokenBidCart) {
    return CartType.TokenBid;
  }
  return CartType.None;
};

export const getCollectionKeyId = (coll: ERC721CollectionCartItem) => {
  return trimLowerCase(`${coll?.chainId}:${coll?.address}:${coll?.id}`);
};

export const getTokenCartItemKey = (data: ERC721TokenCartItem) => {
  return trimLowerCase(`${data?.chainId}:${data?.address}:${data?.tokenId}:${data?.id}`);
};

// use ellipsisString for non-address numbers, this gets the checksum address
export const ellipsisAddress = (address?: string, left = 6, right = 4) => {
  return ellipsisString(address, left, right);
};

export const addressesEqual = (left?: string, right?: string): boolean => {
  if (left && right) {
    return trimLowerCase(left) === trimLowerCase(right);
  }

  return false;
};

export const ellipsisString = (inString?: string, left = 6, right = 4): string => {
  if (inString) {
    // don't do anything if less than a certain length
    if (inString.length > left + right + 5) {
      return `${inString.slice(0, left)}\u{02026}${right < 1 ? '' : inString.slice(-right)}`;
    } else {
      return inString;
    }
  }

  return '';
};

// parse a Timestamp string (in millis or secs)
export const parseTimestampString = (dt: string, inSecond = false): Date | null => {
  let dateObj = null;
  if (!dt || dt === '0') {
    return null;
  }
  try {
    const dtNum = parseInt(dt);
    dateObj = new Date(dtNum * (inSecond ? 1000 : 1));
  } catch (err) {
    console.error(err);
  }
  return dateObj;
};

export const stringToFloat = (numStr?: string, defaultValue = 0) => {
  let num = defaultValue;
  if (!numStr) {
    return num;
  }
  try {
    num = parseFloat(numStr);
  } catch (e) {
    console.error(e);
  }
  return num;
};

// example: formatNumber(1025.12) => '1,025'
export const formatNumber = (floatNum: number | undefined | null, decimals = 0): string => {
  if (decimals) {
    const str = (floatNum ?? 0).toLocaleString('en-US');
    const idx = str.indexOf('.');
    if (idx > 0) {
      return str.slice(0, str.indexOf('.') + decimals + 1);
    } else {
      return str;
    }
  } else {
    const str = Math.round(floatNum ?? 0).toLocaleString('en-US');
    return str;
  }
};

// example: nFormatter(1234, 1) = > 1.2K
export function nFormatter(num: number | undefined | null, digits = 2) {
  if (!num) {
    return num;
  }
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ];
  const regex = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(regex, '$1') + item.symbol : num.toFixed(digits + 1);
}

export const getCustomExceptionMsg = (msg: ReactNode) => {
  let customMsg = msg;
  if (typeof msg === 'string' && msg.indexOf('err: insufficient funds for gas * price + value') > 0) {
    customMsg = 'Insufficient funds for gas * price + value';
  }
  if (typeof msg === 'string' && msg.indexOf('User denied transaction signature') > 0) {
    customMsg = 'Denied';
  }
  if (typeof msg === 'string' && msg.indexOf('rejected transaction') > 0) {
    customMsg = ''; // this is a common error message when user rejects a transaction
  }
  if (typeof msg === 'string' && msg.indexOf('rejected signing') > 0) {
    customMsg = ''; // this is a common error message when user rejects a transaction
  }
  return customMsg;
};

// makes number strings from strings or numbers
export const numStr = (value: string | number): string => {
  let short;

  if (typeof value === 'undefined' || value === null) {
    short = '';
  } else if (typeof value === 'string') {
    if (value.includes('.')) {
      const f = parseFloat(value);
      if (f) {
        short = f.toFixed(3);
      }
    }
    short = value;
  } else {
    short = value.toFixed(3);
  }

  // remove .0000
  let zeros = '.0000';
  if (short.endsWith(zeros)) {
    short = short?.substring(0, short.length - zeros.length);
  }

  // .9800 -> .98
  if (short.includes('.')) {
    zeros = '00';
    if (short?.endsWith(zeros)) {
      short = short.substring(0, short.length - zeros.length);
    }
  }

  const p = parseFloat(short);
  if (!isNaN(p)) {
    // this adds commas
    short = p.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 3 });
  }

  return short;
};

export const getChainScannerBase = (chainId: string): string | null => {
  if (chainId === '1') {
    return ETHEREUM_CHAIN_SCANNER_BASE;
  } else if (chainId === '137') {
    return POLYGON_CHAIN_SCANNER_BASE;
  } else if (chainId === '5') {
    return GOERLI_CHAIN_SCANNER_BASE;
  }
  return null;
};

export const pleaseConnectMsgString = 'Please connect your wallet';

export const truncateDecimals = (numStr: string) => {
  return ((numStr ?? '') + ' ').slice(0, numStr.indexOf('.'));
};

// optimize googleusercontent banner image to have smaller resolution for faster loading.
// src example: https://lh3.googleusercontent.com/o7jTd9uDpVGbHOCgpHvId3c-O6clNo-DnvrJ0fSaZOH9fs4Wj2W1WZL6_RlfGk0a8gRb0GXgiMuwdUZVB0cn3zIM_1NPC9thgdGXJA=s2500
export const getOptimizedCloudImage = (src: string | undefined, resolution = 'h300') => {
  if (src && src.indexOf('googleusercontent.com/') > 0) {
    // replace '=s2500' at the end with resolution (ex: =h300)
    const arr = src.split('=');
    arr[1] = resolution;
    return arr.join('=');
  } else {
    return src;
  }
};

export const getOwnerAddress = (token: BaseToken | null | undefined) => {
  let ownerAddress = '';
  if (token) {
    if (typeof token.owner === 'string') {
      ownerAddress = token.owner;
    } else {
      ownerAddress = (token.owner as OwnerInfo)?.address ?? '';
    }
  }
  return ownerAddress;
};

// extract error message from generic Error, Metamask error, infinityExchangeCustomError:
export const extractErrorMsg = (err: unknown) => {
  console.error(err);
  let msg = `${err}`;
  if (typeof err === 'object' && (err as Error)?.message) {
    msg = (err as Error).message;
  } else if (msg.indexOf('reason=') > 0) {
    const arr = msg.split('reason=');
    const msgArr = arr[1].split('"');
    msg = msgArr[1];
  } else if (msg.indexOf('invalid address') > 0) {
    msg = 'Invalid wallet address';
  }
  return infinityExchangeCustomError(msg);
};

export const infinityExchangeCustomError = (err: string) => {
  switch (err) {
    case 'msg has value':
      return 'Must not send ETH while fulfilling non ETH orders';
    case 'offers only in ERC20':
      return 'Offers can only be placed in approved ERC20 tokens like WETH';
    case 'cannot mix currencies':
      return 'All orders should be in the same currency';
    case 'cannot mix order sides':
      return 'Orders should be all buy or all sell';
    case 'no dogfooding':
      return 'Cannot buy your own NFTs!!';
    case 'order expired':
      return 'Order was already executed or cancelled';
    case 'cannot execute':
      return 'Order cannot be executed as it has invalid constraints/signature';
    case 'insufficient total price':
      return 'Insufficient ETH sent to fulfill order';
    case 'failed returning excess ETH':
      return 'Failed returning excess ETH sent with order';
    case 'mismatched lengths':
      return 'Batch orders must be of the same length';
    case 'invalid address':
      return 'Cannot send NFTs to invalid address';
    case 'nonce too low':
      return 'Nonce is too low';
    case 'too many':
      return 'Too many orders to cancel all. Try canceling multiple orders instead.';
    case 'cannot be empty':
      return 'Order nonces to cancel cannot be empty';
    case 'nonce already exec or cancelled':
      return 'One of the orders was already executed or cancelled';
    case 'only erc721':
      return 'We only support ERC721s';
    case 'failed to send ether to seller':
      return 'Failed to send ether to seller';
    case 'invalid maker order':
      return 'The order is invalid. It has either a wrong signature or invalid constraints';
    case 'tokenIds dont intersect':
      return 'The order is invalid. Token Ids do not match.';
    default:
      return err;
  }
};

export function getFeesAtTarget(currentBaseFee: BigNumber, blocksInFuture: number) {
  const MAX_SINGLE_BLOCK_INCREASE = 1.125;
  const MAX_SINGLE_BLOCK_DECREASE = 0.875;
  const maxIncreaseAtTarget = Math.ceil(MAX_SINGLE_BLOCK_INCREASE ** blocksInFuture * 1000);
  const maxDecreaseAtTarget = Math.floor(MAX_SINGLE_BLOCK_DECREASE ** blocksInFuture * 1000);

  const maxBaseFee = currentBaseFee.mul(maxIncreaseAtTarget).div(1000);
  const minBaseFee = currentBaseFee.mul(maxDecreaseAtTarget).div(1000);

  return {
    maxBaseFeeWei: maxBaseFee.toString(),
    minBaseFeeWei: minBaseFee.toString(),
    maxBaseFeeGwei: formatUnits(maxBaseFee, 'gwei'),
    minBaseFeeGwei: formatUnits(minBaseFee, 'gwei')
  };
}

export const getEstimatedGasPrice = async (provider: Provider | undefined): Promise<string | undefined> => {
  if (!provider) {
    return undefined;
  }
  const price = await provider.getGasPrice();
  const result = getFeesAtTarget(price, 4);
  const priorityFee = parseUnits('3', 'gwei');
  const priceEstimate = BigNumber.from(result.maxBaseFeeWei).add(priorityFee);
  return priceEstimate.toString();
};

export const getDefaultOrderExpiryTime = (): ORDER_EXPIRY_TIME => {
  return ORDER_EXPIRY_TIME.SIX_MONTHS;
};

export const getOrderExpiryTimeInMsFromEnum = (startTimeMs: number, expiry: ORDER_EXPIRY_TIME): number => {
  switch (expiry) {
    case ORDER_EXPIRY_TIME.HOUR:
      return startTimeMs + 60 * 60 * 1000;
    case ORDER_EXPIRY_TIME.DAY:
      return startTimeMs + 24 * 60 * 60 * 1000;
    case ORDER_EXPIRY_TIME.WEEK:
      return startTimeMs + 7 * 24 * 60 * 60 * 1000;
    case ORDER_EXPIRY_TIME.MONTH:
      return startTimeMs + 30 * 24 * 60 * 60 * 1000;
    case ORDER_EXPIRY_TIME.SIX_MONTHS:
      return startTimeMs + 180 * 24 * 60 * 60 * 1000;
    case ORDER_EXPIRY_TIME.YEAR:
      return startTimeMs + 365 * 24 * 60 * 60 * 1000;
    default:
      return startTimeMs + 7 * 24 * 60 * 60 * 1000;
  }
};

export const replaceIPFSWithGateway = (_url?: string) => {
  try {
    const url = new URL(_url ?? '');
    if (url.protocol !== 'ipfs:') {
      return url.toString();
    }
    const gateway = 'https://ipfs.io/ipfs';
    const image = `${gateway}/${url.host}${url.pathname}`;
    return new URL(normalize(image)).toString();
  } catch (err) {
    return _url ?? '';
  }
};

export const erc721OrderCartItemToTokenCartItem = (order: ERC721OrderCartItem): ERC721TokenCartItem => {
  // this function assumes single item orders only not m of n types
  const collInfo = order.nfts[0];
  const item = order.nfts[0]?.tokens[0];
  let orderSnippet: OrdersSnippet;
  if (order.isSellOrder) {
    orderSnippet = {
      listing: {
        hasOrder: true,
        signedOrder: order.signedOrder
      }
    };
  } else {
    orderSnippet = {
      offer: {
        hasOrder: true,
        signedOrder: order.signedOrder
      }
    };
  }

  const result: ERC721TokenCartItem = {
    id: collInfo.chainId + ':' + collInfo.collectionAddress + ':' + item?.tokenId ?? '',
    name: item?.tokenName ?? '',
    title: collInfo.collectionName ?? '',
    collectionName: collInfo.collectionName ?? '',
    collectionSlug: collInfo.collectionSlug ?? '',
    description: '',
    image: item?.tokenImage,
    displayType: 'contain',
    isVideo: false,
    price: order?.startPriceEth ?? 0,
    chainId: collInfo.chainId,
    tokenAddress: collInfo.collectionAddress ?? '',
    address: collInfo.collectionAddress ?? '',
    tokenId: item?.tokenId ?? '',
    rarityRank: 0,
    orderSnippet,
    hasBlueCheck: collInfo.hasBlueCheck ?? false,
    attributes: [],
    cartType: CartType.None
  };

  return result;
};

export const erc721OrderCartItemToCollectionCartItem = (order: ERC721OrderCartItem): ERC721CollectionCartItem => {
  // this function assumes single item orders only not m of n types
  const collInfo = order.nfts[0];

  const result: ERC721CollectionCartItem = {
    chainId: collInfo.chainId,
    address: collInfo.collectionAddress ?? '',
    hasBlueCheck: collInfo.hasBlueCheck ?? false,
    cartType: CartType.CollectionBid,
    tokenStandard: TokenStandard.ERC721,
    offerPriceEth: order.startPriceEth,
    deployer: '',
    deployedAt: 0,
    deployedAtBlock: 0,
    owner: '',
    numOwnersUpdatedAt: 0,
    metadata: {
      name: collInfo.collectionName ?? '',
      description: '',
      profileImage: collInfo.collectionImage ?? '',
      bannerImage: '',
      symbol: '',
      links: {
        timestamp: 0
      }
    },
    slug: collInfo.collectionSlug ?? '',
    numNfts: 0,
    numTraitTypes: 0,
    indexInitiator: '',
    state: {
      version: 0,
      create: {
        step: CreationFlow.Complete,
        updatedAt: 0,
        error: undefined,
        progress: 0,
        zoraCursor: undefined,
        reservoirCursor: undefined
      },
      export: {
        done: false
      }
    }
  };

  return result;
};

export const erc721TokenCartItemToCollectionCartItem = (order: ERC721TokenCartItem): ERC721CollectionCartItem => {
  // this function assumes single item orders only not m of n types

  const result: ERC721CollectionCartItem = {
    id: order.id,
    chainId: order.chainId ?? '',
    address: order.address ?? order.tokenAddress ?? '',
    hasBlueCheck: order.hasBlueCheck ?? false,
    cartType: CartType.CollectionBid,
    tokenStandard: TokenStandard.ERC721,
    offerPriceEth: order.price,
    deployer: '',
    deployedAt: 0,
    deployedAtBlock: 0,
    owner: '',
    numOwnersUpdatedAt: 0,
    criteria: order.criteria,
    source: order.source,
    image: order.criteria?.data?.collection?.image ?? '',
    metadata: {
      name: order.collectionName ?? order.criteria?.data?.collection?.name ?? '',
      description: '',
      profileImage: order.criteria?.data?.collection?.image ?? '',
      bannerImage: '',
      symbol: '',
      links: {
        timestamp: 0
      }
    },
    slug: order.collectionSlug ?? '',
    numNfts: 0,
    numTraitTypes: 0,
    indexInitiator: '',
    state: {
      version: 0,
      create: {
        step: CreationFlow.Complete,
        updatedAt: 0,
        error: undefined,
        progress: 0,
        zoraCursor: undefined,
        reservoirCursor: undefined
      },
      export: {
        done: false
      }
    }
  };

  return result;
};

export const reservoirTokenToERC721Token = (resvToken: ReservoirTokenV6): Erc721Token => {
  // do the mapping and return
  const token = resvToken.token;
  const result: Erc721Token = {
    chainId: token.chainId,
    collectionAddress: token.contract,
    collectionName: token.collection.name,
    collectionSlug: token.collection.slug,
    tokenId: token.tokenId,
    tokenStandard: TokenStandard.ERC721,
    tokenIdNumeric: Number(token.tokenId),
    rarityRank: token.rarityRank,
    rarityScore: token.rarity,
    image: {
      url: token.image,
      updatedAt: 0
    },
    metadata: {
      name: token.name,
      title: token.name,
      description: token.description,
      attributes: token.attributes.map((attr) => {
        return {
          traitType: attr.key,
          value: attr.value
        };
      })
    }
  };
  return result;
};

export const ENV: Env = (process.env.NEXT_PUBLIC_ENV as Env | undefined | '') || Env.Prod;
