/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import * as gtag from 'lib/ga/gtag';
import LogRocket from 'logrocket';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Router, useRouter } from 'next/router';
import { memo, StrictMode, useEffect } from 'react';
import { Layout } from 'src/components/astra/layout';
import 'src/settings/tailwind/globals.scss';
import { isLocalhost } from 'src/utils/common-utils';
import { AppContextProvider } from 'src/utils/context/AppContext';
import { CartContextProvider } from 'src/utils/context/CartContext';

import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import NProgress from 'nprogress'; //nprogress module
import '../styles/nprogress.css'; //styles of nprogress
import { BetaProvider } from 'src/utils/context/BetaContext';
import { WagmiConfig, configureChains, createClient, goerli, mainnet } from 'wagmi';
NProgress.configure({ showSpinner: false });

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const isProduction = process.env.NODE_ENV === 'production';

if (!isLocalhost()) {
  LogRocket.init('0pu9ak/nftco');
}

const alchemyApiKeyMainnet = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MAINNET ?? '';
const alchemyApiKeyGoerli = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_GOERLI ?? '';
const supportedChains = [mainnet, goerli];
const { chains, provider } = configureChains(supportedChains, [
  jsonRpcProvider({
    rpc: (chain) => {
      if (chain.id === goerli.id) {
        return { http: `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKeyGoerli}` };
      } else if (chain.id === mainnet.id) {
        return { http: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKeyMainnet}` };
      } else {
        throw new Error(`Unsupported chain ${chain?.id}`);
      }
    }
  })
]);

const client = createClient(
  getDefaultClient({
    appName: 'Flow',
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
            '--ck-font-family': '"DM Sans"'
          }}
        >
          <CartContextProvider>
            <AppContextProvider>
              <BetaProvider>
                <AppBody {...props} />
              </BetaProvider>
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
