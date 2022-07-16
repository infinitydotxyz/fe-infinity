import { useState, useEffect } from 'react';
import { useAppContext } from 'src/utils/context/AppContext';
import { useStakerContract } from './useStakerContract';
import { BigNumber } from 'ethers';

type StakingInfo = Array<{ 0: BigNumber; 1: BigNumber; amount: BigNumber; timestamp: BigNumber }>;

/**
 * Returns a multidimensional array containing all staked values and their timestamps, for each staking duration type.
 * @param address Optional user address.
 */
export function useGetStakingInfo(address?: string) {
  const { contract } = useStakerContract();
  const { user, userReady } = useAppContext();
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
  }, [userReady]);

  return { info };
}
