import {
  MarketAction,
  MarketListingsBody,
  MarketListingsResponse,
  MarketOrder,
  OBOrder
} from '@infinityxyz/lib/types/core';
import { useEffect, useState } from 'react';
import { apiPost } from 'src/utils';

export function useOrderPager(buyOrder: boolean, limit: number) {
  const [marketListing, setMarketListing] = useState<MarketListingsResponse>();
  const [buyOrders, setBuyOrders] = useState<OBOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<OBOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    fetchData(false)
      .then((listing) => {
        if (isActive) {
          handleResult(listing);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleResult = (listing: MarketListingsResponse) => {
    if (buyOrder) {
      setBuyOrders([...buyOrders, ...listing.buyOrders.orders]);
      setHasMore(listing.buyOrders.orders.length > 0);
    } else {
      setSellOrders([...sellOrders, ...listing.sellOrders.orders]);
      setHasMore(listing.sellOrders.orders.length > 0);
    }
    setMarketListing(listing);
  };

  const emptyResponse = (): MarketListingsResponse => {
    return {
      buyOrders: { cursor: '', orders: [] },
      sellOrders: { cursor: '', orders: [] },
      error: '',
      success: '',
      matches: []
    };
  };

  const fetchMarketListings = async (cursor: string): Promise<MarketListingsResponse> => {
    const body: MarketListingsBody = {
      orderType: MarketOrder.BuyOrders,
      action: MarketAction.List,
      limit,
      cursor
    };

    const { result, error } = await apiPost('/market-listings', { data: body });

    if (error !== undefined) {
      console.log(error);
      return emptyResponse();
    }

    return result as MarketListingsResponse;
  };

  const fetchMore = async () => {
    if (!hasMore) {
      return;
    }

    setIsLoading(true);

    return fetchData(true)
      .then((listing) => {
        handleResult(listing);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchData = async (fetchMore: boolean): Promise<MarketListingsResponse> => {
    let cursor = '';

    if (fetchMore) {
      cursor = buyOrder ? marketListing?.buyOrders.cursor ?? '' : marketListing?.sellOrders.cursor ?? '';
    }

    try {
      const result = await fetchMarketListings(cursor);

      return result;
    } catch (err) {
      console.error(err);
    }

    return emptyResponse();
  };

  return {
    buyOrders,
    sellOrders,
    isLoading,
    fetchMore
  };
}
