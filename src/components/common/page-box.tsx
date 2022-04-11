import Head from 'next/head';
import React, { ReactElement, ReactNode } from 'react';
import { Spacer } from 'src/components/common';
import { useRouter } from 'next/router';
import { Header } from 'src/components/header/Header';

type Props = {
  title: string;
  titleElement?: ReactElement;
  rightSide?: JSX.Element;
  children?: ReactNode;
  center?: boolean;
  showConnect?: boolean;
  hideTitle?: boolean;
};

export const PageBox = ({
  title,
  titleElement,
  rightSide,
  children,
  center = true,
  showConnect = true,
  hideTitle = false
}: Props): JSX.Element => {
  let justify = 'items-start';

  if (center) {
    justify = 'items-center';
  }

  return (
    <div className={`flex flex-col ${justify}`}>
      <Head>
        <title>{title} | Infinity</title>
        <meta name="description" content="Infinity NFT marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {showConnect && <Header />}

      <div className="flex flex-col w-full max-w-screen-2xl px-6 lg:px-8 xl:px-10">
        {!hideTitle && <PageHeader title={titleElement || title} rightSide={rightSide} />}

        <main>{children}</main>
      </div>
    </div>
  );
};

// ==================================================

type PageHeaderProps = {
  title: ReactElement | string;
  rightSide?: JSX.Element;
};

export const PageHeader = ({ title, rightSide }: PageHeaderProps): JSX.Element => {
  const router = useRouter();

  return (
    <div className="flex flex-row">
      <div
        className="mb-6 text-7xl font-medium cursor-pointer"
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
