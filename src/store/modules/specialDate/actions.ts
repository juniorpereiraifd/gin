import { ActionCreators, createActions } from 'reduxsauce';
import { SpecialDateItemProps } from './reducer';

interface Actions extends ActionCreators {
  getSpecialDatesRequest: (payload: {
    unity_id: string;
    page: number;
    start_at?: string;
    end_at?: string;
    with_filter?: boolean;
  }) => {
    type: Types.GET_SPECIAL_DATES_REQUEST;
    payload: {
      unity_id: string;
      page: number;
      start_at?: string;
      end_at?: string;
      with_filter?: boolean;
    };
  };
  getSpecialDatesSuccess: (
    dates: Array<SpecialDateItemProps>
  ) => {
    type: Types.GET_SPECIAL_DATES_SUCCESS;
    payload: Array<SpecialDateItemProps>;
  };
  getSpecialDatesFailed: () => {
    type: Types.GET_SPECIAL_DATES_FAILED;
  };

  createSpecialDateRequest: (
    specialDate: SpecialDateItemProps
  ) => {
    type: Types.CREATE_SPECIAL_DATE_REQUEST;
  };
  createSpecialDateSuccess: (
    specialDate: SpecialDateItemProps
  ) => {
    type: Types.CREATE_SPECIAL_DATE_SUCCESS;
    payload: SpecialDateItemProps;
  };
  createSpecialDateFailed: (
    payload: Array<{ name: string; errors: Array<string> }>
  ) => {
    type: Types.CREATE_SPECIAL_DATE_FAILED;
    payload: Array<{ name: string; errors: Array<string> }>;
  };

  setEditableItem: (
    specialDate: SpecialDateItemProps
  ) => {
    type: Types.SET_EDITABLE_ITEM;
    payload: SpecialDateItemProps;
  };

  editSpecialDateRequest: (
    specialDate: SpecialDateItemProps
  ) => {
    type: Types.EDIT_SPECIAL_DATE_REQUEST;
  };
  editSpecialDateSuccess: (
    specialDate: SpecialDateItemProps
  ) => {
    type: Types.EDIT_SPECIAL_DATE_SUCCESS;
    payload: SpecialDateItemProps;
  };
  editSpecialDateFailed: () => {
    type: Types.EDIT_SPECIAL_DATE_FAILED;
  };

  deleteSpecialDateRequest: (
    special_date_id: string
  ) => {
    type: Types.DELETE_SPECIAL_DATE_REQUEST;
  };
  deleteSpecialDateSuccess: (
    special_date_id: string
  ) => {
    type: Types.DELETE_SPECIAL_DATE_SUCCESS;
  };
  deleteSpecialDateFailed: () => {
    type: Types.DELETE_SPECIAL_DATE_FAILED;
  };

  getSpecialDateRequest: (payload: { schedule_id: string }) => {
    type: Types.GET_SPECIAL_DATE_REQUEST;
    payload: { schedule_id: string };
  };
  getSpecialDateSuccess: (
    specialDate: SpecialDateItemProps
  ) => {
    type: Types.GET_SPECIAL_DATE_SUCCESS;
    payload: SpecialDateItemProps;
  };
  getSpecialDateFailed: () => {
    type: Types.GET_SPECIAL_DATE_FAILED;
  };

  showModal: () => {
    type: Types.SHOW_MODAL;
  };
}

export enum Types {
  GET_SPECIAL_DATE_REQUEST = '@specialDate/GET_SPECIAL_DATE_REQUEST',
  GET_SPECIAL_DATE_SUCCESS = '@specialDate/GET_SPECIAL_DATE_SUCCESS',
  GET_SPECIAL_DATE_FAILED = '@specialDate/GET_SPECIAL_DATE_FAILED',

  GET_SPECIAL_DATES_REQUEST = '@specialDate/GET_SPECIAL_DATES_REQUEST',
  GET_SPECIAL_DATES_SUCCESS = '@specialDate/GET_SPECIAL_DATES_SUCCESS',
  GET_SPECIAL_DATES_FAILED = '@specialDate/GET_SPECIAL_DATES_FAILED',

  CREATE_SPECIAL_DATE_REQUEST = '@specialDate/CREATE_SPECIAL_DATE_REQUEST',
  CREATE_SPECIAL_DATE_SUCCESS = '@specialDate/CREATE_SPECIAL_DATE_SUCCESS',
  CREATE_SPECIAL_DATE_FAILED = '@specialDate/CREATE_SPECIAL_DATE_FAILED',

  SET_EDITABLE_ITEM = '@specialDate/SET_EDITABLE_ITEM',
  EDIT_SPECIAL_DATE_REQUEST = '@specialDate/EDIT_SPECIAL_DATE_REQUEST',
  EDIT_SPECIAL_DATE_SUCCESS = '@specialDate/EDIT_SPECIAL_DATE_SUCCESS',
  EDIT_SPECIAL_DATE_FAILED = '@specialDate/EDIT_SPECIAL_DATE_FAILED',

  DELETE_SPECIAL_DATE_REQUEST = '@specialDate/DELETE_SPECIAL_DATE_REQUEST',
  DELETE_SPECIAL_DATE_SUCCESS = '@specialDate/DELETE_SPECIAL_DATE_SUCCESS',
  DELETE_SPECIAL_DATE_FAILED = '@specialDate/DELETE_SPECIAL_DATE_FAILED',

  SHOW_MODAL = '@specialDate/SHOW_MODAL',
  HIDE_MODAL = '@specialDate/HIDE_MODAL',
}

const CreatedActions = createActions(
  {
    getSpecialDatesRequest: ['payload'],
    getSpecialDatesSuccess: ['payload'],
    getSpecialDatesFailed: [],

    createSpecialDateRequest: ['payload'],
    createSpecialDateSuccess: ['payload'],
    createSpecialDateFailed: ['payload'],

    setEditableItem: ['payload'],
    editSpecialDateRequest: ['payload'],
    editSpecialDateSuccess: ['payload'],
    editSpecialDateFailed: [],

    deleteSpecialDateRequest: ['payload'],
    deleteSpecialDateSuccess: ['payload'],
    deleteSpecialDateFailed: [],

    getSpecialDateRequest: ['payload'],
    getSpecialDateSuccess: ['payload'],
    getSpecialDateFailed: [],

    showModal: [],
    hideModal: [],
  },
  {
    prefix: '@specialDate/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
