import { ERC721CardData, Erc721Collection } from '@infinityxyz/lib-frontend/types/core';

export enum ORDER_EXPIRY_TIME {
  HOUR = '1h',
  DAY = '1d',
  WEEK = '1w',
  MONTH = '1m',
  YEAR = '1y'
}

export interface Erc721CollectionOffer extends Erc721Collection {
  ethPrice: number;
  expiry: ORDER_EXPIRY_TIME;
}

export interface Erc721TokenOffer extends ERC721CardData {
  ethPrice: number;
  expiry: ORDER_EXPIRY_TIME;
}
