import React, { FunctionComponent, useEffect } from 'react';
import Router from 'next/router';

const Home: FunctionComponent = () => {
  useEffect(() => {
    const { pathname } = Router;
    if (pathname == '/') {
      void Router.push('/test');
    }
  });

  return <></>;
};

export default Home;
