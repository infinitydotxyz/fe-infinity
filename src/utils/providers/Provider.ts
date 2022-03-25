/* eslint-disable @typescript-eslint/no-explicit-any */
import { Signature } from 'ethers';
import { ProviderEvents, WalletType } from './AbstractProvider';
export interface JSONRPCRequestPayload {
  params: any[];
  method: string;
  id: number;
  jsonrpc: string;
}

export interface JSONRPCResponsePayload {
  result: any;
  id: number;
  jsonrpc: string;
}

export interface Provider {
  /**
   * current account
   */
  account: string;

  /**
   * current chainId
   */
  chainId: number;

  /**
   * whether the provider is connected
   */
  isConnected: boolean;

  /**
   * the type of wallet
   */
  type: WalletType;

  /**
   * handles initializing the wallet
   * (i.e. connect/open/prompt unlock)
   */
  init(): Promise<void>;

  /**
   * sign a message with the wallet
   */
  personalSign(message: string): Promise<Signature>;

  /**
   * get the available accounts
   */
  getAccounts(): Promise<string[]>;

  /**
   * get the chainId using the provider
   */
  getChainId(): Promise<number>;

  /**
   * disconnect from this provider
   */
  disconnect(): void;

  on(event: ProviderEvents, listener: (data: any) => void): void;

  removeListener(event: ProviderEvents, listener: (data: any) => void): void;

  /**
   * prefer this rpc method
   */
  request(request: JSONRPCRequestPayload): Promise<JSONRPCResponsePayload>;
}
