import produce from 'immer';

import { Types as ComunicationTypes } from './actions';

export type CommunicationService = 'line' | 'reservation' | 'nps' | 'voucher';

export type UpdateMessageSendingProps = {
  unitId: string;
  channel: 'sms' | 'email' | 'push' | 'whatsapp';
  service: CommunicationService;
  value: boolean;
};

export type SmsVariablesProps = {
  type: string;
  text: string;
  size: number;
};

export type SmsMessageProps = {
  type: string;
  text: string;
  default: string;
  variables: SmsVariablesProps[];
};

export type SettingsMessageProps = {
  id: string;
  unit_id: string;
  custom_sms_enabled: boolean;
  created_at: string;
  updated_at: string;
  metadata: {
    infobip: string | null;
  };
  custom_sms: {
    [key: string]: {
      [key: string]: string;
    };
  };
  channels: {
    sms: {
      line: boolean;
      reservation: boolean;
      nps: boolean;
      voucher: boolean;
    };
    whatsapp: {
      line: boolean;
      reservation: boolean;
      nps: boolean;
      voucher: boolean;
    };
    email: {
      line: boolean;
      reservation: boolean;
      nps: boolean;
      voucher: boolean;
    };
  };
};

export type ComunicationProps = {
  saving: boolean;
  savingSettings: boolean;
  loading: boolean;
  errors: {
    name: string;
    errors: string[];
  }[];
  smsMessageData: { reservation: SmsMessageProps[]; line: SmsMessageProps[] };
  settings: SettingsMessageProps | null;
};

export const INITIAL_STATE: ComunicationProps = {
  saving: false,
  savingSettings: false,
  loading: true,
  errors: [],
  smsMessageData: { reservation: [], line: [] },
  settings: null,
};

const comunication = produce((draft: ComunicationProps, action) => {
  switch (action.type) {
    case ComunicationTypes.GET_SMS_MESSAGE_DATA_REQUEST:
      draft.loading = true;
      break;
    case ComunicationTypes.GET_SMS_MESSAGE_DATA_SUCCESS:
      draft.loading = false;

      if (action.payload.service === 'reservation') {
        draft.smsMessageData = {
          ...draft.smsMessageData,
          reservation: action.payload.data,
        };
      } else {
        draft.smsMessageData = {
          ...draft.smsMessageData,
          line: action.payload.data,
        };
      }
      break;
    case ComunicationTypes.GET_SMS_MESSAGE_DATA_FAILED:
      draft.loading = false;
      break;

    case ComunicationTypes.GET_SETTINGS_MESSAGE_REQUEST:
      draft.loading = true;
      break;
    case ComunicationTypes.GET_SETTINGS_MESSAGE_SUCCESS:
      draft.loading = false;
      draft.settings = action.payload;
      break;
    case ComunicationTypes.GET_SETTINGS_MESSAGE_FAILED:
      draft.loading = false;
      draft.settings = null;
      break;

    case ComunicationTypes.EDIT_SETTINGS_MESSAGE_REQUEST:
      draft.saving = true;
      break;
    case ComunicationTypes.EDIT_SETTINGS_MESSAGE_SUCCESS:
      draft.saving = false;
      draft.settings = action.payload;
      break;
    case ComunicationTypes.EDIT_SETTINGS_MESSAGE_FAILED:
      draft.saving = false;
      draft.settings = null;
      break;

    case ComunicationTypes.UPDATE_MESSAGE_SENDING_REQUEST:
      draft.savingSettings = true;
      break;
    case ComunicationTypes.UPDATE_MESSAGE_SENDING_SUCCESS:
      draft.savingSettings = false;
      break;
    case ComunicationTypes.UPDATE_MESSAGE_SENDING_FAILED:
      draft.savingSettings = false;
      break;
  }
}, INITIAL_STATE);

export default comunication;
