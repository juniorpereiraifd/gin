import { ActionCreators, createActions } from 'reduxsauce';
import { OptionalItemProps, OptionalReorderItemProps } from './reducer';

export enum Types {
  GET_OPTIONALS_REQUEST = '@optional/GET_OPTIONALS_REQUEST',
  GET_OPTIONAL_REQUEST = '@optional/GET_OPTIONAL_REQUEST',
  GET_OPTIONALS_SUCCESS = '@optional/GET_OPTIONALS_SUCCESS',
  GET_OPTIONAL_SUCCESS = '@optional/GET_OPTIONAL_SUCCESS',
  GET_OPTIONALS_FAILED = '@optional/GET_OPTIONALS_FAILED',
  GET_OPTIONAL_FAILED = '@optional/GET_OPTIONAL_FAILED',

  GET_OPTIONALS_FROM_MENU = '@optional/GET_OPTIONALS_FROM_MENU',
  GET_OPTIONALS_FROM_MENU_SUCCESS = '@optional/GET_OPTIONALS_FROM_MENU_SUCCESS',
  GET_OPTIONALS_FROM_MENU_FAILED = '@optional/GET_OPTIONALS_FROM_MENU_FAILED',
  RESET_OPTIONALS_FROM_MENU = '@optional/RESET_OPTIONALS_FROM_MENU',

  CREATE_OPTIONAL_REQUEST = '@optional/CREATE_OPTIONAL_REQUEST',
  CREATE_OPTIONAL_SUCCESS = '@optional/CREATE_OPTIONAL_SUCCESS',
  CREATE_OPTIONAL_FAILED = '@optional/CREATE_OPTIONAL_FAILED',

  DELETE_OPTIONAL_REQUEST = '@optional/DELETE_OPTIONAL_REQUEST',
  DELETE_OPTIONAL_SUCCESS = '@optional/DELETE_OPTIONAL_SUCCESS',
  DELETE_OPTIONAL_FAILED = '@optional/DELETE_OPTIONAL_FAILED',

  REORDER_OPTIONAL_REQUEST = '@optional/REORDER_OPTIONAL_REQUEST',
  REORDER_OPTIONAL_FAILED = '@optional/REORDER_OPTIONAL_FAILED',

  EDIT_OPTIONAL_REQUEST = '@optional/EDIT_OPTIONAL_REQUEST',
  EDIT_OPTIONAL_SUCCESS = '@optional/EDIT_OPTIONAL_SUCCESS',
  EDIT_OPTIONAL_FAILED = '@optional/EDIT_OPTIONAL_FAILED',

  RESET_EDITABLE_FIELD = '@optional/RESET_EDITABLE_FIELD',

  LOADED_ALL_OPTIONALS = '@optional/LOADED_ALL_OPTIONALS',

  LOAD_EDIT_INFO = '@optional/LOAD_EDIT_INFO',

  SHOW_MODAL = '@optional/SHOW_MODAL',
  HIDE_MODAL = '@optional/HIDE_MODAL',
}

interface Actions extends ActionCreators {
  getOptionalsRequest: () => {
    type: Types.GET_OPTIONALS_REQUEST;
  };
  loadEditInfo: (
    optional: OptionalItemProps
  ) => {
    type: Types.LOAD_EDIT_INFO;
    payload: OptionalItemProps;
  };
  resetEditableField: () => {
    type: Types.RESET_EDITABLE_FIELD;
  };
  reorderOptionalRequest: (
    optional: OptionalReorderItemProps
  ) => {
    type: Types.REORDER_OPTIONAL_REQUEST;
  };
  getOptionalRequest: () => {
    type: Types.GET_OPTIONAL_REQUEST;
  };
  getOptionalsFromMenu: (
    menu_id: number
  ) => {
    type: Types.GET_OPTIONALS_FROM_MENU;
  };
  getOptionalsFromMenuSuccess: (
    categories: Array<OptionalItemProps>
  ) => {
    type: Types.GET_OPTIONALS_FROM_MENU_SUCCESS;
  };
  getOptionalsFromMenuFailed: () => {
    type: Types.GET_OPTIONALS_FROM_MENU_FAILED;
  };
  resetOptionalsFromMenu: () => {
    type: Types.RESET_OPTIONALS_FROM_MENU;
  };
  loadedAllOptionals: () => {
    type: Types.LOADED_ALL_OPTIONALS;
  };
  getOptionalsSuccess: (
    optionals: Array<OptionalItemProps>
  ) => {
    type: Types.GET_OPTIONALS_SUCCESS;
    payload: Array<OptionalItemProps>;
  };
  getOptionalSuccess: (
    product: OptionalItemProps
  ) => {
    type: Types.GET_OPTIONAL_SUCCESS;
    payload: OptionalItemProps;
  };
  getOptionalsFailed: () => {
    type: Types.GET_OPTIONALS_FAILED;
  };
  getOptionalFailed: () => {
    type: Types.GET_OPTIONAL_FAILED;
  };
  createOptionalRequest: (
    optional: unknown
  ) => {
    type: Types.CREATE_OPTIONAL_REQUEST;
  };
  editOptionalRequest: (
    optional: unknown
  ) => {
    type: Types.EDIT_OPTIONAL_REQUEST;
  };
  createOptionalSuccess: (
    optional: OptionalItemProps
  ) => {
    type: Types.CREATE_OPTIONAL_SUCCESS;
    payload: string;
  };
  createOptionalFailed: () => {
    type: Types.CREATE_OPTIONAL_FAILED;
  };

  deleteOptionalRequest: (
    optional: OptionalItemProps
  ) => {
    type: Types.DELETE_OPTIONAL_REQUEST;
    payload: OptionalItemProps;
  };
  deleteOptionalSuccess: (
    optional_id: string | number
  ) => {
    type: Types.DELETE_OPTIONAL_SUCCESS;
    payload: string | number;
  };
  deleteOptionalFailed: () => {
    type: Types.DELETE_OPTIONAL_FAILED;
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
    getOptionalsRequest: ['payload'],
    getOptionalsSuccess: ['payload'],
    getOptionalsFailed: [],

    getOptionalsFromMenu: ['payload'],
    getOptionalsFromMenuSuccess: ['payload'],
    getOptionalsFromMenuFailed: [],
    resetOptionalsFromMenu: [],

    getOptionalsFromOptional: [],

    getOptionalRequest: ['payload'],
    getOptionalSuccess: ['payload'],
    getOptionalFailed: [],

    createOptionalRequest: ['payload'],
    createOptionalSuccess: ['payload'],
    createOptionalFailed: [],

    editOptionalRequest: ['payload'],
    editOptionalSuccess: ['payload'],
    editOptionalFailed: [],

    deleteOptionalRequest: ['payload'],
    deleteOptionalSuccess: ['payload'],
    deleteOptionalFailed: [],

    reorderOptionalRequest: ['payload'],

    loadEditInfo: ['payload'],

    loadedAllOptionals: [],
    resetEditableField: [],

    showModal: [],
    hideModal: [],
  },
  {
    prefix: '@optional/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
