import { lazy } from 'react';
import { RouteObject } from 'react-router';
import { Loadable } from 'src/components/loadable';

// Authentication pages
const NotFound = Loadable(lazy(() => import('./pages/not-found')));
const MarketPage = Loadable(lazy(() => import('./pages/market')));

// App pages

const getRoutes = (): RouteObject[] => [
  {
    path: '/',
    element: <MarketPage />
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
