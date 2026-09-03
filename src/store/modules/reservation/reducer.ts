import produce from 'immer';
import { Types as ReservationTypes } from './actions';
import { ModalStateEnum, ModalProps } from 'src/types';

export type ReservationSettings = {
  additional_information: string;
  billing_enabled: boolean;
  billing_type: { pix: boolean; credit: boolean };
  conditions: string;
  created_at: string;
  days_in_advance: number;
  enabled: boolean;
  getin_tax: string;
  google_reserve_enabled: boolean;
  id: string;
  installments_enabled: boolean;
  installments_max: number;
  noshow_enabled: boolean;
  noshow_hours_in_advance: number;
  noshow_getin_tax: number;
  notification_email: string;
  notification_email_enabled: boolean;
  nps_enabled: boolean;
  overbook_allowed_for_agent: boolean;
  seller_token: string;
  tolerance: number;
  unit_id: string;
  updated_at: string;
};

export type NotificationEmailItemProps = {
  id?: string;
  email: string;
};

export type ReservationProps = {
  loading: boolean;
  loadingSettings: boolean;
  saving: boolean;
  savingSettings: boolean;
  editable: NotificationEmailItemProps | null;
  notifications: Array<NotificationEmailItemProps>;
  isOpen: ModalProps;
  settings: ReservationSettings | null;
};

export const INITIAL_STATE: ReservationProps = {
  loading: true,
  loadingSettings: false,
  saving: false,
  savingSettings: false,
  editable: null,
  notifications: [],
  isOpen: ModalStateEnum.CLOSED,
  settings: null,
};

const reservation = produce((draft: ReservationProps, action) => {
  switch (action.type) {
    case ReservationTypes.GET_NOTIFICATION_EMAILS_REQUEST:
      draft.loading = true;
      break;
    case ReservationTypes.GET_NOTIFICATION_EMAILS_SUCCESS:
      draft.loading = false;
      draft.notifications = action.payload;
      break;
    case ReservationTypes.GET_NOTIFICATION_EMAILS_FAILED:
      draft.loading = false;
      draft.saving = false;
      break;
    case ReservationTypes.CREATE_NOTIFICATION_EMAIL_REQUEST:
      draft.saving = true;
      break;
    case ReservationTypes.CREATE_NOTIFICATION_EMAIL_SUCCESS:
      draft.saving = false;
      draft.notifications.push(action.payload);
      draft.isOpen = ModalStateEnum.CLOSED;
      break;
    case ReservationTypes.CREATE_NOTIFICATION_EMAIL_FAILED:
      draft.saving = false;
      break;

    case ReservationTypes.SET_EDITABLE_NOTIFICATION_EMAIL_ITEM:
      draft.editable = action.payload;
      draft.isOpen = ModalStateEnum.OPENED;

      break;
    case ReservationTypes.EDIT_NOTIFICATION_EMAIL_REQUEST:
      draft.saving = true;
      break;
    case ReservationTypes.EDIT_NOTIFICATION_EMAIL_SUCCESS:
      draft.saving = false;
      draft.isOpen = ModalStateEnum.CLOSED;
      draft.notifications[draft.notifications.findIndex((notification) => notification.id === action.payload.id)] =
        action.payload;

      break;
    case ReservationTypes.EDIT_NOTIFICATION_EMAIL_FAILED:
      draft.saving = false;
      break;
    case ReservationTypes.DELETE_NOTIFICATION_EMAIL_SUCCESS:
      draft.notifications = draft.notifications.filter((notification) => notification.id !== action.payload);
      break;
    case ReservationTypes.DELETE_NOTIFICATION_EMAIL_FAILED:
      draft.saving = false;
      break;
    case ReservationTypes.SHOW_MODAL:
      draft.editable = null;
      draft.isOpen = ModalStateEnum.OPENED;
      break;
    case ReservationTypes.HIDE_MODAL:
      draft.isOpen = ModalStateEnum.CLOSED;
      break;

    case ReservationTypes.GET_RESERVATION_SETTINGS_REQUEST:
      draft.loadingSettings = true;
      break;
    case ReservationTypes.GET_RESERVATION_SETTINGS_SUCCESS:
      draft.loadingSettings = false;
      draft.settings = action.payload;
      break;
    case ReservationTypes.GET_RESERVATION_SETTINGS_FAILED:
      draft.loadingSettings = false;
      break;

    case ReservationTypes.UPDATE_RESERVATION_SETTINGS_REQUEST:
      draft.savingSettings = true;
      break;
    case ReservationTypes.UPDATE_RESERVATION_SETTINGS_SUCCESS:
      draft.savingSettings = false;
      draft.settings = action.payload;
      break;
    case ReservationTypes.UPDATE_RESERVATION_SETTINGS_FAILED:
      draft.savingSettings = false;
      break;
  }
}, INITIAL_STATE);

export default reservation;
