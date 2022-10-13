import React from 'react';
import Head from 'next/head';

interface Props {
  title?: string;
  children?: React.ReactNode;
}

export const Header = ({ title = 'Home', children }: Props) => {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content="Infinity NFT marketplace" />

        <title>{title ? `${title} | Infinity` : 'Infinity'}</title>

        {children}
      </Head>
    </>
  );
};
