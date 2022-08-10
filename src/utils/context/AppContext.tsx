import * as React from 'react';
import { getCustomExceptionMsg } from 'src/utils/commonUtils';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type User = {
  address: string;
  username?: string;
};

export type AppContextType = {
  showAppError: (msg: string) => void;
  showAppMessage: (msg: string) => void;
  headerPosition: number;
  setHeaderPosition: (bottom: number) => void;
};

const AppContext = React.createContext<AppContextType | null>(null);

export const AppContextProvider = (props: React.PropsWithChildren<unknown>) => {
  const [headerPosition, setHeaderPosition] = React.useState(0);
  const showAppError = (message: React.ReactNode) => {
    getCustomExceptionMsg(message);
  };

  const showAppMessage = (message: React.ReactNode) => message;

  const value: AppContextType = {
    showAppError,
    showAppMessage,
    headerPosition,
    setHeaderPosition
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
