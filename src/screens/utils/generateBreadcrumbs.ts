import { matchRoutes, Params, RouteObject } from 'react-router-dom';
import { RootType } from 'src/store/modules/rootReducer';

type HandleBreadcrumb = {
  breadcrumb: Function | string;
};

function hasBreadcrumb(handle: unknown): handle is HandleBreadcrumb {
  if (handle === undefined || handle === null) {
    return false;
  }

  return typeof handle === 'object' && 'breadcrumb' in handle;
}

type GenerateBreadcrumbsOptions = {
  routes: RouteObject[];
  pathname: string;
  state: RootType;
};

export function generateBreadcrumbs(props: GenerateBreadcrumbsOptions): { path?: string; breadcrumb: string }[] {
  const { routes, pathname, state } = props;
  const matches = matchRoutes(routes, pathname);

  if (!matches) return [];

  return matches
    .filter((match) => hasBreadcrumb(match.route.handle))
    .map((match) => {
      const { route, params } = match;
      let breadcrumb = '';

      if (typeof route.handle.breadcrumb === 'object' && route.handle.breadcrumb.custom.getter !== undefined) {
        breadcrumb = customBreadcrumb[route.handle.breadcrumb.custom.getter](state, params) || '';
      } else {
        breadcrumb = route.handle.breadcrumb;
      }

      if (route.handle.isReadOnly === true) {
        return {
          breadcrumb: breadcrumb || '',
        };
      }

      let resolvedPath = match.pathname;

      if (route.path && params) {
        Object.entries(params).forEach(([key, value]) => {
          resolvedPath = resolvedPath.replace(`:${key}`, value || '');
        });
      }

      return {
        path: resolvedPath,
        breadcrumb: breadcrumb || '',
      };
    });
}

const customBreadcrumb: Record<string, (state: RootType, params: Params<string>) => string | undefined> = {
  getUnitName: (state) => state.hall.unity?.name,
  getHallName: (state) => state.hall.hall?.name,
  getMenuName: (state) => state.menu.editable?.title['pt-br'],
  getEmailCampaignName: (state, params) =>
    state.marketing.emailCampaigns.data.find((email) => email.id === params.campaignId)?.name,
  getSmsCampaignName: (state, params) =>
    state.marketing.smsCampaigns.data.find((sms) => sms.id === params.campaignId)?.name,
  getListName: (state, params) => state.marketing.lists.find((list) => list.id === params.listId)?.name,
  getWidgetName: (state, params) => state.widget.data.find((widget) => widget.id === params.widgetId)?.name,
  getSellerName: (state, params) => {
    const selectedSeller = state.payment.sellers.find((seller) => seller.id === params.sellerId);

    return selectedSeller?.seller_type === 'business'
      ? selectedSeller.metadata.business_name
      : `${selectedSeller?.metadata.first_name} ${selectedSeller?.metadata.last_name}`;
  },
};
