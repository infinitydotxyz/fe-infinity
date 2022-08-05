/* eslint-disable @typescript-eslint/no-explicit-any */
import { WalletState } from '@web3-onboard/core';
import { useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react';
import { ethers, Signature } from 'ethers';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { UserProfileDto } from 'src/components/user/user-profile-dto';
import { apiGet } from '../apiUtils';
import { ProviderEvents } from '../providers/AbstractProvider';
import { JSONRPCRequestPayload, JSONRPCResponsePayload } from '../providers/Provider';
import { setupOnboard } from '../web3-onboard';
import { User } from '../context/AppContext';
import { OnboardAuthProvider } from './OnboardAuthProvider';
import { WalletSigner } from './WalletSigner';
import { OnboardEmitter } from './OnboardEmitter';
import { toastWarning } from 'src/components/common';
import { PleaseConnectMsg } from '../commonUtils';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';

setupOnboard();

export type OnboardContextType = {
  sendTransaction: () => void;
  signIn: () => void;
  signOut: () => void;
  isConnecting: boolean;
  wallet: WalletState | null;
  chainId: string | null;
  setChainId: (chainId: string) => void;
  user: User | null;
  signMessage: (message: string) => Promise<Signature | undefined>;
  getSigner: () => ethers.providers.JsonRpcSigner | undefined;
  request: (request: JSONRPCRequestPayload) => Promise<JSONRPCResponsePayload | undefined>;
  checkSignedIn: () => void;
  waitForTransaction: (txHash: string, callback: (receipt: TransactionReceipt | undefined) => void) => void;
};

const OnboardContext = React.createContext<OnboardContextType | null>(null);

export const OnboardContextProvider = (props: React.PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<User | null>(null);

  // ===========================================================
  // hooks

  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const connectedWallets = useWallets();
  const [
    {
      // chains, // the list of chains that web3-onboard was initialized with
      connectedChain // the current chain the user's wallet is connected to
      // settingChain // boolean indicating if the chain is in the process of being set
    },
    setChain // function to call to initiate user to switch chains in their wallet
  ] = useSetChain();

  // ===========================================================
  // useEffect

  useEffect(() => {
    OnboardEmitter.updateUserAddress(userAddress());

    // keep OnboardAuthProvider in sync
    if (wallet) {
      const walletSigner = new WalletSigner(wallet, userAddress());
      OnboardAuthProvider.updateWalletSigner(walletSigner);

      setUser({ address: userAddress() });

      updateUserInfo(userAddress());
    } else {
      OnboardAuthProvider.updateWalletSigner(undefined);
      setUser(null);
    }
  }, [wallet]);

  useEffect(() => {
    OnboardEmitter.updateChainId(connectedChain?.id ?? '');
  }, [connectedChain]);

  // save connected wallets to local storage
  useEffect(() => {
    if (!connectedWallets.length) {
      return;
    }

    const connectedWalletsLabelArray = connectedWallets.map(({ label }) => label);
    window.localStorage.setItem('connectedWallets', JSON.stringify(connectedWalletsLabelArray));
  }, [connectedWallets]);

  useEffect(() => {
    OnboardEmitter.on(ProviderEvents.AccountsChanged, handleAccountChange);
    OnboardEmitter.on(ProviderEvents.ChainChanged, handleChainChange);
    OnboardEmitter.on(ProviderEvents.Connect, onConnect);
    OnboardEmitter.on(ProviderEvents.Disconnect, onDisconnect);

    return () => {
      OnboardEmitter.removeListener?.(ProviderEvents.AccountsChanged, handleAccountChange);
      OnboardEmitter.removeListener?.(ProviderEvents.ChainChanged, handleChainChange);
      OnboardEmitter.removeListener?.(ProviderEvents.Connect, onConnect);
      OnboardEmitter.removeListener?.(ProviderEvents.Disconnect, onDisconnect);
    };
  }, []);

  // auto connect to the first wallet saved in localStorage
  useEffect(() => {
    const savedConnectedWallets = JSON.parse(window.localStorage.getItem('connectedWallets') ?? '[]');

    if (savedConnectedWallets?.length) {
      const setWalletFromLocalStorage = async () => {
        await connect({ autoSelect: { label: savedConnectedWallets[0], disableModals: true } });
      };

      setWalletFromLocalStorage();
    }
  }, []);

  // ===========================================================

  const userAddress = (): string => {
    if (wallet && wallet?.accounts.length > 0) {
      return wallet?.accounts[0].address;
    }

    return '';
  };

  const chainId = connectedChain?.id ?? '1';
  const isConnecting = connecting;

  const setChainId = (chainId: string) => {
    setChain({ chainId });
  };

  const signIn = async () => {
    connect();
  };

  const signOut = async () => {
    if (wallet) {
      disconnect(wallet);
      window.localStorage.removeItem('connectedWallets');
    }
  };

  const checkSignedIn = () => {
    if (userAddress()) {
      toastWarning(<PleaseConnectMsg />);
      return false;
    }
    return true;
  };

  const sendTransaction = async () => {
    try {
      const signer = getSigner();
      if (signer) {
        const txn: TransactionResponse = await signer.sendTransaction({
          to: '0x',
          value: 100000000000000
        });

        const receipt = await txn.wait();
        console.log(receipt);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getSigner = (): ethers.providers.JsonRpcSigner | undefined => {
    if (wallet) {
      const walletSigner = new WalletSigner(wallet, userAddress());

      return walletSigner.getSigner();
    }
  };

  const signMessage = async (message: string): Promise<Signature | undefined> => {
    if (wallet) {
      const walletSigner = new WalletSigner(wallet, userAddress());

      return walletSigner.signMessage(message);
    }
  };

  const request = async (request: JSONRPCRequestPayload): Promise<JSONRPCResponsePayload | undefined> => {
    if (wallet) {
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any');

      const response = ethersProvider.send(request.method, request.params);

      return { result: response, id: request?.id ?? '', jsonrpc: request?.jsonrpc ?? '' };
    }
  };

  const waitForTransaction = async (txHash: string, callback: (receipt: TransactionReceipt | undefined) => void) => {
    if (wallet) {
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any');

      const receipt = await ethersProvider.waitForTransaction(txHash);
      callback(receipt);
    }

    callback(undefined);
  };

  const updateUserInfo = async (address: string) => {
    console.log('updateUserInfo');

    const { result, error } = await apiGet(`/user/${address}`);
    if (!error) {
      const userInfo = result as UserProfileDto;
      setUser({ address: address, username: userInfo.username });
    }
  };

  // ===========================================================
  // event handlers

  const handleChainChange = () => {
    window.location.reload();
  };

  const handleAccountChange = async () => {
    window.location.reload();
  };

  const onConnect = () => {
    // nothing
  };

  const onDisconnect = () => {
    OnboardAuthProvider.clear();

    window.location.reload();
  };

  // ===========================================================

  const value: OnboardContextType = {
    sendTransaction,
    signOut,
    signIn,
    isConnecting,
    wallet,
    chainId,
    setChainId,
    user,
    signMessage,
    getSigner,
    request,
    checkSignedIn,
    waitForTransaction
  };

  return (
    <OnboardContext.Provider value={value} {...props}>
      {props.children}
    </OnboardContext.Provider>
  );
};

export const useOnboardContext = (): OnboardContextType => {
  return React.useContext(OnboardContext) as OnboardContextType;
};
