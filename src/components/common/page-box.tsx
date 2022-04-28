import { useRouter } from 'next/router';
import React from 'react';
import { Navbar, Spacer, Header } from 'src/components/common';

interface Props {
  children?: React.ReactNode;
  title: string;
  showTitle?: boolean;
  className?: string;
  fullWidth?: boolean;
  rightToolbar?: JSX.Element;
}

export function PageBox({ children, title, showTitle = true, fullWidth, className, rightToolbar }: Props): JSX.Element {
  const styles = {
    content: {
      container: {
        className: `
          transition ${
            fullWidth ? 'w-full' : 'desktop:w-5/6 desktop-sm:w-[95%] tabloid:w-[95%] mobile:w-[98%]'
          } h-content min-h-full
          row-span-1 col-span-24
        `
      },
      element: {
        className: `
          w-full h-content min-h-full
          ${className}
        `
      }
    }
  };
  return (
    <>
      <div
        className="transition w-[100vw] h-[100vh] overflow-y-auto overflow-x-hidden grid
        desktop-8k:grid-rows-[1fr,30fr]
        desktop-4k:grid-rows-[1fr,30fr]
        desktop-lg:grid-rows-[2fr,24fr]
        desktop-md:grid-rows-[2fr,24fr]
        desktop-sm:grid-rows-[2fr,24fr]
        tablet:grid-rows-[2fr,24fr]
        mobile:grid-rows-[2fr,24fr]
        grid-cols-24
        justify-items-center"
      >
        <Header title={title}>
          <Navbar />

          <div {...styles?.content?.container}>
            {showTitle ? <PageHeader title={title} rightToolbar={rightToolbar} /> : null}

            <div {...styles?.content?.element}>{children}</div>

            {/* allows scroll so items aren't at the bottom of the screen */}
            <div style={{ height: 300 }} />
          </div>
        </Header>
      </div>
    </>
  );
}

// ==================================================

type PageHeaderProps = {
  title?: string;
  rightToolbar?: JSX.Element;
};

export const PageHeader = ({ title, rightToolbar }: PageHeaderProps): JSX.Element => {
  const router = useRouter();

  return (
    <div className="flex flex-row items-center">
      <div
        className="font-medium cursor-pointer text-6xl tracking-tight mt-4 mb-8"
        onClick={() => {
          router.push('/');
        }}
      >
        {title}
      </div>

      {rightToolbar && (
        <>
          <Spacer />
          <div>{rightToolbar}</div>
        </>
      )}
    </div>
  );
};
