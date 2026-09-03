import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { ModuleRouterControl } from 'src/screens/components/ModuleRouterControl';
import { MenusPage } from './pages/MenusPage';
import { EditMenuPage } from './pages/EditMenuPage';
import { MenuBannersPage } from './pages/MenuBannersPage';
import { MenuSettingsPage } from './pages/MenuSettingsPage';

export type MenuRoutesParams = {
  'menu.home': { unitId: string };
  'menu.edit': { unitId: string; menuId: string };
  'menu.banners': { unitId: string };
  'menu.settings': { unitId: string };
};

export const menuRoutes: RouteObject[] = [
  {
    element: <ModuleRouterControl module="menu" allowed={<Outlet />} notAllowed={<Navigate to="/units" />} />,
    handle: {
      breadcrumb: 'Cardápios',
      isReadOnly: true,
    },
    children: [
      {
        path: '/units/:unitId/menus',
        element: <Outlet />,
        handle: {
          breadcrumb: 'Meus cardápios',
        },
        children: [
          {
            index: true,
            element: <MenusPage />,
          },
          {
            path: '/units/:unitId/menus/:menuId/edit',
            element: <EditMenuPage />,
            handle: {
              breadcrumb: {
                custom: {
                  getter: 'getMenuName',
                },
              },
            },
          },
        ],
      },
      {
        path: '/units/:unitId/menus/banners',
        element: <MenuBannersPage />,
        handle: {
          breadcrumb: 'Banners',
        },
      },
      {
        path: '/units/:unitId/menus/settings',
        element: <MenuSettingsPage />,
        handle: {
          breadcrumb: 'Ajustes',
        },
      },
    ],
  },
];
