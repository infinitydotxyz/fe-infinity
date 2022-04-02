/* eslint-disable @typescript-eslint/no-explicit-any */

import { ethers, Signature } from 'ethers';
import { AbstractProvider, WalletType } from './AbstractProvider';
import { JSONRPCRequestPayload, JSONRPCResponsePayload } from './Provider';
import { UserRejectException } from './UserRejectException';

declare let window: any;

export class MetaMask extends AbstractProvider {
  private _provider: any;

  public readonly type = WalletType.MetaMask;

  constructor() {
    super();
    /**
     * wallet link attempts to override metamask and sets isMetaMask to true
     * by checking for overrideIsMetaMask we won't open wallet link when we
     * want to open MetaMask
     */
    if (window.ethereum?.isMetaMask && !(window.ethereum as any).overrideIsMetaMask) {
      this._provider = window.ethereum;
    } else {
      const metamaskProvider = ((window.ethereum as any)?.providers || []).find(
        (item: any) => item?.isMetaMask && !item?.overrideIsMetaMask
      );
      if (metamaskProvider) {
        this._provider = metamaskProvider;
      } else {
        throw new Error('MetaMask is not installed');
      }
    }
  }

  async init() {
    this.registerListeners();
    try {
      const accounts = await this.getAccounts();
      const chainId = await this.getChainId();

      this.account = accounts[0];
      this.chainId = chainId;

      if (!this.account) {
        throw new Error('Please install MetaMask');
      }
    } catch (err: Error | any) {
      if (err?.code === 4001) {
        // EIP-1193 userRejectedRequest error
        throw new UserRejectException(this.type);
      }
      throw err;
    }
  }

  async getAccounts() {
    return await this._provider.request({ method: 'eth_requestAccounts' });
  }

  async getChainId() {
    const hexChainId = await this._provider.request({ method: 'eth_chainId' });
    const chainId = parseInt(hexChainId, 16);
    return chainId;
  }

  async personalSign(message: string): Promise<Signature> {
    const params: any[] = [message];
    if (this.account) {
      params.push(this.account);
    }
    try {
      const response: string = await this._provider.request({
        method: 'personal_sign',
        params
      });
      const signature = ethers.utils.splitSignature(response);
      return signature;
    } catch (err: Error | any) {
      if (err?.code === 4001) {
        throw new UserRejectException(this.type);
      }
      throw err;
    }
  }

  disconnect(): void {
    this._provider?.close?.();
  }

  async request(request: JSONRPCRequestPayload): Promise<JSONRPCResponsePayload> {
    const response = await this._provider.request({ method: request.method, params: request.params });
    return { result: response, id: request?.id ?? '', jsonrpc: request?.jsonrpc ?? '' };
  }

  registerListeners(): void {
    this._provider.on('accountsChanged', (accounts: string[]) => {
      this.account = accounts[0];
    });
    this._provider.on('chainChanged', (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16);
      this.chainId = chainId;
    });

    this._provider.on('disconnect', () => {
      this.isConnected = false;
    });

    this._provider.on('connect', () => {
      this.isConnected = true;
    });
  }
}
