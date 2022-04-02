import React from 'react';
import { Header } from 'src/components/analytics/header';
import { Navigation } from 'src/components/common/navbar';

interface Props {
  children?: React.ReactNode;
  title?: string;
}

export const Layout = React.forwardRef(({ children, title }: Props, ref) => {
  const styles = {
    header: {
      title: title
    },
    container: {
      className: `
        transition w-[100vw] h-[100vh] overflow-y-auto
        grid grid-rows-26 grid-cols-24
        justify-items-center
      `
    },
    content: {
      container: {
        className: `
          transition w-full h-full
          row-span-24 col-span-24
          bg-theme-light-50
          bg-theme-light-50
          grid place-items-center
        `
      }
    }
  };
  return (
    <>
      <div {...styles?.container}>
        <Header {...styles?.header} />
        <Navigation />
        <div {...styles?.content?.container}>{children}</div>
      </div>
    </>
  );
});
