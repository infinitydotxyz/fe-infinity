import React, { useEffect } from 'react';
import Router from 'next/router';

const Home = () => {
  useEffect(() => {
    const { pathname } = Router;
    if (pathname == '/') {
      void Router.push('/test');
    }
  });

  return <></>;
};

export default Home;
