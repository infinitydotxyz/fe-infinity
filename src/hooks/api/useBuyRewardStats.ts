import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils';

export interface SaleStats {
  numBuys: number;
  numNativeBuys: number;
  volume: number;
  nativeVolume: number;
}

export interface HistoricalSalesStats extends SaleStats {
  day: string;
  timestamp: number;
}

const fetch = async (filters: { user?: string; chainId?: string }) => {
  const { result, status } = await apiGet('/pixl/rewards/stats/buys', {
    query: {
      user: filters.user,
      chain: filters.chainId
    }
  });

  if (status !== 200) {
    throw new Error(`Failed to fetch`);
  }
  const data = result as {
    aggregated: SaleStats;
    historical: HistoricalSalesStats[];
  };
  return data;
};

export function useBuyRewardStats() {
  const [filters, setFilters] = useState<{ user?: string; chain?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [aggregated, setAggregated] = useState<SaleStats>({
    numBuys: 0,
    numNativeBuys: 0,
    nativeVolume: 0,
    volume: 0
  });

  const [historical, setHistorical] = useState<HistoricalSalesStats[]>([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(filters)
      .then((res) => {
        if (!isMounted) {
          return;
        }
        setAggregated(res.aggregated);
        setHistorical(res.historical);
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
    aggregated,
    historical
  };
}
