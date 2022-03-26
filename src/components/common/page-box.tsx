import Head from 'next/head';
import React, { ReactElement } from 'react';
import { Spacer } from 'src/components/common';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';

type Props = {
  title: string;
  rightSide?: JSX.Element;
  children?: ReactElement | ReactElement[] | string;
  className?: string;
};

export const PageBox = ({ title, rightSide, children, className }: Props): JSX.Element => {
  return (
    <div className={twMerge(`flex flex-row justify-center m-4 ${className ?? ''}`)}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Infinity NFT marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
