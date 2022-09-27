import { useFetchInfinite } from 'src/utils';
import { UserFeedEvent } from '@infinityxyz/lib-frontend/types/core';
import { UserActivityArrayDto, UserActivityQueryDto } from '@infinityxyz/lib-frontend/types/dto/user';
import { FEED_FILTER_DEFAULT_OPTIONS } from 'src/components/feed/feed-filter-dropdown';

export type UserFeedEventTypes = UserFeedEvent['type'][];

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

  if (events.length === 0) {
    events = FEED_FILTER_DEFAULT_OPTIONS.map((option) => option.value).filter(
      (item) => item !== ''
    ) as UserFeedEvent['type'][];
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
