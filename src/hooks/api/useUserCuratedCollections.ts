import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { CuratedCollectionsQuery, UserCuratedCollectionsDto } from '@infinityxyz/lib-frontend/types/dto';
import { useFetchInfinite } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export const useUserCuratedCollections = (
  query: Pick<CuratedCollectionsQuery, 'limit' | 'orderBy' | 'orderDirection'>,
  userAddress: string
) => {
  const { chainId } = useOnboardContext();

  const q: CuratedCollectionsQuery = {
    orderBy: query.orderBy,
    orderDirection: query.orderDirection,
    limit: query.limit,
    chainId: chainId as ChainId
  };
  const { result, setSize, error, isLoading } = useFetchInfinite<UserCuratedCollectionsDto>(
    userAddress ? `/user/${chainId}:${userAddress}/curated` : null,
    {
      query: q,
      apiParams: { requiresAuth: false }
    }
  );

  const fetchMore = () => setSize((size) => size + 1);

  return {
    result: result?.flatMap((item) => item.data) ?? [],
    error,
    isLoading,
    fetchMore
  };
};
