import { BaseCollection, ChainId } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { useFetch } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

type Response = { data: BaseCollection[]; cursor: string; hasNextPage: boolean };

export enum SearchType {
  Collection = 'collection',
  User = 'user'
}

export interface SearchQuery {
  type?: SearchType;
  cursor: string;
  limit: number;
  chainId: ChainId;
  query: string;
}

export enum CollectionSearchType {
  Nft = 'nft'
}

export interface BaseUserSearchQuery extends SearchQuery {
  type: SearchType.User;
}

enum CollectionSearchBy {
  Slug = 'slug',
  Address = 'address'
}

export interface BaseCollectionSearchQuery extends SearchQuery {
  type: SearchType.Collection;
  subType?: CollectionSearchType;
  searchBy: CollectionSearchBy;
}

export interface CollectionSearchQueryByAddress extends BaseCollectionSearchQuery {
  searchBy: CollectionSearchBy.Address;
}

export interface CollectionSearchQueryBySlug extends BaseCollectionSearchQuery {
  searchBy: CollectionSearchBy.Slug;
}

export type BaseCollectionSearches = CollectionSearchQueryByAddress | CollectionSearchQueryBySlug;

export enum CollectionNftsSearchBy {
  TokenId = 'tokenId'
}

export type BaseNftSearchQuery = BaseCollectionSearches & {
  subType: CollectionSearchType.Nft;
  subTypeQuery: string;
  subTypeSearchBy: CollectionNftsSearchBy;
};

export type NftSearchQueryByTokenId = BaseNftSearchQuery & {
  subTypeSearchBy: CollectionNftsSearchBy.TokenId;
  tokenId: string;
};

export type CollectionNftSearches = NftSearchQueryByTokenId;

export type CollectionSearches = BaseCollectionSearches | CollectionNftSearches;

export type UserSearches = BaseUserSearchQuery;

export type Searches = CollectionSearches | UserSearches;

export type ClientSearches = Searches & Partial<Pick<SearchQuery, 'chainId' | 'limit' | 'cursor'>>;

export const useSearch = (search: ClientSearches) => {
  const { chainId } = useOnboardContext();

  const { result, isLoading } = useFetch<Response>('/search', {
    query: {
      ...search,
      cursor: '',
      limit: 5,
      chainId: chainId
    }
  });

  return {
    result,
    isLoading
  };
};

const common = {
  cursor: '',
  limit: 5,
  chainId: ChainId.Mainnet
};

const defaultsByType: Record<SearchType, ClientSearches> = {
  [SearchType.Collection]: {
    ...common,
    type: SearchType.Collection,
    searchBy: CollectionSearchBy.Slug,
    query: 'bored'
  },
  [SearchType.User]: {
    ...common,
    type: SearchType.User,
    query: ''
  }
};

export const useSearchState = () => {
  const [search, setSearch] = useState<ClientSearches>(defaultsByType[SearchType.Collection]);

  const setType = (type: SearchType) => {
    setSearch(defaultsByType[type]);
  };

  const setQuery = (query: string) => {
    setSearch((prev) => ({ ...prev, query }));
  };

  return {
    search,
    setType,
    setQuery
  };
};
