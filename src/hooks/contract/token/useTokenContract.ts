import { infinityTokenAbi } from 'src/abi/infinityContract';
import { useContract } from '../useContract';

export function useTokenContract() {
  return useContract('0x2BDB98086d47e38e3A40B42463Af005F5CF72146', infinityTokenAbi);
}
