import { XFLStakerABI } from '@infinityxyz/lib-frontend/abi/xflStaker';
import { getXFLStakerAddress } from '@infinityxyz/lib-frontend/utils';
import { useAccount } from 'wagmi';
import { useContract } from '../useContract';
import { utils } from 'ethers';

export function useStakerContract(chainId: string) {
  const { address } = useAccount();

  const stakerAddress = getXFLStakerAddress(chainId);
  const contract = useContract(stakerAddress, chainId, XFLStakerABI);

  const stake = async (amount: number) => {
    if (address) {
      const tx = await contract.stake(utils.parseEther(amount.toString()).toString());
      await tx.wait();
    }
  };

  const unstake = async (amount: number) => {
    if (address) {
      const tx = await contract.unstake(utils.parseEther(amount.toString()).toString());
      await tx.wait();
    }
  };

  const getUserStakeLevel = async () => {
    if (address) {
      const stakeLevel = await contract.getUserStakeLevel(address);
      return stakeLevel;
    }
  };

  const stakeBalance = async () => {
    if (address) {
      const balanceWei = await contract.userStakedAmounts(address);
      const balance = utils.formatEther(balanceWei);
      return balance;
    }
  };

  return { contract, stakerAddress, stake, unstake, getUserStakeLevel, stakeBalance };
}
