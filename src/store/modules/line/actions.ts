import { ActionCreators, createActions } from 'reduxsauce';
import { LineSettings } from './reducer';

export enum Types {
  GET_LINE_SETTINGS_REQUEST = '@line/GET_LINE_SETTINGS_REQUEST',
  GET_LINE_SETTINGS_SUCCESS = '@line/GET_LINE_SETTINGS_SUCCESS',
  GET_LINE_SETTINGS_FAILED = '@line/GET_LINE_SETTINGS_FAILED',

  UPDATE_LINE_SETTINGS_REQUEST = '@line/UPDATE_LINE_SETTINGS_REQUEST',
  UPDATE_LINE_SETTINGS_SUCCESS = '@line/UPDATE_LINE_SETTINGS_SUCCESS',
  UPDATE_LINE_SETTINGS_FAILED = '@line/UPDATE_LINE_SETTINGS_FAILED',
}

interface Actions extends ActionCreators {
  getLineSettingsRequest: () => {
    type: Types.GET_LINE_SETTINGS_REQUEST;
  };
  getLineSettingsSuccess: (
    payload: LineSettings
  ) => {
    type: Types.GET_LINE_SETTINGS_SUCCESS;
    payload: LineSettings;
  };
  getLineSettingsFailed: () => {
    type: Types.GET_LINE_SETTINGS_FAILED;
  };

  updateLineSettingsRequest: (
    payload: Partial<LineSettings>
  ) => {
    type: Types.UPDATE_LINE_SETTINGS_REQUEST;
    payload: Partial<LineSettings>;
  };
  updateLineSettingsSuccess: (
    payload: LineSettings
  ) => {
    type: Types.UPDATE_LINE_SETTINGS_SUCCESS;
    payload: LineSettings;
  };
  updateLineSettingsFailed: () => {
    type: Types.UPDATE_LINE_SETTINGS_FAILED;
  };
}

const CreatedActions = createActions(
  {
    getLineSettingsRequest: [],
    getLineSettingsSuccess: ['payload'],
    getLineSettingsFailed: [],

    updateLineSettingsRequest: ['payload'],
    updateLineSettingsSuccess: ['payload'],
    updateLineSettingsFailed: [],
  },
  {
    prefix: '@line/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
