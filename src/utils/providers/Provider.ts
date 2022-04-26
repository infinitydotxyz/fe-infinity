/* eslint-disable @typescript-eslint/no-explicit-any */
import { Signature } from '@ethersproject/bytes';
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
  account: string;
  chainId: number;
  isConnected: boolean;
  type: WalletType;
  init(): Promise<void>;
  personalSign(message: string): Promise<Signature>;
  getAccounts(): Promise<string[]>;
  getChainId(): Promise<number>;
  disconnect(): void;
  on(event: ProviderEvents, listener: (data: any) => void): void;
  removeListener(event: ProviderEvents, listener: (data: any) => void): void;
  request(request: JSONRPCRequestPayload): Promise<JSONRPCResponsePayload>;
}
