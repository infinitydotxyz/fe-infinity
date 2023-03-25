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
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import NProgress from 'nprogress'; //nprogress module
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

const alchemyApiKeyMainnet = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MAINNET ?? '';
const alchemyApiKeyGoerli = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_GOERLI ?? '';
const supportedChains = [mainnet, goerli];
const { chains, provider } = configureChains(supportedChains, [
  jsonRpcProvider({
    rpc: (chain) => {
      if (chain === goerli) {
        return { http: `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKeyGoerli}` };
      } else if (chain === mainnet) {
        return { http: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKeyMainnet}` };
      } else {
        throw Error('Unsupported chain');
      }
    }
  })
]);

const client = createClient(
  getDefaultClient({
    appName: 'Flow',
    chains: supportedChains,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({ chains, options: { appName: 'Flow' } }),
      new WalletConnectConnector({ chains, options: {} })
    ],
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
          options={{ initialChainId: 0 }}
          customTheme={{
            '--ck-font-family': '"DM Sans"'
          }}
        >
          <CartContextProvider>
            <AppContextProvider>
              <AppBody {...props} />
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
