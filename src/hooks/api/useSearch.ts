/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChainId,
  SearchBy,
  SearchQuery,
  SearchType,
  SubQuery,
  SubQuerySearchBy,
  SubQueryType
} from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { SearchResult } from 'src/components/common/search/types';
import { useFetch } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useDebounce } from '../useDebounce';

type Response = { data: SearchResult[]; cursor: string; hasNextPage: boolean };

type OptionalProps<T extends SearchType = any, U extends SearchBy<T> = any> = Partial<
  Pick<SearchQuery<T, U>, 'chainId' | 'limit' | 'cursor'>
>;

export type ClientSearches<
  T extends SearchType = any,
  U extends SearchBy<T> = any,
  V extends SubQueryType<T, U> = any
> = (SubQuery<T, U, V> & OptionalProps) | (SearchQuery<T, U> & OptionalProps<T, U>);

export const useSearch = <T extends SearchType = any, U extends SearchBy<T> = any, V extends SubQueryType<T, U> = any>(
  search: ClientSearches<T, U, V>
) => {
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
    searchBy: 'slug',
    query: ''
  }
};

export const useSearchState = <
  T extends SearchType = any,
  U extends SearchBy<T> = any,
  V extends SubQueryType<T, U> = any
>(
  defaultSearch?: ClientSearches<T, U, V>
) => {
  const [search, setSearch] = useState<ClientSearches<T, U, V>>(
    defaultSearch ?? defaultSearchByType[SearchType.Collection]
  );

  const setType = (type: SearchType) => {
    setSearch(defaultSearchByType[type]);
  };

  const setQuery = (query: string) => {
    setSearch((prev) => ({ ...prev, query }));
  };

  const setSubType = <T extends SearchType = any, U extends SearchBy<T> = any, V extends SubQueryType<T, U> = any>(
    subType?: V,
    subTypeSearchBy?: SubQuerySearchBy<T, U, V>
  ) => {
    if (!subType) {
      setSearch((prev) => {
        if ('subType' in prev) {
          const { subType, subTypeQuery, subTypeSearchBy, ...rest } = prev;
          return rest;
        }
        return prev;
      });
      return;
    }

    switch (search.type) {
      case SearchType.Collection: {
        switch (search.searchBy) {
          case 'slug':
          case 'address':
            setSearch((prev) => ({
              ...prev,
              subType,
              subTypeQuery: '',
              subTypeSearchBy: subTypeSearchBy
            }));
            break;
          default:
            throw new Error('Not yet implemented');
        }
        break;
      }
      default:
        throw new Error('Not yet implemented');
    }
  };

  const setSubTypeQuery = (subTypeQuery: string) => {
    setSearch((prev) => ({ ...prev, subTypeQuery }));
  };

  const setSubTypeSearchBy = <
    T extends SearchType = any,
    U extends SearchBy<T> = any,
    V extends SubQueryType<T, U> = any
  >(
    subTypeSearchBy: SubQuerySearchBy<T, U, V>
  ) => {
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
