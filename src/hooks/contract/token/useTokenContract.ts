import { ERC20ABI } from '@infinityxyz/lib-frontend/abi/erc20';
import { getTokenAddress } from '@infinityxyz/lib-frontend/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useContract } from '../useContract';

export function useTokenContract() {
  const { chainId } = useOnboardContext();
  const address = getTokenAddress(chainId);
  const contract = useContract(address, ERC20ABI);

  return { address, contract };
}
