import { getAddress } from '@ethersproject/address';
import { BaseToken, ChainId, OwnerInfo } from '@infinityxyz/lib-frontend/types/core';
import {
  Env,
  ETHEREUM_CHAIN_SCANNER_BASE,
  POLYGON_CHAIN_SCANNER_BASE,
  trimLowerCase
} from '@infinityxyz/lib-frontend/utils';
import { ReactNode } from 'react';
import ethers from 'ethers';
import { FeedFilter } from './firestore/firestoreUtils';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { normalize } from 'path';

export const base64Encode = (data: string) => Buffer.from(data).toString('base64');

export const base64Decode = (data?: string) => Buffer.from(data ?? '', 'base64').toString();

export const isServer = () => typeof window === 'undefined';

export const isLocalhost = () => !isServer() && (window?.location?.host || '').indexOf('localhost') >= 0;

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

// use ellipsisString for non-address numbers, this gets the checksum address
export const ellipsisAddress = (address?: string, left = 6, right = 4) => {
  return ellipsisString(toChecksumAddress(address), left, right);
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
  if (typeof msg === 'string' && msg.indexOf('User denied transaction signature.') > 0) {
    customMsg = 'MetaMask: User denied transaction signature';
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

export const getChainScannerBase = (chainId?: string): string | null => {
  if (chainId === '1') {
    return ETHEREUM_CHAIN_SCANNER_BASE;
  } else if (chainId === '137') {
    return POLYGON_CHAIN_SCANNER_BASE;
  }
  return null;
};

export const PleaseConnectMsg = () => <>Please connect your wallet.</>;

export const truncateDecimals = (numStr: string) => {
  return ((numStr ?? '') + ' ').slice(0, numStr.indexOf('.'));
};

export const getLoginMessage = (nonce: number): string => {
  // ignore the formatting of this multiline string
  const msg = `Welcome to Infinity. Click "Sign" to sign in. No password needed. This request will not trigger a blockchain transaction or cost any gas fees.
 
I accept the Infinity Terms of Service: https://infinity.xyz/terms

Nonce: ${nonce}
Expires in: 24 hrs`;

  return msg;
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

export const getEstimatedGasPrice = async (
  provider: ethers.providers.Web3Provider | undefined
): Promise<string | undefined> => {
  if (!provider) {
    return undefined;
  }
  const price = await provider.getGasPrice();
  const priceEstimate = price.mul(3);
  return priceEstimate.toString();
};

export const getTypesForFilter = (f: FeedFilter) => {
  const types = f.types ?? [];

  if (types.length === 0) {
    return [
      EventType.NftSale,
      EventType.NftListing,
      EventType.CoinMarketCapNews,
      EventType.DiscordAnnouncement,
      EventType.NftTransfer,
      EventType.TwitterTweet,
      EventType.NftOffer,
      EventType.TokensStaked,
      EventType.UserVote
    ];
  }

  return types;
};

export const getUserToDisplay = (
  user: { address: string; username?: string; displayName?: string },
  currentUserAddress: string
): { value: string; link: string; address: string } => {
  if (currentUserAddress === user.address) {
    return { value: 'You', link: '/profile/me', address: currentUserAddress };
  }

  return {
    value: ellipsisString(user.displayName || user.username || ellipsisAddress(user.address)),
    address: user.address,
    link: `/profile/${user.address}`
  };
};

export const getCollectionLink = ({ slug, address, chainId }: { slug: string; address: string; chainId: ChainId }) => {
  return `/collection/${slug || chainId.toString() + ':' + address}`;
};

export const getTokenLink = ({ chainId, address, tokenId }: { chainId: ChainId; address: string; tokenId: string }) => {
  return `/asset/${chainId.toString()}/${address}/${tokenId}`;
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

export const ENV: Env = (process.env.NEXT_PUBLIC_ENV as Env | undefined | '') || Env.Prod;
