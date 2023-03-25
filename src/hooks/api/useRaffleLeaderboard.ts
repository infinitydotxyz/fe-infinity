import { ChainId, OrderDirection } from '@infinityxyz/lib-frontend/types/core';
import { useFetchInfinite } from 'src/utils';
import {
  RaffleLeaderboardQueryDto,
  RaffleLeaderboardArrayDto,
  RaffleLeaderboardUser
} from '@infinityxyz/lib-frontend/types/dto/raffle';
import { useNetwork } from 'wagmi';
import { useAppContext } from 'src/utils/context/AppContext';

export const useRaffleLeaderboard = (
  raffleId: string
): { result: RaffleLeaderboardUser[]; error: unknown; isLoading: boolean; fetchMore: () => void } => {
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

  const query: RaffleLeaderboardQueryDto = {
    cursor: '',
    chainId: (chainId || ChainId.Mainnet) as ChainId,
    orderDirection: OrderDirection.Ascending,
    limit: 10
  };

  const { result, error, isLoading, setSize } = useFetchInfinite<RaffleLeaderboardArrayDto>(
    `/raffles/${raffleId}/leaderboard`,
    {
      query
    }
  );

  const fetchMore = () => {
    setSize((size) => size + 1);
  };

  return {
    result: result?.flatMap(({ data }) => data) ?? [],
    error,
    isLoading,
    fetchMore
  };
};
