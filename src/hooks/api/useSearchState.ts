/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchType, SearchBy, SubQueryType, SubQuerySearchBy } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { ClientSearches } from './useSearch';

export const useSearchState = <
  T extends SearchType = any,
  U extends SearchBy<T> = any,
  V extends SubQueryType<T, U> = any
>(
  defaultSearch: ClientSearches<T, U, V>
) => {
  const [search, setSearch] = useState<ClientSearches<T, U, V>>(defaultSearch);

  const setType = (type: SearchType) => {
    setSearch(defaultSearch);
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
