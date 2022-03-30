import { ListingType } from '@infinityxyz/lib/types/core';
import React, { useContext, useState } from 'react';

export type Filter = {
  listingType?: ListingType | '';
  traitTypes?: string;
  traitValues?: string;
};

const defaultFilter: Filter = {
  listingType: '',
  traitTypes: '',
  traitValues: ''
};

export type FilterContextType = {
  filterState: Filter;
  setFilterState: (state: Filter) => void;
};

const FilterContext = React.createContext<FilterContextType | null>(null);

export function FilterContextProvider(props: React.PropsWithChildren<unknown>) {
  const [filterState, setFilterState] = useState<Filter>(defaultFilter);

  const value: FilterContextType = { filterState, setFilterState };

  return <FilterContext.Provider value={value} {...props} />;
}

export function useFilterContext(): FilterContextType {
  return useContext(FilterContext) as FilterContextType;
}
