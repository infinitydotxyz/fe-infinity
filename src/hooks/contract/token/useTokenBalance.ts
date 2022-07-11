import { useBalance } from '../useBalance';
import { useTokenContract } from './useTokenContract';

/**
 * Get the total number of tokens owned by the user.
 * @param address Optional address to lookup. Defaults to the address of the currently logged in user.
 */
export function useTokenBalance(address?: string) {
  const { contract } = useTokenContract();
  return useBalance(contract.balanceOf, address);
}
