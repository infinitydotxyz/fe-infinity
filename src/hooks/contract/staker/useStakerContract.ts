import { infinityStakerAbi } from 'src/abi/infinityStaker';
import { useContract } from '../useContract';

export function useStakerContract() {
  const address = '0x031D5A5F12916380ae26c174AF3526f816505CaF'; // TODO: prod address
  const contract = useContract(address, infinityStakerAbi);

  return { contract, address };
}
