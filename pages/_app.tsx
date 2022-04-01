import React, { FunctionComponent, memo, StrictMode, useEffect } from 'react';
import type { AppProps } from 'next/app';
import 'src/settings/theme/globals.scss';
import { useRouter } from 'next/router';
import LogRocket from 'logrocket';
import * as gtag from 'lib/ga/gtag';
import { isLocalhost } from 'src/utils/commonUtils';
import { AppContextProvider } from 'src/utils/context/AppContext';
import { FilterContextProvider } from 'src/utils/context/FilterContext';
import { useRouter } from 'next/router';
import { isLocalhost, isServer } from 'src/utils/commonUtils';
import LogRocket from 'logrocket';
import { OrderContextProvider } from 'src/utils/context/OrderContext';

/*
  ======================================
    Following constants are just memoized
    Page component (optimizations) and variable describing
    whether the environment is production
    or localhost (required for ga tracking).
  ======================================
*/
const Page: FunctionComponent<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />;
const Memoized = memo(Page, (p, n) => p.Component === n.Component && p.pageProps === n.pageProps);
const isProduction = process.env.NODE_ENV === 'production';

if (!isLocalhost()) {
  LogRocket.init('0pu9ak/nftco');
}

const App: FunctionComponent<AppProps> = (props) => {
  /*
    ======================================
      For every route change in production,
      we inject google analytics tracker.
    ======================================
  */
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: URL) => (isProduction ? gtag.pageview(url) : null);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  /*
    ======================================
      Minor optimizations:
      - Disable SSR (check if window is defined).
      - Memoize Page component.
      Additionally: Wrap up the entire thing
      within context providers.
    ======================================
  */
  return isServer() ? null : (
    <StrictMode>
      <AppContextProvider>
        <FilterContextProvider>
          <OrderContextProvider>
            <Memoized {...props} />
          </OrderContextProvider>
        </FilterContextProvider>
      </AppContextProvider>
    </StrictMode>
  );
};

export default App;
