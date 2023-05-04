import { BigNumber } from 'ethers';
import { useStakerContract } from '../staker/useStakerContract';
import { useTokenContract } from './useTokenContract';

/**
 * Approve a contract (the staker contract by default) to spend tokens.
 */
export function useTokenApprove() {
  const { contract } = useTokenContract();
  const { stakerAddress } = useStakerContract();

  const approve = async (amount: BigNumber, spenderAddress?: string) => {
    const tx = await contract.approve(spenderAddress || stakerAddress, amount.toString());
    await tx.wait();
  };

  return { approve };
}
