import { Signature } from '@ethersproject/bytes';
import { Web3Provider } from '@ethersproject/providers';
import { LOGIN_NONCE_EXPIRY_TIME, trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { verifyMessage } from 'ethers/lib/utils';
import EventEmitter from 'events';
import { base64Encode, getLoginMessage } from '../commonUtils';
import { Optional } from '../typeUtils';
import { ProviderEvents, WalletType } from './AbstractProvider';
import { MetaMask } from './MetaMask';
import { JSONRPCRequestPayload, Provider } from './Provider';
import { UserRejectException } from './UserRejectException';

enum StorageKeys {
  CurrentUser = 'CURRENT_USER',
  AuthNonce = 'X-AUTH-NONCE',
  AuthSignature = 'X-AUTH-SIGNATURE',
  AuthMessage = 'X-AUTH-MESSAGE',
  Wallet = 'WALLET'
}

/**
 * provider manager acts as a proxy for the underlying wallet(s)
 *
 * responsibilities:
 * - connect to a new wallet
 * - provide wallet agnostic events and rpc methods
 * - implement the opensea provider interface so that it can be passed to instantiate
 * the seaport
 * - handles saving/refreshing the wallet from localstorage
 * - provide access to auth headers
 * - provides an ethers provider through getEthersProvider
 *
 * to add support for another wallet, implement an AbstractProvider
 *
 * specific wallet implementations should not be used directly by a client
 */
export class ProviderManager implements Omit<Optional<Provider, 'type'>, 'init'> {
  private _provider?: Provider;

  private _emitter: EventEmitter;

  private authNonce = 0;
  private authSignature?: Signature;
  private authMessage = '';

  // SINGLETON
  private static promise: Promise<ProviderManager>;
  public static async getInstance() {
    if (!this.promise) {
      const create = async (): Promise<ProviderManager> => {
        const result = new this();
        await result.refresh();

        return result;
      };

      this.promise = Promise.resolve(create());
    }

    return this.promise;
  }

  private constructor() {
    this._emitter = new EventEmitter();
  }

  get account() {
    return this._provider?.account ?? '';
  }

  get chainId() {
    return this._provider?.chainId ?? 1;
  }

  get isConnected() {
    return this._provider?.isConnected ?? false;
  }

  get type() {
    return this._provider?.type;
  }

  getAuthHeaders = async (attemptLogin = true) => {
    if (attemptLogin && !this.isLoggedInAndAuthenticated) {
      await this.signIn();
    }
    return {
      [StorageKeys.AuthNonce]: this.authNonce,
      [StorageKeys.AuthMessage]: base64Encode(this.authMessage),
      [StorageKeys.AuthSignature]: JSON.stringify(this.authSignature)
    };
  };

  personalSign(message: string): Promise<Signature> {
    if (this._provider) {
      return this._provider.personalSign(message);
    }
    throw new Error('No provider');
  }

  getAccounts(): Promise<string[]> {
    if (this._provider) {
      return this._provider.getAccounts();
    }
    throw new Error('No provider');
  }

  getChainId() {
    if (this._provider) {
      return this._provider.getChainId();
    }
    throw new Error('No provider');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async jsonRpcFetchFunc(method: string, params?: any[]) {
    const response = await this.request({ method, params: params ?? [], id: Date.now(), jsonrpc: '' });
    return response.result;
  }

  getEthersProvider = () => {
    return new Web3Provider(this.jsonRpcFetchFunc.bind(this));
  };

  request(request: JSONRPCRequestPayload) {
    if (this._provider) {
      return this._provider.request(request);
    } else {
      throw new Error('Please login');
    }
  }

  disconnect(): void {
    try {
      this._provider?.disconnect?.();
    } catch (err) {
      console.error(err);
    }
    this._provider = undefined;
    this.authNonce = 0;
    this.authMessage = '';
    this.authSignature = undefined;
    this.save();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: ProviderEvents, listener: (data: any) => void): void {
    this._emitter.on(event, listener);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeListener(event: ProviderEvents, listener: (data: any) => void): void {
    this._emitter.removeListener(event, listener);
  }

  /**
   * connectWallet creates a new provider and
   * @param walletType
   */
  async connectWallet(walletType: WalletType) {
    this._provider?.disconnect?.();
    try {
      const provider = this.createProvider(walletType);

      if (provider) {
        let prevChainId = this._provider?.chainId;
        let prevAccount = this._provider?.account;

        this._provider = provider;
        this.save();

        this._provider?.on(ProviderEvents.AccountsChanged, (account: string) => {
          if (account !== prevAccount) {
            this._emitter.emit(ProviderEvents.AccountsChanged, account);
            prevAccount = account;
          }
        });

        this._provider?.on(ProviderEvents.ChainChanged, (chainId: number) => {
          if (chainId !== prevChainId) {
            this._emitter.emit(ProviderEvents.ChainChanged, chainId);
            prevChainId = chainId;
          }
        });

        this._provider?.on(ProviderEvents.Connect, () => {
          this._emitter.emit(ProviderEvents.Connect);
        });

        this._provider?.on(ProviderEvents.Disconnect, () => {
          this._emitter.emit(ProviderEvents.Disconnect);
        });

        await this._provider?.init();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: Error | UserRejectException | any) {
      if (err instanceof UserRejectException) {
        console.log('User rejected');
      }
      throw err;
    }
  }

  // todo: why is this reqd? this is getting called too many times
  public get isLoggedInAndAuthenticated(): boolean {
    const currentUser = trimLowerCase(this.account);
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

  async signIn() {
    const nonce = Date.now();
    const loginMsg = getLoginMessage(nonce);
    const signature = await this.personalSign(loginMsg);
    if (signature) {
      try {
        this.authNonce = nonce;
        this.authSignature = signature;
        this.authMessage = loginMsg;
        this.save();
      } catch (err) {
        console.error('Error saving login info', err);
      }
    } else {
      console.error('No signature');
    }
  }

  /**
   * createProvider is a provider factory method
   * throws an error if the wallet type is not supported
   */
  private createProvider(type: WalletType) {
    switch (type) {
      case WalletType.MetaMask:
        return new MetaMask();
      // todo: uncomment
      // case WalletType.WalletLink:
      //   return new WalletLink();

      // case WalletType.WalletConnect:
      //   return new WalletConnect();

      default:
        return;
    }
  }

  /**
   * persist wallet type
   */
  private save() {
    const localStorage = window.localStorage;
    localStorage.setItem(StorageKeys.Wallet, this._provider?.type ?? '');
    localStorage.setItem(StorageKeys.AuthNonce, this.authNonce.toString());
    localStorage.setItem(StorageKeys.AuthSignature, JSON.stringify(this.authSignature ?? {}));
    localStorage.setItem(StorageKeys.AuthMessage, this.authMessage);
  }

  /**
   * refresh gets the stored wallet type and attempts tp
   * initialize a wallet
   */
  private async refresh() {
    const localStorage = window.localStorage;
    const preferredWallet = localStorage.getItem(StorageKeys.Wallet);
    const authNonce = localStorage.getItem(StorageKeys.AuthNonce);
    const authSignature = localStorage.getItem(StorageKeys.AuthSignature);
    const authMessage = localStorage.getItem(StorageKeys.AuthMessage);
    if (
      preferredWallet === WalletType.MetaMask ||
      preferredWallet === WalletType.WalletLink ||
      preferredWallet === WalletType.WalletConnect
    ) {
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
        this.authSignature = parsedSignature as Signature;
      }
      this.authMessage = authMessage ?? '';
      this.authNonce = parseInt(authNonce ?? '0');
      try {
        await this.connectWallet(preferredWallet);
      } catch (err) {
        console.error(err);
      }
    }

    return;
  }
}
