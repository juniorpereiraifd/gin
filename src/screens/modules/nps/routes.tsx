import { Navigate, RouteObject, Outlet } from 'react-router-dom';
import { ModuleRouterControl } from 'src/screens/components/ModuleRouterControl';
import { QuestionPersonalizationPage } from './pages/QuestionPersonalizationPage';
import { ComunicationNpsPage } from './pages/ComunicationNpsPage';

type Route = 'nps.personalization' | 'nps.comunication';

export type NpsRoutesParams = Record<Route, { unitId: string }>;

export const npsRoutes: RouteObject[] = [
  {
    element: <ModuleRouterControl module="nps" allowed={<Outlet />} notAllowed={<Navigate to="/units" />} />,
    handle: {
      breadcrumb: 'Avaliações',
      isReadOnly: true,
    },
    children: [
      {
        path: '/units/:unitId/nps/personalization',
        element: <QuestionPersonalizationPage />,
        handle: {
          breadcrumb: 'Personalizar',
        },
      },
      {
        path: '/units/:unitId/nps/comunication',
        element: <ComunicationNpsPage />,
        handle: {
          breadcrumb: 'Comunicação',
        },
      },
    ],
  },
];
