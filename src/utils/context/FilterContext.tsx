import { ListingType } from '@infinityxyz/lib-frontend/types/core';
import React, { useContext, useState } from 'react';

export enum OrderType {
  Listing = 'listing',
  Offer = 'offer'
}

export type Filter = {
  chainId?: string;
  listingType?: ListingType | '';
  orderType?: OrderType | '';
  traitTypes?: string[];
  traitValues?: string[];
  collectionAddresses?: string[];
  minPrice?: string;
  maxPrice?: string;
  sortByPrice?: 'ASC' | 'DESC' | '';
  orderBy?: 'price' | 'tokenIdNumeric';
  orderDirection?: 'asc' | 'desc';
};

export const defaultFilter: Filter = {
  // listingType: '',
  traitTypes: [],
  traitValues: [],
  orderBy: 'tokenIdNumeric',
  orderDirection: 'asc'
};

export type FilterContextType = {
  filterState: Filter;
  setFilterState: (state: Filter) => void;
};

const FilterContext = React.createContext<FilterContextType | null>(null);

export const FilterContextProvider = (props: React.PropsWithChildren<unknown>) => {
  const [filterState, setFilterState] = useState<Filter>(defaultFilter);

  const value: FilterContextType = { filterState, setFilterState };

  return <FilterContext.Provider value={value} {...props} />;
};

export const useFilterContext = (): FilterContextType => {
  return useContext(FilterContext) as FilterContextType;
};
