import { WalletState } from '@web3-onboard/core';
import { useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react';
import { ethers } from 'ethers';
import * as React from 'react';
import { useEffect } from 'react';
import { setupOnboard } from '../web3-onboard';

setupOnboard();

export type OnboardContextType = {
  sendTransaction: () => void;
  signIn: () => void;
  signOut: () => void;
  isConnecting: boolean;
  wallet: WalletState | null;
  chainId: string | null;
  setChainId: (chainId: string) => void;
};

const OnboardContext = React.createContext<OnboardContextType | null>(null);

export const OnboardContextProvider = (props: React.PropsWithChildren<unknown>) => {
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

  useEffect(() => {
    if (!connectedWallets.length) {
      return;
    }

    const connectedWalletsLabelArray = connectedWallets.map(({ label }) => label);
    window.localStorage.setItem('connectedWallets', JSON.stringify(connectedWalletsLabelArray));
  }, [connectedWallets, wallet]);

  useEffect(() => {
    const previouslyConnectedWallets = JSON.parse(window.localStorage.getItem('connectedWallets') ?? '{}');

    if (previouslyConnectedWallets?.length) {
      const setWalletFromLocalStorage = async () => {
        await connect({ autoSelect: { label: previouslyConnectedWallets[0], disableModals: true } });
      };

      setWalletFromLocalStorage();
    }
  }, [connect]);

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

  const sendTransaction = async () => {
    let ethersProvider;

    if (wallet) {
      ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any');

      const signer = ethersProvider.getSigner();

      // send a transaction with the ethers provider
      const txn = await signer.sendTransaction({
        to: '0x',
        value: 100000000000000
      });

      const receipt = await txn.wait();
      console.log(receipt);
    }
  };

  const value: OnboardContextType = {
    sendTransaction,
    signOut,
    signIn,
    isConnecting,
    wallet,
    chainId,
    setChainId
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
