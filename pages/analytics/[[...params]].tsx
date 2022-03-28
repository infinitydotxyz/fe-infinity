import React from 'react';
import System from 'src/systems/application';
import Layout from 'src/components/analytics/layout';

export const Analytics = () => {
  const system = System.use();
  const { settings, events } = system;

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
      <Layout {...styles?.analytics}></Layout>
    </>
  );
};

export default Analytics;
