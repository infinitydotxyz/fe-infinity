import { InfinityStakerABI } from '@infinityxyz/lib-frontend/abi/infinityStaker';
import { getStakerAddress } from '@infinityxyz/lib-frontend/utils';
import { ENV } from 'src/utils';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
import { useContract } from '../useContract';

export function useStakerContract() {
  const { chainId } = useOnboardContext();
  const address = getStakerAddress(chainId, ENV);
  const contract = useContract(address, InfinityStakerABI);

  return { contract, address };
}
