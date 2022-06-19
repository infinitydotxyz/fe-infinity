import { Contract, ContractInterface } from 'ethers';
import { useAppContext } from 'src/utils/context/AppContext';

export function useContract(address: string, abi: ContractInterface) {
  const { providerManager } = useAppContext();

  const signer = providerManager?.getEthersProvider().getSigner();

  const contract = new Contract(address, abi, signer);

  return contract;
}
