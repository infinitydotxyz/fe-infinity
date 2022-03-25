import { Suspense, LazyExoticComponent, ReactElement, FC } from 'react';
import LoadingScreen from '@components/loading-screen';

export const Loadable = (Component: LazyExoticComponent<FC>) =>
  function Loadable(props: Record<string, unknown>): ReactElement {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
      </Suspense>
    );
  };
