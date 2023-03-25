import { InfinityStakerABI } from '@infinityxyz/lib-frontend/abi/infinityStaker';
import { getStakerAddress } from '@infinityxyz/lib-frontend/utils';
import { ENV } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { useNetwork } from 'wagmi';
import { useContract } from '../useContract';

export function useStakerContract() {
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

  const address = getStakerAddress(chainId, ENV);
  const contract = useContract(address, InfinityStakerABI);

  return { contract, address };
}
