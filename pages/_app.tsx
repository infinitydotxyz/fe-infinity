import LogRocket from 'logrocket';
import * as gtag from 'lib/ga/gtag';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import 'src/settings/theme/globals.scss';
import { isLocalhost } from 'src/utils/commonUtils';
import { OnboardContextProvider } from 'src/utils/OnboardContext/OnboardContext';
import { OrderContextProvider } from 'src/utils/context/OrderContext';
import { FilterContextProvider } from 'src/utils/context/FilterContext';
import React, { memo, StrictMode, useEffect } from 'react';
import { DrawerContextProvider } from 'src/utils/context/DrawerContext';
import { CurationBulkVoteContextProvider } from 'src/utils/context/CurationBulkVoteContext';
import { AppContextProvider, useAppContext } from 'src/utils/context/AppContext';
import { DashboardContextProvider } from 'src/utils/context/DashboardContext';
import { twMerge } from 'tailwind-merge';
import { Layout } from 'src/components/astra/layout';

const isProduction = process.env.NODE_ENV === 'production';

if (!isLocalhost()) {
  LogRocket.init('0pu9ak/nftco');
}

const App = (props: AppProps) => {
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
      <AppContextProvider>
        <OnboardContextProvider>
          <FilterContextProvider>
            <OrderContextProvider>
              <DashboardContextProvider>
                <DrawerContextProvider>
                  <CurationBulkVoteContextProvider>
                    <AppBody {...props} />
                  </CurationBulkVoteContextProvider>
                </DrawerContextProvider>
              </DashboardContextProvider>
            </OrderContextProvider>
          </FilterContextProvider>
        </OnboardContextProvider>
      </AppContextProvider>
    </StrictMode>
  );
};

// ======================================================================

const Page = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

const Memoized = memo(Page, (p, n) => p.Component === n.Component && p.pageProps === n.pageProps);

const AppBody = (props: AppProps) => {
  const { darkMode } = useAppContext();

  return (
    <div className={twMerge(darkMode ? 'dark' : 'light', darkMode ? 'bg-neutral-900' : 'bg-white')}>
      <Memoized {...props} />
    </div>
  );
};

export default App;
