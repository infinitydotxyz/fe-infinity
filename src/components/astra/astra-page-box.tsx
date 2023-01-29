import React from 'react';
import { Header, Spacer } from 'src/components/common';
import { textColor } from 'src/utils/ui-constants';
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

// used in the Header
export const pageStyles = 'mx-auto desktop:w-5/6 desktop-sm:w-[95%] tabloid:w-[95%] mobile:w-[98%]';

export const APageBox = ({
  children,
  title,
  showTitle = true,
  className = '',
  rightToolbar,
  footer
}: Props): JSX.Element => {
  return (
    <div
      className={twMerge(
        textColor,
        'transition px-4 w-full h-full flex flex-col overflow-y-clip overflow-x-clip',
        className
      )}
    >
      <Header title={title} />

      {showTitle ? <APageHeader title={title} rightToolbar={rightToolbar} /> : null}

      {children}
      {footer}
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
      <div className={twMerge(textColor, 'font-heading font-bold text-3xl tracking-tight mt-4 mb-8')}>{title}</div>

      {rightToolbar && (
        <>
          <Spacer />
          <div>{rightToolbar}</div>
        </>
      )}
    </div>
  );
};
