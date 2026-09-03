import { ActionCreators, createActions } from 'reduxsauce';
import { OperatorItemProps, type OperatorMutationProps } from './reducer';
import type { Pagination } from 'src/types';

export enum Types {
  GET_OPERATORS_REQUEST = '@operator/GET_OPERATORS_REQUEST',
  GET_OPERATORS_SUCCESS = '@operator/GET_OPERATORS_SUCCESS',
  GET_OPERATORS_FAILED = '@operator/GET_OPERATORS_FAILED',

  GET_OPERATOR_REQUEST = '@operator/GET_OPERATOR_REQUEST',
  GET_OPERATOR_SUCCESS = '@operator/GET_OPERATOR_SUCCESS',
  GET_OPERATOR_FAILED = '@operator/GET_OPERATOR_FAILED',

  CREATE_OPERATOR_REQUEST = '@operator/CREATE_OPERATOR_REQUEST',
  CREATE_OPERATOR_SUCCESS = '@operator/CREATE_OPERATOR_SUCCESS',
  CREATE_OPERATOR_FAILED = '@operator/CREATE_OPERATOR_FAILED',

  EDIT_OPERATOR_REQUEST = '@operator/EDIT_OPERATOR_REQUEST',
  EDIT_OPERATOR_SUCCESS = '@operator/EDIT_OPERATOR_SUCCESS',
  EDIT_OPERATOR_FAILED = '@operator/EDIT_OPERATOR_FAILED',

  DELETE_OPERATOR_REQUEST = '@operator/DELETE_OPERATOR_REQUEST',
  DELETE_OPERATOR_SUCCESS = '@operator/DELETE_OPERATOR_SUCCESS',
  DELETE_OPERATOR_FAILED = '@operator/DELETE_OPERATOR_FAILED',

  DISCONNECT_OPERATOR_REQUEST = '@operator/DISCONNECT_OPERATOR_REQUEST',
  DISCONNECT_OPERATOR_SUCCESS = '@operator/DISCONNECT_OPERATOR_SUCCESS',
  DISCONNECT_OPERATOR_FAILED = '@operator/DISCONNECT_OPERATOR_FAILED',

  SET_MUTATION_DRAWER_OPEN = '@operator/SET_MUTATION_DRAWER_OPEN',

  SET_OPERATOR_EDITABLE = '@operator/SET_OPERATOR_EDITABLE',
}

interface Actions extends ActionCreators {
  getOperatorsRequest: (payload: { page: number; perPage?: number }) => {
    type: Types.GET_OPERATORS_REQUEST;
    payload: { page: number; perPage?: number };
  };
  getOperatorsSuccess: (payload: { operators: Array<OperatorItemProps>; pagination?: Pagination }) => {
    type: Types.GET_OPERATORS_SUCCESS;
    payload: {
      operators: Array<OperatorItemProps>;
      pagination?: Pagination;
    };
  };
  getOperatorsFailed: () => {
    type: Types.GET_OPERATORS_FAILED;
  };

  getOperatorRequest: (
    payload: { operatorId: string },
    options?: { editable?: boolean },
  ) => {
    type: Types.GET_OPERATOR_REQUEST;
    payload: { operatorId: string };
    options?: { editable?: boolean };
  };
  getOperatorSuccess: (payload: { operator: OperatorItemProps }) => {
    type: Types.GET_OPERATOR_SUCCESS;
    payload: { operator: OperatorItemProps };
  };
  getOperatorFailed: () => {
    type: Types.GET_OPERATOR_FAILED;
  };

  editOperatorRequest: (payload: {
    operator: OperatorItemProps & { password?: string; password_confirmation?: string; enabled_2fa?: boolean };
  }) => {
    type: Types.EDIT_OPERATOR_REQUEST;
    payload: {
      operator: OperatorItemProps & { password?: string; password_confirmation?: string; enabled_2fa?: boolean };
    };
  };
  editOperatorSuccess: (payload: { operator: OperatorItemProps }) => {
    type: Types.EDIT_OPERATOR_SUCCESS;
    payload: { operator: OperatorItemProps };
  };
  editOperatorFailed: () => {
    type: Types.EDIT_OPERATOR_FAILED;
  };

  deleteOperatorRequest: (payload: { operatorId: string }) => {
    type: Types.DELETE_OPERATOR_REQUEST;
    payload: { operatorId: string };
  };
  deleteOperatorSuccess: (payload: { operatorId: string }) => {
    type: Types.DELETE_OPERATOR_SUCCESS;
    payload: { operatorId: string };
  };
  deleteOperatorFailed: () => {
    type: Types.DELETE_OPERATOR_FAILED;
  };

  disconnectOperatorRequest: (payload: { operatorId: string }) => {
    type: Types.DISCONNECT_OPERATOR_REQUEST;
    payload: { operatorId: string };
  };
  disconnectOperatorSuccess: (payload: { operatorId: string }) => {
    type: Types.DISCONNECT_OPERATOR_SUCCESS;
    payload: { operatorId: string };
  };
  disconnectOperatorFailed: () => {
    type: Types.DISCONNECT_OPERATOR_FAILED;
  };

  createOperatorRequest: (payload: { operator: OperatorMutationProps }) => {
    type: Types.CREATE_OPERATOR_REQUEST;
    payload: { operator: OperatorMutationProps };
  };
  createOperatorSuccess: (payload: { operator: OperatorItemProps }) => {
    type: Types.CREATE_OPERATOR_SUCCESS;
    payload: { operator: OperatorItemProps };
  };
  createOperatorFailed: () => {
    type: Types.CREATE_OPERATOR_FAILED;
  };

  setMutationDrawerOpen: (payload: { open: boolean }) => {
    type: Types.SET_MUTATION_DRAWER_OPEN;
    payload: { open: boolean };
  };

  setOperatorEditable: (payload: { operator: OperatorItemProps | null }) => {
    type: Types.SET_OPERATOR_EDITABLE;
    payload: { open: OperatorItemProps | null };
  };
}

const CreatedActions = createActions(
  {
    getOperatorsRequest: ['payload'],
    getOperatorsSuccess: ['payload'],
    getOperatorsFailed: [],

    getOperatorRequest: ['payload', 'options'],
    getOperatorSuccess: ['payload'],
    getOperatorFailed: [],

    createOperatorRequest: ['payload'],
    createOperatorSuccess: ['payload'],
    createOperatorFailed: [],

    deleteOperatorRequest: ['payload'],
    deleteOperatorSuccess: ['payload'],
    deleteOperatorFailed: [],

    disconnectOperatorRequest: ['payload'],
    disconnectOperatorSuccess: ['payload'],
    disconnectOperatorFailed: [],

    editOperatorRequest: ['payload'],
    editOperatorSuccess: ['payload'],
    editOperatorFailed: [],

    setMutationDrawerOpen: ['payload'],

    setOperatorEditable: ['payload'],
    setOperatorEditableSuccess: ['payload'],
    setOperatorEditableFailed: [],
  },
  {
    prefix: '@operator/',
  },
);

export const Creators = CreatedActions.Creators as Actions;
