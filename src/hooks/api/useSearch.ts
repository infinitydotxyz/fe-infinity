/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { SearchResult } from 'src/components/common/search/types';
import { useFetch } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useDebounce } from '../useDebounce';

type Response = { data: SearchResult[]; cursor: string; hasNextPage: boolean };

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

export enum CollectionSearchBy {
  Slug = 'slug',
  Address = 'address'
}

export interface BaseCollectionSearchQuery extends SearchQuery {
  type: SearchType.Collection;
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
};

const isUserQuery = (search: Searches): search is BaseUserSearchQuery => {
  return search.type === SearchType.User;
};

const isCollectionQuery = (search: Searches): search is BaseCollectionSearches => {
  return search.type === SearchType.Collection;
};

const isCollectionQueryBySlug = (search: Searches): search is CollectionSearchQueryBySlug => {
  return isCollectionQuery(search) && search.searchBy === CollectionSearchBy.Slug;
};

const isCollectionQueryByAddress = (search: Searches): search is CollectionSearchQueryByAddress => {
  return isCollectionQuery(search) && search.searchBy === CollectionSearchBy.Address;
};

const isNftSearchQueryByTokenId = (search: Searches): search is NftSearchQueryByTokenId => {
  return (
    isCollectionQuery(search) &&
    'subType' in search &&
    search.subType === CollectionSearchType.Nft &&
    search.subTypeSearchBy === CollectionNftsSearchBy.TokenId
  );
};

export type CollectionNftSearches = NftSearchQueryByTokenId;

export type CollectionSearches = BaseCollectionSearches | CollectionNftSearches;

export type UserSearches = BaseUserSearchQuery;

export type Searches = CollectionSearches | UserSearches;

export type ClientSearches = Searches & Partial<Pick<SearchQuery, 'chainId' | 'limit' | 'cursor'>>;

export const useSearch = (search: ClientSearches) => {
  const { chainId } = useOnboardContext();

  const { debouncedValue: debouncedSearch } = useDebounce(search, 300);

  const { result, isLoading } = useFetch<Response>('/search', {
    query: {
      ...debouncedSearch,
      cursor: '',
      chainId: chainId
    }
  });

  return {
    result: {
      ...result,
      data: (result?.data ?? []) as SearchResult[]
    },
    isLoading
  };
};

const common = {
  cursor: '',
  limit: 10,
  chainId: ChainId.Mainnet
};

export const defaultSearchByType: Record<SearchType, ClientSearches> = {
  [SearchType.Collection]: {
    ...common,
    type: SearchType.Collection,
    searchBy: CollectionSearchBy.Slug,
    query: ''
  },
  [SearchType.User]: {
    ...common,
    type: SearchType.User,
    query: ''
  }
};

export const useSearchState = (defaultSearch?: ClientSearches) => {
  const [search, setSearch] = useState<ClientSearches>(defaultSearch ?? defaultSearchByType[SearchType.Collection]);

  const setType = (type: SearchType) => {
    setSearch(defaultSearchByType[type]);
  };

  const setQuery = (query: string) => {
    setSearch((prev) => ({ ...prev, query }));
  };

  const setSubType = (subType?: CollectionSearchType) => {
    if (subType) {
      setSearch((prev) => ({ ...prev, subType, subTypeQuery: '', subTypeSearchBy: CollectionNftsSearchBy.TokenId }));
    } else if (isNftSearchQueryByTokenId(search)) {
      const { subType, subTypeQuery, subTypeSearchBy, ...rest } = search;
      setSearch(rest);
    }
  };

  const setSubTypeQuery = (subTypeQuery: string) => {
    setSearch((prev) => ({ ...prev, subTypeQuery }));
  };

  const setSubTypeSearchBy = (subTypeSearchBy: CollectionNftsSearchBy) => {
    setSearch((prev) => ({ ...prev, subTypeSearchBy }));
  };

  return {
    search,
    setType,
    setQuery,
    setSubType,
    setSubTypeQuery,
    setSubTypeSearchBy
  };
};
