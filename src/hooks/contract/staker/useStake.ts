import { utils } from 'ethers';
import { useAccount } from 'wagmi';
import { useStakerContract } from './useStakerContract';

export function useStake() {
  const { address: user } = useAccount();

  const { contract } = useStakerContract();

  const stake = async (amount: number, duration: number, address?: string) => {
    address = address || user;

    if (address) {
      const tx = await contract.stake(utils.parseEther(amount.toString()).toString(), duration);
      await tx.wait();
    }
  };

  return { stake };
}
