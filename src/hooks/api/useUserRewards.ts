import { UserRewardsDto } from '@infinityxyz/lib-frontend/types/dto/rewards';
import { useFetch } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export function useRewards(userId: string | null) {
  return useFetch<UserRewardsDto>(userId ? `/user/${userId}/rewards` : null);
}

export function useUserRewards() {
  const { user, chainId } = useOnboardContext();

  return useRewards(user?.address ? `${chainId}:${user.address}` : null);
}
