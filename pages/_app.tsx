import '../styles/globals.css';

import type { AppProps } from 'next/app';
import React, { ComponentType, createElement, FunctionComponent, memo, StrictMode, useEffect } from 'react';
import * as gtag from '../lib/ga/gtag';
const isProduction = process.env.NODE_ENV === 'production';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from 'src/utils/context/AppContext';
import { FilterContextProvider } from 'src/utils/context/FilterContext';
import { useRouter } from 'next/router';
import { isLocalhost } from 'src/utils/commonUtil';
import LogRocket from 'logrocket';

const providers: readonly ComponentType[] = [BrowserRouter];

const PageComponent: FunctionComponent<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />;

const MemoizedComponent = memo(PageComponent, (p, n) => p.Component === n.Component && p.pageProps === n.pageProps);

if (!isLocalhost()) {
  LogRocket.init('0pu9ak/nftco');
}

const App: FunctionComponent<AppProps> = (props) => {
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
      {providers.reduceRight(
        (children, provider) => createElement(provider, undefined, children),
        <AppContextProvider>
          <FilterContextProvider>
            <MemoizedComponent {...props} />
          </FilterContextProvider>
        </AppContextProvider>
      )}
    </StrictMode>
  );
};

export default App;
