import * as gtag from 'lib/ga/gtag';
import LogRocket from 'logrocket';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { memo, StrictMode, useEffect } from 'react';
import { Layout } from 'src/components/astra/layout';
import 'src/settings/tailwind/globals.scss';
import { isLocalhost } from 'src/utils/common-utils';
import { AppContextProvider } from 'src/utils/context/AppContext';
import { OnboardContextProvider } from 'src/utils/context/OnboardContext/OnboardContext';

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
      <OnboardContextProvider>
        <AppContextProvider>
          <AppBody {...props} />
        </AppContextProvider>
      </OnboardContextProvider>
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
  return (
    <ThemeProvider attribute="class">
      <Memoized {...props} />
    </ThemeProvider>
  );
};

export default App;
