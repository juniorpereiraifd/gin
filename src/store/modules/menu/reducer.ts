import produce from 'immer';
import { MenuTypes } from './actions';

export type GoogleMenuIntegrationStatus = 'pending' | 'declined' | 'accepted' | 'unknown' | 'error';

export type MenuSettings = {
  id: string;
  enabled: boolean;
  font_primary_color?: string;
  font_secondary_color?: string;
  background_primary_color?: string;
  background_secondary_color?: string;
  miscellaneous_color?: string;
  show_in_line?: boolean;
  google_menu_enabled: boolean;
  external_link?: string;
  hide_price_enabled?: boolean;
};

export type BannerBase = {
  type: 'home' | 'content';
  active: boolean;
  priority?: number;
  link?: string;
};

export type BannerPayload = BannerBase & {
  image: {
    content: string;
    name: string;
  };
};

export type BannerPayloadIdentified = BannerPayload & { id: string };

export type BannerResponse = BannerBase & { image: string; id: string };

export type Tag = {
  id: string;
  icon: string;
  title: {
    'pt-br': string;
  };
};

type Image = {
  id: string;
  image: string;
  priority: number;
  created_at: string;
  updated_at: string;
};

type Price = {
  id: string;
  origin_id: string;
  origin_slug?: unknown | null;
  price: number;
};

type Visibility = {
  origin_id: string;
  origin: string;
  active: boolean;
};

type Category = {
  id: string;
  title: {
    'pt-br': string;
  };
  visibilities: Visibility[];
  priority: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type Menu = {
  id: string;
  unit_id: string;
  title: {
    'pt-br': string;
  };
  icon?: unknown | null;
  priority: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: unknown | null;
  restriction_id: string;
};

export type ItemFromMenu = {
  id: string;
  type: string;
  price_type: string;
  title: {
    'pt-br': string;
  };
  description: string;
  pos_identifier: string;
  images: Image[];
  prices: Price[];
  visibilities: Visibility[];
  categories: Category[];
  menu: Menu[];
  portion: number;
  for_adults_only: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuLinkedUnit = {
  id: string;
  name: string;
};

export type MenuItemProps = {
  id: string;
  title: {
    'pt-br': string;
  };
  active: boolean;
  icon: string;
  priority: number;
  created_at: string;
  updated_at: string;
  units?: MenuLinkedUnit[];
  unit_id: string;
};

export type MenuItemPayload = {
  id: string;
  title: {
    'pt-br': string;
  };
  active: boolean;
  icon: {
    name: string;
    content: string;
  } | null;
  priority: number;
  created_at: string;
  updated_at: string;
  units?: MenuLinkedUnit[];
};

export type MenuReorderItemProps = {
  id: string | number;
  old_position?: number;
  new_position?: number;
};

export type MenuProps = {
  loading: boolean;
  loadingBanners: boolean;
  loadingSettings: boolean;
  loadingTags: boolean;
  saving: boolean;
  savingBanners: boolean;
  savingSettings: boolean;
  savingUnits: boolean;
  data: Array<MenuItemProps>;
  settings: MenuSettings | null;
  bannersHome: BannerResponse[];
  bannersContent: BannerResponse[];
  tags: Tag[];
  filteredMenuItems: Array<ItemFromMenu>;
  selectedMenuItem: ItemFromMenu | null;
  editable: MenuItemProps | null;
  googleMenuStatus: GoogleMenuIntegrationStatus | null;
};

export const INITIAL_STATE: MenuProps = {
  loading: true,
  loadingBanners: false,
  loadingSettings: true,
  loadingTags: false,
  saving: false,
  savingBanners: false,
  savingSettings: false,
  savingUnits: false,
  data: [],
  settings: null,
  bannersHome: [],
  bannersContent: [],
  tags: [],
  filteredMenuItems: [],
  selectedMenuItem: null,
  editable: null,
  googleMenuStatus: null,
};

const menu = produce((draft: MenuProps, action) => {
  switch (action.type) {
    case MenuTypes.GET_MENUS_REQUEST:
      draft.loading = true;
      break;
    case MenuTypes.GET_MENUS_SUCCESS:
      draft.loading = false;
      draft.data = action.payload;
      break;
    case MenuTypes.GET_MENUS_FAILED:
      draft.loading = false;
      break;

    case MenuTypes.GET_FILTERED_MENU_ITEMS_REQUEST:
      draft.loading = true;
      break;
    case MenuTypes.GET_FILTERED_MENU_ITEMS_SUCCESS:
      draft.loading = false;
      draft.filteredMenuItems = action.payload;
      break;
    case MenuTypes.GET_FILTERED_MENU_ITEMS_FAILED:
      draft.loading = false;
      break;

    case MenuTypes.GET_MENU_REQUEST:
      draft.loading = true;
      break;
    case MenuTypes.GET_MENU_SUCCESS:
      draft.loading = false;
      draft.editable = action.payload;
      break;
    case MenuTypes.GET_MENU_FAILED:
      draft.loading = false;
      draft.editable = null;
      break;

    case MenuTypes.CREATE_MENU_REQUEST:
      draft.saving = true;
      break;
    case MenuTypes.CREATE_MENU_SUCCESS:
      draft.saving = false;
      draft.data.push(action.payload);
      break;
    case MenuTypes.CREATE_MENU_FAILED:
      draft.saving = false;
      break;

    case MenuTypes.EDIT_MENU_REQUEST:
      draft.saving = true;
      break;
    case MenuTypes.EDIT_MENU_FAILED:
      draft.saving = false;
      break;
    case MenuTypes.EDIT_MENU_SUCCESS:
      draft.saving = false;
      draft.data[draft.data.findIndex((menu) => menu.id === action.payload.id)] = action.payload;
      break;

    case MenuTypes.DELETE_MENU_SUCCESS:
      draft.data = draft.data.filter((menu) => menu.id !== action.payload);
      break;

    case MenuTypes.LINK_MENU_UNITS_REQUEST:
      draft.savingUnits = true;
      break;
    case MenuTypes.LINK_MENU_UNITS_SUCCESS: {
      draft.savingUnits = false;
      const index = draft.data.findIndex((menu) => menu.id === action.payload.menuId);
      if (index !== -1) {
        draft.data[index].units = action.payload.units;
      }
      break;
    }
    case MenuTypes.LINK_MENU_UNITS_FAILED:
      draft.savingUnits = false;
      break;

    case MenuTypes.UNLINK_MENU_UNIT_REQUEST:
      draft.savingUnits = true;
      break;
    case MenuTypes.UNLINK_MENU_UNIT_SUCCESS:
      draft.savingUnits = false;
      draft.data = draft.data.filter((menu) => menu.id !== action.payload.menuId);
      break;
    case MenuTypes.UNLINK_MENU_UNIT_FAILED:
      draft.savingUnits = false;
      break;

    case MenuTypes.GET_MENUS_TAGS_REQUEST:
      draft.loadingTags = true;
      break;
    case MenuTypes.GET_MENUS_TAGS_SUCCESS:
      draft.loadingTags = false;
      draft.tags = action.payload;
      break;
    case MenuTypes.GET_MENUS_TAGS_FAILED:
      draft.loadingTags = false;
      break;

    case MenuTypes.SET_SELECTED_MENU_ITEM:
      draft.selectedMenuItem = action.payload;
      break;

    case MenuTypes.RESET_FILTERED_MENU_ITEMS:
      draft.filteredMenuItems = [];
      draft.selectedMenuItem = null;
      break;

    case MenuTypes.RESET_EDITABLE_MENU:
      draft.editable = null;
      break;

    case MenuTypes.GET_MENU_BANNERS_REQUEST:
      draft.loadingBanners = true;
      break;
    case MenuTypes.GET_MENU_BANNERS_SUCCESS:
      draft.loadingBanners = false;

      if (action.payload.type === 'home') {
        draft.bannersHome = action.payload.data;
      } else {
        draft.bannersContent = action.payload.data;
      }
      break;
    case MenuTypes.GET_MENU_BANNERS_FAILED:
      draft.loadingBanners = false;
      break;

    case MenuTypes.CREATE_MENU_BANNER_REQUEST:
      draft.savingBanners = true;
      break;
    case MenuTypes.CREATE_MENU_BANNER_SUCCESS:
      draft.savingBanners = false;
      if (action.payload.type === 'home') {
        draft.bannersHome = draft.bannersHome.concat(action.payload);
      } else {
        draft.bannersContent = draft.bannersContent.concat(action.payload);
      }
      break;
    case MenuTypes.CREATE_MENU_BANNER_FAILED:
      draft.savingBanners = false;
      break;

    case MenuTypes.EDIT_MENU_BANNER_REQUEST:
      draft.savingBanners = true;
      break;
    case MenuTypes.EDIT_MENU_BANNER_SUCCESS:
      draft.savingBanners = false;
      if (action.payload.type === 'home') {
        draft.bannersHome = draft.bannersHome.map((banner) => {
          if (banner.id === action.payload.id) {
            return action.payload;
          }

          return banner;
        });
      } else {
        draft.bannersContent = draft.bannersContent.map((banner) => {
          if (banner.id === action.payload.id) {
            return action.payload;
          }

          return banner;
        });
      }

      break;
    case MenuTypes.EDIT_MENU_BANNER_FAILED:
      draft.savingBanners = false;
      break;

    case MenuTypes.DELETE_MENU_BANNER_REQUEST:
      break;
    case MenuTypes.DELETE_MENU_BANNER_SUCCESS:
      if (action.payload.type === 'home') {
        draft.bannersHome = draft.bannersHome.filter((banner) => {
          return banner.id !== action.payload.id;
        });
      } else {
        draft.bannersContent = draft.bannersContent.filter((banner) => {
          return banner.id !== action.payload.id;
        });
      }

      break;

    case MenuTypes.GET_MENU_SETTINGS_REQUEST:
      draft.loadingSettings = true;
      break;
    case MenuTypes.GET_MENU_SETTINGS_SUCCESS:
      draft.loadingSettings = false;
      draft.settings = action.payload;
      break;
    case MenuTypes.GET_MENU_SETTINGS_FAILED:
      draft.loadingSettings = false;
      break;

    case MenuTypes.UPDATE_MENU_SETTINGS_REQUEST:
      draft.savingSettings = true;
      break;
    case MenuTypes.UPDATE_MENU_SETTINGS_SUCCESS:
      draft.savingSettings = false;
      draft.settings = action.payload;
      break;
    case MenuTypes.UPDATE_MENU_SETTINGS_FAILED:
      draft.savingSettings = false;
      break;

    case MenuTypes.UPDATE_LIST_MENU_BANNER:
      if (action.payload.type === 'home') {
        draft.bannersHome = action.payload.banners;
      } else {
        draft.bannersContent = action.payload.banners;
      }
      break;

    case MenuTypes.DELETE_MENU_FAILED:
      break;

    case MenuTypes.GET_GOOGLE_MENU_STATUS_REQUEST:
      draft.loading = true;
      break;
    case MenuTypes.GET_GOOGLE_MENU_STATUS_SUCCESS:
      draft.loading = false;
      draft.googleMenuStatus = action.payload.status;
      break;
    case MenuTypes.GET_GOOGLE_MENU_STATUS_FAILED:
      draft.loading = false;
      draft.googleMenuStatus = 'error';
      break;
  }
}, INITIAL_STATE);

export default menu;
