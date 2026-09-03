import { ActionCreators, createActions } from 'reduxsauce';
import { NotificationEmailItemProps, ReservationSettings } from './reducer';

export enum Types {
  GET_NOTIFICATION_EMAILS_REQUEST = '@reservation/GET_NOTIFICATION_EMAILS_REQUEST',
  GET_NOTIFICATION_EMAILS_SUCCESS = '@reservation/GET_NOTIFICATION_EMAILS_SUCCESS',
  GET_NOTIFICATION_EMAILS_FAILED = '@reservation/GET_NOTIFICATION_EMAILS_FAILED',

  CREATE_NOTIFICATION_EMAIL_REQUEST = '@reservation/CREATE_NOTIFICATION_EMAIL_REQUEST',
  CREATE_NOTIFICATION_EMAIL_SUCCESS = '@reservation/CREATE_NOTIFICATION_EMAIL_SUCCESS',
  CREATE_NOTIFICATION_EMAIL_FAILED = '@reservation/CREATE_NOTIFICATION_EMAIL_FAILED',

  SET_EDITABLE_NOTIFICATION_EMAIL_ITEM = '@reservation/SET_EDITABLE_NOTIFICATION_EMAIL_ITEM',
  EDIT_NOTIFICATION_EMAIL_REQUEST = '@reservation/EDIT_NOTIFICATION_EMAIL_REQUEST',
  EDIT_NOTIFICATION_EMAIL_SUCCESS = '@reservation/EDIT_NOTIFICATION_EMAIL_SUCCESS',
  EDIT_NOTIFICATION_EMAIL_FAILED = '@reservation/EDIT_NOTIFICATION_EMAIL_FAILED',

  DELETE_NOTIFICATION_EMAIL_REQUEST = '@reservation/DELETE_NOTIFICATION_EMAIL_REQUEST',
  DELETE_NOTIFICATION_EMAIL_SUCCESS = '@reservation/DELETE_NOTIFICATION_EMAIL_SUCCESS',
  DELETE_NOTIFICATION_EMAIL_FAILED = '@reservation/DELETE_NOTIFICATION_EMAIL_FAILED',

  GET_RESERVATION_SETTINGS_REQUEST = '@reservation/GET_RESERVATION_SETTINGS_REQUEST',
  GET_RESERVATION_SETTINGS_SUCCESS = '@reservation/GET_RESERVATION_SETTINGS_SUCCESS',
  GET_RESERVATION_SETTINGS_FAILED = '@reservation/GET_RESERVATION_SETTINGS_FAILED',

  UPDATE_RESERVATION_SETTINGS_REQUEST = '@reservation/UPDATE_RESERVATION_SETTINGS_REQUEST',
  UPDATE_RESERVATION_SETTINGS_SUCCESS = '@reservation/UPDATE_RESERVATION_SETTINGS_SUCCESS',
  UPDATE_RESERVATION_SETTINGS_FAILED = '@reservation/UPDATE_RESERVATION_SETTINGS_FAILED',

  SHOW_MODAL = '@reservation/SHOW_MODAL',
  HIDE_MODAL = '@reservation/HIDE_MODAL',
}

interface Actions extends ActionCreators {
  getNotificationEmailsRequest: () => {
    type: Types.GET_NOTIFICATION_EMAILS_REQUEST;
  };
  getNotificationEmailsSuccess: (
    payload: Array<NotificationEmailItemProps>
  ) => {
    type: Types.GET_NOTIFICATION_EMAILS_SUCCESS;
  };
  getNotificationEmailsFailed: () => {
    type: Types.GET_NOTIFICATION_EMAILS_FAILED;
  };

  createNotificationEmailRequest: (
    notification_email: NotificationEmailItemProps
  ) => {
    type: Types.CREATE_NOTIFICATION_EMAIL_REQUEST;
  };
  createNotificationEmailSuccess: (
    notification_email: NotificationEmailItemProps
  ) => {
    type: Types.CREATE_NOTIFICATION_EMAIL_SUCCESS;
  };
  createNotificationEmailFailed: () => {
    type: Types.CREATE_NOTIFICATION_EMAIL_FAILED;
  };

  setEditableNotificationEmailItem: (
    notification_email: NotificationEmailItemProps
  ) => {
    type: Types.SET_EDITABLE_NOTIFICATION_EMAIL_ITEM;
  };
  editNotificationEmailRequest: (
    email: NotificationEmailItemProps
  ) => {
    type: Types.EDIT_NOTIFICATION_EMAIL_REQUEST;
  };
  editNotificationEmailSuccess: (
    notification_email: NotificationEmailItemProps
  ) => {
    type: Types.EDIT_NOTIFICATION_EMAIL_SUCCESS;
  };
  editNotificationEmailFailed: () => {
    type: Types.EDIT_NOTIFICATION_EMAIL_FAILED;
  };

  deleteNotificationEmailRequest: (
    notification_email_id: NotificationEmailItemProps
  ) => {
    type: Types.DELETE_NOTIFICATION_EMAIL_REQUEST;
  };
  deleteNotificationEmailSuccess: (
    notification_email_id?: string
  ) => {
    type: Types.DELETE_NOTIFICATION_EMAIL_SUCCESS;
  };
  deleteNotificationEmailFailed: () => {
    type: Types.DELETE_NOTIFICATION_EMAIL_FAILED;
  };

  getReservationSettingsRequest: () => {
    type: Types.GET_RESERVATION_SETTINGS_REQUEST;
  };
  getReservationSettingsSuccess: (
    payload: ReservationSettings
  ) => {
    type: Types.GET_RESERVATION_SETTINGS_SUCCESS;
    payload: ReservationSettings;
  };
  getReservationSettingsFailed: () => {
    type: Types.GET_RESERVATION_SETTINGS_FAILED;
  };

  updateReservationSettingsRequest: (
    payload: Partial<ReservationSettings>
  ) => {
    type: Types.UPDATE_RESERVATION_SETTINGS_REQUEST;
    payload: Partial<ReservationSettings>;
  };
  updateReservationSettingsSuccess: (
    payload: ReservationSettings
  ) => {
    type: Types.UPDATE_RESERVATION_SETTINGS_SUCCESS;
    payload: ReservationSettings;
  };
  updateReservationSettingsFailed: () => {
    type: Types.UPDATE_RESERVATION_SETTINGS_FAILED;
  };

  showModal: () => {
    type: Types.SHOW_MODAL;
  };

  hideModal: () => {
    type: Types.HIDE_MODAL;
  };
}

const CreatedActions = createActions(
  {
    getNotificationEmailsRequest: [],
    getNotificationEmailsSuccess: ['payload'],
    getNotificationEmailsFailed: [],

    createNotificationEmailRequest: ['payload'],
    createNotificationEmailSuccess: ['payload'],
    createNotificationEmailFailed: [],

    setEditableNotificationEmailItem: ['payload'],
    editNotificationEmailRequest: ['payload'],
    editNotificationEmailSuccess: ['payload'],
    editNotificationEmailFailed: [],

    deleteNotificationEmailRequest: ['payload'],
    deleteNotificationEmailSuccess: ['payload'],
    deleteNotificationEmailFailed: [],

    getReservationSettingsRequest: [],
    getReservationSettingsSuccess: ['payload'],
    getReservationSettingsFailed: [],

    updateReservationSettingsRequest: ['payload'],
    updateReservationSettingsSuccess: ['payload'],
    updateReservationSettingsFailed: [],

    showModal: [],
    hideModal: [],
  },
  {
    prefix: '@reservation/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
