import { ActionCreators, createActions } from 'reduxsauce';
import { UserItemProps, type ModuleRestrictionByUnit } from './reducer';
import type { Pagination } from 'src/types';
import type { ModulesValues } from 'src/utils/constants';

export enum Types {
  GET_USERS_REQUEST = '@user/GET_USERS_REQUEST',
  GET_USERS_SUCCESS = '@user/GET_USERS_SUCCESS',
  GET_USERS_FAILED = '@user/GET_USERS_FAILED',

  GET_USER_REQUEST = '@user/GET_USER_REQUEST',
  GET_USER_SUCCESS = '@user/GET_USER_SUCCESS',
  GET_USER_FAILED = '@user/GET_USER_FAILED',

  GET_USER_MODULE_RESTRICTIONS_REQUEST = '@user/GET_USER_MODULE_RESTRICTIONS_REQUEST',
  GET_USER_MODULE_RESTRICTIONS_SUCCESS = '@user/GET_USER_MODULE_RESTRICTIONS_SUCCESS',
  GET_USER_MODULE_RESTRICTIONS_FAILED = '@user/GET_USER_MODULE_RESTRICTIONS_FAILED',

  UPDATE_USER_MODULE_RESTRICTION_REQUEST = '@user/UPDATE_USER_MODULE_RESTRICTION_REQUEST',
  UPDATE_USER_MODULE_RESTRICTION_SUCCESS = '@user/UPDATE_USER_MODULE_RESTRICTION_SUCCESS',
  UPDATE_USER_MODULE_RESTRICTION_FAILED = '@user/UPDATE_USER_MODULE_RESTRICTION_FAILED',

  CREATE_USER_REQUEST = '@user/CREATE_USER_REQUEST',
  CREATE_USER_SUCCESS = '@user/CREATE_USER_SUCCESS',
  CREATE_USER_FAILED = '@user/CREATE_USER_FAILED',

  UPDATE_USER_REQUEST = '@user/UPDATE_USER_REQUEST',
  UPDATE_USER_SUCCESS = '@user/UPDATE_USER_SUCCESS',
  UPDATE_USER_FAILED = '@user/UPDATE_USER_FAILED',

  DELETE_USER_REQUEST = '@user/DELETE_USER_REQUEST',
  DELETE_USER_SUCCESS = '@user/DELETE_USER_SUCCESS',
  DELETE_USER_FAILED = '@user/DELETE_USER_FAILED',

  SEND_EMAIL_USER_REQUEST = '@user/SEND_EMAIL_USER_REQUEST',
  SEND_EMAIL_USER_SUCCESS = '@user/SEND_EMAIL_USER_SUCCESS',
  SEND_EMAIL_USER_FAILED = '@user/SEND_EMAIL_USER_FAILED',

  GENERATE_TEMPORARY_PASSWORD_REQUEST = '@user/GENERATE_TEMPORARY_PASSWORD_REQUEST',
  GENERATE_TEMPORARY_PASSWORD_SUCCESS = '@user/GENERATE_TEMPORARY_PASSWORD_SUCCESS',
  GENERATE_TEMPORARY_PASSWORD_FAILED = '@user/GENERATE_TEMPORARY_PASSWORD_FAILED',
  CLEAR_TEMPORARY_PASSWORD = '@user/CLEAR_TEMPORARY_PASSWORD',

  SET_MUTATION_DRAWER_OPEN = '@user/SET_MUTATION_DRAWER_OPEN',
}

interface Actions extends ActionCreators {
  getUsersRequest: (payload: { page: number; perPage?: number }) => {
    type: Types.GET_USERS_REQUEST;
    payload: {
      page: number;
      perPage?: number;
    };
  };
  getUsersSuccess: (payload: { users: Array<UserItemProps>; pagination?: Pagination }) => {
    type: Types.GET_USERS_SUCCESS;
    payload: { users: Array<UserItemProps>; pagination?: Pagination };
  };
  getUsersFailed: () => {
    type: Types.GET_USERS_FAILED;
  };
  getUserRequest: (user_id: string) => {
    type: Types.GET_USER_REQUEST;
  };
  getUserSuccess: (user: UserItemProps) => {
    type: Types.GET_USER_SUCCESS;
    payload: UserItemProps;
  };
  getUserFailed: () => {
    type: Types.GET_USER_FAILED;
  };

  getUserModuleRestrictionsRequest: (payload: { userId: string; unitId: string; modules: ModulesValues[] }) => {
    type: Types.GET_USER_MODULE_RESTRICTIONS_REQUEST;
    payload: { userId: string; unitId: string; modules: ModulesValues[] };
  };
  getUserModuleRestrictionsSuccess: (payload: ModuleRestrictionByUnit) => {
    type: Types.GET_USER_MODULE_RESTRICTIONS_SUCCESS;
    payload: ModuleRestrictionByUnit;
  };
  getUserModuleRestrictionsFailed: () => {
    type: Types.GET_USER_MODULE_RESTRICTIONS_FAILED;
  };

  updateUserModuleRestrictionRequest: (payload: {
    userId: string;
    unitId: string;
    module: ModulesValues;
    enable: boolean;
  }) => {
    type: Types.UPDATE_USER_MODULE_RESTRICTION_REQUEST;
    payload: { userId: string; unitId: string; module: ModulesValues; enable: boolean };
  };
  updateUserModuleRestrictionSuccess: (payload: ModuleRestrictionByUnit) => {
    type: Types.UPDATE_USER_MODULE_RESTRICTION_SUCCESS;
    payload: ModuleRestrictionByUnit;
  };
  updateUserModuleRestrictionFailed: (payload: ModuleRestrictionByUnit | null) => {
    type: Types.UPDATE_USER_MODULE_RESTRICTION_FAILED;
    payload: ModuleRestrictionByUnit | null;
  };

  createUserRequest: (user: { email: string }) => {
    type: Types.CREATE_USER_REQUEST;
  };
  createUserSuccess: (user: UserItemProps) => {
    type: Types.CREATE_USER_SUCCESS;
    payload: string;
  };
  createUserFailed: () => {
    type: Types.CREATE_USER_FAILED;
  };

  updateUserRequest: (
    user: Partial<UserItemProps>,
    onSuccessCallback?: VoidFunction,
  ) => {
    type: Types.UPDATE_USER_REQUEST;
    user: Partial<UserItemProps>;
    onSuccessCallback?: VoidFunction;
  };
  updateUserSuccess: (user: UserItemProps) => {
    type: Types.UPDATE_USER_SUCCESS;
    user: UserItemProps;
  };
  updateUserFailed: () => {
    type: Types.UPDATE_USER_FAILED;
  };

  deleteUserRequest: (user: UserItemProps) => {
    type: Types.DELETE_USER_REQUEST;
  };
  deleteUserSuccess: (user_id: string | number) => {
    type: Types.DELETE_USER_SUCCESS;
    payload: string;
  };
  deleteUserFailed: () => {
    type: Types.DELETE_USER_FAILED;
  };

  sendEmailUserRequest: (payload: { user_id: string | number; email: string }) => {
    type: Types.SEND_EMAIL_USER_REQUEST;
  };

  sendEmailUserSuccess: () => {
    type: Types.SEND_EMAIL_USER_SUCCESS;
  };

  sendEmailUserFailed: () => {
    type: Types.SEND_EMAIL_USER_FAILED;
  };

  setMutationDrawerOpen: (payload: { open: boolean }) => {
    type: Types.SET_MUTATION_DRAWER_OPEN;
    payload: { open: boolean };
  };

  generateTemporaryPasswordRequest: (payload: { managerId: string }) => {
    type: Types.GENERATE_TEMPORARY_PASSWORD_REQUEST;
    payload: { managerId: string };
  };
  generateTemporaryPasswordSuccess: (payload: { temporaryPassword: string }) => {
    type: Types.GENERATE_TEMPORARY_PASSWORD_SUCCESS;
    payload: { temporaryPassword: string };
  };
  generateTemporaryPasswordFailed: () => {
    type: Types.GENERATE_TEMPORARY_PASSWORD_FAILED;
  };
  clearTemporaryPassword: () => {
    type: Types.CLEAR_TEMPORARY_PASSWORD;
  };
}

const CreatedActions = createActions(
  {
    getUsersRequest: ['payload'],
    getUsersSuccess: ['payload'],
    getUsersFailed: [],

    getUserRequest: ['payload'],
    getUserSuccess: ['payload'],
    getUserFailed: [],

    getUserModuleRestrictionsRequest: ['payload'],
    getUserModuleRestrictionsSuccess: ['payload'],
    getUserModuleRestrictionsFailed: [],

    updateUserModuleRestrictionRequest: ['payload'],
    updateUserModuleRestrictionSuccess: ['payload'],
    updateUserModuleRestrictionFailed: ['payload'],

    createUserRequest: ['payload'],
    createUserSuccess: ['payload'],
    createUserFailed: [],

    updateUserRequest: ['user', 'onSuccessCallback'],
    updateUserSuccess: ['user'],
    updateUserFailed: [],

    deleteUserRequest: ['payload'],
    deleteUserSuccess: ['payload'],
    deleteUserFailed: [],

    sendEmailUserRequest: ['payload'],
    sendEmailUserSuccess: [],
    sendEmailUserFailed: [],

    generateTemporaryPasswordRequest: ['payload'],
    generateTemporaryPasswordSuccess: ['payload'],
    generateTemporaryPasswordFailed: [],
    clearTemporaryPassword: [],

    setMutationDrawerOpen: ['payload'],
  },
  {
    prefix: '@user/',
  },
);

export const Creators = CreatedActions.Creators as Actions;
