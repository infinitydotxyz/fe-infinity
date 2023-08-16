import { BigNumber, utils } from 'ethers';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useStakerContract } from '../staker/useStakerContract';
import { useTokenContract } from './useTokenContract';

/**
 * Gets the amount of tokens that the specified owner address is allowed to spend.
 *
 * This function can be used to check how many tokens the staker contract may spend for staking.
 * @param owner Address of the owner of the tokens (e.g. the user address)
 * @param spender Address of the contract. Defaults to the InfinityStaker contract address.
 */
export function useTokenAllowance(chainId: string, owner?: string, spender?: string) {
  const { address: user } = useAccount();
  const { contract } = useTokenContract(chainId);
  const { stakerAddress } = useStakerContract(chainId);
  const [allowance, setAllowance] = useState(0);

  useEffect(() => {
    if (user) {
      contract
        .allowance(owner || user, spender || stakerAddress)
        .then((allowance: BigNumber) => setAllowance(+utils.formatEther(allowance)))
        .catch(console.error);
    }
  }, [user]);

  return { allowance };
}
