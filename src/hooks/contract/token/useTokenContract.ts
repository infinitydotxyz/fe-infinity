import { ERC20ABI } from '@infinityxyz/lib-frontend/abi/erc20';
import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { getTokenAddress } from '@infinityxyz/lib-frontend/utils';
import { ENV } from 'src/utils';
import { useNetwork } from 'wagmi';
import { useContract } from '../useContract';

export function useTokenContract() {
  const { chain } = useNetwork();
  const chainId = String(chain?.id ?? 1) as ChainId;

  const address = getTokenAddress(chainId, ENV);
  const contract = useContract(address, ERC20ABI);

  return { address, contract };
}
