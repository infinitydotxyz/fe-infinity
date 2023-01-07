import * as gtag from 'lib/ga/gtag';
import LogRocket from 'logrocket';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { memo, StrictMode, useEffect } from 'react';
import { Layout } from 'src/components/astra/layout';
import 'src/settings/tailwind/globals.scss';
import { isLocalhost } from 'src/utils/commonUtils';
import { AppContextProvider, useAppContext } from 'src/utils/context/AppContext';
import { DashboardContextProvider } from 'src/utils/context/DashboardContext';
import { FilterContextProvider } from 'src/utils/context/FilterContext';
import { OnboardContextProvider } from 'src/utils/OnboardContext/OnboardContext';
import { twMerge } from 'tailwind-merge';

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
            <DashboardContextProvider>
              <AppBody {...props} />
            </DashboardContextProvider>
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
    <div className={twMerge(darkMode ? 'dark' : 'light')}>
      <Memoized {...props} />
    </div>
  );
};

export default App;
