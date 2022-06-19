import { useBalance } from '../useBalance';
import { useTokenContract } from './useTokenContract';

/**
 * Get the total number of available user votes.
 */
export function useTokenVotes() {
  const contract = useTokenContract();
  const { balance: votes } = useBalance(contract.getVotes);
  return { votes };
}
