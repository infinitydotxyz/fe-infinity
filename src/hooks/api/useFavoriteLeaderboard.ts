import { CollectionFavoriteQueryResultDto } from '@infinityxyz/lib-frontend/types/dto';
import { useFetch } from 'src/utils';

export function useFavoriteLeaderboard(phaseId: string) {
  const { result, isError, isLoading } = useFetch<CollectionFavoriteQueryResultDto>(
    `/favorites/${phaseId}/leaderboard`,
    {
      query: {
        orderDirection: 'desc',
        limit: 10
      }
    }
  );

  return { result, isLoading, isError };
}
