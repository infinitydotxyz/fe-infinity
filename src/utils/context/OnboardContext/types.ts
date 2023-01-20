export enum WalletType {
  MetaMask = 'MetaMask',
  WalletLink = 'WalletLink',
  WalletConnect = 'WalletConnect'
}

export enum ProviderEvents {
  AccountsChanged = 'accountsChanged',
  ChainChanged = 'chainChanged',
  Connect = 'connect',
  Disconnect = 'disconnect'
}

export interface JSONRPCRequestPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[];
  method: string;
  id: number;
  jsonrpc: string;
}

export interface JSONRPCResponsePayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
  id: number;
  jsonrpc: string;
}
