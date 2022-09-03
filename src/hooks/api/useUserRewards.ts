import { UserRewardsDto } from '@infinityxyz/lib-frontend/types/dto/rewards';
import { useFetch } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export function useUserRewards() {
  const { user, chainId } = useOnboardContext();

  return useFetch<UserRewardsDto>(user?.address ? `${chainId}:${user.address}` : null);
}
