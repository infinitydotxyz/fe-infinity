import { utils } from 'ethers';
import { useAppContext } from 'src/utils/context/AppContext';
import { useStakerContract } from './useStakerContract';

export function useUnstake() {
  const { user } = useAppContext();
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
