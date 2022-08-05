/* eslint-disable @typescript-eslint/no-explicit-any */
import { WalletState } from '@web3-onboard/core';
import { ethers, Signature } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import { WalletType } from '../providers/AbstractProvider';
import { UserRejectException } from '../providers/UserRejectException';

export class WalletSigner {
  public wallet;
  public userAddress;

  constructor(wallet: WalletState, userAddress: string) {
    this.wallet = wallet;
    this.userAddress = userAddress;
  }

  getSigner(): ethers.providers.JsonRpcSigner | undefined {
    const ethersProvider = new ethers.providers.Web3Provider(this.wallet.provider, 'any');

    return ethersProvider.getSigner();
  }

  async signMessage(message: string): Promise<Signature | undefined> {
    try {
      const signer = this.getSigner();
      if (signer) {
        const result = await signer.signMessage(message);

        return splitSignature(result);
      }
    } catch (err: any) {
      if (err?.code === 4001) {
        throw new UserRejectException(WalletType.MetaMask);
      }
      throw err;
    }
  }
}
