import React, { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from 'react';
import { getCustomExceptionMsg } from 'src/utils/commonUtils';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Preferences } from '../preferences';

export type User = {
  address: string;
  username?: string;
};

export type AppContextType = {
  showAppError: (msg: string) => void;
  showAppMessage: (msg: string) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = (props: PropsWithChildren<unknown>) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(Preferences.darkMode());
  }, []);

  useEffect(() => {
    Preferences.setDarkMode(darkMode);
  }, [darkMode]);

  const showAppError = (message: ReactNode) => {
    getCustomExceptionMsg(message);
  };

  const showAppMessage = (message: ReactNode) => message;

  const value: AppContextType = {
    showAppError,
    showAppMessage,
    darkMode,
    setDarkMode
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
  return useContext(AppContext) as AppContextType;
};
