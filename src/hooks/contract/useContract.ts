import { Contract, ContractInterface } from 'ethers';
import { useSigner } from 'wagmi';

export function useContract(address: string, abi: ContractInterface) {
  const { data: signer } = useSigner();

  const contract = new Contract(address, abi, signer ? signer : undefined);

  return contract;
}
