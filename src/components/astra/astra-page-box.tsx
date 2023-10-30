import React from 'react';
import { Header, Spacer } from 'src/components/common';
import { textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  children?: React.ReactNode;
  title: string;
  subTitle?: string;
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
  subTitle = '',
  showTitle = true,
  className = '',
  rightToolbar,
  footer
}: Props): JSX.Element => {
  return (
    <div
      className={twMerge(
        textColor,
        'transition w-full h-full flex flex-col overflow-y-clip overflow-x-clip',
        className
      )}
    >
      <Header title={title} />

      {showTitle ? <APageHeader subTitle={subTitle} title={title} rightToolbar={rightToolbar} /> : null}

      {children}
      {footer}
    </div>
  );
};

// ==================================================

type Props2 = {
  title?: string;
  subTitle?: string;
  rightToolbar?: JSX.Element;
};

export const APageHeader = ({ title, rightToolbar, subTitle }: Props2): JSX.Element => {
  return (
    <div className="flex flex-row items-center py-15 px-5">
      {subTitle ? (
        <div className="flex flex-col justify-center w-full text-center md:text-left">
          <div className={twMerge(textColor, 'font-extrabold  text-35 h-10.5 tracking-tight dark:text-white')}>
            {title}
          </div>
          <div className="text-neutral-300 text-base font-medium">{subTitle}</div>
        </div>
      ) : (
        <div className={twMerge(textColor, 'font-extrabold  text-35 h-10.5 tracking-tight dark:text-white')}>
          {title}
        </div>
      )}

      {rightToolbar && (
        <>
          <Spacer />
          <div>{rightToolbar}</div>
        </>
      )}
    </div>
  );
};
