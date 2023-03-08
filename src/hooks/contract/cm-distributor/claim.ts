import { InfinityCmDistributorABI } from '@infinityxyz/lib-frontend/abi';
import { DistributionType } from '@infinityxyz/lib-frontend/types/core';
import { getCmDistributorAddress } from '@infinityxyz/lib-frontend/utils';
import { ENV } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { useNetwork } from 'wagmi';
import { useContract } from '../useContract';

export interface ClaimProps {
  type: DistributionType;
  account: string;
  cumulativeAmount: string;
  merkleRoot: string;
  merkleProof: string[];
  contractAddress: string;
}

export const useClaim = () => {
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

  const contractAddress = getCmDistributorAddress(chainId, ENV);
  const contract = useContract(contractAddress, InfinityCmDistributorABI);
  const claim = async (data: ClaimProps) => {
    if (data.contractAddress !== contract.address) {
      throw new Error('Contract address does not match');
    }
    const { type, account, cumulativeAmount, merkleRoot, merkleProof } = data;
    let txn: { hash?: string };
    if (type === DistributionType.ETH) {
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
