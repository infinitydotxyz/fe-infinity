import { ListingType } from '@infinityxyz/lib/types/core';
import React, { useContext, useState } from 'react';

export type Filter = {
  listingType?: ListingType | '';
  traitTypes?: string[];
  traitValues?: string[];
  priceMin?: string;
  priceMax?: string;
  sortByPrice?: 'ASC' | 'DESC' | '';
  orderBy?: 'rarityRank' | 'price' | '';
  orderDirection?: 'asc' | 'desc' | '';
};

const defaultFilter: Filter = {
  listingType: '',
  traitTypes: [],
  traitValues: [],
  orderBy: '',
  orderDirection: ''
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
