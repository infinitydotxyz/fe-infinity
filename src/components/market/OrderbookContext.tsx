import isEqual from 'lodash/isEqual';
import { GetOrderItemsQuery, OBOrder } from '@infinityxyz/lib/types/core';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { getOrders } from 'src/utils/marketUtils';
import { ParsedUrlQuery } from 'querystring';

export type OBFilters = {
  orderTypes?: string[];
  collections?: string[];
  minPrice?: number;
  maxPrice?: number;
  numberOfNfts?: number;
};

const getIsSellOrder = (orderTypes: OBFilters['orderTypes']) => {
  if (!orderTypes || orderTypes === []) {
    return undefined;
  } else if (orderTypes.length === 1 && orderTypes.includes('Listing')) {
    return true;
  } else if (orderTypes.length === 1 && orderTypes.includes('Offer')) {
    return false;
  } else {
    return undefined;
  }
};

const parseFiltersToApiQueryParams = (filters: OBFilters): GetOrderItemsQuery => {
  const parsedFilters: GetOrderItemsQuery = {};

  Object.keys(filters).forEach((filter) => {
    switch (filter) {
      case 'orderTypes':
        if (filters?.orderTypes?.length) {
          parsedFilters.isSellOrder = getIsSellOrder(filters?.orderTypes);
        }
        break;
      case 'collections':
        if (filters?.collections?.length) {
          parsedFilters.collections = filters?.collections;
        }
        break;
      case 'minPrice':
        if (filters?.minPrice) {
          parsedFilters.minPrice = filters?.minPrice;
        }
        break;
      case 'maxPrice':
        if (filters?.maxPrice) {
          parsedFilters.maxPrice = filters?.maxPrice;
        }
        break;
      case 'numberOfNfts':
        if (filters?.numberOfNfts) {
          parsedFilters.numItems = filters?.numberOfNfts;
        }
        break;
    }
  });

  return parsedFilters;
};

const parseRouterQueryParamsToFilters = (query: ParsedUrlQuery): OBFilters => {
  const { collections: _collections, orderTypes: _orderTypes, minPrice, maxPrice, numberOfNfts } = query;

  const newFilters: OBFilters = {};

  let collections: string[] = [];
  if (typeof _collections === 'string') {
    collections = [_collections];
  }
  if (typeof _collections === 'object') {
    collections = [..._collections];
  }

  let orderTypes: string[] = [];
  if (typeof _orderTypes === 'string') {
    orderTypes = [_orderTypes];
  }
  if (typeof _orderTypes === 'object') {
    orderTypes = [..._orderTypes];
  }

  if (orderTypes.length > 0) {
    newFilters.orderTypes = orderTypes;
  }

  if (collections.length > 0) {
    newFilters.collections = collections;
  }

  if (minPrice) {
    newFilters.minPrice = parseInt(minPrice as string);
  }
  if (maxPrice) {
    newFilters.maxPrice = parseInt(maxPrice as string);
  }

  if (numberOfNfts) {
    newFilters.numberOfNfts = parseInt(numberOfNfts as string);
  }

  return newFilters;
};

type OBContextType = {
  orders: OBOrder[];
  isLoading: boolean;
  fetchMore: () => Promise<void>;
  filters: OBFilters;
  setFilters: React.Dispatch<React.SetStateAction<OBFilters>>;
  clearFilter: (name: string) => void;
  updateFilterArray: (filterName: string, currentFitlers: string[], selectionName: string, checked: boolean) => void;
  updateFilter: (name: string, value: string) => void;
};

const OrderbookContext = React.createContext<OBContextType | null>(null);

type OBProvider = {
  children: ReactNode;
};

export const OrderbookProvider = ({ children }: OBProvider) => {
  const router = useRouter();
  const defaultFilters = parseRouterQueryParamsToFilters(router.query);

  if (!router.isReady) {
    return null;
  }

  const [orders, setOrders] = useState<OBOrder[]>([]);
  const [filters, setFilters] = useState<OBFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const newFilters = parseRouterQueryParamsToFilters(router.query);

    if (!isEqual(newFilters, filters)) {
      setFilters(newFilters);
    }
  }, [router.query]);

  useEffect(() => {
    console.log('fetching orders...');
    fetchOrders();
  }, [filters]);

  const fetchMore = async () => {
    return fetchOrders();
  };

  // filters helper functions
  const removeQueryParam = (value: string) => {
    const updateQueryParams = { ...router.query };
    delete updateQueryParams[value];
    router.replace({ pathname: router.pathname, query: { ...updateQueryParams } });
  };

  const clearFilter = (name: string) => {
    removeQueryParam(name);
  };

  const updateFilterArray = (filterName: string, currentFitlers: string[], selectionName: string, checked: boolean) => {
    let updatedSelections = [];
    if (checked) {
      updatedSelections = [...currentFitlers, selectionName];
    } else {
      updatedSelections = currentFitlers.filter((currentFilter) => currentFilter !== selectionName);
    }

    router.replace({ pathname: router.pathname, query: { ...router.query, [filterName]: updatedSelections } });
  };

  const updateFilter = (name: string, value: string) => {
    if (!value) {
      removeQueryParam(name);
    } else {
      router.replace({ pathname: router.pathname, query: { ...router.query, [name]: value } });
    }
  };

  // todo: make this prod ready
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const orders = await getOrders(parseFiltersToApiQueryParams(filters));
      setOrders(orders);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const value: OBContextType = {
    orders,
    isLoading,
    fetchMore,
    filters,
    setFilters,
    clearFilter,
    updateFilterArray,
    updateFilter
  };

  return <OrderbookContext.Provider value={value}>{children}</OrderbookContext.Provider>;
};

export const useOrderbook = () => {
  return React.useContext(OrderbookContext) as OBContextType;
};
