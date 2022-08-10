import { utils } from 'ethers';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useStakerContract } from './useStakerContract';

export function useStake() {
  const { user } = useOnboardContext();

  const { contract } = useStakerContract();

  const stake = async (amount: number, duration: number, address?: string) => {
    address = address || user?.address;

    if (address) {
      const tx = await contract.stake(utils.parseEther(amount.toString()).toString(), duration);
      await tx.wait();
    }
  };

  return { stake };
}
