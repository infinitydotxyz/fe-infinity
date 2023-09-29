import { FlowCmDistributorABI } from '@infinityxyz/lib-frontend/abi';
import { DistributionType } from '@infinityxyz/lib-frontend/types/core';
import { getCmDistributorAddress, getFlurTokenAddress, getTokenAddress } from '@infinityxyz/lib-frontend/utils';
import { ENV } from 'src/utils';
import { useContract } from '../useContract';

export interface ClaimProps {
  type: DistributionType;
  account: string;
  cumulativeAmount: string;
  merkleRoot: string;
  merkleProof: string[];
}

export const useClaim = (chainId: string) => {
  const contractAddress = getCmDistributorAddress(chainId, ENV);
  const contract = useContract(contractAddress, chainId, FlowCmDistributorABI);
  const claim = async (data: ClaimProps) => {
    const { type, account, cumulativeAmount, merkleRoot, merkleProof } = data;
    let txn: { hash?: string };
    if (type === DistributionType.ETH) {
      txn = await contract?.claimEth(account, cumulativeAmount, merkleRoot, merkleProof);
    } else if (type === DistributionType.FLUR) {
      const flurTokenAddress = getFlurTokenAddress();
      txn = await contract?.claimErc20(flurTokenAddress, account, cumulativeAmount, merkleRoot, merkleProof);
    } else {
      const tokenAddress = getTokenAddress(chainId);
      txn = await contract?.claimErc20(tokenAddress, account, cumulativeAmount, merkleRoot, merkleProof);
    }

    return {
      hash: txn?.hash ?? ''
    };
  };

  return { claim };
};
