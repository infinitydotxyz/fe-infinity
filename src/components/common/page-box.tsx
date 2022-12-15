import React from 'react';
import { Spacer, Header } from 'src/components/common';
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

// used in the Header
export const pageStyles = 'mx-auto desktop:w-5/6 desktop-sm:w-[95%] tabloid:w-[95%] mobile:w-[98%]';

interface Props {
  children?: React.ReactNode;
  title: string;
  showTitle?: boolean;
  className?: string;
  fullWidth?: boolean;
  rightToolbar?: JSX.Element;
  footer?: JSX.Element;
  scroll?: boolean;
}

export const PageBox = ({
  children,
  title,
  showTitle = true,
  className = '',
  footer,
  rightToolbar,
  scroll = true
}: Props): JSX.Element => {
  return (
    <div
      className={twMerge(
        'transition justify-items-center overflow-x-clip',
        scroll ? 'overflow-y-auto' : 'overflow-y-clip'
      )}
    >
      <>
        <Header title={title} />

        <div className="transition w-full">
          {showTitle ? <PageHeader title={title} rightToolbar={rightToolbar} /> : null}

          <div className={`w-full ${className}`}>{children}</div>
        </div>

        {footer}
      </>
    </div>
  );
};

// ==================================================

type PageHeaderProps = {
  title?: string;
  rightToolbar?: JSX.Element;
};

export const PageHeader = ({ title, rightToolbar }: PageHeaderProps): JSX.Element => {
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
