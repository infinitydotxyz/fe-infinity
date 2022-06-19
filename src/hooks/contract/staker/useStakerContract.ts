import { infinityStakerAbi } from 'src/abi/infinityStaker';
import { useContract } from '../useContract';

export function useStakerContract() {
  return useContract('0x031D5A5F12916380ae26c174AF3526f816505CaF', infinityStakerAbi);
}
