import { ActionCreators, createActions } from 'reduxsauce';
import type {
  BannerPayloadIdentified,
  BannerPayload,
  Tag,
  ItemFromMenu,
  MenuItemPayload,
  MenuItemProps,
  MenuLinkedUnit,
  MenuReorderItemProps,
  BannerResponse,
  MenuSettings,
  GoogleMenuIntegrationStatus,
} from './reducer';

export enum MenuTypes {
  GET_MENUS_REQUEST = '@menu/GET_MENUS_REQUEST',
  GET_MENUS_FAILED = '@menu/GET_MENUS_FAILED',
  GET_MENUS_SUCCESS = '@menu/GET_MENUS_SUCCESS',

  GET_MENU_REQUEST = '@menu/GET_MENU_REQUEST',
  GET_MENU_SUCCESS = '@menu/GET_MENU_SUCCESS',
  GET_MENU_FAILED = '@menu/GET_MENU_FAILED',

  GET_FILTERED_MENU_ITEMS_REQUEST = '@menu/GET_FILTERED_MENU_ITEMS_REQUEST',
  GET_FILTERED_MENU_ITEMS_FAILED = '@menu/GET_FILTERED_MENU_ITEMS_FAILED',
  GET_FILTERED_MENU_ITEMS_SUCCESS = '@menu/GET_FILTERED_MENU_ITEMS_SUCCESS',

  CREATE_MENU_REQUEST = '@menu/CREATE_MENU_REQUEST',
  CREATE_MENU_SUCCESS = '@menu/CREATE_MENU_SUCCESS',
  CREATE_MENU_FAILED = '@menu/CREATE_MENU_FAILED',

  EDIT_MENU_REQUEST = '@menu/EDIT_MENU_REQUEST',
  EDIT_MENU_SUCCESS = '@menu/EDIT_MENU_SUCCESS',
  EDIT_MENU_FAILED = '@menu/EDIT_MENU_FAILED',

  DELETE_MENU_REQUEST = '@menu/DELETE_MENU_REQUEST',
  DELETE_MENU_SUCCESS = '@menu/DELETE_MENU_SUCCESS',
  DELETE_MENU_FAILED = '@menu/DELETE_MENU_FAILED',

  LINK_MENU_UNITS_REQUEST = '@menu/LINK_MENU_UNITS_REQUEST',
  LINK_MENU_UNITS_SUCCESS = '@menu/LINK_MENU_UNITS_SUCCESS',
  LINK_MENU_UNITS_FAILED = '@menu/LINK_MENU_UNITS_FAILED',

  UNLINK_MENU_UNIT_REQUEST = '@menu/UNLINK_MENU_UNIT_REQUEST',
  UNLINK_MENU_UNIT_SUCCESS = '@menu/UNLINK_MENU_UNIT_SUCCESS',
  UNLINK_MENU_UNIT_FAILED = '@menu/UNLINK_MENU_UNIT_FAILED',

  GET_MENU_BANNERS_REQUEST = '@menu/GET_MENU_BANNERS_REQUEST',
  GET_MENU_BANNERS_FAILED = '@menu/GET_MENU_BANNERS_FAILED',
  GET_MENU_BANNERS_SUCCESS = '@menu/GET_MENU_BANNERS_SUCCESS',

  CREATE_MENU_BANNER_REQUEST = '@menu/CREATE_MENU_BANNER_REQUEST',
  CREATE_MENU_BANNER_SUCCESS = '@menu/CREATE_MENU_BANNER_SUCCESS',
  CREATE_MENU_BANNER_FAILED = '@menu/CREATE_MENU_BANNER_FAILED',

  EDIT_MENU_BANNER_REQUEST = '@menu/EDIT_MENU_BANNER_REQUEST',
  EDIT_MENU_BANNER_SUCCESS = '@menu/EDIT_MENU_BANNER_SUCCESS',
  EDIT_MENU_BANNER_FAILED = '@menu/EDIT_MENU_BANNER_FAILED',

  DELETE_MENU_BANNER_REQUEST = '@menu/DELETE_MENU_BANNER_REQUEST',
  DELETE_MENU_BANNER_SUCCESS = '@menu/DELETE_MENU_BANNER_SUCCESS',
  DELETE_MENU_BANNER_FAILED = '@menu/DELETE_MENU_BANNER_FAILED',

  GET_MENU_SETTINGS_REQUEST = '@menu/GET_MENU_SETTINGS_REQUEST',
  GET_MENU_SETTINGS_SUCCESS = '@menu/GET_MENU_SETTINGS_SUCCESS',
  GET_MENU_SETTINGS_FAILED = '@menu/GET_MENU_SETTINGS_FAILED',

  UPDATE_MENU_SETTINGS_REQUEST = '@menu/UPDATE_MENU_SETTINGS_REQUEST',
  UPDATE_MENU_SETTINGS_SUCCESS = '@menu/UPDATE_MENU_SETTINGS_SUCCESS',
  UPDATE_MENU_SETTINGS_FAILED = '@menu/UPDATE_MENU_SETTINGS_FAILED',

  UPDATE_LIST_MENU_BANNER = '@menu/UPDATE_LIST_MENU_BANNER',

  REORDER_MENU_REQUEST = '@menu/REORDER_MENU_REQUEST',
  REORDER_MENU_FAILED = '@menu/REORDER_MENU_FAILED',

  GET_MENUS_TAGS_REQUEST = '@menu/GET_MENUS_TAGS_REQUEST',
  GET_MENUS_TAGS_FAILED = '@menu/GET_MENUS_TAGS_FAILED',
  GET_MENUS_TAGS_SUCCESS = '@menu/GET_MENUS_TAGS_SUCCESS',

  SET_SELECTED_MENU_ITEM = '@menu/SET_SELECTED_MENU_ITEM',
  RESET_FILTERED_MENU_ITEMS = '@menu/RESET_FILTERED_MENU_ITEMS',

  RESET_EDITABLE_MENU = '@menu/RESET_EDITABLE_MENU',

  GET_GOOGLE_MENU_STATUS_REQUEST = '@menu/GET_GOOGLE_MENU_STATUS_REQUEST',
  GET_GOOGLE_MENU_STATUS_SUCCESS = '@menu/GET_GOOGLE_MENU_STATUS_SUCCESS',
  GET_GOOGLE_MENU_STATUS_FAILED = '@menu/GET_GOOGLE_MENU_STATUS_FAILED',
}

interface MenuActions extends ActionCreators {
  getMenusRequest: () => {
    type: MenuTypes.GET_MENUS_REQUEST;
  };

  getMenusSuccess: (menus: Array<MenuItemProps>) => {
    type: MenuTypes.GET_MENUS_SUCCESS;
    payload: Array<MenuItemProps>;
  };

  getMenusFailed: () => {
    type: MenuTypes.GET_MENUS_FAILED;
  };

  getMenuRequest: (payload: { menu_id: string }) => {
    type: MenuTypes.GET_MENU_REQUEST;
    payload: {
      menu_id: string;
    };
  };

  getMenuSuccess: (payload: MenuItemProps) => {
    type: MenuTypes.GET_MENU_SUCCESS;
    payload: MenuItemProps;
  };

  getMenuFailed: () => {
    type: MenuTypes.GET_MENU_FAILED;
  };

  getFilteredMenuItemsRequest: (payload: { menuItem: string }) => {
    type: MenuTypes.GET_FILTERED_MENU_ITEMS_REQUEST;
    payload: {
      menuItem: string;
    };
  };

  getFilteredMenuItemsSuccess: (menu: Array<MenuItemProps>) => {
    type: MenuTypes.GET_FILTERED_MENU_ITEMS_SUCCESS;
    payload: Array<MenuItemProps>;
  };

  getFilteredMenuItemsFailed: () => {
    type: MenuTypes.GET_FILTERED_MENU_ITEMS_FAILED;
  };

  createMenuRequest: (payload: {
    menu: {
      title: {
        'pt-br': string;
      };
    };
  }) => {
    type: MenuTypes.CREATE_MENU_REQUEST;
  };

  createMenuSuccess: (menu: MenuItemProps) => {
    type: MenuTypes.CREATE_MENU_SUCCESS;
    payload: string;
  };

  createMenuFailed: () => {
    type: MenuTypes.CREATE_MENU_FAILED;
  };

  editMenuRequest: (payload: { menu: Partial<MenuItemPayload> }) => {
    type: MenuTypes.EDIT_MENU_REQUEST;
    payload: { menu: Partial<MenuItemPayload> };
  };

  editMenuFailed: () => {
    type: MenuTypes.EDIT_MENU_FAILED;
  };

  editMenuSuccess: (menu: MenuItemProps) => {
    type: MenuTypes.EDIT_MENU_SUCCESS;
  };

  reorderMenuRequest: (payload: MenuReorderItemProps) => {
    type: MenuTypes.REORDER_MENU_REQUEST;
    payload: MenuReorderItemProps;
  };

  deleteMenuRequest: (id: string) => {
    type: MenuTypes.DELETE_MENU_REQUEST;
  };

  deleteMenuSuccess: (user_id: string | number) => {
    type: MenuTypes.DELETE_MENU_SUCCESS;
    payload: string;
  };

  deleteMenuFailed: () => {
    type: MenuTypes.DELETE_MENU_FAILED;
  };

  linkMenuUnitsRequest: (payload: { menuId: string; units: MenuLinkedUnit[] }) => {
    type: MenuTypes.LINK_MENU_UNITS_REQUEST;
    payload: { menuId: string; units: MenuLinkedUnit[] };
  };

  linkMenuUnitsSuccess: (payload: { menuId: string; units: MenuLinkedUnit[] }) => {
    type: MenuTypes.LINK_MENU_UNITS_SUCCESS;
    payload: { menuId: string; units: MenuLinkedUnit[] };
  };

  linkMenuUnitsFailed: () => {
    type: MenuTypes.LINK_MENU_UNITS_FAILED;
  };

  unlinkMenuUnitRequest: (payload: { menuId: string }) => {
    type: MenuTypes.UNLINK_MENU_UNIT_REQUEST;
    payload: { menuId: string };
  };

  unlinkMenuUnitSuccess: (payload: { menuId: string }) => {
    type: MenuTypes.UNLINK_MENU_UNIT_SUCCESS;
    payload: { menuId: string };
  };

  unlinkMenuUnitFailed: () => {
    type: MenuTypes.UNLINK_MENU_UNIT_FAILED;
  };

  getMenuBannersRequest: (payload: { type: BannerPayloadIdentified['type'] }) => {
    type: MenuTypes.GET_MENU_BANNERS_REQUEST;
    payload: { type: BannerPayloadIdentified['type'] };
  };

  getMenuBannersSuccess: (payload: { data: BannerPayloadIdentified[]; type: BannerPayloadIdentified['type'] }) => {
    type: MenuTypes.GET_MENU_BANNERS_SUCCESS;
    payload: {
      data: BannerPayloadIdentified[];
      type: BannerPayloadIdentified['type'];
    };
  };

  getMenuBannersFailed: () => {
    type: MenuTypes.GET_MENU_BANNERS_FAILED;
  };

  createMenuBannerRequest: (payload: BannerPayload) => {
    type: MenuTypes.CREATE_MENU_BANNER_REQUEST;
    payload: BannerPayload;
  };

  createMenuBannerSuccess: (payload: BannerPayloadIdentified) => {
    type: MenuTypes.CREATE_MENU_BANNER_SUCCESS;
    payload: BannerPayloadIdentified;
  };

  createMenuBannerFailed: () => {
    type: MenuTypes.CREATE_MENU_BANNER_FAILED;
  };

  editMenuBannerRequest: (payload: Partial<BannerPayloadIdentified>) => {
    type: MenuTypes.EDIT_MENU_BANNER_REQUEST;
    payload: Partial<BannerPayloadIdentified>;
  };

  editMenuBannerSuccess: (payload: BannerPayloadIdentified) => {
    type: MenuTypes.EDIT_MENU_BANNER_SUCCESS;
    payload: BannerPayloadIdentified;
  };

  editMenuBannerFailed: () => {
    type: MenuTypes.EDIT_MENU_BANNER_FAILED;
  };

  deleteMenuBannerRequest: (payload: { id: string; type: BannerPayloadIdentified['type'] }) => {
    type: MenuTypes.DELETE_MENU_BANNER_REQUEST;
    payload: {
      id: string;
      type: BannerPayloadIdentified['type'];
    };
  };

  deleteMenuBannerSuccess: (payload: { id: string; type: BannerPayloadIdentified['type'] }) => {
    type: MenuTypes.DELETE_MENU_BANNER_SUCCESS;
    payload: {
      id: string;
      type: BannerPayloadIdentified['type'];
    };
  };

  deleteMenuBannerFailed: () => {
    type: MenuTypes.DELETE_MENU_BANNER_FAILED;
  };

  getMenuSettingsRequest: () => {
    type: MenuTypes.GET_MENU_SETTINGS_REQUEST;
  };
  getMenuSettingsSuccess: (payload: MenuSettings) => {
    type: MenuTypes.GET_MENU_SETTINGS_SUCCESS;
    payload: MenuSettings;
  };
  getMenuSettingsFailed: () => {
    type: MenuTypes.GET_MENU_SETTINGS_FAILED;
  };

  updateMenuSettingsRequest: (payload: Partial<MenuSettings>) => {
    type: MenuTypes.UPDATE_MENU_SETTINGS_REQUEST;
    payload: Partial<MenuSettings>;
  };
  updateMenuSettingsSuccess: (payload: MenuSettings) => {
    type: MenuTypes.UPDATE_MENU_SETTINGS_SUCCESS;
    payload: MenuSettings;
  };
  updateMenuSettingsFailed: () => {
    type: MenuTypes.UPDATE_MENU_SETTINGS_FAILED;
  };

  updateListMenuBanner: (payload: { banners: BannerResponse[]; type: BannerPayloadIdentified['type'] }) => {
    type: MenuTypes.UPDATE_LIST_MENU_BANNER;
    payload: {
      banners: BannerResponse[];
      type: BannerPayloadIdentified['type'];
    };
  };
  getMenusTagsRequest: () => {
    type: MenuTypes.GET_MENUS_TAGS_REQUEST;
  };

  getMenusTagsSuccess: (tags: Tag[]) => {
    type: MenuTypes.GET_MENUS_TAGS_SUCCESS;
    payload: Tag[];
  };

  getMenusTagsFailed: () => {
    type: MenuTypes.GET_MENUS_TAGS_FAILED;
  };

  setSelectedMenuItem: (payload: ItemFromMenu) => {
    type: MenuTypes.SET_SELECTED_MENU_ITEM;
    payload: ItemFromMenu;
  };

  resetFilteredMenuItems: () => {
    type: MenuTypes.RESET_FILTERED_MENU_ITEMS;
  };

  resetEditableMenu: () => {
    type: MenuTypes.RESET_FILTERED_MENU_ITEMS;
  };

  getGoogleMenuStatusRequest: () => {
    type: MenuTypes.GET_GOOGLE_MENU_STATUS_REQUEST;
  };
  getGoogleMenuStatusSuccess: (payload: { status: GoogleMenuIntegrationStatus }) => {
    type: MenuTypes.GET_GOOGLE_MENU_STATUS_SUCCESS;
    payload: { status: GoogleMenuIntegrationStatus };
  };
  getGoogleMenuStatusFailed: () => {
    type: MenuTypes.GET_GOOGLE_MENU_STATUS_FAILED;
  };
}

const MenuActions = createActions(
  {
    getMenusRequest: [],
    getMenusSuccess: ['payload'],
    getMenusFailed: [],

    getMenuRequest: ['payload'],
    getMenuSuccess: ['payload'],
    getMenuFailed: [],

    getFilteredMenuItemsRequest: ['payload'],
    getFilteredMenuItemsSuccess: ['payload'],
    getFilteredMenuItemsFailed: [],

    createMenuRequest: ['payload'],
    createMenuSuccess: ['payload'],
    createMenuFailed: [],

    editMenuRequest: ['payload'],
    editMenuSuccess: ['payload'],
    editMenuFailed: [],

    deleteMenuRequest: ['payload'],
    deleteMenuSuccess: ['payload'],
    deleteMenuFailed: [],

    linkMenuUnitsRequest: ['payload'],
    linkMenuUnitsSuccess: ['payload'],
    linkMenuUnitsFailed: [],

    unlinkMenuUnitRequest: ['payload'],
    unlinkMenuUnitSuccess: ['payload'],
    unlinkMenuUnitFailed: [],

    getMenuBannersRequest: ['payload'],
    getMenuBannersSuccess: ['payload'],
    getMenuBannersFailed: [],

    createMenuBannerRequest: ['payload'],
    createMenuBannerSuccess: ['payload'],
    createMenuBannerFailed: [],

    editMenuBannerRequest: ['payload'],
    editMenuBannerSuccess: ['payload'],
    editMenuBannerFailed: [],

    deleteMenuBannerRequest: ['payload'],
    deleteMenuBannerSuccess: ['payload'],
    deleteMenuBannerFailed: [],

    getMenuSettingsRequest: [],
    getMenuSettingsSuccess: ['payload'],
    getMenuSettingsFailed: [],

    updateMenuSettingsRequest: ['payload'],
    updateMenuSettingsSuccess: ['payload'],
    updateMenuSettingsFailed: [],

    updateListMenuBanner: ['payload'],

    reorderMenuRequest: ['payload'],

    getMenusTagsRequest: [],
    getMenusTagsSuccess: ['payload'],
    getMenusTagsFailed: [],

    setSelectedMenuItem: ['payload'],
    resetFilteredMenuItems: [],

    resetEditableMenu: [],

    getGoogleMenuStatusRequest: [],
    getGoogleMenuStatusSuccess: ['payload'],
    getGoogleMenuStatusFailed: [],
  },
  {
    prefix: '@menu/',
  },
);

export const MenuCreators = MenuActions.Creators as MenuActions;
