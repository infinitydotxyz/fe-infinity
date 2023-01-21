/* eslint-disable @typescript-eslint/no-explicit-any */
import { LOGIN_NONCE_EXPIRY_TIME, trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { AxiosRequestHeaders } from 'axios';
import { Signature } from 'ethers';
import { verifyMessage } from '@ethersproject/wallet';
import { base64Encode } from '../../common-utils';
import { Preferences } from '../../preferences';
import { getMutex } from './mutex';
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
  private mutex = getMutex();

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
  updateWalletSigner(walletSigner: WalletSigner | null) {
    let update = true;

    if (this.walletSigner !== null && walletSigner !== null) {
      update = !this.walletSigner.isEqual(walletSigner);
    } else {
      // check if both are null
      update = this.walletSigner !== walletSigner;
    }

    if (update) {
      this.walletSigner = walletSigner;

      // we will authenticate as needed in getAuthHeaders
      // if (this.walletSigner) {
      //   await this.authenticate();
      // }
    }
  }

  async getAuthHeaders(): Promise<AxiosRequestHeaders> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    if (this.isAuthenticated()) {
      return {
        'X-AUTH-NONCE': this.currentCreds.nonce,
        'X-AUTH-MESSAGE': base64Encode(this.currentCreds.message),
        'X-AUTH-SIGNATURE': JSON.stringify(this.currentCreds.signature)
      };
    }

    return {};
  }

  isAuthenticated(): boolean {
    if (this.walletSigner) {
      const currentUser = trimLowerCase(this.walletSigner.address());

      if (currentUser && this.currentCreds.nonce && this.currentCreds.message && this.currentCreds.signature) {
        try {
          const signer = verifyMessage(this.currentCreds.message, this.currentCreds.signature).toLowerCase();
          const isSigValid = signer === currentUser;
          const isNonceValid = Date.now() - this.currentCreds.nonce < LOGIN_NONCE_EXPIRY_TIME;

          const result =
            isSigValid && isNonceValid && this.currentCreds.message === this.getLoginMessage(this.currentCreds.nonce);

          return result;
        } catch (err) {
          console.error(err);
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

        const credsString = Preferences.getString(key);
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
            console.error(err);
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

        Preferences.setString(key, JSON.stringify(data));
      }
    }
  };

  getLoginMessage = (nonce: number): string => {
    // ignore the formatting of this multiline string
    const msg = `Welcome to Flow. Click "Sign" to sign in. No password needed. This request will not trigger a blockchain transaction or cost any gas fees.
 
I accept the Flow Terms of Service: https://flow.so/terms

Nonce: ${nonce}
Expires in: 24 hrs`;

    return msg;
  };

  authenticate = async () => {
    if (this.walletSigner) {
      const [lock, release] = this.mutex.getLock();

      try {
        // we don't want 4 authenticate calls all at once, do them one at a time
        await lock;

        this.loadCreds();

        if (!this.isAuthenticated()) {
          const nonce = Date.now();
          const message = this.getLoginMessage(nonce);
          const signature = await this.walletSigner.signMessage(message);
          if (signature) {
            this.currentCreds = { nonce, signature, message };

            this.saveCreds();
          } else {
            console.error('No signature');
          }
        }
      } catch (err) {
        console.error('Error in authenticate', err);
      } finally {
        release();
      }
    }
  };
}

// Singleton
export const OnboardAuthProvider = new _OnboardAuthProvider();
