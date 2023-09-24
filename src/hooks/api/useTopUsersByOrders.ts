import { apiGet } from 'src/utils';
import { OrderStats } from './useOrderRewardStats';
import { useEffect, useState } from 'react';

type OrderBy =
  | 'numListings'
  | 'numActiveListings'
  | 'numListingsBelowFloor'
  | 'numActiveListingsBelowFloor'
  | 'numBids'
  | 'numActiveBids'
  | 'numBidsNearFloor'
  | 'numActiveBidsNearFloor';

const fetch = async (options: { orderBy: OrderBy }) => {
  const { result, status } = await apiGet('/pixl/rewards/stats/orders/top', {
    query: {
      orderBy: options.orderBy
    }
  });

  if (status !== 200) {
    throw new Error(`Failed to fetch`);
  }
  const res = result as {
    data: (OrderStats & { user: string })[];
    total: number;
  };
  return res;
};

export const useTopUsersByOrders = (initialOrderBy: OrderBy) => {
  const [orderBy, setOrderBy] = useState<OrderBy>(initialOrderBy);
  const [topUsers, setTopUsers] = useState<{ data: (OrderStats & { user: string })[]; total: number }>({
    data: [],
    total: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetch({ orderBy })
      .then((topUsers) => {
        if (!isMounted) {
          return;
        }

        setIsLoading(false);
        setTopUsers(topUsers);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [orderBy]);

  return {
    orderBy,
    isLoading,
    setOrderBy,
    topUsers
  };
};
