import React from 'react';
import { Header, Spacer } from 'src/components/common';
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  children?: React.ReactNode;
  title: string;
  showTitle?: boolean;
  className?: string;
  fullWidth?: boolean;
  rightToolbar?: JSX.Element;
  footer?: JSX.Element;
}

export const APageBox = ({ children, title, showTitle = true, className = '', rightToolbar }: Props): JSX.Element => {
  return (
    <div
      className={twMerge(
        textClr,
        'transition pl-6 w-full h-full flex flex-col overflow-y-clip overflow-x-clip',
        className
      )}
    >
      <Header title={title} />

      {showTitle ? <APageHeader title={title} rightToolbar={rightToolbar} /> : null}

      {children}
    </div>
  );
};

// ==================================================

type Props2 = {
  title?: string;
  rightToolbar?: JSX.Element;
};

export const APageHeader = ({ title, rightToolbar }: Props2): JSX.Element => {
  return (
    <div className="flex flex-row items-center">
      <div className={twMerge(textClr, 'font-medium text-5xl tracking-tight mt-4 mb-8')}>{title}</div>

      {rightToolbar && (
        <>
          <Spacer />
          <div>{rightToolbar}</div>
        </>
      )}
    </div>
  );
};
