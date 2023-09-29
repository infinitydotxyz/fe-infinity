import { ERC20ABI } from '@infinityxyz/lib-frontend/abi/erc20';
import { getTokenAddress } from '@infinityxyz/lib-frontend/utils';
import { ENV } from 'src/utils';
import { useContract } from '../useContract';

export function useTokenContract(chainId: string) {
  const address = getTokenAddress(chainId, ENV);
  const contract = useContract(address, chainId, ERC20ABI);

  return { address, contract };
}
