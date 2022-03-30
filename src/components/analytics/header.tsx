/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import Head from 'next/head';

interface Props {
  children?: React.ReactNode;
  title?: string;
}

export const Header = ({ children, title = 'Home', ...props }: Props) => {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <title>{title} | Infinity</title>
      </Head>
      {children}
    </>
  );
};

export default Header;
