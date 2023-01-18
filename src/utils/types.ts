import { ERC721CardData, Erc721Collection } from '@infinityxyz/lib-frontend/types/core';

export enum OrderBy {
  Price = 'price',
  StartTime = 'startTime',
  EndTime = 'endTime'
}

export const SORT_FILTERS = {
  highestPrice: 'highestPrice',
  lowestPrice: 'lowestPrice',
  mostRecent: 'mostRecent',
  tokenIdNumeric: 'tokenIdNumeric'
};

export const SORT_LABELS: {
  [key: string]: string;
} = {
  [SORT_FILTERS.highestPrice]: 'Highest Price',
  [SORT_FILTERS.lowestPrice]: 'Lowest Price',
  [SORT_FILTERS.mostRecent]: 'Most Recent',
  [SORT_FILTERS.tokenIdNumeric]: 'Token ID'
};

export enum ORDER_EXPIRY_TIME {
  HOUR = '1h',
  DAY = '1d',
  WEEK = '1w',
  MONTH = '1m',
  YEAR = '1y'
}

export interface Erc721CollectionOffer extends Erc721Collection {
  offerPriceEth?: number;
  offerExpiry?: ORDER_EXPIRY_TIME;
}

export interface Erc721TokenOffer extends ERC721CardData {
  offerPriceEth?: number;
  offerExpiry?: ORDER_EXPIRY_TIME;
}

export interface BasicTokenInfo {
  chainId: string;
  collectionAddress: string;
  tokenId: string;
}

export type TokensFilter = {
  sort?: string;
  orderType?: 'listings' | 'offers-made' | 'offers-received' | 'listing' | 'offer' | '';
  collections?: string[];
  minPrice?: string;
  maxPrice?: string;
  traitTypes?: string[];
  traitValues?: string[];
  orderBy?: string;
};

export const getSortLabel = (key?: string, defaultLabel?: string): string => {
  let result = '';

  if (key) {
    result = SORT_LABELS[key];
  }

  // default if blank
  return result || defaultLabel || SORT_LABELS[SORT_FILTERS.tokenIdNumeric];
};
