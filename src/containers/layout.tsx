import React from 'react';
import { AppContextProvider } from 'src/utils/context/AppContext';
import Header from 'src/components/header/Header';
import { isLocalhost } from 'src/utils/commonUtil';
import LogRocket from 'logrocket';

if (!isLocalhost()) {
  LogRocket.init('0pu9ak/nftco');
}

interface IProps {
  children: any;
  landing?: boolean;
  connect?: boolean;
}

const Layout: React.FC<IProps> = ({ connect, children }: IProps) => {
  return (
    <>
      <AppContextProvider>
        {/* No header on connect page */}
        {!connect && <Header />}

        <main>{children}</main>
      </AppContextProvider>
    </>
  );
};

export default Layout;
