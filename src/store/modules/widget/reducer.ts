import produce from 'immer';

import { Types as WidgetTypes } from './actions';
import { ModalProps, ModalStateEnum, type Pagination } from 'src/types';

export type WidgetProps = {
  id: string;
  name: string;
  tag: string;
  default: boolean;
  gtm_code?: string;
  fb_pixel_code?: string;
  instructions?: string;
  show_products_field?: boolean;
  show_state_field?: boolean;
  metadata: {
    customization: {
      birthdate_field: {
        enabled: boolean;
        required: boolean;
      };
      info_field: {
        label: string;
        enabled: boolean;
        required: boolean;
      };
      occasion_field: {
        enabled: boolean;
        required: boolean;
      };
      promocode_field: {
        enabled: boolean;
        required: boolean;
      };
      taxpayer_identification: {
        enabled: boolean;
        required: boolean;
      };
      zipcode_field: {
        enabled: boolean;
        required: boolean;
      };
    };
  };
  units?: {
    id: string;
    unit_id: string;
    active: boolean;
    created_at: Date | string;
    updated_at: Date | string;
  }[];
  active?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
};

export type WidgetReducerProps = {
  loading: boolean;
  loadingSelectedWidget: boolean;
  saving: boolean;
  savingWidgetCodes: boolean;
  loadingSearchWidgets: boolean;
  isOpen: ModalProps;
  data: WidgetProps[];
  searcheds: WidgetProps[];
  searchedsPagination: Pagination | null;
  pagination: Pagination | null;
  selectedWidget: WidgetProps | null;
  isCreateWidgetDrawerOpen?: boolean;
};

export const INITIAL_STATE: WidgetReducerProps = {
  loading: false,
  loadingSelectedWidget: false,
  saving: false,
  savingWidgetCodes: false,
  loadingSearchWidgets: false,
  isOpen: ModalStateEnum.CLOSED,
  data: [],
  searcheds: [],
  searchedsPagination: null,
  pagination: null,
  selectedWidget: null,
  isCreateWidgetDrawerOpen: false,
};

const widget = produce((draft: WidgetReducerProps, action) => {
  switch (action.type) {
    case WidgetTypes.GET_WIDGETS_REQUEST:
      if (action.payload.page && action.payload.page === 1) draft.data = [];
      draft.loading = true;
      break;
    case WidgetTypes.GET_WIDGETS_SUCCESS:
      draft.loading = false;
      draft.data = draft.data.concat(action.payload.widgets);

      draft.pagination = action.payload.pagination;
      break;
    case WidgetTypes.GET_WIDGETS_FAILED:
      draft.loading = false;
      break;

    case WidgetTypes.GET_WIDGET_REQUEST:
      draft.loadingSelectedWidget = true;
      draft.selectedWidget = null;
      break;
    case WidgetTypes.GET_WIDGET_SUCCESS:
      draft.loadingSelectedWidget = false;
      draft.selectedWidget = action.payload;
      break;
    case WidgetTypes.GET_WIDGET_FAILED:
      draft.loadingSelectedWidget = false;
      break;

    case WidgetTypes.CREATE_WIDGET_REQUEST:
      draft.saving = true;
      break;
    case WidgetTypes.CREATE_WIDGET_SUCCESS:
      draft.saving = false;
      draft.isOpen = ModalStateEnum.CLOSED;
      draft.isCreateWidgetDrawerOpen = false;

      if (action.payload.widget.units.find((unity: { unit_id: string }) => unity.unit_id === action.payload.unity))
        draft.data = draft.data.concat(action.payload.widget);

      break;
    case WidgetTypes.CREATE_WIDGET_FAILED:
      draft.saving = false;
      break;

    case WidgetTypes.DELETE_WIDGET_SUCCESS:
      draft.loading = false;
      draft.data = draft.data.filter((widget) => widget.id !== action.payload);
      break;

    case WidgetTypes.UNLINK_WIDGET_SUCCESS:
      draft.data = draft.data.filter((widget) => widget.id !== action.payload);
      break;

    case WidgetTypes.LINK_WIDGET_SUCCESS:
      draft.data = [...draft.data.filter((widget) => widget.id !== action.payload.id), action.payload];
      break;

    case WidgetTypes.SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_REQUEST:
      draft.savingWidgetCodes = true;
      break;
    case WidgetTypes.SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_SUCCESS:
      draft.savingWidgetCodes = false;
      break;
    case WidgetTypes.SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_FAILED:
      draft.savingWidgetCodes = false;
      break;

    case WidgetTypes.OPEN_MODAL:
      draft.isOpen = ModalStateEnum.OPENED;
      break;

    case WidgetTypes.CLOSE_MODAL:
      draft.isOpen = ModalStateEnum.CLOSED;
      break;

    case WidgetTypes.SEARCH_WIDGETS_REQUEST:
      draft.loadingSearchWidgets = true;
      break;
    case WidgetTypes.SEARCH_WIDGETS_SUCCESS:
      draft.loadingSearchWidgets = false;
      draft.searchedsPagination = action.payload.pagination;

      if (action.payload.reset === false) {
        draft.searcheds = draft.searcheds.concat(action.payload.widgets);
      } else {
        draft.searcheds = action.payload.widgets;
      }
      break;
    case WidgetTypes.SEARCH_WIDGETS_FAILED:
      draft.loadingSearchWidgets = false;
      draft.searchedsPagination = null;
      break;

    case WidgetTypes.SET_CREATE_DRAWER_OPEN:
      draft.isCreateWidgetDrawerOpen = action.payload.open;
      break;
  }
}, INITIAL_STATE);

export default widget;
