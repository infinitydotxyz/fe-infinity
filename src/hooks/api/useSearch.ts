/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChainId,
  SearchBy,
  SearchQuery,
  SearchType,
  SubQuery,
  SubQueryType
} from '@infinityxyz/lib-frontend/types/core';
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
