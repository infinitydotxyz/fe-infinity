import isEqual from 'lodash/isEqual';
import {
  ChainId,
  ChainOBOrder,
  GetOrderItemsQuery,
  Order,
  OrderItemToken,
  SignedOBOrder
} from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { apiGet, ITEMS_PER_PAGE } from 'src/utils';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { OrderCache } from './order-cache';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';

type OBFilters = {
  sort?: string;
  orderTypes?: string[];
  collections?: string[];
  minPrice?: string;
  maxPrice?: string;
  numberOfNfts?: number;
};

export const SORT_FILTERS = {
  highestPrice: 'highestPrice',
  lowestPrice: 'lowestPrice',
  mostRecent: 'mostRecent'
};

export const SORT_LABELS: {
  [key: string]: string;
} = {
  [SORT_FILTERS.highestPrice]: 'Highest Price',
  [SORT_FILTERS.lowestPrice]: 'Lowest Price',
  [SORT_FILTERS.mostRecent]: 'Most Recent'
};

export const getSortLabel = (key?: string): string => {
  let result = '';

  if (key) {
    result = SORT_LABELS[key];
  }

  // mostRecent is the default if blank
  return result || SORT_LABELS[SORT_FILTERS.mostRecent];
};

// ============================================================

const getIsSellOrder = (orderTypes: OBFilters['orderTypes']) => {
  if (!orderTypes || orderTypes.length === 0) {
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
          parsedFilters.minPrice = parseFloat(filters?.minPrice);
        }
        break;
      case 'maxPrice':
        if (filters?.maxPrice) {
          parsedFilters.maxPrice = parseFloat(filters?.maxPrice);
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
    newFilters.minPrice = minPrice as string;
  }

  if (maxPrice) {
    newFilters.maxPrice = maxPrice as string;
  }

  if (numberOfNfts) {
    newFilters.numberOfNfts = parseInt(numberOfNfts as string);
  }

  if (sort) {
    newFilters.sort = sort as string;
  }

  return newFilters;
};

// ============================================================

type OBContextType = {
  orders: SignedOBOrder[];
  isLoading: boolean;
  fetchMore: () => void;
  filters: OBFilters;
  setFilters: React.Dispatch<React.SetStateAction<OBFilters>>;
  clearFilters: (names: string[]) => Promise<boolean>;
  updateFilterArray: (
    filterName: string,
    currentFitlers: string[],
    selectionName: string,
    checked: boolean
  ) => Promise<boolean>;
  updateFilter: (name: string, value: string) => Promise<boolean>;
  updateFilters: (params: { name: string; value: string }[]) => Promise<boolean>;
  hasMoreOrders: boolean;
  hasNoData: boolean;
  isReady: boolean;
};

const OrderbookContext = React.createContext<OBContextType | null>(null);

const orderCache = new OrderCache();

interface BaseProps {
  children: ReactNode;
  kind: 'collection' | 'token' | 'user';
  limit?: number;
}

interface CollectionProps extends BaseProps {
  kind: 'collection';
  context: {
    collectionAddress: string;
  };
}

interface TokenProps extends BaseProps {
  kind: 'token';
  context: {
    collectionAddress: string;
    tokenId: string;
  };
}

interface UserProps extends BaseProps {
  kind: 'user';
  context: {
    chainId: ChainId;
    userAddress: string;
    side: Queries.Side;
  };
}

export type OrderbookProviderProps = CollectionProps | TokenProps | UserProps;

export const OrderbookProvider = ({ children, limit = ITEMS_PER_PAGE, ...props }: OrderbookProviderProps) => {
  const router = useRouter();
  const { chainId } = useOnboardContext();

  const [isReady, setIsReady] = useState(false);
  const [orders, setOrders] = useState<SignedOBOrder[]>([]);
  const [filters, setFilters] = useState<OBFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreOrders, setHasMoreOrders] = useState<boolean>(false);
  const [hasNoData, setHasNoData] = useState<boolean>(false);
  const [cursor, setCursor] = useState<string>('');
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isReady) {
      setIsLoading(true);
      fetchOrders(true);
    }
  }, [props.kind, props.context, filters, isReady]);

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);

      const newFilters = parseRouterQueryParamsToFilters(router.query);

      if (!isEqual(newFilters, filters)) {
        setFilters(newFilters);
      }
    }
  }, [router.query]);

  const fetchMore = () => {
    fetchOrders();
  };

  const clearFilters = (names: string[]): Promise<boolean> => {
    const newQueryParams = { ...router.query };

    for (const name of names) {
      delete newQueryParams[name];
    }

    return router.replace({ pathname: router.pathname, query: { ...newQueryParams } });
  };

  const updateFilterArray = (
    filterName: string,
    currentFilters: string[],
    selectionName: string,
    checked: boolean
  ): Promise<boolean> => {
    let updatedSelections = [];
    if (checked) {
      updatedSelections = [...currentFilters, selectionName];
    } else {
      updatedSelections = currentFilters.filter((currentFilter) => currentFilter !== selectionName);
    }

    return router.replace({ pathname: router.pathname, query: { ...router.query, [filterName]: updatedSelections } });
  };

  const updateFilter = (name: string, value: string): Promise<boolean> => {
    if (!value) {
      return clearFilters([name]);
    } else {
      return router.replace({ pathname: router.pathname, query: { ...router.query, [name]: value } });
    }
  };

  const updateFilters = (params: { name: string; value: string }[]): Promise<boolean> => {
    let query = { ...router.query };

    for (const param of params) {
      const val = param['value'];

      if (val) {
        query = { ...query, [param['name']]: param['value'] };
      } else {
        delete query[param['name']];
      }
    }

    return router.replace({ pathname: router.pathname, query: { ...query } });
  };

  const fetchOrders = async (refreshData = false) => {
    try {
      const parsedFilters = parseFiltersToApiQueryParams(filters);

      if (parsedFilters.collections && parsedFilters.collections.length > 1) {
        throw new Error('Multiple collections not yet supported');
      }

      // const collection = parsedFilters.collections[1];

      // eslint-disable-next-line
      const v1Query: any = {
        limit: limit,
        cursor: refreshData ? '' : cursor,
        ...parsedFilters
      };

      let options: {
        endpoint: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query: any;
      };

      const v2OrderBy: Record<string, Queries.OrderBy> = {
        startPriceEth: Queries.OrderBy.Price,
        startTimeMs: Queries.OrderBy.StartTime,
        endTimeMs: Queries.OrderBy.EndTime
      };

      const baseQuery: Queries.BaseOrderQuery = {
        isSellOrder: v1Query.isSellOrder,
        minPrice: v1Query.minPrice,
        maxPrice: v1Query.maxPrice,
        cursor: v1Query.cursor,
        limit: v1Query.limit,
        orderBy: v2OrderBy[v1Query.orderBy as keyof typeof v2OrderBy],
        orderDirection: v1Query.orderByDirection
      };

      if (props.kind === 'token') {
        const query: Queries.TokenOrdersQuery = {
          ...baseQuery,
          status: Queries.OrderStatus.Active
        };

        options = {
          endpoint: `/v2/collections/${chainId}:${props.context.collectionAddress}/tokens/${props.context.tokenId}/orders`,
          query
        };
      } else if (props.kind === 'collection') {
        const query: Queries.CollectionOrdersQuery = {
          ...baseQuery,
          status: Queries.OrderStatus.Active
        };

        options = {
          endpoint: `/v2/collections/${chainId}:${props.context.collectionAddress}/orders`,
          query
        };
      } else if (props.kind === 'user') {
        if (props.context.side === Queries.Side.Maker) {
          const query: Queries.MakerOrdersQuery = {
            ...baseQuery,
            chainId: props.context.chainId,
            side: Queries.Side.Maker,
            status: Queries.OrderStatus.Active
          };

          options = {
            endpoint: `/v2/users/${props.context.userAddress}/orders`,
            query
          };
        } else {
          const query: Queries.TakerOrdersQuery = {
            ...baseQuery,
            chainId: props.context.chainId,
            side: Queries.Side.Taker,
            status: Queries.OrderStatus.Active
          };
          options = {
            endpoint: `/v2/users/${props.context.userAddress}/orders`,
            query
          };
        }
      } else {
        throw new Error('Invalid query');
      }

      const cacheKey = JSON.stringify(options);

      // use cached value if exists
      let response = orderCache.get(cacheKey);
      if (!response) {
        response = await apiGet(options.endpoint, {
          query: options.query,
          requiresAuth: false
        });

        // save in cache
        orderCache.set(cacheKey, response);
      }

      if (isMounted()) {
        if (response && response.result?.data) {
          let newData;

          if (refreshData) {
            newData = [...response.result.data];
          } else {
            newData = [...orders, ...response.result.data];
          }

          setOrders(
            newData.map((order: Order) => {
              const orderItems = order.kind === 'single-collection' ? [order.item] : order.items;
              const nfts = orderItems.map((item) => {
                let tokens: OrderItemToken[];
                switch (item.kind) {
                  case 'collection-wide':
                    tokens = [];
                    break;
                  case 'single-token':
                    tokens = [item.token];
                    break;

                  case 'token-list':
                    tokens = item.tokens;
                    break;
                }

                const chainTokens = tokens.map((item) => {
                  return {
                    tokenId: item.tokenId,
                    tokenName: item.name,
                    tokenImage: item.image,
                    takerUsername: item.owner?.username,
                    takerAddress: item.owner?.address,
                    numTokens: item.quantity,
                    attributes: []
                  };
                });
                return {
                  chainId: order.chainId,
                  collectionAddress: item.address,
                  collectionName: item.name,
                  collectionImage: item.profileImage,
                  collectionSlug: item.slug,
                  hasBlueCheck: item.hasBlueCheck,
                  tokens: chainTokens
                };
              });

              const signedObOrder: SignedOBOrder = {
                id: order.id,
                chainId: order.chainId,
                isSellOrder: order.isSellOrder,
                numItems: order.numItems,
                makerUsername: order.maker?.username,
                makerAddress: order.maker?.address,
                startPriceEth: order.startPriceEth,
                endPriceEth: order.endPriceEth,
                startTimeMs: order.startTimeMs,
                endTimeMs: order.endTimeMs,
                maxGasPriceWei: '0',
                nonce: 0,
                nfts: nfts,
                execParams: {
                  complicationAddress: '',
                  currencyAddress: order.currency
                },
                extraParams: {
                  buyer: order.isPrivate ? order.taker.address : ''
                },
                signedOrder: {} as unknown as ChainOBOrder
              };

              return signedObOrder;
            })
          );
          setHasNoData(newData.length === 0);

          setHasMoreOrders(response.result.hasNextPage);
          setCursor(response.result.cursor);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted()) {
        setIsLoading(false);
      }
    }
  };

  const value: OBContextType = {
    orders,
    isLoading,
    fetchMore,
    filters,
    setFilters,
    clearFilters,
    updateFilterArray,
    updateFilter,
    updateFilters,
    hasMoreOrders,
    hasNoData,
    isReady
  };

  return <OrderbookContext.Provider value={value}>{children}</OrderbookContext.Provider>;
};

export const useOrderbook = () => {
  return React.useContext(OrderbookContext) as OBContextType;
};
