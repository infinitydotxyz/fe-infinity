import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import * as gtag from 'lib/ga/gtag';
import LogRocket from 'logrocket';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Router, useRouter } from 'next/router';
import { StrictMode, memo, useEffect } from 'react';
import { Layout } from 'src/components/astra/layout';
import 'src/settings/tailwind/globals.scss';
import { isLocalhost } from 'src/utils/common-utils';
import { AppContextProvider } from 'src/utils/context/AppContext';
import { CartContextProvider } from 'src/utils/context/CartContext';

import { publicProvider } from '@wagmi/core/providers/public';
import NProgress from 'nprogress'; //nprogress module
import { ProfileContextProvider } from 'src/utils/context/ProfileContext';
import { WagmiConfig, configureChains, createClient, mainnet } from 'wagmi';
import '../styles/nprogress.css'; //styles of nprogress
NProgress.configure({ showSpinner: false });

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const isProduction = process.env.NODE_ENV === 'production';

if (!isLocalhost()) {
  LogRocket.init('0pu9ak/nftco');
}

const supportedChains = [mainnet];
const { chains, provider } = configureChains(supportedChains, [publicProvider()]);

const client = createClient(
  getDefaultClient({
    appName: 'Pixelpack',
    chains: chains,
    provider
  })
);

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
      <WagmiConfig client={client}>
        <ConnectKitProvider
          options={{ initialChainId: 1 }}
          customTheme={{
            '--ck-font-family': '"Triplicate"'
          }}
        >
          <CartContextProvider>
            <AppContextProvider>
              <ProfileContextProvider>
                <AppBody {...props} />
              </ProfileContextProvider>
            </AppContextProvider>
          </CartContextProvider>
        </ConnectKitProvider>
      </WagmiConfig>
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
