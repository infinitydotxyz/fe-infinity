import React from 'react';
import System from 'src/systems/application';
import Header from 'src/components/analytics/header';
import Navigation from 'src/components/common/navbar';
import { useRouter } from 'next/router';

interface Props {
  children?: React.ReactNode;
  title?: string;
}

export const Layout = React.forwardRef(({ children, title, ...props }: Props, ref) => {
  const router = useRouter();
  const system = System.use();
  const { params } = router.query;
  const { state, settings, events } = system;
  const { theme, layout } = settings;

  const styles = {
    header: {
      title: title
    },
    container: {
      className: `
        transition w-full h-full overflow-y-scroll
        grid grid-rows-26 grid-cols-24
        justify-items-center
      `
    },
    content: {
      container: {
        className: `
          transition w-full h-full
          row-span-24 col-span-24
          ${theme.state.light && 'bg-theme-light-50'}
          ${theme.state.dark && 'bg-theme-light-50'}
          px-8 py-4 grid place-items-center
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

export default Layout;
