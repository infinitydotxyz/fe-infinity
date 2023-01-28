import { InfinityStakerABI } from '@infinityxyz/lib-frontend/abi/infinityStaker';
import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { getStakerAddress } from '@infinityxyz/lib-frontend/utils';
import { ENV } from 'src/utils';
import { useNetwork } from 'wagmi';
import { useContract } from '../useContract';

export function useStakerContract() {
  const { chain } = useNetwork();
  const chainId = String(chain?.id ?? 1) as ChainId;
  const address = getStakerAddress(chainId, ENV);
  const contract = useContract(address, InfinityStakerABI);

  return { contract, address };
}
