import { InfinityCmDistributorABI } from '@infinityxyz/lib-frontend/abi';
import { AirdropType } from '@infinityxyz/lib-frontend/types/core';
import { getCmDistributorAddress } from '@infinityxyz/lib-frontend/utils';
import { ENV } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useContract } from '../useContract';

export interface ClaimProps {
  type: AirdropType;
  account: string;
  cumulativeAmount: string;
  merkleRoot: string;
  merkleProof: string[];
  contractAddress: string;
}

export const useClaim = () => {
  const { chainId } = useOnboardContext();
  const contractAddress = getCmDistributorAddress(chainId, ENV);
  const contract = useContract(contractAddress, InfinityCmDistributorABI);
  const claim = async (data: ClaimProps) => {
    if (data.contractAddress !== contract.address) {
      throw new Error('Contract address does not match');
    }
    const { type, account, cumulativeAmount, merkleRoot, merkleProof } = data;
    let txn: { hash?: string };
    if (type === AirdropType.Curation) {
      txn = await contract?.claimETH(account, cumulativeAmount, merkleRoot, merkleProof);
    } else {
      txn = await contract?.claimINFT(account, cumulativeAmount, merkleRoot, merkleProof);
    }

    return {
      hash: txn?.hash ?? ''
    };
  };

  return { claim };
};
