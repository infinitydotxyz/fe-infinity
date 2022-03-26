import { FunctionComponent, ReactNode } from 'react';
import Head from 'next/head';

export interface PageProps {
  title: string;
  children: ReactNode;
}

export const CommonHead: FunctionComponent<PageProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title} | Infinity</title>
      </Head>
      {children}
    </>
  );
};
