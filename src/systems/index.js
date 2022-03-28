/*
  ======================================
    This components collects all providers
    of various systems and applies them
    at the root of the application so that
    you can use them anywhere inside the tree.
  ======================================
*/
import React from 'react';
import Application from './application';

/*
  ======================================
    Uncomment following lines to allow
    Xstate inspector to popup and show
    the visualizer.
  ======================================
*/

import { inspect } from '@xstate/inspect';
if (typeof window !== 'undefined') {
  inspect({ iframe: false });
}

export const Systems = ({ children }) => {
  return (
    <>
      <Application.Provider>{children}</Application.Provider>
    </>
  );
};

export default Systems;
