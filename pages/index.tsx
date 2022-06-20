import React, { useEffect } from 'react';
import Router from 'next/router';
import { isLocalhost } from 'src/utils';

const Home = () => {
  useEffect(() => {
    const { pathname } = Router;
    if (pathname === '/') {
      void Router.push(isLocalhost() ? '/test' : '/trending'); // analytics/trending/weekly
    }
  });

  return <></>;
};

export default Home;
