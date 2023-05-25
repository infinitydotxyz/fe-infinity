import { ERC20ABI } from '@infinityxyz/lib-frontend/abi/erc20';
import { getTokenAddress } from '@infinityxyz/lib-frontend/utils';
import { ENV } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { useNetwork } from 'wagmi';
import { useContract } from '../useContract';

export function useTokenContract() {
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

  const address = getTokenAddress(chainId, ENV);
  const contract = useContract(address, ERC20ABI);

  return { address, contract };
}
