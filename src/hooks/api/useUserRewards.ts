import { UserRewardsDto } from '@infinityxyz/lib-frontend/types/dto/rewards';
import { useFetch } from 'src/utils';
import { useAccount } from 'wagmi';

export function useUserRewards(chainId: string) {
  const { address: user } = useAccount();

  return useFetch<UserRewardsDto>(user ? `/user/${chainId}:${user}/rewards` : null);
}
