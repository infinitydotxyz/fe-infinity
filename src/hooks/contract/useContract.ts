import { Contract, ContractInterface } from 'ethers';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export function useContract(address: string, abi: ContractInterface) {
  const { getSigner } = useOnboardContext();

  const signer = getSigner();

  const contract = new Contract(address, abi, signer);

  return contract;
}
