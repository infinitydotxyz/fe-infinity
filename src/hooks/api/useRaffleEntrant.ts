import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { RaffleLeaderboardUser } from '@infinityxyz/lib-frontend/types/dto';
import { useFetch } from 'src/utils';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';

export const useRaffleEntrant = (raffleId: string, userAddress: string) => {
  const { chainId } = useOnboardContext();

  const query = {
    chainId: (chainId || ChainId.Mainnet) as ChainId
  };

  const { result, isLoading, isError, error } = useFetch<RaffleLeaderboardUser>(
    userAddress ? `/raffles/${raffleId}/entrants/${userAddress}` : null,
    {
      query
    }
  );

  return {
    result,
    isLoading,
    isError,
    error
  };
};
