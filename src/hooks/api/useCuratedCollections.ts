import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import {
  CuratedCollectionDto,
  CuratedCollectionsDto,
  CuratedCollectionsQueryWithUser,
  UserCuratedCollectionDto,
  UserCuratedCollectionsDto
} from '@infinityxyz/lib-frontend/types/dto';
import { useFetchInfinite } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export const useCuratedCollections = (
  query: Pick<CuratedCollectionsQueryWithUser, 'orderBy' | 'orderDirection' | 'limit'>
) => {
  const { chainId, user } = useOnboardContext();
  const q: CuratedCollectionsQueryWithUser = {
    chainId: chainId as ChainId,
    orderBy: query.orderBy,
    orderDirection: query.orderDirection,
    limit: query.limit,
    user: user?.address ? `${chainId}:${user.address}` : undefined
  };

  const { result, error, isLoading, setSize } = useFetchInfinite<UserCuratedCollectionsDto | CuratedCollectionsDto>(
    '/collections/curated',
    {
      query: q,
      apiParams: { requiresAuth: !!user?.address }
    }
  );

  const fetchMore = () => {
    setSize((size) => size + 1);
  };

  return {
    result: (result?.flatMap(({ data }) => data) ?? []) as (UserCuratedCollectionDto | CuratedCollectionDto)[],
    error,
    isLoading,
    fetchMore
  };
};
