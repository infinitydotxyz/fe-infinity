/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Tab } from '@headlessui/react';
import Layout from 'src/components/analytics/layout';

export const Analytics = () => {
  const styles = {
    layout: {
      title: 'Analytics'
    },
    container: {
      className: `
        w-full h-full overflow-hidden
        bg-theme-light-50
        grid grid-rows-24 grid-cols-24 divide-y-1 divide-theme-light-900
      `
    },
    heading: {
      container: {
        className: `
          w-full h-full overflow-hidden
          bg-theme-light-50
          row-start-1 col-start-1 row-span-8 col-span-24
        `
      }
    },
    options: {
      container: {
        className: `
          w-full h-full overflow-hidden
          bg-theme-light-50
          row-start-9 col-start-1 row-span-2 col-span-24
          grid grid-rows-1 grid-cols-24 divide-y-1 divide-theme-light-900
        `
      },
      timeframes: {
        container: {
          className: `
            w-full h-full overflow-hidden
            bg-theme-light-50
            row-start-1 col-start-1 row-span-1 col-span-12
          `
        }
      },
      actions: {
        container: {
          className: `
            w-full h-full overflow-hidden
            bg-theme-light-50
            row-start-1 col-start-13 row-span-1 col-span-12
          `
        }
      }
    },
    statistics: {
      container: {
        className: `
          w-full h-full overflow-hidden
          bg-theme-light-50
          row-start-11 col-start-1 row-span-14 col-span-24
        `
      }
    }
  };

  return (
    <>
      <Layout {...styles?.layout}>
        <div {...styles?.container}>
          <div {...styles?.heading?.container}></div>
          <div {...styles?.options?.container}>
            <div {...styles?.options?.timeframes?.container}></div>
            <div {...styles?.options?.actions?.container}></div>
          </div>
          <div {...styles?.statistics?.container}></div>
        </div>
      </Layout>
    </>
  );
};

export default Analytics;
