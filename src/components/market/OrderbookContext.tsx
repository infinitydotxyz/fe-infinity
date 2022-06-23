import isEqual from 'lodash/isEqual';
import { GetOrderItemsQuery, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { apiGet, ITEMS_PER_PAGE } from 'src/utils';
import { debounce } from 'lodash';

export type OBFilters = {
  sort?: string;
  orderTypes?: string[];
  collections?: string[];
  minPrice?: number;
  maxPrice?: number;
  numberOfNfts?: number;
};

export const SORT_FILTERS = {
  highestPrice: 'highestPrice',
  lowestPrice: 'lowestPrice',
  mostRecent: 'mostRecent'
};

const getIsSellOrder = (orderTypes: OBFilters['orderTypes']) => {
  if (!orderTypes || orderTypes === []) {
    return undefined;
  } else if (orderTypes.length === 1 && orderTypes.includes('Listing')) {
    // todo: check with backend types
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
      case 'sort':
        if (filters.sort === SORT_FILTERS.lowestPrice) {
          parsedFilters.orderBy = 'startPriceEth';
          parsedFilters.orderByDirection = 'asc';
        }
        if (filters.sort === SORT_FILTERS.highestPrice) {
          parsedFilters.orderBy = 'startPriceEth';
          parsedFilters.orderByDirection = 'desc';
        }
        if (filters.sort === SORT_FILTERS.mostRecent) {
          parsedFilters.orderBy = 'startTimeMs';
          parsedFilters.orderByDirection = 'desc';
        }
        break;
      case 'orderTypes':
        if (filters?.orderTypes?.length) {
          parsedFilters.isSellOrder = getIsSellOrder(filters?.orderTypes);
        }
        break;
      case 'collections':
        if (filters?.collections?.length) {
          parsedFilters.collections = filters?.collections.map((collection) => {
            const decoded = decodeURIComponent(collection);
            return decoded.split(':')[1];
          });
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
  const { collections: _collections, orderTypes: _orderTypes, minPrice, maxPrice, numberOfNfts, sort } = query;

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

  if (sort) {
    newFilters.sort = sort as string;
  }

  return newFilters;
};

type OBContextType = {
  orders: SignedOBOrder[];
  isLoading: boolean;
  fetchMore: () => Promise<void>;
  filters: OBFilters;
  setFilters: React.Dispatch<React.SetStateAction<OBFilters>>;
  clearFilter: (name: string) => void;
  updateFilterArray: (filterName: string, currentFitlers: string[], selectionName: string, checked: boolean) => void;
  updateFilter: (name: string, value: string) => void;
  collectionId: string | undefined;
  hasMoreOrders: boolean;
};

const OrderbookContext = React.createContext<OBContextType | null>(null);

type OBProvider = {
  children: ReactNode;
  collectionId: string | undefined;
  tokenId?: string;
};

const AMOUNT_OF_ORDERS = 10;

export const OrderbookProvider = ({ children, collectionId, tokenId }: OBProvider) => {
  const router = useRouter();
  const defaultFilters = parseRouterQueryParamsToFilters(router.query);

  if (!router.isReady) {
    return null;
  }

  const [orders, setOrders] = useState<SignedOBOrder[]>([]);
  const [filters, setFilters] = useState<OBFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(AMOUNT_OF_ORDERS);
  const [hasMoreOrders, setHasMoreOrders] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, [collectionId]);

  useEffect(() => {
    const newFilters = parseRouterQueryParamsToFilters(router.query);

    if (!isEqual(newFilters, filters)) {
      setFilters(newFilters);
    }
  }, [router.query]);

  useEffect(() => {
    fetchOrders();
  }, [limit]);

  useEffect(() => {
    fetchOrders(true);
  }, [filters]);

  const fetchMore = async () => {
    setLimit(limit + AMOUNT_OF_ORDERS);
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
  const fetchOrders = debounce(async (refreshData = false) => {
    try {
      setIsLoading(true);
      const parsedFilters = parseFiltersToApiQueryParams(filters);
      // console.log('fetchOrders - parsedFilters', parsedFilters);
      // const orders = await getOrders(
      //   { ...parsedFilters, collections: collectionId ? [collectionId] : parsedFilters.collections },
      //   limit
      // );
      // eslint-disable-next-line
      const query: any = {
        limit: ITEMS_PER_PAGE,
        cursor: refreshData ? '' : cursor,
        ...parsedFilters,
        collections: collectionId ? [collectionId] : parsedFilters.collections
      };
      if (tokenId) {
        query.tokenId = tokenId;
      }
      const { result } = await apiGet('/orders', {
        query
      });
      if (result?.data) {
        if (refreshData) {
          setOrders([...result.data]);
        } else {
          setOrders([...orders, ...result.data]);
        }

        // setHasMoreOrders(orders.length === limit);
        setHasMoreOrders(result?.hasNextPage);
        setCursor(result?.cursor);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  const value: OBContextType = {
    orders,
    isLoading,
    fetchMore,
    filters,
    setFilters,
    clearFilter,
    updateFilterArray,
    updateFilter,
    collectionId,
    hasMoreOrders
  };

  return <OrderbookContext.Provider value={value}>{children}</OrderbookContext.Provider>;
};

export const useOrderbook = () => {
  return React.useContext(OrderbookContext) as OBContextType;
};
