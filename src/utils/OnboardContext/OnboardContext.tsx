/* eslint-disable @typescript-eslint/no-explicit-any */
import { WalletState } from '@web3-onboard/core';
import { useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react';
import { ethers, Signature } from 'ethers';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { UserProfileDto } from '@infinityxyz/lib-frontend/types/dto/user';
import { apiGet } from '../apiUtils';
import { setupOnboard } from './setup-onboard';
import { User } from '../context/AppContext';
import { OnboardAuthProvider } from './OnboardAuthProvider';
import { WalletSigner } from './WalletSigner';
import { OnboardEmitter } from './OnboardEmitter';
import { Modal, toastWarning } from 'src/components/common';
import { PleaseConnectMsg } from '../commonUtils';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { JSONRPCRequestPayload, JSONRPCResponsePayload, ProviderEvents } from './UserRejectException';

setupOnboard();

export type OnboardContextType = {
  signIn: () => void;
  signOut: () => void;
  isConnecting: boolean;
  wallet: WalletState | null;
  chainId: string;
  setChainId: (chainId: string) => void;
  user: User | null;
  signMessage: (message: string) => Promise<Signature | undefined>;
  getSigner: () => ethers.providers.JsonRpcSigner | undefined;
  request: (request: JSONRPCRequestPayload) => Promise<JSONRPCResponsePayload | undefined>;
  checkSignedIn: () => boolean;
  waitForTransaction: (txHash: string, callback: (receipt: TransactionReceipt | undefined) => void) => void;
  getEthersProvider: () => ethers.providers.Web3Provider | undefined;
};

const OnboardContext = React.createContext<OnboardContextType | null>(null);

export const OnboardContextProvider = (props: React.PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<User | null>(null);
  const [showUserUpdatedDialog, setShowUserUpdatedDialog] = useState(false);

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
    updateWallet();
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

  const updateWallet = async () => {
    if (OnboardEmitter.isUserAddressChanging(userAddress())) {
      if (wallet) {
        if (!document.hasFocus()) {
          setShowUserUpdatedDialog(true);

          return;
        }
      }
    }

    // keep OnboardAuthProvider in sync
    if (wallet) {
      const walletSigner = new WalletSigner(wallet);
      await OnboardAuthProvider.updateWalletSigner(walletSigner);

      setUser({ address: userAddress() });

      await updateUserInfo(userAddress());
    } else {
      await OnboardAuthProvider.updateWalletSigner(null);
      setUser(null);
    }

    OnboardEmitter.updateUserAddress(userAddress());
  };

  const userAddress = (): string => {
    if (wallet && wallet?.accounts.length > 0) {
      return wallet?.accounts[0].address;
    }

    return '';
  };

  // connectedChain.id is stored 0x1
  const convertHexToDecString = (hex: string) => {
    const dec = parseInt(hex, 16);

    return dec.toString();
  };

  const chainId = convertHexToDecString(connectedChain?.id ?? '0x1');
  const isConnecting = connecting;

  const setChainId = (chainId: string) => {
    setChain({ chainId });
  };

  const signIn = () => {
    connect();
  };

  const signOut = () => {
    if (wallet) {
      disconnect(wallet);
      window.localStorage.removeItem('connectedWallets');
    }
  };

  const checkSignedIn = () => {
    if (!userAddress()) {
      toastWarning(<PleaseConnectMsg />);
      return false;
    }
    return true;
  };

  const getSigner = (): ethers.providers.JsonRpcSigner | undefined => {
    if (wallet) {
      const walletSigner = new WalletSigner(wallet);

      return walletSigner.getSigner();
    }
  };

  const getEthersProvider = (): ethers.providers.Web3Provider | undefined => {
    if (wallet) {
      const walletSigner = new WalletSigner(wallet);

      return walletSigner.getEthersProvider();
    }
  };

  const signMessage = (message: string): Promise<Signature | undefined> => {
    if (wallet) {
      const walletSigner = new WalletSigner(wallet);

      return walletSigner.signMessage(message);
    }

    return Promise.resolve(undefined);
  };

  const request = async (request: JSONRPCRequestPayload): Promise<JSONRPCResponsePayload | undefined> => {
    if (wallet) {
      const walletSigner = new WalletSigner(wallet);

      const response = await walletSigner.getEthersProvider().send(request.method, request.params);

      return { result: response, id: request?.id ?? '', jsonrpc: request?.jsonrpc ?? '' };
    }
  };

  const waitForTransaction = async (txHash: string, callback: (receipt: TransactionReceipt | undefined) => void) => {
    if (wallet) {
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any');

      const receipt = await ethersProvider.waitForTransaction(txHash);
      callback(receipt);
    } else {
      callback(undefined);
    }
  };

  const updateUserInfo = async (address: string) => {
    const { result, error } = await apiGet(`/user/${address}`);
    if (!error) {
      const userInfo = result as UserProfileDto;
      setUser({ address: address, username: userInfo.username });
    }
  };

  // ===========================================================
  // event handlers

  const handleChainChange = () => {
    // window.location.reload();
  };

  const handleAccountChange = async () => {
    // window.location.reload();
  };

  const onConnect = () => {
    // nothing
  };

  const onDisconnect = () => {
    OnboardAuthProvider.clear();
  };

  // ===========================================================

  const value: OnboardContextType = {
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
    waitForTransaction,
    getEthersProvider
  };

  return (
    <OnboardContext.Provider value={value} {...props}>
      {props.children}

      <UserChangedModel
        isOpen={showUserUpdatedDialog}
        onClose={() => {
          setShowUserUpdatedDialog(false);

          return updateWallet();
        }}
        userAddress={WalletSigner.addressForWallet(wallet)}
      />
    </OnboardContext.Provider>
  );
};

export const useOnboardContext = (): OnboardContextType => {
  return React.useContext(OnboardContext) as OnboardContextType;
};

// ===================================================================================

interface Props {
  isOpen: boolean;
  userAddress: string;
  onClose: () => void;
}

export const UserChangedModel = ({ userAddress, isOpen, onClose }: Props) => {
  const onOKButton = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      okButton="Continue"
      cancelButton=""
      title="You switched account to"
      onOKButton={onOKButton}
    >
      <div className={`mt-4 p-2 flex flex-col w-full overflow-y-auto overflow-x-clip`}>{userAddress}</div>
    </Modal>
  );
};
