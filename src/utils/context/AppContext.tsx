import * as React from 'react';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { getCustomExceptionMsg } from 'src/utils/commonUtils';
import { ProviderEvents, WalletType } from 'src/utils/providers/AbstractProvider';
import { UserRejectException } from 'src/utils/providers/UserRejectException';
import { ProviderManager } from 'src/utils/providers/ProviderManager';
import { toastWarning } from 'src/components/common';
import { apiGet } from '../apiUtils';
import { UserProfileDto } from 'src/components/user/user-profile-dto';
import { PleaseConnectMsg } from '..';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type User = {
  address: string;
  username?: string;
};

export type AppContextType = {
  user: User | null;
  signOut: () => void;
  checkSignedIn: () => boolean;
  userReady: boolean;
  chainId: string;
  showAppError: (msg: string) => void;
  showAppMessage: (msg: string) => void;
  headerPosition: number;
  setHeaderPosition: (bottom: number) => void;
  connectWallet: (walletType: WalletType) => Promise<void>;
  providerManager?: ProviderManager;
  waitForTransaction: (txHash: string, callback: (receipt: TransactionReceipt | undefined) => void) => void;
};

const AppContext = React.createContext<AppContextType | null>(null);

export const AppContextProvider = (props: React.PropsWithChildren<unknown>) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [userReady, setUserReady] = React.useState(false);
  const [chainId, setChainId] = React.useState('1');
  const [headerPosition, setHeaderPosition] = React.useState(0);
  const showAppError = (message: React.ReactNode) => {
    getCustomExceptionMsg(message);
  };
  const [providerManager, setProviderManager] = React.useState<ProviderManager | undefined>();
  const provider = providerManager?.getEthersProvider();

  const showAppMessage = (message: React.ReactNode) => message;

  React.useEffect(() => {
    // check & set logged in user:
    let isActive = true;
    ProviderManager.getInstance().then(async (providerManagerInstance) => {
      if (isActive) {
        setProviderManager(providerManagerInstance);
        const isLoggedIn = providerManagerInstance.isLoggedInAndAuthenticated;
        if (isLoggedIn) {
          const address = providerManagerInstance.account;
          setUser({ address });
          const chainIdNew = providerManagerInstance.chainId ?? 1;
          setChainId(`${chainIdNew}`);
          await fetchUserInfo(address);
        }
        setUserReady(true);
      }
    });
    return () => {
      isActive = false;
    };
  }, []);

  const connectWallet = async (walletType: WalletType) => {
    if (providerManager?.connectWallet) {
      try {
        await providerManager.connectWallet(walletType);
        await providerManager.signIn();
        const address = providerManager.account ?? '';
        setUser({ address });
        const chainIdNew = providerManager.chainId ?? 1;
        setChainId(`${chainIdNew}`);
        await fetchUserInfo(address);
        setUserReady(true);
      } catch (err: Error | unknown) {
        console.error(err);
        if (err instanceof UserRejectException) {
          showAppError(err.message);
        }

        setUserReady(true);
      }
    } else {
      console.log(`Provider not ready yet`);
    }
  };

  const fetchUserInfo = async (userAddress: string) => {
    const { result, error } = await apiGet(`/user/${userAddress}`);
    if (!error) {
      const userInfo = result as UserProfileDto;
      const _user = { address: userAddress, username: userInfo.username };
      setUser(_user);
    }
  };

  React.useEffect(() => {
    const handleNetworkChange = () => {
      setChainId(`${chainId}`);
      window.location.reload();
    };

    let isChangingAccount = false;
    const handleAccountChange = async () => {
      isChangingAccount = true;
      window.onfocus = async () => {
        if (isChangingAccount) {
          setTimeout(async () => {
            isChangingAccount = false;
            try {
              await providerManager?.signIn();
              setUser({ address: providerManager?.account ?? '' });
              const chainIdNew = providerManager?.chainId ?? 1;
              setChainId(`${chainIdNew}`);
            } catch (err) {
              if (err instanceof UserRejectException) {
                showAppError(err.message);
                return;
              }
              console.error(err);
            }
            window.location.reload();
          }, 500);
        }
      };
    };

    const onConnect = () => {
      return;
    };

    const onDisconnect = () => {
      signOut();
    };

    if (providerManager) {
      providerManager.on(ProviderEvents.AccountsChanged, handleAccountChange);
      providerManager.on(ProviderEvents.ChainChanged, handleNetworkChange);
      providerManager.on(ProviderEvents.Connect, onConnect);
      providerManager.on(ProviderEvents.Disconnect, onDisconnect);
    }

    return () => {
      providerManager?.removeListener?.(ProviderEvents.AccountsChanged, handleAccountChange);
      providerManager?.removeListener?.(ProviderEvents.ChainChanged, handleNetworkChange);
      providerManager?.removeListener?.(ProviderEvents.Connect, onConnect);
      providerManager?.removeListener?.(ProviderEvents.Disconnect, onDisconnect);
    };
  }, [providerManager]);

  const signOut = async (): Promise<void> => {
    setUser(null);
    providerManager?.disconnect();
    window.location.reload();
  };

  const checkSignedIn = () => {
    if (!user?.address) {
      toastWarning(<PleaseConnectMsg />);
      return false;
    }
    return true;
  };

  const waitForTransaction = async (txHash: string, callback: (receipt: TransactionReceipt | undefined) => void) => {
    const receipt = await provider?.waitForTransaction(txHash);
    callback(receipt);
  };

  const value: AppContextType = {
    user,
    signOut,
    checkSignedIn,
    userReady,
    chainId,
    showAppError,
    showAppMessage,
    headerPosition,
    setHeaderPosition,
    connectWallet,
    providerManager,
    waitForTransaction
  };

  return (
    <AppContext.Provider value={value} {...props}>
      {props.children}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        progressClassName="toastify-custom-progress-bar"
      />
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  return React.useContext(AppContext) as AppContextType;
};
