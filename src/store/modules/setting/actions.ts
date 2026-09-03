import { ActionCreators, createActions } from 'reduxsauce';
import { ReservationSettingsProps, GoogleReserveIntegrationStatus, MenuSettingsProps } from './reducer';

export enum Types {
  GET_SETTING_REQUEST = '@setting/GET_SETTING_REQUEST',
  GET_SETTING_SUCCESS = '@setting/GET_SETTING_SUCCESS',
  GET_SETTING_FAILED = '@setting/GET_SETTING_FAILED',

  SAVE_SETTING_REQUEST = '@setting/SAVE_SETTING_REQUEST',
  SAVE_SETTING_SUCCESS = '@setting/SAVE_SETTING_SUCCESS',
  SAVE_SETTING_FAILED = '@setting/SAVE_SETTING_FAILED',

  GET_MENU_SETTING_REQUEST = '@setting/GET_MENU_SETTING_REQUEST',
  GET_MENU_SETTING_SUCCESS = '@setting/GET_MENU_SETTING_SUCCESS',
  GET_MENU_SETTING_FAILED = '@setting/GET_MENU_SETTING_FAILED',

  SAVE_MENU_SETTING_REQUEST = '@setting/SAVE_MENU_SETTING_REQUEST',
  SAVE_MENU_SETTING_SUCCESS = '@setting/SAVE_MENU_SETTING_SUCCESS',
  SAVE_MENU_SETTING_FAILED = '@setting/SAVE_MENU_SETTING_FAILED',

  GET_GOOGLE_RESERVE_STATUS_REQUEST = '@setting/GET_GOOGLE_RESERVE_STATUS_REQUEST',
  GET_GOOGLE_RESERVE_STATUS_SUCCESS = '@setting/GET_GOOGLE_RESERVE_STATUS_SUCCESS',
  GET_GOOGLE_RESERVE_STATUS_FAILED = '@setting/GET_GOOGLE_RESERVE_STATUS_FAILED',

  SHOW_IN_RESERVATION_REQUEST = '@setting/SHOW_IN_RESERVATION_REQUEST',
  SHOW_IN_RESERVATION_SUCCESS = '@setting/SHOW_IN_RESERVATION_SUCCESS',
  SHOW_IN_RESERVATION_FAILED = '@setting/SHOW_IN_RESERVATION_FAILED',

  SHOW_IN_LINE_REQUEST = '@setting/SHOW_IN_LINE_REQUEST',
  SHOW_IN_LINE_SUCCESS = '@setting/SHOW_IN_LINE_SUCCESS',
  SHOW_IN_LINE_FAILED = '@setting/SHOW_IN_LINE_FAILED',
}

interface Actions extends ActionCreators {
  getSettingRequest: () => {
    type: Types.GET_SETTING_REQUEST;
  };
  getSettingSuccess: (reservation: ReservationSettingsProps) => {
    type: Types.GET_SETTING_SUCCESS;
  };
  getSettingFailed: () => {
    type: Types.GET_SETTING_FAILED;
  };

  saveSettingRequest: (reservation: Partial<ReservationSettingsProps>) => {
    type: Types.SAVE_SETTING_REQUEST;
    payload: Partial<ReservationSettingsProps>;
  };
  saveSettingSuccess: (reservation: Partial<ReservationSettingsProps>) => {
    type: Types.SAVE_SETTING_SUCCESS;
  };
  saveSettingFailed: () => {
    type: Types.SAVE_SETTING_FAILED;
  };

  getMenuSettingRequest: () => {
    type: Types.GET_MENU_SETTING_REQUEST;
  };
  getMenuSettingSuccess: (settings: MenuSettingsProps) => {
    type: Types.GET_MENU_SETTING_SUCCESS;
  };
  getMenuSettingFailed: () => {
    type: Types.GET_MENU_SETTING_FAILED;
  };

  saveMenuSettingRequest: (menu: { uuid: string; pos_connector: string; enabled: boolean }) => {
    type: Types.SAVE_MENU_SETTING_REQUEST;
    payload: {
      uuid: string;
      pos_connector: string;
      enabled: boolean;
    };
  };
  saveMenuSettingSuccess: (menu: MenuSettingsProps) => {
    type: Types.SAVE_MENU_SETTING_SUCCESS;
  };
  saveMenuSettingFailed: () => {
    type: Types.SAVE_MENU_SETTING_FAILED;
  };

  getGoogleReserveStatusRequest: () => {
    type: Types.GET_GOOGLE_RESERVE_STATUS_REQUEST;
  };
  getGoogleReserveStatusSuccess: (payload: { status: GoogleReserveIntegrationStatus }) => {
    type: Types.GET_GOOGLE_RESERVE_STATUS_SUCCESS;
  };
  getGoogleReserveStatusFailed: () => {
    type: Types.GET_GOOGLE_RESERVE_STATUS_FAILED;
  };

  showInReservationRequest: (payload: { show_in_reservation: boolean }) => {
    type: Types.SHOW_IN_RESERVATION_REQUEST;
    payload: { show_in_reservation: boolean };
  };

  showInReservationSuccess: (showInReservation: boolean) => {
    type: Types.SHOW_IN_RESERVATION_SUCCESS;
  };

  showInReservationFailed: () => {
    type: Types.SHOW_IN_RESERVATION_FAILED;
  };

  showInLineRequest: (payload: { show_in_line: boolean }) => {
    type: Types.SHOW_IN_LINE_REQUEST;
    payload: { show_in_line: boolean };
  };

  showInLineSuccess: (showInLine: boolean) => {
    type: Types.SHOW_IN_LINE_SUCCESS;
    payload: { show_in_line: boolean };
  };

  showInLineFailed: () => {
    type: Types.SHOW_IN_LINE_FAILED;
  };
}

const CreatedActions = createActions(
  {
    getSettingRequest: ['payload'],
    getSettingSuccess: ['payload'],
    getSettingFailed: [],

    getMenuSettingRequest: ['payload'],
    getMenuSettingSuccess: ['payload'],
    getMenuSettingFailed: [],

    saveSettingRequest: ['payload', 'sms'],
    saveSettingSuccess: ['payload'],
    saveSettingFailed: [],

    saveMenuSettingRequest: ['payload'],
    saveMenuSettingSuccess: ['payload'],
    saveMenuSettingFailed: [],

    getGoogleReserveStatusRequest: [],
    getGoogleReserveStatusSuccess: ['payload'],
    getGoogleReserveStatusFailed: [],

    showInReservationRequest: ['payload'],
    showInReservationSuccess: ['payload'],
    showInReservationFailed: [],

    showInLineRequest: ['payload'],
    showInLineSuccess: ['payload'],
    showInLineFailed: [],
  },
  {
    prefix: '@setting/',
  },
);

export const Creators = CreatedActions.Creators as Actions;
