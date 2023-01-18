import {
  ChainId,
  ChainOBOrder,
  GetOrderItemsQuery,
  Order,
  OrderItemToken,
  SignedOBOrder
} from '@infinityxyz/lib-frontend/types/core';
import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { apiGet, ITEMS_PER_PAGE } from 'src/utils';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
import { OrderCache } from '../../components/orderbook/order-cache';

export type OrdersFilter = {
  sort?: string;
  orderType?: 'listings' | 'offers-made' | 'offers-received' | 'listing' | 'offer' | ''; // todo add 'listing' and 'offer'?
  collections?: string[];
  minPrice?: string;
  maxPrice?: string;
  traitTypes?: string[];
  traitValues?: string[];
  orderBy?: string;
};

export const SORT_FILTERS = {
  highestPrice: 'highestPrice',
  lowestPrice: 'lowestPrice',
  mostRecent: 'mostRecent',
  tokenIdNumeric: 'tokenIdNumeric'
};

export const SORT_LABELS: {
  [key: string]: string;
} = {
  [SORT_FILTERS.highestPrice]: 'Highest Price',
  [SORT_FILTERS.lowestPrice]: 'Lowest Price',
  [SORT_FILTERS.mostRecent]: 'Most Recent',
  [SORT_FILTERS.tokenIdNumeric]: 'Token ID'
};

export const getSortLabel = (key?: string, defaultLabel?: string): string => {
  let result = '';

  if (key) {
    result = SORT_LABELS[key];
  }

  // default if blank
  return result || defaultLabel || SORT_LABELS[SORT_FILTERS.tokenIdNumeric];
};

export const parseFiltersToApiQueryParams = (filter: OrdersFilter): GetOrderItemsQuery => {
  const parsedFilters: GetOrderItemsQuery = {};
  // todo: add orderType
  Object.keys(filter).forEach((filterVal) => {
    switch (filterVal) {
      case 'sort':
        if (filter.sort === SORT_FILTERS.lowestPrice) {
          parsedFilters.orderBy = 'startPriceEth';
          parsedFilters.orderByDirection = 'asc';
        }
        if (filter.sort === SORT_FILTERS.highestPrice) {
          parsedFilters.orderBy = 'startPriceEth';
          parsedFilters.orderByDirection = 'desc';
        }
        if (filter.sort === SORT_FILTERS.mostRecent) {
          parsedFilters.orderBy = 'startTimeMs';
          parsedFilters.orderByDirection = 'desc';
        }
        break;
      case 'collections':
        if (filter?.collections?.length) {
          parsedFilters.collections = filter?.collections.map((collection) => {
            const decoded = decodeURIComponent(collection);
            return decoded.split(':')[1];
          });
        }
        break;
      case 'minPrice':
        if (filter?.minPrice) {
          parsedFilters.minPrice = parseFloat(filter?.minPrice);
        }
        break;
      case 'maxPrice':
        if (filter?.maxPrice) {
          parsedFilters.maxPrice = parseFloat(filter?.maxPrice);
        }
        break;
    }
  });

  return parsedFilters;
};

// ============================================================

type OrdersContextType = {
  orders: SignedOBOrder[];
  isLoading: boolean;
  fetchMore: () => void;
  filter: OrdersFilter;
  setFilter: React.Dispatch<React.SetStateAction<OrdersFilter>>;
  hasMoreOrders: boolean;
  hasNoData: boolean;
  isReady: boolean;
};

const OrdersContext = React.createContext<OrdersContextType | null>(null);

const orderCache = new OrderCache();

interface BaseProps {
  children: ReactNode;
  kind?: 'collection' | 'token' | 'profile';
  limit?: number;
}

interface CollectionProps extends BaseProps {
  kind?: 'collection';
  context?: {
    collectionAddress: string;
  };
}

interface TokenProps extends BaseProps {
  kind?: 'token';
  context?: {
    collectionAddress: string;
    tokenId: string;
  };
}

interface ProfileProps extends BaseProps {
  kind?: 'profile';
  context?: {
    chainId: ChainId;
    userAddress: string;
    side: Queries.Side;
  };
}

export type OrdersContextProviderProps = CollectionProps | TokenProps | ProfileProps;

export const OrdersContextProvider = ({ children, limit = ITEMS_PER_PAGE, ...props }: OrdersContextProviderProps) => {
  const router = useRouter();
  const { chainId } = useOnboardContext();

  const [isReady, setIsReady] = useState(false);
  const [orders, setOrders] = useState<SignedOBOrder[]>([]);
  const [filter, setFilter] = useState<OrdersFilter>({});
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
  }, [props.kind, props.context, filter, isReady]);

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.query]);

  const fetchMore = () => {
    fetchOrders();
  };

  const fetchOrders = async (refreshData = false) => {
    try {
      const parsedFilters = parseFiltersToApiQueryParams(filter);

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

      if (parsedFilters.minPrice || parsedFilters.maxPrice) {
        v1Query.orderBy = Queries.OrderBy.Price;
      }

      let options: {
        endpoint: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query: any;
      };

      const v2OrderBy: Record<string, Queries.OrderBy> = {
        startPriceEth: Queries.OrderBy.Price,
        startTimeMs: Queries.OrderBy.StartTime,
        endTimeMs: Queries.OrderBy.EndTime,
        price: Queries.OrderBy.Price
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
          endpoint: `/v2/collections/${chainId}:${props.context?.collectionAddress}/tokens/${props.context?.tokenId}/orders`,
          query
        };
      } else if (props.kind === 'collection') {
        const query: Queries.CollectionOrdersQuery = {
          ...baseQuery,
          status: Queries.OrderStatus.Active
        };

        options = {
          endpoint: `/v2/collections/${chainId}:${props.context?.collectionAddress}/orders`,
          query
        };
      } else if (props.kind === 'profile') {
        if (props.context?.side === Queries.Side.Maker) {
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
            chainId: props.context?.chainId,
            side: Queries.Side.Taker,
            status: Queries.OrderStatus.Active
          };
          options = {
            endpoint: `/v2/users/${props.context?.userAddress}/orders`,
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

  const value: OrdersContextType = {
    orders,
    isLoading,
    fetchMore,
    filter,
    setFilter,
    hasMoreOrders,
    hasNoData,
    isReady
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrdersContext = () => {
  return React.useContext(OrdersContext) as OrdersContextType;
};