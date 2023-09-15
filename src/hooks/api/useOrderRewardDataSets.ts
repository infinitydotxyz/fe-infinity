import { useEffect } from 'react';
import { useOrderRewardStats } from './useOrderRewardStats';
import { useAccount } from 'wagmi';

export const useOrderRewardDataSets = () => {
  const { address } = useAccount();

  const { aggregated } = useOrderRewardStats();
  const { filters, setFilters, aggregated: userAggregated } = useOrderRewardStats();

  useEffect(() => {
    if (address) {
      if (filters.user === address) {
        return;
      }
      setFilters({ user: address });
    }
  }, [address]);

  return {
    userAvailable: !!address,
    aggregated,
    userAggregated
  };
};
