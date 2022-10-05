import { ChainId, OrderDirection } from '@infinityxyz/lib-frontend/types/core';
import { useFetchInfinite } from 'src/utils';
import {
  RaffleLeaderboardQueryDto,
  RaffleLeaderboardArrayDto,
  RaffleLeaderboardUser
} from '@infinityxyz/lib-frontend/types/dto/raffle';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export const useRaffleLeaderboard = (
  phaseId: string
): { result: RaffleLeaderboardUser[]; error: unknown; isLoading: boolean; fetchMore: () => void } => {
  const { chainId } = useOnboardContext();

  const query: RaffleLeaderboardQueryDto = {
    cursor: '',
    chainId: (chainId || ChainId.Mainnet) as ChainId,
    orderDirection: OrderDirection.Ascending,
    limit: 50
  };

  const { result, error, isLoading, setSize } = useFetchInfinite<RaffleLeaderboardArrayDto>(
    `/raffles/${phaseId}/leaderboard`,
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
