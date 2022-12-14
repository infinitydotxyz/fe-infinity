import React, { useEffect, useState } from 'react';
import { Spacer, Header } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { isPasswordModalNeeded, PasswordModal } from './password-modal';

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
  extraSpaceAtBottom?: boolean;
}

export const PageBox = ({
  children,
  title,
  showTitle = true,
  className = '',
  footer,
  rightToolbar,
  scroll = true,
  extraSpaceAtBottom = true
}: Props): JSX.Element => {
  const [renderPasswordModal, setRenderPasswordModal] = useState(false);

  useEffect(() => {
    setRenderPasswordModal(isPasswordModalNeeded());
  }, []);

  return (
    <div
      className={twMerge(
        'transition justify-items-center overflow-x-clip',
        scroll ? 'overflow-y-auto' : 'overflow-y-clip'
      )}
    >
      {renderPasswordModal ? (
        <PasswordModal isOpen={true} onClose={() => console.log} />
      ) : (
        <>
          <Header title={title} />

          <div className="transition w-full">
            {showTitle ? <PageHeader title={title} rightToolbar={rightToolbar} /> : null}

            <div className={`w-full ${className}`}>{children}</div>

            {/* allows scroll so items aren't at the bottom of the screen  */}
            {extraSpaceAtBottom && <div className="shrink-0" style={{ height: 200 }} />}
          </div>

          {footer}
        </>
      )}
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
      <div className="font-medium text-5xl tracking-tight mt-4 mb-8">{title}</div>

      {rightToolbar && (
        <>
          <Spacer />
          <div>{rightToolbar}</div>
        </>
      )}
    </div>
  );
};
