import { useBalance } from '../useBalance';
import { useStakerContract } from './useStakerContract';

export function useTotalStaked(address?: string) {
  const { contract } = useStakerContract();
  return useBalance(contract.getUserTotalStaked, address);
}
