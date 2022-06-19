import { useState } from 'react';
import { useAppContext } from 'src/utils/context/AppContext';
import { useStakerContract } from './useStakerContract';

// TODO: fix RPC Error: execution reverted: ERC20: insufficient allowance
export function useStakerStake() {
  const { user } = useAppContext();
  const [isStaked, setIsStaked] = useState(false);
  const contract = useStakerContract();

  const stake = async (amount: number, duration: number, address?: string) => {
    address = address || user?.address;

    if (address) {
      try {
        console.log(address, amount, duration);
        const res = await contract.stake(address, amount, duration);
        console.log(res);
        setIsStaked(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return { isStaked, stake };
}
