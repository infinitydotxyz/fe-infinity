import React, { useEffect } from 'react';
import NProgress from 'nprogress';

export const LoadingScreen: React.FC = () => {
  useEffect(() => {
    NProgress.start();

    return (): void => {
      NProgress.done();
    };
  }, []);

  return <div className="h-full" />;
};
