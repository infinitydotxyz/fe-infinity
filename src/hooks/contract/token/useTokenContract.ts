import { infinityTokenAbi } from 'src/abi/infinityContract';
import { useContract } from '../useContract';

export function useTokenContract() {
  const address = '0x2BDB98086d47e38e3A40B42463Af005F5CF72146'; // TODO: prod address
  const contract = useContract(address, infinityTokenAbi);

  return { address, contract };
}
