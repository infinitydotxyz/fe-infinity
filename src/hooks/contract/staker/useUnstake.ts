import { utils } from 'ethers';
import { useAccount } from 'wagmi';
import { useStakerContract } from './useStakerContract';

export function useUnstake() {
  const { address: user } = useAccount();
  const { contract } = useStakerContract();

  const unstake = async (amount: number, address?: string) => {
    address = address || user;

    if (address) {
      const tx = await contract.unstake(utils.parseEther(amount.toString()).toString());
      await tx.wait();
    }
  };

  return { unstake };
}
