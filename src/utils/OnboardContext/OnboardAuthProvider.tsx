/* eslint-disable @typescript-eslint/no-explicit-any */
import { LOGIN_NONCE_EXPIRY_TIME, trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { AxiosRequestHeaders } from 'axios';
import { Signature } from 'ethers';
import { verifyMessage } from 'ethers/lib/utils';
import { base64Encode, getLoginMessage } from '../commonUtils';
import { WalletSigner } from './WalletSigner';

type WalletCreds = {
  nonce: number;
  signature: Signature | undefined;
  message: string;
};

class _OnboardAuthProvider {
  private currentCreds: WalletCreds = {
    nonce: 0,
    signature: undefined,
    message: ''
  };
  private walletSigner: WalletSigner | null = null;

  clear() {
    this.walletSigner = null;

    this.currentCreds = {
      nonce: 0,
      signature: undefined,
      message: ''
    };

    this.saveCreds();
  }

  // OnboardContext updates this
  async updateWalletSigner(walletSigner: WalletSigner | null) {
    let update = true;

    if (this.walletSigner !== null && walletSigner !== null) {
      update = !this.walletSigner.isEqual(walletSigner);
    } else {
      // check if both are null
      update = this.walletSigner !== walletSigner;
    }

    if (update) {
      this.walletSigner = walletSigner;

      if (this.walletSigner) {
        await this.authenticate();
      }
    }
  }

  getAuthHeaders(): AxiosRequestHeaders {
    if (this.isLoggedInAndAuthenticated()) {
      return {
        'X-AUTH-NONCE': this.currentCreds.nonce,
        'X-AUTH-MESSAGE': base64Encode(this.currentCreds.message),
        'X-AUTH-SIGNATURE': JSON.stringify(this.currentCreds.signature)
      };
    }

    console.log('### getAuthHeaders called when not authenticated');

    return {};
  }

  isLoggedInAndAuthenticated(): boolean {
    if (this.walletSigner) {
      const currentUser = trimLowerCase(this.walletSigner.address());

      if (currentUser && this.currentCreds.nonce && this.currentCreds.message && this.currentCreds.signature) {
        try {
          const signer = verifyMessage(this.currentCreds.message, this.currentCreds.signature).toLowerCase();
          const isSigValid = signer === currentUser;
          const isNonceValid = Date.now() - this.currentCreds.nonce < LOGIN_NONCE_EXPIRY_TIME;

          const result = isSigValid && isNonceValid;

          return result;
        } catch (err) {
          console.log(err);
          return false;
        }
      }
    }

    return false;
  }

  loadCreds = () => {
    if (this.walletSigner) {
      const currentUser = trimLowerCase(this.walletSigner.address());

      if (currentUser) {
        const key = `creds-${currentUser}`;

        const credsString = localStorage.getItem(key);
        if (credsString) {
          try {
            const creds = JSON.parse(credsString);

            const nonceString = creds['nonce'];
            const signatureString = creds['signature'];
            const messageString = creds['message'];

            const parsedSignature = JSON.parse(signatureString || '');

            let signature;
            if (
              parsedSignature &&
              'r' in parsedSignature &&
              's' in parsedSignature &&
              'v' in parsedSignature &&
              'recoveryParam' in parsedSignature
            ) {
              signature = parsedSignature;
            }

            if (nonceString && signature && messageString) {
              const result: WalletCreds = {
                nonce: parseInt(nonceString) ?? 0,
                message: messageString ?? '',
                signature: signature
              };

              this.currentCreds = result;
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  };

  saveCreds = () => {
    if (this.walletSigner) {
      const currentUser = trimLowerCase(this.walletSigner.address());

      if (currentUser) {
        const key = `creds-${currentUser}`;

        const data = {
          nonce: this.currentCreds.nonce,
          message: this.currentCreds.message,
          signature: JSON.stringify(this.currentCreds.signature ?? {})
        };

        localStorage.setItem(key, JSON.stringify(data));
      }
    }
  };

  authenticate = async () => {
    if (this.walletSigner) {
      this.loadCreds();

      if (this.isLoggedInAndAuthenticated()) {
        return;
      }

      const nonce = Date.now();
      const message = getLoginMessage(nonce);
      const signature = await this.walletSigner.signMessage(message);
      if (signature) {
        try {
          this.currentCreds = { nonce, signature, message };

          this.saveCreds();
        } catch (err) {
          console.error('Error saving login info', err);
        }
      } else {
        console.error('No signature');
      }
    }
  };
}

// Singleton
export const OnboardAuthProvider = new _OnboardAuthProvider();
