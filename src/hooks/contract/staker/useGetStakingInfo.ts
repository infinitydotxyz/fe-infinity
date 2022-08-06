import { useState, useEffect } from 'react';
import { useStakerContract } from './useStakerContract';
import { BigNumber } from 'ethers';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

type StakingInfo = Array<{ 0: BigNumber; 1: BigNumber; amount: BigNumber; timestamp: BigNumber }>;

/**
 * Returns a multidimensional array containing all staked values and their timestamps, for each staking duration type.
 * @param address Optional user address.
 */
export function useGetStakingInfo(address?: string) {
  const { contract } = useStakerContract();
  const { user } = useOnboardContext();
  const [info, setInfo] = useState<StakingInfo>();

  useEffect(() => {
    if (user?.address) {
      contract
        .getStakingInfo(address || user.address)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((stakingInfo: StakingInfo) => {
          setInfo(stakingInfo);
        })
        .catch(console.error);
    }
  }, [user?.address]);

  return { info };
}
