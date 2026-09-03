import { Outlet, RouteObject } from 'react-router-dom';
import { DisabledModule } from './pages/DisabledModule';

export type ModuleRoutesParams = {
  module: { unitId: string; module: string };
};

export const moduleRoutes: RouteObject[] = [
  {
    element: <Outlet />,
    children: [
      {
        path: '/units/:unitId/module/:module',
        element: <DisabledModule />,
      },
    ],
  },
];
