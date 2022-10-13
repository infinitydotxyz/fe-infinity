import { ChainId, RaffleState } from '@infinityxyz/lib-frontend/types/core';
import { UserRafflesArrayDto } from '@infinityxyz/lib-frontend/types/dto';
import { useFetch } from 'src/utils';

import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

const stateOrder = {
  [RaffleState.Unstarted]: 4,
  [RaffleState.InProgress]: 2,
  [RaffleState.Locked]: 1,
  [RaffleState.Finalized]: 0,
  [RaffleState.Completed]: 3
};

export const useRaffles = () => {
  const { chainId } = useOnboardContext();

  const query = {
    chainId: (chainId || ChainId.Mainnet) as ChainId,
    states: ['active', 'inactive', 'complete']
  };

  const { result, isLoading, isError, error } = useFetch<UserRafflesArrayDto>('/raffles', {
    query
  });

  return {
    result: {
      raffles: (result?.data?.raffles ?? []).sort((a, b) => stateOrder[a.state] - stateOrder[b.state]),
      ethPrice: result?.data?.ethPrice ?? 0
    },
    isLoading,
    isError,
    error
  };
};
