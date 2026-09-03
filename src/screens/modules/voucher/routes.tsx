import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { ModuleRouterControl } from 'src/screens/components/ModuleRouterControl';
import { VoucherPage } from './pages/VoucherPage';
import { VoucherSettingsPage } from './pages/VoucherSettingsPage';
import { VoucherCommunicationPage } from './pages/VoucherCommunicationPage';

type Route = 'voucher.list' | 'voucher.comunication' | 'voucher.settings';

export type VoucherRoutesParams = Record<Route, { unitId: string }>;

export const voucherRoutes: RouteObject[] = [
  {
    element: <ModuleRouterControl module="voucher" allowed={<Outlet />} notAllowed={<Navigate to="/units" />} />,
    handle: {
      breadcrumb: 'Giftback',
      isReadOnly: true,
    },
    children: [
      {
        path: '/units/:unitId/voucher/list',
        element: <VoucherPage />,
        handle: {
          breadcrumb: 'Meus Giftbacks',
        },
      },
      {
        path: '/units/:unitId/voucher/comunication',
        element: <VoucherCommunicationPage />,
        handle: {
          breadcrumb: 'Comunicação',
        },
      },
      {
        path: '/units/:unitId/voucher/settings',
        element: <VoucherSettingsPage />,
        handle: {
          breadcrumb: 'Ajustes',
        },
      },
      {
        path: '/units/:unitId/voucher/settings',
        element: <VoucherSettingsPage />,
      },
    ],
  },
];
