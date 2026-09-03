import { ActionCreators, createActions } from 'reduxsauce';
import { WidgetProps } from './reducer';
import type { Pagination } from 'src/types';

export enum Types {
  GET_WIDGETS_REQUEST = '@widget/GET_WIDGETS_REQUEST',
  GET_WIDGETS_SUCCESS = '@widget/GET_WIDGETS_SUCCESS',
  GET_WIDGETS_FAILED = '@widget/GET_WIDGETS_FAILED',

  GET_WIDGET_REQUEST = '@widget/GET_WIDGET_REQUEST',
  GET_WIDGET_SUCCESS = '@widget/GET_WIDGET_SUCCESS',
  GET_WIDGET_FAILED = '@widget/GET_WIDGET_FAILED',

  SEARCH_WIDGETS_REQUEST = '@widget/SEARCH_WIDGETS_REQUEST',
  SEARCH_WIDGETS_SUCCESS = '@widget/SEARCH_WIDGETS_SUCCESS',
  SEARCH_WIDGETS_FAILED = '@widget/SEARCH_WIDGETS_FAILED',

  CREATE_WIDGET_REQUEST = '@widget/CREATE_WIDGET_REQUEST',
  CREATE_WIDGET_SUCCESS = '@widget/CREATE_WIDGET_SUCCESS',
  CREATE_WIDGET_FAILED = '@widget/CREATE_WIDGET_FAILED',

  DELETE_WIDGET_REQUEST = '@widget/DELETE_WIDGET_REQUEST',
  DELETE_WIDGET_SUCCESS = '@widget/DELETE_WIDGET_SUCCESS',
  DELETE_WIDGET_FAILED = '@widget/DELETE_WIDGET_FAILED',

  UNLINK_WIDGET_REQUEST = '@widget/UNLINK_WIDGET_REQUEST',
  UNLINK_WIDGET_SUCCESS = '@widget/UNLINK_WIDGET_SUCCESS',
  UNLINK_WIDGET_FAILED = '@widget/UNLINK_WIDGET_FAILED',

  LINK_WIDGET_REQUEST = '@widget/LINK_WIDGET_REQUEST',
  LINK_WIDGET_SUCCESS = '@widget/LINK_WIDGET_SUCCESS',
  LINK_WIDGET_FAILED = '@widget/LINK_WIDGET_FAILED',

  SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_REQUEST = '@widget/SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_REQUEST',
  SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_SUCCESS = '@widget/SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_SUCCESS',
  SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_FAILED = '@widget/SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_FAILED',

  SAVE_FIELDS_CUSTOMIZATION_REQUEST = '@widget/SAVE_FIELDS_CUSTOMIZATION_REQUEST',
  SAVE_FIELDS_CUSTOMIZATION_SUCCESS = '@widget/SAVE_FIELDS_CUSTOMIZATION_SUCCESS',
  SAVE_FIELDS_CUSTOMIZATION_FAILED = '@widget/SAVE_FIELDS_CUSTOMIZATION_FAILED',

  OPEN_MODAL = '@widget/OPEN_MODAL',
  CLOSE_MODAL = '@widget/CLOSE_MODAL',

  SET_CREATE_DRAWER_OPEN = '@widget/SET_CREATE_DRAWER_OPEN',
}

type CreateWidgetProps = {
  unity: string;
  data: {
    widget: {
      name: string;
      active: boolean;
    };
    widget_units: Array<{ unit_id: string; active: boolean }>;
  };
};

interface Actions extends ActionCreators {
  getWidgetsRequest: (payload: { page: number; unity: string }) => {
    type: Types.GET_WIDGETS_REQUEST;
    payload: {
      page: number;
      unity: string;
    };
  };
  getWidgetsSuccess: (payload: {
    widgets: WidgetProps[];
    pagination: {
      is_last_page: boolean;
    };
  }) => {
    type: Types.GET_WIDGETS_REQUEST;
    payload: {
      widget: WidgetProps[];
      pagination: {
        is_last_page: boolean;
      };
    };
  };
  getWidgetsFailed: () => {
    type: Types.GET_WIDGETS_FAILED;
  };

  getWidgetRequest: (payload: { id: string }) => {
    type: Types.GET_WIDGET_REQUEST;
    payload: { id: string };
  };
  getWidgetSuccess: (payload: WidgetProps) => {
    type: Types.GET_WIDGET_REQUEST;
    payload: WidgetProps;
  };
  getWidgetFailed: () => {
    type: Types.GET_WIDGET_FAILED;
  };

  searchWidgetsRequest: (payload: { query?: string; page?: number; perPage?: number; reset?: boolean }) => {
    type: Types.SEARCH_WIDGETS_REQUEST;
    payload: { query?: string; page?: number; perPage?: number; reset?: boolean };
  };
  searchWidgetsSuccess: (payload: { widgets: WidgetProps[]; pagination: Pagination; reset?: boolean }) => {
    type: Types.SEARCH_WIDGETS_SUCCESS;
    payload: {
      widget: WidgetProps[];
      pagination: Pagination;
      reset?: boolean;
    };
  };
  searchWidgetsFailed: () => {
    type: Types.SEARCH_WIDGETS_FAILED;
  };

  createWidgetRequest: (widget: CreateWidgetProps) => {
    type: Types.CREATE_WIDGET_REQUEST;
    payload: CreateWidgetProps;
  };
  createWidgetSuccess: (payload: { widget: WidgetProps; unity: string }) => {
    type: Types.CREATE_WIDGET_REQUEST;
    payload: {
      widget: WidgetProps;
      unity: string;
    };
  };
  createWidgetFailed: () => {
    type: Types.CREATE_WIDGET_FAILED;
  };

  deleteWidgetRequest: (widget: string) => {
    type: Types.DELETE_WIDGET_REQUEST;
    payload: string;
  };
  deleteWidgetSuccess: (widget: string) => {
    type: Types.DELETE_WIDGET_REQUEST;
    payload: string;
  };
  deleteWidgetFailed: () => {
    type: Types.DELETE_WIDGET_FAILED;
  };

  unlinkWidgetRequest: (payload: { widget: string; unity: string }) => {
    type: Types.UNLINK_WIDGET_REQUEST;
    payload: {
      widget: string;
      unity: string;
    };
  };
  unlinkWidgetSuccess: (widget: string) => {
    type: Types.UNLINK_WIDGET_REQUEST;
    payload: string;
  };
  unlinkWidgetFailed: () => {
    type: Types.UNLINK_WIDGET_FAILED;
  };

  linkWidgetRequest: (payload: { widget: string; unity: string }) => {
    type: Types.LINK_WIDGET_REQUEST;
    payload: {
      widget: string;
      unity: string;
    };
  };
  linkWidgetSuccess: (widget: string) => {
    type: Types.LINK_WIDGET_REQUEST;
    payload: string;
  };
  linkWidgetFailed: () => {
    type: Types.LINK_WIDGET_FAILED;
  };

  saveGtmAndFbPixelCodesWidgetRequest: (payload: {
    widget: WidgetProps;
    gtm_code?: string;
    fb_pixel_code?: string;
  }) => {
    type: Types.SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_REQUEST;
    payload: {
      widget: WidgetProps;
      gtm_code?: string;
      fb_pixel_code?: string;
    };
  };

  saveFieldsCustomizationRequest: (payload: {
    widget: WidgetProps;
    instructions?: string;
    show_products_field?: boolean;
    show_state_field?: boolean;
    fields_customization?: unknown;
  }) => {
    type: Types.SAVE_FIELDS_CUSTOMIZATION_REQUEST;
    payload: {
      widget: WidgetProps;
      instructions?: string;
      show_products_field?: boolean;
      show_state_field?: boolean;
      fields_customization?: unknown;
    };
  };

  saveGtmAndFbPixelCodesWidgetSuccess: () => {
    type: Types.SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_SUCCESS;
  };

  saveGtmAndFbPixelCodesWidgetFailed: () => {
    type: Types.SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_FAILED;
  };

  openModal: () => {
    type: Types.OPEN_MODAL;
  };

  closeModal: () => {
    type: Types.CLOSE_MODAL;
  };

  setCreateDrawerOpen: (payload: { open: boolean }) => {
    type: Types.SET_CREATE_DRAWER_OPEN;
    payload: { open: boolean };
  };
}

const CreatedActions = createActions(
  {
    getWidgetsRequest: ['payload'],
    getWidgetsSuccess: ['payload'],
    getWidgetsFailed: [],

    getWidgetRequest: ['payload'],
    getWidgetSuccess: ['payload'],
    getWidgetFailed: [],

    createWidgetRequest: ['payload'],
    createWidgetSuccess: ['payload'],
    createWidgetFailed: [],

    deleteWidgetRequest: ['payload'],
    deleteWidgetSuccess: ['payload'],
    deleteWidgetFailed: [],

    unlinkWidgetRequest: ['payload'],
    unlinkWidgetSuccess: ['payload'],
    unlinkWidgetFailed: [],

    linkWidgetRequest: ['payload'],
    linkWidgetSuccess: ['payload'],
    linkWidgetFailed: [],

    searchWidgetsRequest: ['payload'],
    searchWidgetsSuccess: ['payload'],
    searchWidgetsFailed: [],

    saveGtmAndFbPixelCodesWidgetRequest: ['payload'],
    saveGtmAndFbPixelCodesWidgetSuccess: [],
    saveGtmAndFbPixelCodesWidgetFailed: [],

    saveFieldsCustomizationRequest: ['payload'],
    saveFieldsCustomizationSuccess: [],
    saveFieldsCustomizationFailed: [],

    openModal: [],
    closeModal: [],

    setCreateDrawerOpen: ['payload'],
  },
  {
    prefix: '@widget/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
