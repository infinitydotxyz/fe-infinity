/* eslint-disable @typescript-eslint/no-explicit-any */
import { WalletState } from '@web3-onboard/core';
import { ethers, Signature } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import { UserRejectException, WalletType } from './UserRejectException';

export class WalletSigner {
  public wallet;

  constructor(wallet: WalletState) {
    this.wallet = wallet;
  }

  isEqual(other: WalletSigner): boolean {
    return other.address() === this.address() && other.chainId() === this.chainId();
  }

  static addressForWallet(wallet: WalletState): string {
    if (wallet.accounts.length > 0) {
      return wallet.accounts[0].address;
    }

    return '';
  }

  static chainIdForWallet(wallet: WalletState): string {
    if (wallet.chains.length > 0) {
      return wallet.chains[0].id;
    }

    return '';
  }

  address(): string {
    return WalletSigner.addressForWallet(this.wallet);
  }

  chainId(): string {
    return WalletSigner.chainIdForWallet(this.wallet);
  }

  getEthersProvider(): ethers.providers.Web3Provider {
    return new ethers.providers.Web3Provider(this.wallet.provider, 'any');
  }

  getSigner(): ethers.providers.JsonRpcSigner | undefined {
    return this.getEthersProvider().getSigner();
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
