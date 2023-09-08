import { apiGet } from 'src/utils';
import { SaleStats } from './useBuyRewardStats';
import { useEffect, useState } from 'react';

type OrderBy = 'volume' | 'nativeVolume' | 'numNativeBuys' | 'numBuys';
const fetch = async (options: { orderBy: OrderBy }) => {
  const { result, status } = await apiGet('/pixl/rewards/stats/buys/top', {
    query: {
      orderBy: options.orderBy
    }
  });

  if (status !== 200) {
    throw new Error(`Failed to fetch`);
  }
  const res = result as {
    data: (SaleStats & { user: string })[];
    total: number;
  };
  return res;
};

export const useTopBuyers = (initialOrderBy: OrderBy) => {
  const [orderBy, setOrderBy] = useState<OrderBy>(initialOrderBy);
  const [topBuyers, setTopBuyers] = useState<{ data: (SaleStats & { user: string })[]; total: number }>({
    data: [],
    total: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetch({ orderBy })
      .then((topBuyers) => {
        if (!isMounted) {
          return;
        }

        setIsLoading(false);
        setTopBuyers(topBuyers);
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
    topBuyers
  };
};
