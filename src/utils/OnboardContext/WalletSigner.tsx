/* eslint-disable @typescript-eslint/no-explicit-any */
import { WalletState } from '@web3-onboard/core';
import { ethers, Signature } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import mitt from 'mitt';
import { ProviderEvents, WalletType } from '../providers/AbstractProvider';
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

// ==========================================================================

class _Emitter {
  emitter = mitt();

  emit(event: ProviderEvents, ...args: any) {
    this.emitter.emit(event, args);
  }

  on(event: ProviderEvents, listener: (data: any) => void): void {
    this.emitter.on(event, listener);
  }

  removeListener(event: ProviderEvents, listener: (data: any) => void): void {
    this.emitter.off(event, listener);
  }
}

export const Emitter = new _Emitter();
