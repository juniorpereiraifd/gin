import { Outlet, RouteObject } from 'react-router-dom';
import { PromotionsPage } from './pages/PromotionsPage';
import { CustomersPage } from './pages/CustomersPage';
import { OrganizationLayout } from 'src/screens/layouts/OrganizationLayout';

export const backofficeRoutes: RouteObject[] = [
  {
    element: (
      <OrganizationLayout>
        <Outlet />
      </OrganizationLayout>
    ),
    children: [
      {
        path: '/backoffice-get-in/crm/promotions',
        element: <PromotionsPage />,
      },
      {
        path: '/backoffice-get-in/crm/customers',
        element: <CustomersPage />,
      },
    ],
  },
];
