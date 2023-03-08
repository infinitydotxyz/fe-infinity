import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { RaffleLeaderboardUser } from '@infinityxyz/lib-frontend/types/dto';
import { useFetch } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { useNetwork } from 'wagmi';

export const useRaffleEntrant = (raffleId: string, userAddress: string) => {
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

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
