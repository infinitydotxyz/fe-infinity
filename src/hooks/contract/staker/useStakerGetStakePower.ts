import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useAppContext } from 'src/utils/context/AppContext';
import { useStakerContract } from './useStakerContract';

/**
 * Returns the total number of staking power (a.k.a votes).
 * @param address The user wallet address.
 */
export function useStakePower(address?: string) {
  const { user, userReady } = useAppContext();
  const { contract } = useStakerContract();
  const [stakePower, setStakePower] = useState<number>();

  useEffect(() => {
    if (userReady) {
      contract
        .getUserStakePower(address || user?.address)
        .then((big: BigNumber) => {
          setStakePower(big.toNumber());
        })
        .catch(console.error);
    }
  }, [userReady]);

  return { stakePower };
}
