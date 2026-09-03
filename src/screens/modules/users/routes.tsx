import { RouteObject } from 'react-router-dom';
import { UsersPage } from './pages/UsersPage';

export type UsersRoutesParams = {
  users: { unitId: string };
};

export const usersRoutes: RouteObject[] = [
  {
    path: '/units/:unitId/users',
    handle: {
      breadcrumb: 'Usuários',
      isReadOnly: true,
    },
    element: <UsersPage />,
  },
];
