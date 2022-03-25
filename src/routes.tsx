import { lazy } from 'react';
import { RouteObject } from 'react-router';
import { Loadable } from 'src/components/loadable';

// Authentication pages
const NotFound = Loadable(lazy(() => import('./pages/not-found')));

// App pages

const getRoutes = (): RouteObject[] => [
  {
    path: '/',
    element: <NotFound />
  },

  {
    path: '401',
    element: <NotFound />
  },
  {
    path: '404',
    element: <NotFound />
  },
  {
    path: '500',
    element: <NotFound />
  },
  {
    path: '*',
    element: <NotFound />
  }
];
export default getRoutes;
