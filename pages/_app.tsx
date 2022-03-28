import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import * as gtag from '../lib/ga/gtag';
const isProduction = process.env.NODE_ENV === 'production';
// import { ComponentType, createElement, FunctionComponent, memo, StrictMode } from 'react';
// import { BrowserRouter } from 'react-router-dom';

// const providers: readonly ComponentType[] = [BrowserRouter];

// const PageComponent: FunctionComponent<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />;

// const MemoizedComponent = memo(PageComponent, (p, n) => p.Component === n.Component && p.pageProps === n.pageProps);

// const App: FunctionComponent<AppProps> = (props) => {
//   return typeof window === 'undefined' ? null : (
//     <StrictMode>
//       {providers.reduceRight(
//         (children, provider) => createElement(provider, undefined, children),
//         <MemoizedComponent {...props} />
//       )}
//     </StrictMode>
//   );
// };

// export default App;

function MyApp({ Component, pageProps }: AppProps) {
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

  const getLayout = (Component as any).getLayout || ((page: NextPage) => page);
  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
