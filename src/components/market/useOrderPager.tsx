import {
  MarketAction,
  MarketListingsBody,
  MarketListingsResponse,
  MarketOrder,
  OBOrderSpec
} from '@infinityxyz/lib/types/core';
import { useEffect, useState } from 'react';
import { apiPost } from 'src/utils';

export function useOrderPager(limit: number) {
  const [buyMarketListing, setBuyMarketListing] = useState<MarketListingsResponse>();
  const [sellMarketListing, setSellMarketListing] = useState<MarketListingsResponse>();
  const [orders, setOrders] = useState<OBOrderSpec[]>([]);
  const [buyOrders, setBuyOrders] = useState<OBOrderSpec[]>([]);
  const [sellOrders, setSellOrders] = useState<OBOrderSpec[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreBuy, setHasMoreBuy] = useState(true);
  const [hasMoreSell, setHasMoreSell] = useState(true);

  useEffect(() => {
    // let isActive = true;

    fetchData(false);

    return () => {
      // isActive = false;
    };
  }, []);

  const handleResult = (buyListing?: MarketListingsResponse, sellListing?: MarketListingsResponse) => {
    let buys = buyOrders;
    let sells = sellOrders;

    if (buyListing) {
      buys = [...buys, ...buyListing.buyOrders.orders];

      setHasMoreBuy(buyListing.buyOrders.orders.length > 0);
      setBuyMarketListing(buyListing);
    }

    if (sellListing) {
      sells = [...sellOrders, ...sellListing.sellOrders.orders];

      setHasMoreSell(sellListing.sellOrders.orders.length > 0);
      setSellMarketListing(sellListing);
    }

    setOrders([...buys, ...sells]);
    setBuyOrders(buys);
    setSellOrders(sells);
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

  const fetchMarketListings = async (buyOrder: boolean, cursor: string): Promise<MarketListingsResponse> => {
    const body: MarketListingsBody = {
      orderType: buyOrder ? MarketOrder.BuyOrders : MarketOrder.SellOrders,
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

  const hasMore = () => {
    return hasMoreBuy || hasMoreSell;
  };

  const fetchMore = async () => {
    if (!hasMore()) {
      return;
    }

    return fetchData(true);
  };

  const fetchData = async (fetchMore: boolean) => {
    let buyCursor = '';
    let sellCursor = '';

    if (fetchMore) {
      buyCursor = buyMarketListing?.buyOrders.cursor ?? '';
      sellCursor = sellMarketListing?.sellOrders.cursor ?? '';
    }

    try {
      setIsLoading(true);

      let buyListing;
      let sellListing;

      if (hasMoreBuy) {
        buyListing = await fetchMarketListings(true, buyCursor);
      }

      if (hasMoreSell) {
        sellListing = await fetchMarketListings(false, sellCursor);
      }

      handleResult(buyListing, sellListing);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orders,
    buyOrders,
    sellOrders,
    isLoading,
    fetchMore
  };
}
