import { Outlet, RouteObject } from 'react-router-dom';
import { CustomerFlowReports } from './pages/CustomerFlowReports';
import { SalesDashboardPage } from './pages/SalesDashboardPage';
import { CommunicationReports } from './pages/CommunicationReports';
import { NpsDashboardPage } from './pages/NpsDashboardPage';

type Route = 'dashboard.flow' | 'dashboard.sales' | 'dashboard.communication' | 'dashboard.nps';

export type DashboardRoutesParams = Record<Route, { unitId: string }>;

export const dashboardRoutes: RouteObject[] = [
  {
    element: <Outlet />,
    handle: {
      breadcrumb: 'Relatórios',
      isReadOnly: true,
    },
    children: [
      {
        path: '/units/:unitId/dashboard/flow',
        element: <CustomerFlowReports />,
        handle: {
          breadcrumb: 'Fluxo de clientes',
        },
      },
      {
        path: '/units/:unitId/dashboard/sales',
        element: <SalesDashboardPage />,
        handle: {
          breadcrumb: 'Vendas',
        },
      },
      {
        path: '/units/:unitId/dashboard/communication',
        element: <CommunicationReports />,
        handle: {
          breadcrumb: 'Comunicação',
        },
      },
      {
        path: '/units/:unitId/dashboard/nps',
        element: <NpsDashboardPage />,
        handle: {
          breadcrumb: 'Avaliações',
        },
      },
    ],
  },
];
