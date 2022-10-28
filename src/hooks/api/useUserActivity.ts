import { useFetchInfinite } from 'src/utils';
import { EventType, UserFeedEvent } from '@infinityxyz/lib-frontend/types/core';
import { UserActivityArrayDto, UserActivityQueryDto } from '@infinityxyz/lib-frontend/types/dto/user';

export function useUserActivity(
  events: EventType[],
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

  let limit = 20;
  let invalid = false;

  if (events.length === 0) {
    invalid = true;

    // just pass some bullshit, we are forced to call this hook below, so we call it, but don't return the data
    limit = 1;
    events = [EventType.CoinMarketCapNews];
  }

  const query: UserActivityQueryDto = {
    events,
    limit: limit,
    cursor: ''
  };

  const { result, error, isLoading, setSize } = useFetchInfinite<UserActivityArrayDto>(`/user/${user}/activity`, {
    query
  });

  const fetchMore = () => {
    if (!invalid) {
      setSize((size) => size + 1);
    }
  };

  let resultList = result?.flatMap(({ data }) => data) ?? [];
  if (invalid) {
    resultList = [];
  }

  return {
    result: resultList,
    error,
    isLoading,
    fetchMore
  };
}
