import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { UnitLayout } from 'src/screens/layouts/UnitLayout';
import { OrganizationLayout } from 'src/screens/layouts/OrganizationLayout';
import { HomePage } from './pages/HomePage';
import { CreateUnityPage } from './pages/CreateUnityPage';
import { accountRoutes, AccountRoutesParams } from '../account/routes';
import { dashboardRoutes, DashboardRoutesParams } from '../dashboard/routes';
import { lineRoutes, LineRoutesParams } from '../line/routes';
import { marketingRoutes, MarketingRoutesParams } from '../marketing/routes';
import { menuRoutes, MenuRoutesParams } from '../menu/routes';
import { moduleRoutes, ModuleRoutesParams } from '../module/routes';
import { npsRoutes, NpsRoutesParams } from '../nps/routes';
import { reservationRoutes, ReservationRoutesParams } from '../reservation/routes';
import { usersRoutes, UsersRoutesParams } from '../users/routes';
import { voucherRoutes, VoucherRoutesParams } from '../voucher/routes';
import { SellersPage } from './modules/Sellers/pages/SellersPage';
import { CreateSellerPage } from './modules/Sellers/pages/CreateSellerPage';
import { FinancialLayout } from './layouts/FinancialLayout';
import { EditSellerPage } from './modules/Sellers/pages/EditSellerPage';
import { MasterRouterControl } from 'src/screens/components/MasterRouterControl';

export type OrganizationModuleParams = DashboardRoutesParams &
  ReservationRoutesParams &
  LineRoutesParams &
  MenuRoutesParams &
  MarketingRoutesParams &
  NpsRoutesParams &
  VoucherRoutesParams &
  UsersRoutesParams &
  AccountRoutesParams &
  ModuleRoutesParams & {
    unit: { unitId: string };
    seller: { sellerId: string };
  };

export const organizationRoutes: RouteObject[] = [
  {
    path: '/units',
    element: <Outlet />,
    handle: {
      breadcrumb: 'Unidades',
    },
    children: [
      {
        element: (
          <OrganizationLayout>
            <Outlet />
          </OrganizationLayout>
        ),
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: '/units/create',
            element: <CreateUnityPage />,
          },
        ],
      },
      {
        element: (
          <UnitLayout>
            <Outlet />
          </UnitLayout>
        ),
        handle: {
          breadcrumb: {
            custom: {
              getter: 'getUnitName',
            },
          },
          isReadOnly: true,
        },
        children: [
          ...dashboardRoutes,
          ...reservationRoutes,
          ...lineRoutes,
          ...menuRoutes,
          ...marketingRoutes,
          ...npsRoutes,
          ...voucherRoutes,
          ...usersRoutes,
          ...accountRoutes,
          ...moduleRoutes,
        ],
      },
    ],
  },
  {
    path: '/financial/sellers',
    element: (
      <FinancialLayout>
        <MasterRouterControl yes={<Outlet />} no={<Navigate to="/units" />} />
      </FinancialLayout>
    ),
    handle: {
      breadcrumb: 'Vendedores',
      isReadOnly: true,
    },
    children: [
      {
        path: '/financial/sellers/zoop',
        element: <Outlet />,
        handle: {
          breadcrumb: 'Zoop',
        },
        children: [
          {
            index: true,
            element: <SellersPage />,
          },
          {
            path: '/financial/sellers/zoop/create',
            element: <CreateSellerPage />,
            handle: {
              breadcrumb: 'Criar vendedor',
            },
          },
          {
            path: '/financial/sellers/zoop/edit/:sellerId',
            element: <EditSellerPage />,
            handle: {
              breadcrumb: {
                custom: {
                  getter: 'getSellerName',
                },
              },
            },
          },
        ],
      },
    ],
  },
];
