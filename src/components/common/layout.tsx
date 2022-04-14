import React from 'react';
import { Header } from 'src/components/common/header';
import { Navbar } from 'src/components/common/navbar';

interface Props {
  children?: React.ReactNode;
  title?: string;
  className?: string;
  padded?: boolean;
}

export function Layout({ children, title, padded, className }: Props): JSX.Element {
  const styles = {
    header: {
      title: title
    },
    container: {
      className: `
        transition w-[100vw] h-[100vh] overflow-y-auto overflow-x-hidden
        grid grid-rows-26 grid-cols-24
        justify-items-center
      `
    },
    content: {
      container: {
        className: `
          transition ${
            padded ? 'desktop:w-5/6 desktop-sm:w-[95%] tabloid:w-[95%] mobile:w-[98%]' : 'w-full'
          } h-content min-h-full
          row-span-24 col-span-24
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
      <div {...styles?.container}>
        <Header {...styles?.header}>
          <Navbar />
          <div {...styles?.content?.container}>
            <div {...styles?.content?.element}>{children}</div>
          </div>
        </Header>
      </div>
    </>
  );
}

export default Layout;
