import { ActionCreators, createActions } from 'reduxsauce';
import { RestrictionItemProps } from 'src/store/modules/restriction/reducer';

export enum Types {
  GET_RESTRICTIONS_REQUEST = '@restriction/GET_RESTRICTIONS_REQUEST',
  GET_RESTRICTIONS_SUCCESS = '@restriction/GET_RESTRICTIONS_SUCCESS',
  GET_RESTRICTIONS_FAILED = '@restriction/GET_RESTRICTIONS_FAILED',

  CREATE_RESTRICTION_REQUEST = '@restriction/CREATE_RESTRICTION_REQUEST',
  CREATE_RESTRICTION_SUCCESS = '@restriction/CREATE_RESTRICTION_SUCCESS',
  CREATE_RESTRICTION_FAILED = '@restriction/CREATE_RESTRICTION_FAILED',

  DELETE_RESTRICTION_REQUEST = '@restriction/DELETE_RESTRICTION_REQUEST',
  DELETE_RESTRICTION_SUCCESS = '@restriction/DELETE_RESTRICTION_SUCCESS',
  DELETE_RESTRICTION_FAILED = '@restriction/DELETE_RESTRICTION_FAILED',

  SHOW_MODAL = '@restriction/SHOW_MODAL',
  HIDE_MODAL = '@restriction/HIDE_MODAL',
}

interface Actions extends ActionCreators {
  getRestrictionsRequest: (
    menu_id: string
  ) => {
    type: Types.GET_RESTRICTIONS_REQUEST;
  };
  getRestrictionsSuccess: (
    data: Array<RestrictionItemProps>
  ) => {
    type: Types.GET_RESTRICTIONS_SUCCESS;
  };
  getRestrictionsFailed: () => {
    type: Types.GET_RESTRICTIONS_FAILED;
  };

  createRestrictionRequest: (restriction: {
    menu: string;
    weekday: Array<number>;
    starts_at: string;
    ends_at: string;
  }) => {
    type: Types.CREATE_RESTRICTION_REQUEST;
  };
  createRestrictionSuccess: (
    restriction: RestrictionItemProps
  ) => {
    type: Types.CREATE_RESTRICTION_SUCCESS;
  };
  createRestrictionFailed: () => {
    type: Types.CREATE_RESTRICTION_FAILED;
  };

  deleteRestrictionRequest: (
    restriction: { menu: string } & RestrictionItemProps
  ) => {
    type: Types.DELETE_RESTRICTION_REQUEST;
    payload: { menu: string } & RestrictionItemProps;
  };
  deleteRestrictionSuccess: (
    data: RestrictionItemProps
  ) => {
    type: Types.DELETE_RESTRICTION_SUCCESS;
    payload: RestrictionItemProps;
  };
  deleteRestrictionFailed: () => {
    type: Types.DELETE_RESTRICTION_FAILED;
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
    getRestrictionsRequest: ['payload'],
    getRestrictionsSuccess: ['payload'],
    getRestrictionsFailed: [],

    createRestrictionRequest: ['payload'],
    createRestrictionSuccess: ['payload'],
    createRestrictionFailed: [],

    deleteRestrictionRequest: ['payload'],
    deleteRestrictionSuccess: ['payload'],
    deleteRestrictionFailed: [],

    showModal: [],
    hideModal: [],
  },
  {
    prefix: '@restriction/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
