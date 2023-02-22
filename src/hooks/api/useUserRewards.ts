import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { UserRewardsDto } from '@infinityxyz/lib-frontend/types/dto/rewards';
import { useFetch } from 'src/utils';
import { useAccount, useNetwork } from 'wagmi';

export function useUserRewards() {
  const { chain } = useNetwork();
  const { address: user } = useAccount();
  const chainId = String(chain?.id ?? 1) as ChainId;

  return useFetch<UserRewardsDto>(user ? `/user/${chainId}:${user}/rewards` : null);
}
