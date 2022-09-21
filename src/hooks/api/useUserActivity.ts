import { useFetchInfinite } from 'src/utils';
import { UserFeedEvent } from '@infinityxyz/lib-frontend/types/core';
import { UserActivityArrayDto, UserActivityQueryDto } from '@infinityxyz/lib-frontend/types/dto/user';

export function useUserActivity(
  user: string,
  events: UserFeedEvent['type'][]
): { result: UserFeedEvent[]; error: unknown; isLoading: boolean; fetchMore: () => void } {
  const query: UserActivityQueryDto = {
    events: events,
    limit: 50,
    cursor: ''
  };

  const { result, error, isLoading, setSize } = useFetchInfinite<UserActivityArrayDto>(`/user/${user}/activity`, {
    query
  });

  const fetchMore = () => {
    setSize((size) => size + 1);
  };

  return {
    result: result?.flatMap(({ data }) => data) ?? [],
    error,
    isLoading,
    fetchMore
  };
}
