import React, { useEffect } from 'react';
import NProgress from 'nprogress';

NProgress.configure({ easing: 'ease', speed: 500 });

export const LoadingScreen: React.FC = () => {
  useEffect(() => {
    NProgress.start();

    return (): void => {
      NProgress.done();
    };
  }, []);

  return <div className="h-full" />;
};
