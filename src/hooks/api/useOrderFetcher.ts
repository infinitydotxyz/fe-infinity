import { ChainId, GetOrderItemsQuery } from '@infinityxyz/lib-frontend/types/core';
import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';
import { useEffect, useState } from 'react';
import { DEFAULT_LIMIT, apiGet } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { ERC721TokenCartItem, SORT_FILTERS, TokensFilter } from 'src/utils/types';
import { resvOrdersToCardData, resvUserTopOffersToCardData } from './useTokenFetcher';

interface BaseProps {
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
    userAddress: string;
    side: Queries.Side;
  };
}

type FetcherProps = CollectionProps | TokenProps | ProfileProps;

export type OrdersContextProviderProps = CollectionProps | TokenProps | ProfileProps;

// const orderCache = new OrderCache();

const parseFiltersToApiQueryParams = (filter: TokensFilter): GetOrderItemsQuery => {
  const parsedFilters: GetOrderItemsQuery = {};
  Object.keys(filter).forEach((filterVal) => {
    switch (filterVal) {
      case 'orderType':
        if (filter.orderType === 'listings') {
          parsedFilters.isSellOrder = true;
        }
        if (filter.orderType === 'bids-placed') {
          parsedFilters.isSellOrder = false;
        }
        if (filter.orderType === 'offers-received') {
          parsedFilters.isSellOrder = false;
        }
        break;
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

export const useCollectionOrderFetcher = (
  limit: number,
  filter: TokensFilter,
  collectionAddress: string,
  collectionChainId: string
) => {
  const props: CollectionProps = {
    kind: 'collection',
    limit,
    context: {
      collectionAddress
    }
  } as unknown as CollectionProps;

  return useOrderFetcher(limit, filter, collectionChainId, props);
};

export const useProfileOrderFetcher = (limit: number, filter: TokensFilter, userAddress: string) => {
  const side =
    filter.orderType === 'listings' || filter.orderType === 'bids-placed' ? Queries.Side.Maker : Queries.Side.Taker;
  const props: ProfileProps = {
    kind: 'profile',
    limit,
    orderBy: 'startTime',
    context: {
      userAddress,
      side
    }
  } as unknown as ProfileProps;

  const { selectedChain } = useAppContext();

  const fetcher = useOrderFetcher(limit, filter, selectedChain, props);

  useEffect(() => {
    fetcher.fetch(false);
  }, [selectedChain]);

  return fetcher;
};

export const useTokenOrderFetcher = (
  limit: number,
  filter: TokensFilter,
  collectionAddress: string,
  collectionChainId: ChainId,
  tokenId: string
) => {
  const props: TokenProps = {
    kind: 'token',
    limit,
    context: {
      collectionAddress,
      tokenId
    }
  };
  return useOrderFetcher(limit, filter, collectionChainId, props);
};

const useOrderFetcher = (limit = DEFAULT_LIMIT, filter: TokensFilter, chainId: string, props: FetcherProps) => {
  const [profileOrders, setProfileOrders] = useState<ERC721TokenCartItem[]>([]);
  const [totalOffersValue, setTotalOffersValue] = useState<number>(0);
  const [numTokensWithOffers, setNumTokensWithOffers] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const fetch = async (loadMore: boolean) => {
    try {
      const parsedFilters = parseFiltersToApiQueryParams(filter);

      let collection = '';
      if (filter.collections && filter.collections.length > 1) {
        throw new Error('Multiple collections not yet supported');
      } else if (filter.collections && filter.collections.length === 1) {
        collection = filter.collections[0];
      }

      // eslint-disable-next-line
      let v1Query: any = { limit, ...parsedFilters };
      if (loadMore) {
        v1Query.cursor = cursor;
      } else {
        v1Query.cursor = ''; // reset cursor
      }

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
            chainId: chainId as ChainId,
            side: Queries.Side.Maker,
            status: Queries.OrderStatus.Active
          };

          if (collection) {
            query.collection = collection;
          }

          options = {
            endpoint: `/v2/users/${props.context.userAddress}/orders`,
            query
          };
        } else {
          const query: Queries.TakerOrdersQuery = {
            ...baseQuery,
            chainId: chainId as ChainId,
            side: Queries.Side.Taker,
            status: Queries.OrderStatus.Active
          };

          if (collection) {
            query.collection = collection;
          }

          options = {
            endpoint: `/v2/users/${props.context?.userAddress}/orders`,
            query
          };
        }
      } else {
        throw new Error('Invalid query');
      }

      // const cacheKey = JSON.stringify(options);

      // not using cache for now
      // let response = orderCache.get(cacheKey);
      let response;
      if (!response) {
        response = await apiGet(options.endpoint, {
          query: options.query,
          requiresAuth: false
        });

        if (response.error) {
          setError(response.error);
          console.error(response.error);
        }
      }

      if (response && response.result?.data) {
        // not saving in cache
        // orderCache.set(cacheKey, response);

        let newData;
        if (loadMore) {
          newData = [...profileOrders, ...response.result.data];
        } else {
          newData = [...response.result.data];
        }

        if (props.kind === 'profile') {
          if (props.context?.side === Queries.Side.Maker) {
            setProfileOrders(resvOrdersToCardData(newData));
          } else {
            setNumTokensWithOffers(response.result.totalTokensWithBids);
            setTotalOffersValue(response.result.totalAmount);
            setProfileOrders(resvUserTopOffersToCardData(newData));
          }
        }

        setHasNextPage(response.result.hasNextPage);
        setCursor(response.result.cursor);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  return { profileOrders, totalOffersValue, numTokensWithOffers, isLoading, hasNextPage, fetch, error };
};
