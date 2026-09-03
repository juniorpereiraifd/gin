import produce from 'immer';
import { HallItemProps } from 'src/store/modules/hall/reducer';
import type { Pagination } from 'src/types';
import { Types as UnityTypes } from './actions';
import { Types as LineTypes } from '../line/actions';
import { Types as VoucherTypes } from '../voucher/actions';
import { MenuTypes } from '../menu/actions';
import { Types as ReservationTypes } from '../reservation/actions';
import { Types as NpsTypes } from '../nps/actions';
import { MarketingTypes } from '../marketing/actions';
import type { REPORTS_STATUS } from '../dashboard/reducer';

export type Cuisine = {
  id: string;
  name: string;
  slug: string;
};

export type Occasion = {
  id: string;
  name: string;
  slug: string;
};

export const MODULES_KEYS = ['reservation', 'line', 'menu', 'voucher', 'nps', 'marketing'] as const;

export type Module = { [key in (typeof MODULES_KEYS)[number]]: boolean | null };

type ImageProps = {
  path: string;
};

type MetadataProps = {
  apoie_um_restaurante?: boolean;
  voucher_limit_control?: boolean;
  voucher_limit?: number;
};

type Coordinates = {
  lat: number;
  lng: number;
};

export type UnitBaseInformation = {
  id?: string | number;
  taxpayer_identification: string;
  name: string;
  about: string;
  telephone: string;
  cover: {
    name: string;
    content: string;
  } | null;
  logo: {
    name: string;
    content: string;
  } | null;
  website: string | null;
  timezone: string;
};

export type UnitAddress = {
  address: string;
  neighborhood: string;
  number: string;
  state_id: string;
  city_id: string;
  zipcode: string;
  complement?: string;
  coordinates?: Coordinates;
  is_forced_coordinates?: boolean;
};

export type UnityItemProps = {
  key: number | string;
  id: string;
  taxpayer_identification: string | null;
  average_ticket: number;
  published_at: string;
  name: string;
  zipcode: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  cover_image: string;
  profile_image: string;
  payment_description: string;
  opening_hours_description: string;
  telephone: string;
  city_id: string;
  state_id: string;
  logo: string;
  hall: number;
  halls: Array<HallItemProps>;
  photos: Array<{ id: string | number; photo: ImageProps }>;
  location: string;
  about: string;
  website: string;
  operators: number;
  status: 'listed' | 'not-listed' | 'suspended';
  metadata: MetadataProps;
  amenities: {
    id: string;
    amenity_id: string;
    amenity_name: string;
    category_id: string;
    category_name: string;
  }[];
  cuisines: Cuisine[];
  occasions: Occasion[];
  city_slug: string;
  company_name: string;
  company_start_date: string;
  slug: string;
  price_range: string;
  price_range_description: string;
  financial_email: string;
  full_address: string;
  coordinates: Coordinates;
  is_forced_coordinates?: boolean;
  timezone: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  settings?: {
    flow_reports_status?: (typeof REPORTS_STATUS)[number];
    communication_reports_status?: (typeof REPORTS_STATUS)[number];
  };
};

export type AmenitiesProps = {
  name: string;
  id: string;
  category_name: string;
  category_id: string;
}[];

export type UnityProps = {
  loading: boolean;
  saving: boolean;
  savingModuleControl: boolean;
  created: UnityItemProps | null;
  data: Array<UnityItemProps>;
  pagination: Pagination | null;
  amenities: AmenitiesProps | null;
  unitModules: Module;
};

export const INITIAL_STATE: UnityProps = {
  loading: false,
  saving: false,
  savingModuleControl: false,
  created: null,
  data: [],
  pagination: null,
  amenities: null,
  unitModules: {
    reservation: null,
    line: null,
    menu: null,
    voucher: null,
    nps: null,
    marketing: null,
  },
};

const unity = produce((draft: UnityProps, action) => {
  switch (action.type) {
    case UnityTypes.GET_UNITS_REQUEST:
      draft.loading = true;
      if (action.payload.page && action.payload.page === 1) {
        draft.data = [];
      }
      break;
    case UnityTypes.GET_UNITS_SUCCESS:
      draft.loading = false;
      if (action.payload.isCumulative === true) {
        draft.data = draft.data.concat(action.payload.units);
      } else {
        draft.data = action.payload.units;
      }
      draft.pagination = action.payload.pagination;
      break;
    case UnityTypes.GET_UNITS_FAILED:
      draft.loading = false;
      break;
    case UnityTypes.CREATE_UNITY_REQUEST:
      draft.saving = true;
      break;
    case UnityTypes.CREATE_UNITY_SUCCESS:
      draft.saving = false;
      draft.created = action.payload;
      break;
    case UnityTypes.CREATE_UNITY_FAILED:
      draft.saving = false;
      break;
    case UnityTypes.EDIT_UNITY_REQUEST:
      draft.saving = true;
      break;
    case UnityTypes.EDIT_UNITY_SUCCESS:
      draft.saving = false;
      draft.created = null;
      break;
    case UnityTypes.EDIT_UNITY_FAILED:
      draft.saving = false;
      break;

    case UnityTypes.ACTIVE_UNITY_SUPPORT_RESTAURANT_REQUEST:
      draft.loading = true;
      break;

    case UnityTypes.ACTIVE_UNITY_SUPPORT_RESTAURANT_SUCCESS:
      draft.loading = false;
      break;

    case UnityTypes.ACTIVE_UNITY_SUPPORT_RESTAURANT_FAILED:
      draft.loading = false;
      break;

    case UnityTypes.GET_LIST_AMENITIES_REQUEST:
      draft.loading = true;
      break;
    case UnityTypes.GET_LIST_AMENITIES_SUCCESS:
      draft.loading = false;
      draft.amenities = action.payload;
      break;
    case UnityTypes.GET_LIST_AMENITIES_FAILED:
      draft.loading = false;
      break;

    case UnityTypes.ADD_LIST_AMENITIES_REQUEST:
      draft.saving = true;
      break;
    case UnityTypes.ADD_LIST_AMENITIES_SUCCESS:
      draft.saving = false;
      break;
    case UnityTypes.ADD_LIST_AMENITIES_FAILED:
      draft.saving = false;
      break;

    case UnityTypes.UPDATE_UNIT_MODULE_REQUEST:
      draft.savingModuleControl = true;
      break;
    case UnityTypes.UPDATE_UNIT_MODULE_SUCCESS:
      draft.savingModuleControl = false;
      break;
    case UnityTypes.UPDATE_UNIT_MODULE_FAILED:
      draft.savingModuleControl = false;
      break;

    case UnityTypes.RESET_UNITY_DATA:
      draft.data = [];
      draft.pagination = null;
      break;

    // External actions
    case LineTypes.GET_LINE_SETTINGS_SUCCESS:
      draft.unitModules.line = action.payload.enabled;
      break;
    case LineTypes.GET_LINE_SETTINGS_FAILED:
      draft.unitModules.line = false;
      break;
    case LineTypes.UPDATE_LINE_SETTINGS_SUCCESS:
      draft.unitModules.line = action.payload.enabled;
      draft.savingModuleControl = false;
      break;

    case VoucherTypes.GET_VOUCHER_SETTINGS_SUCCESS:
      draft.unitModules.voucher = action.payload.enabled;
      break;
    case VoucherTypes.GET_VOUCHER_SETTINGS_FAILED:
      draft.unitModules.voucher = false;
      break;
    case VoucherTypes.UPDATE_VOUCHER_SETTINGS_SUCCESS:
      draft.unitModules.voucher = action.payload.enabled;
      draft.savingModuleControl = false;
      break;

    case MenuTypes.GET_MENU_SETTINGS_SUCCESS:
      draft.unitModules.menu = action.payload.enabled;
      break;
    case MenuTypes.GET_MENU_SETTINGS_FAILED:
      draft.unitModules.menu = false;
      break;
    case MenuTypes.UPDATE_MENU_SETTINGS_SUCCESS:
      draft.unitModules.menu = action.payload.enabled;
      draft.savingModuleControl = false;
      break;

    case ReservationTypes.GET_RESERVATION_SETTINGS_SUCCESS:
      draft.unitModules.reservation = action.payload.enabled;
      break;
    case ReservationTypes.GET_RESERVATION_SETTINGS_FAILED:
      draft.unitModules.reservation = false;
      break;
    case ReservationTypes.UPDATE_RESERVATION_SETTINGS_SUCCESS:
      draft.unitModules.reservation = action.payload.enabled;
      draft.savingModuleControl = false;
      break;

    case NpsTypes.GET_NPS_SETTINGS_SUCCESS:
      draft.unitModules.nps = action.payload.enabled;
      break;
    case NpsTypes.GET_NPS_SETTINGS_FAILED:
      draft.unitModules.nps = false;
      break;
    case NpsTypes.UPDATE_NPS_SETTINGS_SUCCESS:
      draft.unitModules.nps = action.payload.enabled;
      draft.savingModuleControl = false;
      break;

    case MarketingTypes.GET_MARKETING_SETTINGS_SUCCESS:
      draft.unitModules.marketing = action.payload.enabled;
      break;
    case MarketingTypes.GET_MARKETING_SETTINGS_FAILED:
      draft.unitModules.marketing = false;
      break;
    case MarketingTypes.UPDATE_MARKETING_SETTINGS_SUCCESS:
      draft.unitModules.marketing = action.payload.enabled;
      draft.savingModuleControl = false;
      break;
  }
}, INITIAL_STATE);

export default unity;
