import { utils } from 'ethers';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
import { useStakerContract } from './useStakerContract';

export function useUnstake() {
  const { user } = useOnboardContext();
  const { contract } = useStakerContract();

  const unstake = async (amount: number, address?: string) => {
    address = address || user?.address;

    if (address) {
      const tx = await contract.unstake(utils.parseEther(amount.toString()).toString());
      await tx.wait();
    }
  };

  return { unstake };
}
