import produce from 'immer';
import { Types as SettingTypes } from './actions';
import type { PaymentProviderValues } from 'src/utils/constants';
import type { ScheduleBillingTypeValue } from '../schedule/reducer';

export type PosParamsType = {
  companyCode?: string;
  fractionPriceOption?: string;
  type?: string;
  host?: string;
  mode?: string;
  port?: string;
  store?: string;
  userName?: string;
  priceOrigin?: string;
};

export type MenuSettingsProps = {
  id: string;
  uuid: string;
  enabled: boolean;
  pos_connector: string | null;
  pos_action: [] | null;
  pos_action_with_error: string | null;
  pos_last_sync: string | null;
  pos_params: PosParamsType;
  hide_price_enabled: boolean;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  show_in_reservation: boolean;
  show_in_line: boolean;
} | null;

export type GoogleReserveIntegrationStatus = 'pending' | 'declined' | 'accepted' | 'unknown';

export type ReservationPaymentSettingsProps = {
  billing_enabled: boolean;
  getin_tax: string;
  noshow_enabled: boolean;
  noshow_getin_tax: string;
  noshow_hours_in_advance: number;
  noshow_tax: number;
  billing_service: {
    reserve: PaymentProviderValues;
    noshow: PaymentProviderValues;
  };
  billing_provider: {
    zoop?: string;
    iugu?: string;
  } | null;
  billing_type: {
    pix: boolean;
    credit: boolean;
  };
  noshow_fallback: {
    enabled: boolean;
    billing_type: ScheduleBillingTypeValue;
    price: number;
    refund_hours: number;
  };
};

export type ReservationSettingsProps = ReservationPaymentSettingsProps & {
  id?: string;
  enabled: boolean;
  conditions: string;
  days_in_advance: number;
  tolerance: number;
  additional_information: string;
  google_reserve_enabled: boolean;
  cena_enabled: boolean;
  overbook_allowed_for_agent: boolean;
  nps_enabled: boolean;
  products_enabled: boolean;
  installments_enabled: boolean;
  installments_max: number;
  notification_email_enabled: boolean;
  notification_email: string;
};

export type SettingProps = {
  saving: boolean;
  loading: boolean;
  reservation: ReservationSettingsProps | null;
  menu: MenuSettingsProps;
  googleReserveStatus: GoogleReserveIntegrationStatus | null;
  show_in_reservation: boolean | null;
  show_in_line: boolean | null;
};

export const INITIAL_STATE: SettingProps = {
  loading: true,
  saving: false,
  reservation: null,
  menu: null,
  googleReserveStatus: null,
  show_in_reservation: null,
  show_in_line: null,
};

const setting = produce((draft: SettingProps, action) => {
  switch (action.type) {
    case SettingTypes.GET_SETTING_REQUEST:
      draft.loading = true;
      break;
    case SettingTypes.GET_SETTING_SUCCESS:
      draft.loading = false;
      draft.reservation = action.payload;
      break;
    case SettingTypes.GET_SETTING_FAILED:
      draft.loading = false;
      break;

    case SettingTypes.GET_MENU_SETTING_REQUEST:
      draft.loading = true;
      break;
    case SettingTypes.GET_MENU_SETTING_SUCCESS:
      draft.loading = false;
      draft.menu = action.payload;
      break;
    case SettingTypes.GET_MENU_SETTING_FAILED:
      draft.loading = false;
      break;

    case SettingTypes.SAVE_SETTING_REQUEST:
      draft.saving = true;
      break;
    case SettingTypes.SAVE_SETTING_SUCCESS:
      draft.saving = false;
      draft.reservation = action.payload;
      break;
    case SettingTypes.SAVE_SETTING_FAILED:
      draft.saving = false;
      break;

    case SettingTypes.SAVE_MENU_SETTING_REQUEST:
      draft.saving = true;
      break;
    case SettingTypes.SAVE_MENU_SETTING_SUCCESS:
      draft.saving = false;
      draft.menu = action.payload;
      break;
    case SettingTypes.SAVE_MENU_SETTING_FAILED:
      draft.saving = false;
      break;

    case SettingTypes.GET_GOOGLE_RESERVE_STATUS_REQUEST:
      draft.loading = true;
      break;
    case SettingTypes.GET_GOOGLE_RESERVE_STATUS_SUCCESS:
      draft.loading = false;
      draft.googleReserveStatus = action.payload.status;
      break;
    case SettingTypes.GET_GOOGLE_RESERVE_STATUS_FAILED:
      draft.loading = false;
      draft.saving = false;
      draft.googleReserveStatus = null;
      break;

    case SettingTypes.SHOW_IN_RESERVATION_REQUEST:
      draft.show_in_reservation = true;
      draft.saving = true;
      break;
    case SettingTypes.SHOW_IN_RESERVATION_SUCCESS:
      draft.saving = false;
      draft.show_in_reservation = action.payload;
      break;
    case SettingTypes.SHOW_IN_RESERVATION_FAILED:
      draft.saving = false;
      draft.show_in_reservation = false;
      break;

    case SettingTypes.SHOW_IN_LINE_REQUEST:
      draft.show_in_line = true;
      draft.saving = true;
      break;
    case SettingTypes.SHOW_IN_LINE_SUCCESS:
      draft.saving = false;
      draft.show_in_line = action.payload;
      break;
    case SettingTypes.SHOW_IN_LINE_FAILED:
      draft.saving = false;
      draft.show_in_line = false;
      break;
  }
}, INITIAL_STATE);

export default setting;
