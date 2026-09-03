import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { ModuleRouterControl } from 'src/screens/components/ModuleRouterControl';
import { CampaignsPage } from './pages/CampaignsPage';
import { CreateEmailCampaignPage } from './pages/CreateEmailCampaignPage';
import { CreateSMSCampaignPage } from './pages/CreateSMSCampaignPage';
import { ViewEmailCampaignPage } from './pages/ViewEmailCampaignPage';
import { ViewSMSCampaignPage } from './pages/ViewSMSCampaignPage';
import { CustomersPage } from './pages/CustomersPage';
import { ListCustomerDetailPage, ParsedSegmentations } from './pages/ListCustomerDetailPage';
import { MarketingSettingsPage } from './pages/MarketingSettingsPage';
import { MasterRouterControl } from 'src/screens/components/MasterRouterControl';

export type MarketingRoutesParams = {
  'marketing.campaigns': { unitId: string };
  'marketing.campaigns.email.create': { unitId: string };
  'marketing.campaigns.email.view': { unitId: string; campaignId: string };
  'marketing.campaigns.email.edit': { unitId: string; campaignId: string };
  'marketing.campaigns.sms.create': { unitId: string };
  'marketing.campaigns.sms.view': { unitId: string; campaignId: string };
  'marketing.campaigns.sms.edit': { unitId: string; campaignId: string };
  'marketing.customers': { unitId: string };
  'marketing.customers.list': {
    unitId: string;
    segmentation?: ParsedSegmentations;
    listId?: string;
  };
  'marketing.settings': { unitId: string };
};

export const marketingRoutes: RouteObject[] = [
  {
    element: <ModuleRouterControl module="marketing" allowed={<Outlet />} notAllowed={<Navigate to="/units" />} />,
    handle: {
      breadcrumb: 'Marketing',
      isReadOnly: true,
    },
    children: [
      {
        path: '/units/:unitId/marketing/campaigns',
        element: <Outlet />,
        handle: {
          breadcrumb: 'Campanhas',
        },
        children: [
          {
            index: true,
            element: <CampaignsPage />,
          },
          {
            path: '/units/:unitId/marketing/campaigns/email/create',
            element: <CreateEmailCampaignPage />,
            handle: {
              breadcrumb: 'Criar campanha de e-mail',
            },
          },
          {
            path: '/units/:unitId/marketing/campaigns/email/:campaignId/view',
            element: <ViewEmailCampaignPage />,
            handle: {
              breadcrumb: {
                custom: {
                  getter: 'getEmailCampaignName',
                },
              },
            },
          },
          {
            path: '/units/:unitId/marketing/campaigns/email/:campaignId/edit',
            element: <CreateEmailCampaignPage />,
            handle: {
              breadcrumb: {
                custom: {
                  getter: 'getEmailCampaignName',
                },
              },
            },
          },
          {
            path: '/units/:unitId/marketing/campaigns/sms/create',
            element: <CreateSMSCampaignPage />,
            handle: {
              breadcrumb: 'Criar campanha de sms',
            },
          },
          {
            path: '/units/:unitId/marketing/campaigns/sms/:campaignId/view',
            element: <ViewSMSCampaignPage />,
            handle: {
              breadcrumb: {
                custom: {
                  getter: 'getSmsCampaignName',
                },
              },
            },
          },
          {
            path: '/units/:unitId/marketing/campaigns/sms/:campaignId/edit',
            element: <CreateSMSCampaignPage />,
            handle: {
              breadcrumb: {
                custom: {
                  getter: 'getSmsCampaignName',
                },
              },
            },
          },
        ],
      },
      {
        path: '/units/:unitId/marketing/customers',
        element: <Outlet />,
        handle: {
          breadcrumb: 'Clientes',
        },
        children: [
          {
            index: true,
            element: <CustomersPage />,
          },
          {
            path: '/units/:unitId/marketing/customers/segmentation',
            element: <Outlet />,
            handle: {
              breadcrumb: 'Segmentações da base',
              isReadOnly: true,
            },
            children: [
              {
                path: '/units/:unitId/marketing/customers/segmentation/:segmentation',
                element: <ListCustomerDetailPage />,
              },
            ],
          },
          {
            path: '/units/:unitId/marketing/customers/list',
            element: <Outlet />,
            handle: {
              breadcrumb: 'Listas importadas',
              isReadOnly: true,
            },
            children: [
              {
                path: '/units/:unitId/marketing/customers/list/:listId',
                element: <ListCustomerDetailPage />,
                handle: {
                  breadcrumb: {
                    custom: {
                      getter: 'getListName',
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      {
        path: '/units/:unitId/marketing/settings',
        element: <MasterRouterControl yes={<MarketingSettingsPage />} no={<Navigate to="/units" />} />,
        handle: {
          breadcrumb: 'Ajustes',
          isReadOnly: true,
        },
      },
    ],
  },
];
