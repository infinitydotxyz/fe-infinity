import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils';

export interface OrderStats {
  numListings: number;
  numListingsBelowFloor: number;
  numListingsNearFloor: number;

  numActiveListings: number;
  numActiveListingsBelowFloor: number;
  numActiveListingsNearFloor: number;

  numBids: number;
  numBidsBelowFloor: number;
  numBidsNearFloor: number;

  numActiveBids: number;
  numActiveBidsBelowFloor: number;
  numActiveBidsNearFloor: number;

  numCollectionBids: number;
  numCollectionBidsBelowFloor: number;
  numCollectionBidsNearFloor: number;

  numActiveCollectionBids: number;
  numActiveCollectionBidsBelowFloor: number;
  numActiveCollectionBidsNearFloor: number;

  numCancelledListings: number;
  numCancelledBids: number;
  numCancelledCollectionBids: number;
  numCancelledOrders: number;
}

const fetch = async (filters: { user?: string; chainId?: string }) => {
  const { result, status } = await apiGet('/pixl/rewards/stats/orders', {
    query: {
      user: filters.user,
      chain: filters.chainId
    }
  });

  if (status !== 200) {
    throw new Error(`Failed to fetch`);
  }
  const data = result as {
    aggregated: OrderStats;
  };

  return data;
};

export function useOrderRewardStats() {
  const [filters, setFilters] = useState<{ user?: string; chain?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [aggregated, setAggregated] = useState<OrderStats>({
    numListings: 0,
    numListingsBelowFloor: 0,
    numListingsNearFloor: 0,
    numCancelledListings: 0,

    numActiveListings: 0,
    numActiveListingsBelowFloor: 0,
    numActiveListingsNearFloor: 0,

    numBids: 0,
    numBidsBelowFloor: 0,
    numBidsNearFloor: 0,
    numCancelledBids: 0,

    numActiveBids: 0,
    numActiveBidsBelowFloor: 0,
    numActiveBidsNearFloor: 0,

    numCollectionBids: 0,
    numCollectionBidsNearFloor: 0,
    numCollectionBidsBelowFloor: 0,
    numCancelledCollectionBids: 0,

    numActiveCollectionBids: 0,
    numActiveCollectionBidsBelowFloor: 0,
    numActiveCollectionBidsNearFloor: 0,

    numCancelledOrders: 0
  });

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(filters)
      .then((res) => {
        if (!isMounted) {
          return;
        }
        setAggregated(res.aggregated);
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  return {
    filters,
    setFilters,
    isLoading,
    aggregated
  };
}
