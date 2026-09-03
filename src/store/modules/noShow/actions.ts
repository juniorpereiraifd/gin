import { ActionCreators, createActions } from 'reduxsauce';
import { NoShowItemProps } from './reducer';

export enum Types {
  GET_NO_SHOW_REQUEST = '@noshow/GET_NO_SHOW_REQUEST',
  GET_NO_SHOW_SUCCESS = '@noshow/GET_NO_SHOW_SUCCESS',
  GET_NO_SHOW_FAILED = '@noshow/GET_NO_SHOW_FAILED',

  CHARGED_NO_SHOW_REQUEST = '@noshow/CHARGED_NO_SHOW_REQUEST',
  CHARGED_NO_SHOW_SUCCESS = '@noshow/CHARGED_NO_SHOW_SUCCESS',
  CHARGED_NO_SHOW_FAILED = '@noshow/CHARGED_NO_SHOW_FAILED',

  SET_PAGINATION = '@noshow/SET_PAGINATION',
}

interface Actions extends ActionCreators {
  getNoShowRequest: (payload: {
    page: number;
    search?: string;
    date_start?: string;
    date_end?: string;
  }) => {
    type: Types.GET_NO_SHOW_REQUEST;
    payload: {
      page: number;
      search?: string;
      date_start?: string;
      date_end?: string;
    };
  };
  getNoShowSuccess: (
    noShow: Array<NoShowItemProps>
  ) => {
    type: Types.GET_NO_SHOW_SUCCESS;
  };
  getNoShowFailed: () => {
    type: Types.GET_NO_SHOW_FAILED;
  };

  setPagination: (pagination: {
    is_last_page: boolean;
    current_page: number;
    total: number;
  }) => {
    type: Types.SET_PAGINATION;
    payload: {
      is_last_page: boolean;
      current_page: number;
      total: number;
    };
  };

  chargedNoShowRequest: (payload: {
    id: string;
  }) => {
    type: Types.CHARGED_NO_SHOW_REQUEST;
    payload: {
      id: string;
    };
  };
  chargedNoShowSuccess: (
    noShow: Array<NoShowItemProps>
  ) => {
    type: Types.CHARGED_NO_SHOW_SUCCESS;
  };
  chargedNoShowFailed: (payload: {
    id: string;
  }) => {
    type: Types.CHARGED_NO_SHOW_FAILED;
  };
}

const CreatedActions = createActions(
  {
    getNoShowRequest: ['payload'],
    getNoShowSuccess: ['payload'],
    getNoShowFailed: [],

    setPagination: ['payload'],

    chargedNoShowRequest: ['payload'],
    chargedNoShowSuccess: ['payload'],
    chargedNoShowFailed: ['payload'],
  },
  {
    prefix: '@noshow/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
