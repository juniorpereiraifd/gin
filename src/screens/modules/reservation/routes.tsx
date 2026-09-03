import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { ModuleRouterControl } from 'src/screens/components/ModuleRouterControl';
import { HallsPage } from './pages/HallsPage';
import { HallEditPage } from './pages/HallEditPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { SpecialDatesPage } from './pages/SpecialDatesPage';
import { BlockadesPage } from './pages/BlockadesPage';
import { WidgetPage } from './pages/WidgetPage';
import { ComunicationReservationPage } from './pages/ComunicationReservationPage';
import { CustomReservationPage } from './pages/CustomReservationPage';
import { SettingsReservationPage } from './pages/SettingsReservationPage';
import { WidgetEditPage } from './pages/WidgetEditPage';

export type ReservationRoutesParams = {
  'reservation.halls': { unitId: string };
  'reservation.hallEdit': { unitId: string; hallId: string };
  'reservation.experiences': { unitId: string };
  'reservation.transactions': { unitId: string };
  'reservation.specialDates': { unitId: string };
  'reservation.blocks': { unitId: string };
  'reservation.widgets': { unitId: string };
  'reservation.widgetEdit': { unitId: string; widgetId: string };
  'reservation.custom': { unitId: string };
  'reservation.comunication': { unitId: string };
  'reservation.settings': { unitId: string };
};

export const reservationRoutes: RouteObject[] = [
  {
    element: <ModuleRouterControl module="reservation" allowed={<Outlet />} notAllowed={<Navigate to="/units" />} />,
    handle: {
      breadcrumb: 'Reservas',
      isReadOnly: true,
    },
    children: [
      {
        path: '/units/:unitId/reservation/halls',
        element: <Outlet />,
        handle: {
          breadcrumb: 'Salões',
        },
        children: [
          {
            index: true,
            element: <HallsPage />,
          },
          {
            path: '/units/:unitId/reservation/halls/:hallId/edit',
            element: <HallEditPage />,
            handle: {
              breadcrumb: {
                custom: {
                  getter: 'getHallName',
                },
              },
            },
          },
        ],
      },
      {
        path: '/units/:unitId/reservation/experiences',
        element: <ExperiencesPage />,
        handle: {
          breadcrumb: 'Experiências',
        },
      },
      {
        path: '/units/:unitId/reservation/transactions',
        element: <TransactionsPage />,
        handle: {
          breadcrumb: 'Transações',
        },
      },
      {
        path: '/units/:unitId/reservation/special-dates',
        element: <SpecialDatesPage />,
        handle: {
          breadcrumb: 'Datas especiais',
        },
      },
      {
        path: '/units/:unitId/reservation/blocks',
        element: <BlockadesPage />,
        handle: {
          breadcrumb: 'Bloqueios',
        },
      },
      {
        path: '/units/:unitId/reservation/widgets',
        element: <Outlet />,
        handle: {
          breadcrumb: 'Widgets',
        },
        children: [
          {
            index: true,
            element: <WidgetPage />,
          },
          {
            path: '/units/:unitId/reservation/widgets/:widgetId/edit',
            element: <WidgetEditPage />,
            handle: {
              breadcrumb: {
                custom: {
                  getter: 'getWidgetName',
                },
              },
            },
          },
        ],
      },
      {
        path: '/units/:unitId/reservation/custom',
        element: <CustomReservationPage />,
        handle: {
          breadcrumb: 'Personalizar formulário de reserva',
        },
      },
      {
        path: '/units/:unitId/reservation/comunication',
        element: <ComunicationReservationPage />,
        handle: {
          breadcrumb: 'Comunicação',
        },
      },
      {
        path: '/units/:unitId/reservation/settings',
        element: <SettingsReservationPage />,
        handle: {
          breadcrumb: 'Ajustes',
        },
      },
    ],
  },
];
