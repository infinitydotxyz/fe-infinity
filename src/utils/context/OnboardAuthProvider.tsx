/* eslint-disable @typescript-eslint/no-explicit-any */
import { LOGIN_NONCE_EXPIRY_TIME, trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { WalletState } from '@web3-onboard/core';
import { ethers, Signature } from 'ethers';
import { splitSignature, verifyMessage } from 'ethers/lib/utils';
import mitt from 'mitt';
import { base64Encode, getLoginMessage } from '../commonUtils';
import { ProviderEvents, WalletType } from '../providers/AbstractProvider';
import { UserRejectException } from '../providers/UserRejectException';

enum StorageKeys {
  CurrentUser = 'CURRENT_USER',
  AuthNonce = 'X-AUTH-NONCE',
  AuthSignature = 'X-AUTH-SIGNATURE',
  AuthMessage = 'X-AUTH-MESSAGE',
  Wallet = 'WALLET'
}

class _OnboardAuthProvider {
  private authNonce = 0;
  private authSignature?: Signature;
  private authMessage = '';

  clear() {
    this.authNonce = 0;
    this.authSignature = undefined;
    this.authMessage = '';
    this.saveAuthSignature();
  }

  getAuthHeaders = (): object => {
    return {
      [StorageKeys.AuthNonce]: this.authNonce,
      [StorageKeys.AuthMessage]: base64Encode(this.authMessage),
      [StorageKeys.AuthSignature]: JSON.stringify(this.authSignature)
    };
  };

  isLoggedInAndAuthenticated(walletSigner: WalletSigner): boolean {
    const currentUser = trimLowerCase(walletSigner.userAddress);

    if (currentUser && this.authNonce && this.authMessage && this.authSignature) {
      try {
        const signer = verifyMessage(this.authMessage, this.authSignature).toLowerCase();
        const isSigValid = signer === currentUser;
        const isNonceValid = Date.now() - this.authNonce < LOGIN_NONCE_EXPIRY_TIME;

        return isSigValid && isNonceValid;
      } catch (err) {
        console.log(err);
        return false;
      }
    }

    return false;
  }

  loadCreds = () => {
    const localStorage = window.localStorage;
    const authNonce = localStorage.getItem(StorageKeys.AuthNonce);
    const authSignature = localStorage.getItem(StorageKeys.AuthSignature);
    const authMessage = localStorage.getItem(StorageKeys.AuthMessage);

    let parsedSignature;
    try {
      parsedSignature = JSON.parse(authSignature || '');
    } catch (err) {
      console.error(err);
    }

    if (
      parsedSignature &&
      'r' in parsedSignature &&
      's' in parsedSignature &&
      'v' in parsedSignature &&
      'recoveryParam' in parsedSignature
    ) {
      this.authSignature = parsedSignature;
    }
    this.authMessage = authMessage ?? '';
    this.authNonce = parseInt(authNonce ?? '0');
  };

  saveAuthSignature = () => {
    const localStorage = window.localStorage;

    localStorage.setItem(StorageKeys.AuthNonce, this.authNonce.toString());
    localStorage.setItem(StorageKeys.AuthSignature, JSON.stringify(this.authSignature ?? {}));
    localStorage.setItem(StorageKeys.AuthMessage, this.authMessage);
  };

  authenticate = async (walletSigner: WalletSigner) => {
    this.loadCreds();

    if (this.isLoggedInAndAuthenticated(walletSigner)) {
      return;
    }

    const nonce = Date.now();
    const loginMsg = getLoginMessage(nonce);
    const signature = await walletSigner.signMessage(loginMsg);
    if (signature) {
      try {
        this.authNonce = nonce;
        this.authSignature = signature;
        this.authMessage = loginMsg;
        this.saveAuthSignature();
      } catch (err) {
        console.error('Error saving login info', err);
      }
    } else {
      console.error('No signature');
    }
  };
}

export const OnboardAuthProvider = new _OnboardAuthProvider();

// ===================================================================

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
