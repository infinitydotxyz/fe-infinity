import { Contract, ContractInterface } from 'ethers';
import { useSigner } from 'wagmi';

export function useContract(address: string, chainId: string, abi: ContractInterface) {
  const { data: signer } = useSigner({ chainId: parseFloat(chainId) });

  const contract = new Contract(address, abi, signer ?? undefined);

  return contract;
}
