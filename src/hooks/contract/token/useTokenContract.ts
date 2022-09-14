import { ERC20ABI } from '@infinityxyz/lib-frontend/abi/erc20';
import { ETHEREUM_TOKEN_CONTRACT_ADDRESS } from '@infinityxyz/lib-frontend/utils/constants';
import { useContract } from '../useContract';

export function useTokenContract() {
  const address = ETHEREUM_TOKEN_CONTRACT_ADDRESS;
  const contract = useContract(address, ERC20ABI);

  return { address, contract };
}
