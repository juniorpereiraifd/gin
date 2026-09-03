import { ActionCreators, createActions } from 'reduxsauce';
import { CustomFieldItemProps } from './reducer';

export enum Types {
  GET_CUSTOM_FIELDS_REQUEST = '@customField/GET_CUSTOM_FIELDS_REQUEST',
  GET_CUSTOM_FIELDS_SUCCESS = '@customField/GET_CUSTOM_FIELDS_SUCCESS',
  GET_CUSTOM_FIELDS_FAILED = '@customField/GET_CUSTOM_FIELDS_FAILED',

  CREATE_CUSTOM_FIELD_REQUEST = '@customField/CREATE_CUSTOM_FIELD_REQUEST',
  CREATE_CUSTOM_FIELD_SUCCESS = '@customField/CREATE_CUSTOM_FIELD_SUCCESS',
  CREATE_CUSTOM_FIELD_FAILED = '@customField/CREATE_CUSTOM_FIELD_FAILED',

  EDIT_CUSTOM_FIELD_REQUEST = '@customField/EDIT_CUSTOM_FIELD_REQUEST',
  EDIT_CUSTOM_FIELD_SUCCESS = '@customField/EDIT_CUSTOM_FIELD_SUCCESS',
  EDIT_CUSTOM_FIELD_FAILED = '@customField/EDIT_CUSTOM_FIELD_FAILED',

  DELETE_CUSTOM_FIELD_REQUEST = '@customField/DELETE_CUSTOM_FIELD_REQUEST',
  DELETE_CUSTOM_FIELD_SUCCESS = '@customField/DELETE_CUSTOM_FIELD_SUCCESS',
  DELETE_CUSTOM_FIELD_FAILED = '@customField/DELETE_CUSTOM_FIELD_FAILED',

  SET_EDITABLE_ITEM = '@customField/SET_EDITABLE_ITEM',

  SHOW_MODAL = '@customField/SHOW_MODAL',
  HIDE_MODAL = '@customField/HIDE_MODAL',
}

interface Actions extends ActionCreators {
  getCustomFieldsRequest: (payload: { unitId: string; page: number }) => {
    type: Types.GET_CUSTOM_FIELDS_REQUEST;
    payload: { unitId: string; page: number };
  };
  getCustomFieldsSuccess: (payload: CustomFieldItemProps[]) => {
    type: Types.GET_CUSTOM_FIELDS_SUCCESS;
    payload: CustomFieldItemProps[];
  };
  getCustomFieldsFailed: () => {
    type: Types.GET_CUSTOM_FIELDS_FAILED;
  };

  createCustomFieldRequest: (
    payload: { customField: CustomFieldItemProps; unitId: string },
    onSuccessCallback?: VoidFunction
  ) => {
    type: Types.CREATE_CUSTOM_FIELD_REQUEST;
    payload: {
      customField: CustomFieldItemProps;
      unitId: string;
    };
    onSuccessCallback?: VoidFunction;
  };
  createCustomFieldSuccess: (payload: CustomFieldItemProps) => {
    type: Types.CREATE_CUSTOM_FIELD_SUCCESS;
    payload: CustomFieldItemProps;
  };
  createCustomFieldFailed: (payload: Array<{ name: string; errors: Array<string> }>) => {
    type: Types.CREATE_CUSTOM_FIELD_FAILED;
    payload: Array<{ name: string; errors: Array<string> }>;
  };

  editCustomFieldRequest: (
    payload: { customField: CustomFieldItemProps; customFieldId: string; unitId: string },
    onSuccessCallback?: VoidFunction
  ) => {
    type: Types.EDIT_CUSTOM_FIELD_REQUEST;
    payload: {
      customField: CustomFieldItemProps;
      customFieldId: string;
      unitId: string;
    };
    onSuccessCallback?: VoidFunction;
  };
  editCustomFieldSuccess: (payload: CustomFieldItemProps) => {
    type: Types.EDIT_CUSTOM_FIELD_SUCCESS;
    payload: CustomFieldItemProps;
  };
  editCustomFieldFailed: () => {
    type: Types.EDIT_CUSTOM_FIELD_FAILED;
  };

  deleteCustomFieldRequest: (payload: { customFieldId: string; unitId: string }) => {
    type: Types.DELETE_CUSTOM_FIELD_REQUEST;
    payload: {
      customFieldId: string;
      unitId: string;
    };
  };
  deleteCustomFieldSuccess: (customFieldId: string) => {
    type: Types.DELETE_CUSTOM_FIELD_SUCCESS;
    customFieldId: string;
  };
  deleteCustomFieldFailed: () => {
    type: Types.DELETE_CUSTOM_FIELD_FAILED;
  };

  setEditableItem: (payload: CustomFieldItemProps | null) => {
    type: Types.SET_EDITABLE_ITEM;
    payload: CustomFieldItemProps | null;
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
    getCustomFieldsRequest: ['payload'],
    getCustomFieldsSuccess: ['payload'],
    getCustomFieldsFailed: [],

    createCustomFieldRequest: ['payload', 'onSuccessCallback'],
    createCustomFieldSuccess: ['payload'],
    createCustomFieldFailed: ['payload'],

    editCustomFieldRequest: ['payload', 'onSuccessCallback'],
    editCustomFieldSuccess: ['payload'],
    editCustomFieldFailed: [],

    deleteCustomFieldRequest: ['payload'],
    deleteCustomFieldSuccess: ['payload'],
    deleteCustomFieldFailed: [],

    setEditableItem: ['payload'],

    showModal: [],
    hideModal: [],
  },
  {
    prefix: '@customField/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
