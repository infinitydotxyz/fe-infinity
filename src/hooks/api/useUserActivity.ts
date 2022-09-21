import { useFetchInfinite } from 'src/utils';
import { UserFeedEvent } from '@infinityxyz/lib-frontend/types/core';
import { UserActivityArrayDto, UserActivityQueryDto } from '@infinityxyz/lib-frontend/types/dto/user';

export function useUserActivity(
  events: UserFeedEvent['type'][],
  user?: string
): {
  result: UserFeedEvent[];
  error: unknown;
  isLoading: boolean;
  fetchMore: () => void;
} {
  if (!user) {
    return {
      result: [],
      error: null,
      isLoading: false,
      fetchMore: () => {
        return;
      }
    };
  }

  const query: UserActivityQueryDto = {
    events,
    limit: 20,
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
