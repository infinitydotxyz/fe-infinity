import 'src/settings/theme/globals.scss';
import type { AppProps } from 'next/app';
import React, { FunctionComponent, StrictMode, useEffect } from 'react';
import * as gtag from 'lib/ga/gtag';
const isProduction = process.env.NODE_ENV === 'production';
import { AppContextProvider } from 'src/utils/context/AppContext';
import { FilterContextProvider } from 'src/utils/context/FilterContext';
import { useRouter } from 'next/router';
import { isLocalhost } from 'src/utils/commonUtils';
import LogRocket from 'logrocket';
import { OrderContextProvider } from 'src/utils/context/OrderContext';

if (!isLocalhost()) {
  LogRocket.init('0pu9ak/nftco');
}

const App: FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      /* invoke analytics function only for production */
      if (isProduction) {
        gtag.pageview(url);
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return typeof window === 'undefined' ? null : (
    <StrictMode>
      <AppContextProvider>
        <FilterContextProvider>
          <OrderContextProvider>
            <Component {...pageProps} />
          </OrderContextProvider>
        </FilterContextProvider>
      </AppContextProvider>
    </StrictMode>
  );
};

export default App;
