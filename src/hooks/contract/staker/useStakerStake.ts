import { utils } from 'ethers';
import { useAppContext } from 'src/utils/context/AppContext';
import { useStakerContract } from './useStakerContract';

export function useStakerStake() {
  const { user } = useAppContext();
  const { contract } = useStakerContract();

  const stake = async (amount: number, duration: number, address?: string) => {
    address = address || user?.address;

    if (address) {
      const tx = await contract.stake(address, utils.parseEther(amount.toString()).toString(), duration);
      await tx.wait();
    }
  };

  return { stake };
}
