/* eslint-disable @typescript-eslint/no-explicit-any */
import { WalletState } from '@web3-onboard/core';
import { useConnectWallet, useSetChain, useWallets, web3Onboard } from '@web3-onboard/react';
import { ethers, Signature } from 'ethers';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { UserProfileDto } from 'src/components/user/user-profile-dto';
import { apiGet } from '../apiUtils';
import { ProviderEvents } from '../providers/AbstractProvider';
import { JSONRPCRequestPayload, JSONRPCResponsePayload } from '../providers/Provider';
import { setupOnboard } from '../web3-onboard';
import { User } from './AppContext';
import { Emitter, OnboardAuthProvider, WalletSigner } from './OnboardAuthProvider';

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
  isLoggedInAndAuthenticated: () => boolean;
  getSigner: () => ethers.providers.JsonRpcSigner | undefined;
  request: (request: JSONRPCRequestPayload) => Promise<JSONRPCResponsePayload | undefined>;
  getAuthHeaders: (attemptLogin?: boolean) => void;
};

const OnboardContext = React.createContext<OnboardContextType | null>(null);

export const OnboardContextProvider = (props: React.PropsWithChildren<unknown>) => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const connectedWallets = useWallets();

  const [user, setUser] = useState<User | null>(null);
  const [
    {
      // chains, // the list of chains that web3-onboard was initialized with
      connectedChain // the current chain the user's wallet is connected to
      // settingChain // boolean indicating if the chain is in the process of being set
    },
    setChain // function to call to initiate user to switch chains in their wallet
  ] = useSetChain();

  useEffect(() => {
    if (user?.address) {
      emit(ProviderEvents.AccountsChanged);
    }
  }, [user]);

  useEffect(() => {
    if (wallet) {
      emit(ProviderEvents.Connect);
    } else {
      emit(ProviderEvents.Disconnect);
    }
  }, [wallet]);

  useEffect(() => {
    if (connectedChain) {
      emit(ProviderEvents.ChainChanged);
    }
  }, [connectedChain]);

  useEffect(() => {
    if (!connectedWallets.length) {
      return;
    }

    const connectedWalletsLabelArray = connectedWallets.map(({ label }) => label);
    window.localStorage.setItem('connectedWallets', JSON.stringify(connectedWalletsLabelArray));
  }, [connectedWallets]);

  const handleNetworkChange = () => {
    // ddd
  };

  const handleAccountChange = async () => {
    // ddd
  };

  const onConnect = () => {
    // ddd
  };

  const onDisconnect = () => {
    // ddd
  };

  useEffect(() => {
    Emitter.on(ProviderEvents.AccountsChanged, handleAccountChange);
    Emitter.on(ProviderEvents.ChainChanged, handleNetworkChange);
    Emitter.on(ProviderEvents.Connect, onConnect);
    Emitter.on(ProviderEvents.Disconnect, onDisconnect);

    return () => {
      Emitter.removeListener?.(ProviderEvents.AccountsChanged, handleAccountChange);
      Emitter.removeListener?.(ProviderEvents.ChainChanged, handleNetworkChange);
      Emitter.removeListener?.(ProviderEvents.Connect, onConnect);
      Emitter.removeListener?.(ProviderEvents.Disconnect, onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (wallet && wallet.accounts?.length > 0) {
      updateUserInfo(wallet.accounts[0].address);
    } else {
      setUser(null);

      // if had a user, then assume the user disconnected
      // clear out the auth cache
      if (user) {
        OnboardAuthProvider.clear();
      }
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet && user) {
      // TODO steve not sure where this goes, or if needed
      const walletSigner = new WalletSigner(wallet, user?.address);

      OnboardAuthProvider.authenticate(walletSigner);
    }
  }, [user]);

  useEffect(() => {
    if (web3Onboard) {
      const savedConnectedWallets = JSON.parse(window.localStorage.getItem('connectedWallets') ?? '[]');

      if (savedConnectedWallets?.length) {
        const setWalletFromLocalStorage = async () => {
          await connect({ autoSelect: { label: savedConnectedWallets[0], disableModals: true } });
        };

        setWalletFromLocalStorage();
      }
    }
  }, [web3Onboard]);

  const chainId = connectedChain?.id ?? '1';
  const isConnecting = connecting;

  const setChainId = (chainId: string) => {
    setChain({ chainId });
  };

  const signIn = async () => {
    connect();
  };

  const getAuthHeaders = async (attemptLogin = true): Promise<object> => {
    if (attemptLogin && !isLoggedInAndAuthenticated()) {
      await signIn();
    }

    return OnboardAuthProvider.getAuthHeaders();
  };

  const signOut = async () => {
    if (wallet) {
      disconnect(wallet);
      window.localStorage.removeItem('connectedWallets');
    }
  };

  const sendTransaction = async () => {
    try {
      const signer = getSigner();
      if (signer) {
        const txn = await signer.sendTransaction({
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
    if (wallet && user) {
      const walletSigner = new WalletSigner(wallet, user?.address);

      return walletSigner.getSigner();
    }
  };

  const signMessage = async (message: string): Promise<Signature | undefined> => {
    if (wallet && user) {
      const walletSigner = new WalletSigner(wallet, user?.address);

      return walletSigner.signMessage(message);
    }
  };

  const isLoggedInAndAuthenticated = (): boolean => {
    if (wallet && user) {
      const walletSigner = new WalletSigner(wallet, user?.address);

      return OnboardAuthProvider.isLoggedInAndAuthenticated(walletSigner);
    }

    return false;
  };

  const emit = (event: ProviderEvents, ...args: any) => {
    Emitter.emit(event, args);
  };

  const request = async (request: JSONRPCRequestPayload): Promise<JSONRPCResponsePayload | undefined> => {
    if (wallet) {
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any');

      const response = ethersProvider.send(request.method, request.params);

      return { result: response, id: request?.id ?? '', jsonrpc: request?.jsonrpc ?? '' };
    }
  };

  const updateUserInfo = async (address: string) => {
    const { result, error } = await apiGet(`/user/${address}`);

    if (!error) {
      const userInfo = result as UserProfileDto;
      setUser({ address: address, username: userInfo.username });
    }
  };

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
    isLoggedInAndAuthenticated,
    getSigner,
    request,
    getAuthHeaders
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
