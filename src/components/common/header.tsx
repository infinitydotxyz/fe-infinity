import React from 'react';
import Head from 'next/head';

interface Props {
  title?: string;
}

export const Header = ({ title = 'Home' }: Props) => {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content="Pixelpack" />

        <title>{title ? `${title} | Pixelpack` : 'Pixelpack'}</title>
      </Head>
    </>
  );
};
