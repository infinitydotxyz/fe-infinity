/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import Layout from 'src/components/analytics/layout';

export const Analytics = () => {
  const styles = {
    layout: {
      title: 'Analytics'
    },
    container: {
      className: `
        w-full h-full overflow-hidden
        bg-black
      `
    }
  };

  return (
    <>
      <Layout {...styles?.layout}>
        <div {...styles?.container}></div>
      </Layout>
    </>
  );
};

export default Analytics;
