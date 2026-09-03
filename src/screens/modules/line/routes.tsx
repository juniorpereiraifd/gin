import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { ModuleRouterControl } from 'src/screens/components/ModuleRouterControl';
import { ComunicationLinePage } from './pages/ComunicationLinePage';
import { LineSettingsPage } from './pages/LineSettingsPage';

type Route = 'line.qrCode' | 'line.comunication' | 'line.settings';

export type LineRoutesParams = Record<Route, { unitId: string }>;

export const lineRoutes: RouteObject[] = [
  {
    element: <ModuleRouterControl module="line" allowed={<Outlet />} notAllowed={<Navigate to="/units" />} />,
    handle: {
      breadcrumb: 'Fila de espera',
      isReadOnly: true,
    },
    children: [
      {
        path: '/units/:unitId/line/comunication',
        element: <ComunicationLinePage />,
        handle: {
          breadcrumb: 'Comunicação',
        },
      },
      {
        path: '/units/:unitId/line/settings',
        element: <LineSettingsPage />,
        handle: {
          breadcrumb: 'Ajustes',
        },
      },
    ],
  },
];
