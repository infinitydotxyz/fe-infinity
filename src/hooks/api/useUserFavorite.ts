import { UserFavoriteDto } from '@infinityxyz/lib-frontend/types/dto';
import { useFetch } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export function useUserFavorite(phaseId?: string) {
  const { user } = useOnboardContext();
  const result = useFetch<UserFavoriteDto>(
    user?.address ? `/favorites/${user.address}${phaseId ? `?phaseId=${phaseId}` : ''}` : null,
    {
      apiParams: { requiresAuth: true }
    }
  );
  return { ...result, isLoading: result.result === undefined };
}
