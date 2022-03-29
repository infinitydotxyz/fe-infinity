import Head from 'next/head';
import React, { ReactNode } from 'react';
import { Spacer } from 'src/components/common';
import { useRouter } from 'next/router';
import Header from 'src/components/header/Header';

type Props = {
  title: string;
  rightSide?: JSX.Element;
  children?: ReactNode;
  center?: boolean;
  showConnect?: boolean;
};

export const PageBox = ({ title, rightSide, children, center = true, showConnect = true }: Props): JSX.Element => {
  let justify = 'items-start';

  if (center) {
    justify = 'items-center';
  }

  return (
    <div className={`flex flex-col  ${justify} m-4`}>
      <Head>
        <title>{title} | Infinity</title>
        <meta name="description" content="Infinity NFT marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {showConnect && (
        <>
          <Header />
          <div style={{ height: '99px' }} />
        </>
      )}

      <div className="flex flex-col w-full m-4 max-w-screen-md">
        <PageHeader title={title} rightSide={rightSide} />

        <main>{children}</main>
      </div>
    </div>
  );
};

// ==================================================

type PageHeaderProps = {
  title: string;
  rightSide?: JSX.Element;
};

export const PageHeader = ({ title, rightSide }: PageHeaderProps): JSX.Element => {
  const router = useRouter();

  return (
    <div className="flex flex-row">
      <div
        className="mb-6 text-4xl  font-medium cursor-pointer"
        onClick={() => {
          router.push('/');
        }}
      >
        {title}
      </div>

      {rightSide && (
        <>
          <Spacer />
          <div>{rightSide}</div>
        </>
      )}
    </div>
  );
};
