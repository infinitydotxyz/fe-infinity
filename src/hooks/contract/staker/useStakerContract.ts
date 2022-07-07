import { InfinityStakerABI } from '@infinityxyz/lib-frontend/abi/infinityStaker';
import { GOERLI_STAKER_CONTRACT_ADDRESS } from '@infinityxyz/lib-frontend/utils/constants';
import { useContract } from '../useContract';

export function useStakerContract() {
  const address = GOERLI_STAKER_CONTRACT_ADDRESS;
  const contract = useContract(address, InfinityStakerABI);

  return { contract, address };
}
