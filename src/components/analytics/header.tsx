import React from 'react';
import Head from 'next/head';

interface Props {
  children?: React.ReactNode;
  title?: string;
}

export const Header = React.forwardRef(({ children, title = 'Home', ...props }: Props, ref) => {
  return (
    <Head>
      <link rel="shortcut icon" href="/favicon.svg" />
      <title>{title} | Infinity</title>
    </Head>
  );
});

export default Header;
