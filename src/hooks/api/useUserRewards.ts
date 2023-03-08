import { UserRewardsDto } from '@infinityxyz/lib-frontend/types/dto/rewards';
import { useFetch } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { useAccount, useNetwork } from 'wagmi';

export function useUserRewards() {
  const { chain } = useNetwork();
  const { address: user } = useAccount();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

  return useFetch<UserRewardsDto>(user ? `/user/${chainId}:${user}/rewards` : null);
}
