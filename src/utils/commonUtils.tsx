import { ReactNode } from 'react';
import { ethers } from 'ethers';
import { CardData } from '@infinityxyz/lib/types/core';
import {
  WETH_ADDRESS,
  CHAIN_SCANNER_BASE,
  POLYGON_WETH_ADDRESS,
  ETHEREUM_NETWORK_NAME,
  POLYGON_NETWORK_NAME,
  POLYGON_CHAIN_SCANNER_BASE,
  NFT_DATA_SOURCES
} from './constants';
import { UnmarshalNFTAsset } from '@infinityxyz/lib/types/services/unmarshal';
import { AlchemyUserAsset } from '@infinityxyz/lib/types/services/alchemy';
import { trimLowerCase } from '@infinityxyz/lib/utils';

// OpenSea's EventType
export enum EventType {
  // Transactions and signature requests
  TransactionCreated = 'TransactionCreated',
  TransactionConfirmed = 'TransactionConfirmed',
  TransactionDenied = 'TransactionDenied',
  TransactionFailed = 'TransactionFailed',

  // Basic actions: matching orders, creating orders, and cancelling orders
  MatchOrders = 'MatchOrders',
  CancelOrder = 'CancelOrder',
  ApproveOrder = 'ApproveOrder',
  CreateOrder = 'CreateOrder',
  // When the signature request for an order is denied
  OrderDenied = 'OrderDenied',

  ApproveCurrency = 'ApproveCurrency'
}

export const isServer = () => typeof window === 'undefined';

export const isLocalhost = () =>
  typeof window !== 'undefined' && (window?.location?.host || '').indexOf('localhost') >= 0;

export const toChecksumAddress = (address?: string): string => {
  if (address) {
    let result = address;

    try {
      // this crashes if the address isn't valid
      result = ethers.utils.getAddress(address);
    } catch (err) {
      // do nothing
    }

    return result;
  }

  return '';
};

// use ellipsisString for non-address numbers, this gets the checksum address
export const ellipsisAddress = (address: string, left = 6, right = 4) => {
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
      return `${inString.slice(0, left)}...${inString.slice(-right)}`;
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

export const transformOpenSea = (item: any, owner: string, chainId: string) => {
  if (!item) {
    return null;
  }

  return {
    id: `${item?.asset_contract?.address}_${item?.token_id}`,
    title: item.name,
    description: item.description,
    image: item.image_url,
    imagePreview: item.image_preview_url,
    tokenAddress: item.asset_contract.address,
    tokenId: item.token_id,
    collectionName: item.asset_contract.name,
    owner: owner,
    schemaName: item['asset_contract']['schema_name'],
    chainId,
    data: item
  } as CardData;
};

export const transformUnmarshal = (item: UnmarshalNFTAsset, owner: string, chainId: string) => {
  if (!item) {
    return null;
  }

  let schemaName = '';
  const nftType = item?.type;
  if (nftType === '721') {
    schemaName = 'ERC721';
  } else if (nftType === '1155') {
    schemaName = 'ERC1155';
  }

  const data = item;
  data.traits = item?.nft_metadata;

  return {
    id: `${item?.asset_contract}_${item?.token_id}`,
    title: item?.issuer_specific_data?.name,
    description: item?.description,
    image: item?.issuer_specific_data?.image_url,
    imagePreview: item?.issuer_specific_data?.image_url,
    tokenAddress: item?.asset_contract,
    tokenId: item?.token_id,
    collectionName: item?.issuer_specific_data?.name,
    owner,
    schemaName,
    chainId,
    data
  } as CardData;
};

export const transformAlchemy = (item: AlchemyUserAsset, owner: string, chainId: string) => {
  if (!item) {
    return null;
  }

  let schemaName = '';
  const nftType = item?.id?.tokenMetadata?.tokenType;
  if (nftType?.trim().toLowerCase() === 'erc721') {
    schemaName = 'ERC721';
  } else if (nftType?.trim().toLowerCase() === 'erc1155') {
    schemaName = 'ERC1155';
  }

  const data = item;
  // data.traits = item?.metadata?.attributes;

  let image = item?.metadata?.image;
  // special case
  if (image.startsWith('ipfs://')) {
    image = item?.media[0]?.uri?.gateway;
  }

  return {
    id: `${item?.contract?.address}_${item?.id?.tokenId}`,
    title: item?.title,
    description: item?.description,
    image: image,
    imagePreview: image,
    tokenAddress: item?.contract?.address,
    tokenId: item?.id?.tokenId,
    collectionName: item?.title, // this should ideally be coll name; todo: adi handle this case
    owner,
    schemaName,
    chainId,
    data
  } as CardData;
};

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

export const getCustomMessage = (eventName: string, data: any) => {
  const arr: string[] = [];
  Object.keys(data).forEach((k: string) => {
    if (typeof data[k] !== 'object') {
      arr.push(`${k}: ${data[k]}`);
    }
  });
  const defaultMsg = `${eventName}: ${arr.join(', ')}`;
  let customMsg: JSX.Element | string | null = defaultMsg;

  const createLink = (transactionHash: string) => (
    <a
      className="toast-link"
      href={`${getChainScannerBase(data.chainId)}/tx/${transactionHash}`}
      target="_blank"
      rel="noreferrer"
    >
      {data?.transactionHash}
    </a>
  );

  if (
    eventName === EventType.MatchOrders ||
    eventName === EventType.CreateOrder ||
    eventName === EventType.CancelOrder ||
    eventName === EventType.OrderDenied ||
    eventName === EventType.TransactionDenied
  ) {
    // for these events, MetaMask pops up, no need to show messages.
    return null;
  }
  // customize OpenSea messages:
  if (eventName === EventType.TransactionCreated) {
    customMsg = <span>Your transaction has been sent to chain: {createLink(data?.transactionHash)}</span>;
  }
  if (eventName === EventType.TransactionConfirmed) {
    customMsg = 'Transaction confirmed';
  }
  if (eventName === EventType.TransactionFailed) {
    customMsg = 'Transaction failed';
  }
  if (eventName === EventType.ApproveCurrency) {
    customMsg = 'Approving currency for trading';
  }
  return customMsg;
};

// if items used their title as a key they ran the risk of having the same value
// to fix this we can use a guid generator instead
export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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
        short = f.toFixed(4);
      }
    }
    short = value;
  } else {
    short = value.toFixed(4);
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
    short = p.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  }

  return short;
};

// get search-friendly string, e.g. `/collections/${getSearchFriendlyString(collectionName)}`
export const getSearchFriendlyString = (input: string): string => {
  if (!input) {
    return '';
  }
  // remove spaces, dashes and underscores only
  const output = input.replace(/[\s-_]/g, '');
  return output.toLowerCase();
};

export const getCanonicalWeth = (chain: string): { address: string; decimals: number } => {
  if (!chain) {
    return { address: '', decimals: 0 };
  }
  if (chain === ETHEREUM_NETWORK_NAME) {
    return { address: WETH_ADDRESS, decimals: 18 };
  } else if (chain === POLYGON_NETWORK_NAME) {
    return { address: POLYGON_WETH_ADDRESS, decimals: 18 };
  }
  return { address: '', decimals: 0 };
};

export const getChainScannerBase = (chainId?: string): string | null => {
  if (chainId === '1') {
    return CHAIN_SCANNER_BASE;
  } else if (chainId === '137') {
    return POLYGON_CHAIN_SCANNER_BASE;
  }
  return null;
};

export const getNftDataSource = (chainId?: string): number => {
  if (chainId === '1') {
    return NFT_DATA_SOURCES.OPENSEA;
  } else if (chainId === '137') {
    return NFT_DATA_SOURCES.UNMARSHAL;
  }
  // default
  return NFT_DATA_SOURCES.OPENSEA;
};

export const getPageOffsetForAssetQuery = (source: number, currentPage: number, itemsPerPage: number): number => {
  if (source === NFT_DATA_SOURCES.OPENSEA) {
    return currentPage * itemsPerPage;
  } else if (source === NFT_DATA_SOURCES.UNMARSHAL) {
    return currentPage;
  }
  // default
  return currentPage;
};

// get search params from the current URL - example: getSearchParams('name')
export const getSearchParam = (paramName: string) => {
  if (typeof document !== 'undefined') {
    const params = new URL(document.location.toString()).searchParams;
    return params?.get(paramName);
  }
  return null;
};
