import { useBalance } from '../useBalance';
import { useStakerContract } from './useStakerContract';

/**
 * Get the total number of tokens staked by the user.
 * @param address Optional address to lookup. Defaults to the address of the currently logged in user.
 */
export function useStakerTotalStaked(address?: string) {
  const contract = useStakerContract();
  const { balance: staked } = useBalance(contract.getUserTotalStaked, address);
  return { staked };
}
