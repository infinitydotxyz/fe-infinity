import { ChainId, RaffleState, UserRaffle } from '@infinityxyz/lib-frontend/types/core';
import { useFetch } from 'src/utils';

import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

const stateOrder = {
  [RaffleState.Unstarted]: 4,
  [RaffleState.InProgress]: 2,
  [RaffleState.Locked]: 1,
  [RaffleState.Finalized]: 0,
  [RaffleState.Completed]: 3
};

export type Raffle = UserRaffle & {
  progress: number;
  totals: {
    numUniqueEntrants: number;
    totalNumTickets: number;
    prizePoolEth: number;
    prizePoolWei: string;
  };
};

export const useRaffles = () => {
  const { chainId } = useOnboardContext();

  const query = {
    chainId: (chainId || ChainId.Mainnet) as ChainId,
    states: ['active', 'inactive', 'complete']
  };

  const { result, isLoading, isError, error } = useFetch<Raffle[]>('/raffles', {
    query
  });

  return {
    result: (result ?? []).sort((a, b) => stateOrder[a.state] - stateOrder[b.state]),
    isLoading,
    isError,
    error
  };
};
