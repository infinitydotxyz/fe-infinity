import { InfinityStakerABI } from '@infinityxyz/lib-frontend/abi/infinityStaker';
import { getStakerAddress } from '@infinityxyz/lib-frontend/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useContract } from '../useContract';

export function useStakerContract() {
  const { chainId } = useOnboardContext();
  const address = getStakerAddress(chainId);
  const contract = useContract(address, InfinityStakerABI);

  return { contract, address };
}
