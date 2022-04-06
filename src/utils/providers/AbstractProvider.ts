import { Signature } from 'ethers';
import EventEmitter from 'events';
import { JSONRPCRequestPayload, JSONRPCResponsePayload, Provider } from './Provider';

export enum WalletType {
  MetaMask = 'MetaMask',
  WalletLink = 'WalletLink',
  WalletConnect = 'WalletConnect'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Web3Provider = any;

export enum ProviderEvents {
  AccountsChanged = 'accountsChanged',
  ChainChanged = 'chainChanged',
  Connect = 'connect',
  Disconnect = 'disconnect'
}

export abstract class AbstractProvider implements Provider {
  abstract type: WalletType;

  private _account?: string;
  private _chainId?: number;
  private _state: 'connected' | 'disconnected' = 'disconnected';

  get account() {
    return this._account ?? '';
  }

  get chainId() {
    return this._chainId ?? 1;
  }

  get isConnected() {
    return this._state === 'connected';
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  protected set account(account: string) {
    if (this.account === account) {
      return;
    }

    const shouldEmit = !!this._account;
    this._account = account;

    if (shouldEmit) {
      this.emit(ProviderEvents.AccountsChanged, account);
    }
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  protected set chainId(chainId: number) {
    const shouldEmit = typeof this._chainId === 'number';
    if (this._chainId === chainId) {
      return;
    }
    this._chainId = chainId;
    if (shouldEmit) {
      this.emit(ProviderEvents.ChainChanged, chainId);
    }
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  protected set isConnected(isConnected: boolean) {
    if (this.isConnected === isConnected) {
      return;
    }
    this._state = isConnected ? 'connected' : 'disconnected';
    if (isConnected) {
      this.emit(ProviderEvents.Connect);
    } else {
      this.emit(ProviderEvents.Disconnect);
    }
  }

  protected emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  /**
   * handles initializing the wallet
   * (i.e. connect/open/prompt unlock)
   */
  abstract init(): Promise<void>;

  /**
   * personalSign takes a message to be signed and returns a promise for the
   * signature object (you'll likely have to decode the resulting hex data)
   *
   * @param message to be signed
   */
  abstract personalSign(message: string): Promise<Signature>;

  abstract getAccounts(): Promise<string[]>;

  /**
   * returns a promise for the chainId as a base 10 number
   */
  abstract getChainId(): Promise<number>;

  /**
   * concrete providers only need to implement the request method
   * send and sendAsync are handled using request
   */
  abstract request(request: JSONRPCRequestPayload): Promise<JSONRPCResponsePayload>;

  /**
   * disconnects the wallet
   * the user will need to re-connect
   */
  abstract disconnect(): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: ProviderEvents, listener: (data: any) => void): void {
    this.emitter.on(event, listener);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeListener(event: ProviderEvents, listener: (data: any) => void): void {
    this.emitter.removeListener(event, listener);
  }

  /**
   * concrete implementations should register listeners on the internal provider
   * and set account/chaindId and isConnected accordingly
   */
  protected abstract registerListeners(): void;

  /**
   * emit is called internally.
   * Use the setters for account, chainId and isConnected when the provider
   * emits an update. these setter handle emitting events
   * @param event to be emitted
   * @param args
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private emit(event: ProviderEvents, ...args: any) {
    this.emitter.emit(event, args);
  }
}
