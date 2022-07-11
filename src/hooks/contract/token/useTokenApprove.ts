import { utils } from 'ethers';
import { useStakerContract } from '../staker/useStakerContract';
import { useTokenContract } from './useTokenContract';

/**
 * Approve a contract (the staker contract by default) to spend tokens.
 */
export function useTokenApprove() {
  const { contract } = useTokenContract();
  const { address: stakerAddress } = useStakerContract();

  const approve = async (amount: number, spenderAddress?: string) => {
    const tx = await contract.approve(spenderAddress || stakerAddress, utils.parseEther(amount.toString()).toString());
    await tx.wait();
  };

  return { approve };
}
