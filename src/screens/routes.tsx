import { createBrowserRouter, Navigate, Outlet, RouteObject } from 'react-router-dom';
import { AuthenticatedAccess } from './components/AuthenticatedAccess';
import { GlobalLayout } from './layouts/GlobalLayout';
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout';
import { NotFoundPage } from './pages/NotFoundPage';
import { profileRoutes } from './modules/profile/routes';
import { backofficeRoutes } from './modules/backoffice/routes';
import { OrganizationModuleParams, organizationRoutes } from './modules/organization/routes';

export type RoutesParams = OrganizationModuleParams;

export const routes: RouteObject[] = [
  {
    element: (
      <GlobalLayout>
        <Outlet />
      </GlobalLayout>
    ),
    children: [
      {
        path: '/',
        element: <AuthenticatedAccess yes={<Navigate to="/units" />} />,
      },

      {
        element: (
          <AuthenticatedAccess
            yes={
              <AuthenticatedLayout>
                <Outlet />
              </AuthenticatedLayout>
            }
          />
        ),
        children: [...profileRoutes, ...backofficeRoutes, ...organizationRoutes],
      },

      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
