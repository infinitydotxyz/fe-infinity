import 'src/settings/theme/globals.scss';
import type { AppProps } from 'next/app';
import { ComponentType, createElement, FunctionComponent, memo, StrictMode } from 'react';
import Systems from 'src/systems';

const PageComponent: FunctionComponent<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />;

const MemoizedComponent = memo(PageComponent, (p, n) => p.Component === n.Component && p.pageProps === n.pageProps);

const App: FunctionComponent<AppProps> = (props) => {
  return typeof window === 'undefined' ? null : (
    <StrictMode>
      <Systems>
        <MemoizedComponent {...props} />
      </Systems>
    </StrictMode>
  );
};

export default App;
