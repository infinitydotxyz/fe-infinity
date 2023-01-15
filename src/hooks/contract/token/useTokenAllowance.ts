import { BigNumber, utils } from 'ethers';
import { useEffect, useState } from 'react';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
import { useStakerContract } from '../staker/useStakerContract';
import { useTokenContract } from './useTokenContract';

/**
 * Gets the amount of tokens that the specified owner address is allowed to spend.
 *
 * This function can be used to check how many tokens the staker contract may spend for staking.
 * @param owner Address of the owner of the tokens (e.g. the user address)
 * @param spender Address of the contract. Defaults to the InfinityStaker contract address.
 */
export function useTokenAllowance(owner?: string, spender?: string) {
  const { user } = useOnboardContext();
  const { contract } = useTokenContract();
  const { address: stakerAddress } = useStakerContract();
  const [allowance, setAllowance] = useState(0);

  useEffect(() => {
    if (user?.address) {
      contract
        .allowance(owner || user.address, spender || stakerAddress)
        .then((allowance: BigNumber) => setAllowance(+utils.formatEther(allowance)))
        .catch(console.error);
    }
  }, [user?.address]);

  return { allowance };
}
