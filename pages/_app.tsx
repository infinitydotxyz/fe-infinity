import LogRocket from 'logrocket';
import * as gtag from 'lib/ga/gtag';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import 'src/settings/theme/globals.scss';
import { isLocalhost } from 'src/utils/commonUtils';
import { OnboardContextProvider } from 'src/utils/OnboardContext/OnboardContext';
import { OrderContextProvider } from 'src/utils/context/OrderContext';
import { FilterContextProvider } from 'src/utils/context/FilterContext';
import React, { FunctionComponent, memo, StrictMode, useEffect } from 'react';
import { DrawerContextProvider } from 'src/utils/context/DrawerContext';
import { CurationBulkVoteContextProvider } from 'src/utils/context/CurationBulkVoteContext';

const Page: FunctionComponent<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />;
const Memoized = memo(Page, (p, n) => p.Component === n.Component && p.pageProps === n.pageProps);
const isProduction = process.env.NODE_ENV === 'production';

if (!isLocalhost()) {
  LogRocket.init('0pu9ak/nftco');
}

const App: FunctionComponent<AppProps> = (props) => {
  // For every route change in production,
  // we inject google analytics tracker.
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => (isProduction ? gtag.pageview(url) : null);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    <StrictMode>
      <OnboardContextProvider>
        <FilterContextProvider>
          <OrderContextProvider>
            <DrawerContextProvider>
              <CurationBulkVoteContextProvider>
                <Memoized {...props} />
              </CurationBulkVoteContextProvider>
            </DrawerContextProvider>
          </OrderContextProvider>
        </FilterContextProvider>
      </OnboardContextProvider>
    </StrictMode>
  );
};

export default App;
