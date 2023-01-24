/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchBy, SearchQuery, SearchType, SubQuery, SubQueryType } from '@infinityxyz/lib-frontend/types/core';
import { SearchResult } from 'src/components/common/search/types';
import { useFetch } from 'src/utils';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
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

  if (!debouncedSearch.query) {
    return {
      result: {
        data: [],
        cursor: '',
        hasNextPage: false
      },
      isLoading: false
    };
  } else if ('subType' in debouncedSearch && !debouncedSearch.subTypeQuery) {
    return {
      result: {
        data: [],
        cursor: '',
        hasNextPage: false
      },
      isLoading: false
    };
  }
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
