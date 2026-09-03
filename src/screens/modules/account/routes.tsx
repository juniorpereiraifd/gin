import { RouteObject } from 'react-router-dom';
import { AccountPage } from './pages/AccountPage';

type Route = 'account';

export type AccountRoutesParams = Record<Route, { unitId: string }>;

export const accountRoutes: RouteObject[] = [
  {
    path: '/units/:unitId/account',
    element: <AccountPage />,
    handle: {
      breadcrumb: 'Conta',
      isReadOnly: true,
    },
  },
];
