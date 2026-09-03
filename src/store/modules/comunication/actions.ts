import { ActionCreators, createActions } from 'reduxsauce';
import {
  SmsMessageProps,
  SettingsMessageProps,
  UpdateMessageSendingProps,
  CommunicationService,
} from './reducer';

export enum Types {
  GET_SMS_MESSAGE_DATA_REQUEST = '@comunication/GET_SMS_MESSAGE_DATA_REQUEST',
  GET_SMS_MESSAGE_DATA_SUCCESS = '@comunication/GET_SMS_MESSAGE_DATA_SUCCESS',
  GET_SMS_MESSAGE_DATA_FAILED = '@comunication/GET_SMS_MESSAGE_DATA_FAILED',

  GET_SETTINGS_MESSAGE_REQUEST = '@comunication/GET_SETTINGS_MESSAGE_REQUEST',
  GET_SETTINGS_MESSAGE_SUCCESS = '@comunication/GET_SETTINGS_MESSAGE_SUCCESS',
  GET_SETTINGS_MESSAGE_FAILED = '@comunication/GET_SETTINGS_MESSAGE_FAILED',

  EDIT_SETTINGS_MESSAGE_REQUEST = '@comunication/EDIT_SETTINGS_MESSAGE_REQUEST',
  EDIT_SETTINGS_MESSAGE_SUCCESS = '@comunication/EDIT_SETTINGS_MESSAGE_SUCCESS',
  EDIT_SETTINGS_MESSAGE_FAILED = '@comunication/EDIT_SETTINGS_MESSAGE_FAILED',

  UPDATE_MESSAGE_SENDING_REQUEST = '@comunication/UPDATE_MESSAGE_SENDING_REQUEST',
  UPDATE_MESSAGE_SENDING_SUCCESS = '@comunication/UPDATE_MESSAGE_SENDING_SUCCESS',
  UPDATE_MESSAGE_SENDING_FAILED = '@comunication/UPDATE_MESSAGE_SENDING_FAILED',
}

interface Actions extends ActionCreators {
  getSmsMessageDataRequest: (payload: {
    service: CommunicationService;
    unitId: string;
  }) => {
    type: Types.GET_SMS_MESSAGE_DATA_REQUEST;
    payload: {
      service: CommunicationService;
      unitId: string;
    };
  };
  getSmsMessageDataSuccess: (payload: {
    service: CommunicationService;
    data: SmsMessageProps[];
  }) => {
    type: Types.GET_SMS_MESSAGE_DATA_SUCCESS;
    payload: { service: CommunicationService; data: SmsMessageProps[] };
  };
  getSmsMessageDataFailed: () => {
    type: Types.GET_SMS_MESSAGE_DATA_FAILED;
  };

  getSettingsMessageRequest: (payload: {
    unitId: string;
  }) => {
    type: Types.GET_SETTINGS_MESSAGE_REQUEST;
    payload: { unitId: string };
  };
  getSettingsMessageSuccess: (
    payload: SettingsMessageProps
  ) => {
    type: Types.GET_SETTINGS_MESSAGE_SUCCESS;
    payload: SettingsMessageProps;
  };
  getSettingsMessageFailed: () => {
    type: Types.GET_SETTINGS_MESSAGE_FAILED;
  };

  editSettingsMessageRequest: (payload: {
    customSmsData: { [key: string]: { [key: string]: string } };
    unitId: string;
    settingId: string;
  }) => {
    type: Types.EDIT_SETTINGS_MESSAGE_REQUEST;
    payload: {
      customSmsData: { [key: string]: { [key: string]: string } };
      unitId: string;
      settingId: string;
    };
  };
  editSettingsMessageSuccess: (
    payload: SettingsMessageProps
  ) => {
    type: Types.EDIT_SETTINGS_MESSAGE_SUCCESS;
    payload: SettingsMessageProps;
  };
  editSettingsMessageFailed: () => {
    type: Types.EDIT_SETTINGS_MESSAGE_FAILED;
  };

  updateMessageSendingRequest: (
    payload: UpdateMessageSendingProps
  ) => {
    type: Types.UPDATE_MESSAGE_SENDING_REQUEST;
    payload: UpdateMessageSendingProps;
  };
  updateMessageSendingSuccess: () => {
    type: Types.UPDATE_MESSAGE_SENDING_SUCCESS;
  };
  updateMessageSendingFailed: () => {
    type: Types.UPDATE_MESSAGE_SENDING_FAILED;
  };
}

const CreatedActions = createActions(
  {
    getSmsMessageDataRequest: ['payload'],
    getSmsMessageDataSuccess: ['payload'],
    getSmsMessageDataFailed: [],

    getSettingsMessageRequest: ['payload'],
    getSettingsMessageSuccess: ['payload'],
    getSettingsMessageFailed: [],

    editSettingsMessageRequest: ['payload'],
    editSettingsMessageSuccess: ['payload'],
    editSettingsMessageFailed: [],

    updateMessageSendingRequest: ['payload'],
    updateMessageSendingSuccess: [],
    updateMessageSendingFailed: [],
  },
  {
    prefix: '@comunication/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
