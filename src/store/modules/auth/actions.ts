import { ActionCreators, createActions } from 'reduxsauce';
import type { AdminDetails, UserProps } from './reducer';

type LoginSuccessPayloadProps = {
  token: string;
  user: UserProps;
};

export type ChangePasswordPayload = {
  old_password: string;
  password: string;
  password_confirmation: string;
};

interface Actions extends ActionCreators {
  loginRequest: () => { type: Types.LOGIN_REQUEST };
  loginSuccess: (payload: LoginSuccessPayloadProps) => {
    type: Types.LOGIN_SUCCESS;
    payload: LoginSuccessPayloadProps;
  };
  loginFailed: () => {
    type: Types.LOGIN_FAILED;
  };

  logoutRequest: (payload?: { forceLogin?: boolean; redirectAfterAuth?: boolean }) => {
    type: Types.LOGOUT_REQUEST;
    payload?: {
      forceLogin?: boolean;
      redirectAfterAuth?: boolean;
    };
  };
  logoutSuccess: () => {
    type: Types.LOGOUT_SUCCESS;
  };
  logoutFailed: () => {
    type: Types.LOGOUT_FAILED;
  };

  getManagerRequest: () => {
    type: Types.GET_MANAGER_REQUEST;
  };
  getManagerSuccess: (payload: UserProps) => {
    type: Types.GET_MANAGER_SUCCESS;
    payload: UserProps;
  };
  getManagerFailed: () => {
    type: Types.GET_MANAGER_FAILED;
  };

  getAdminDetailsRequest: (payload: { unitId: string }) => {
    type: Types.GET_ADMIN_DETAILS_REQUEST;
    payload: { unitId: string };
  };
  getAdminDetailsSuccess: (payload: AdminDetails) => {
    type: Types.GET_ADMIN_DETAILS_SUCCESS;
    payload: AdminDetails;
  };
  getAdminDetailsFailed: () => {
    type: Types.GET_ADMIN_DETAILS_FAILED;
  };

  updateManagerRequest: (payload: Partial<UserProps>) => {
    type: Types.UPDATE_MANAGER_REQUEST;
    payload: Partial<UserProps>;
  };
  updateManagerSuccess: (payload: UserProps) => {
    type: Types.UPDATE_MANAGER_SUCCESS;
    payload: UserProps;
  };
  updateManagerFailed: () => {
    type: Types.UPDATE_MANAGER_FAILED;
  };

  changePasswordRequest: (payload: ChangePasswordPayload) => {
    type: Types.CHANGE_PASSWORD_REQUEST;
    payload: ChangePasswordPayload;
  };
  changePasswordSuccess: () => {
    type: Types.CHANGE_PASSWORD_SUCCESS;
  };
  changePasswordFailed: () => {
    type: Types.CHANGE_PASSWORD_FAILED;
  };

  changeNameProfileRequest: (payload: { name: string; email: string }) => {
    type: Types.CHANGE_NAME_PROFILE_REQUEST;
    payload: {
      name: string;
      email: string;
    };
  };
  changeNameProfileSuccess: (payload: { name: string }) => {
    type: Types.CHANGE_NAME_PROFILE_SUCCESS;
    payload: UserProps;
  };
  changeNameProfileFailed: () => {
    type: Types.CHANGE_NAME_PROFILE_FAILED;
  };

  refreshTokenRequest: () => {
    type: Types.REFRESH_TOKEN_REQUEST;
  };
  refreshTokenSuccess: (payload: { token: string }) => {
    type: Types.REFRESH_TOKEN_SUCCESS;
    payload: {
      token: string;
    };
  };
  refreshTokenFailed: () => {
    type: Types.REFRESH_TOKEN_FAILED;
  };

  updateFavoriteUnitRequest: (payload: { favorite_unit: string | null }) => {
    type: Types.UPDATE_FAVORITE_UNIT_REQUEST;
    payload: {
      favorite_unit: string | null;
    };
  };
  updateFavoriteUnitSuccess: (payload: UserProps) => {
    type: Types.UPDATE_FAVORITE_UNIT_SUCCESS;
    payload: UserProps;
  };
  updateFavoriteUnitFailed: () => {
    type: Types.UPDATE_FAVORITE_UNIT_FAILED;
  };
}

export enum Types {
  LOGIN_REQUEST = '@auth/LOGIN_REQUEST',
  LOGIN_SUCCESS = '@auth/LOGIN_SUCCESS',
  LOGIN_FAILED = '@auth/LOGIN_FAILED',

  LOGOUT_REQUEST = '@auth/LOGOUT_REQUEST',
  LOGOUT_SUCCESS = '@auth/LOGOUT_SUCCESS',
  LOGOUT_FAILED = '@auth/LOGOUT_FAILED',

  GET_MANAGER_REQUEST = '@auth/GET_MANAGER_REQUEST',
  GET_MANAGER_SUCCESS = '@auth/GET_MANAGER_SUCCESS',
  GET_MANAGER_FAILED = '@auth/GET_MANAGER_FAILED',

  GET_ADMIN_DETAILS_REQUEST = '@auth/GET_ADMIN_DETAILS_REQUEST',
  GET_ADMIN_DETAILS_SUCCESS = '@auth/GET_ADMIN_DETAILS_SUCCESS',
  GET_ADMIN_DETAILS_FAILED = '@auth/GET_ADMIN_DETAILS_FAILED',

  UPDATE_MANAGER_REQUEST = '@auth/UPDATE_MANAGER_REQUEST',
  UPDATE_MANAGER_SUCCESS = '@auth/UPDATE_MANAGER_SUCCESS',
  UPDATE_MANAGER_FAILED = '@auth/UPDATE_MANAGER_FAILED',

  CHANGE_PASSWORD_REQUEST = '@auth/CHANGE_PASSWORD_REQUEST',
  CHANGE_PASSWORD_SUCCESS = '@auth/CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_FAILED = '@auth/CHANGE_PASSWORD_FAILED',

  CHANGE_NAME_PROFILE_REQUEST = '@auth/CHANGE_NAME_PROFILE_REQUEST',
  CHANGE_NAME_PROFILE_SUCCESS = '@auth/CHANGE_NAME_PROFILE_SUCCESS',
  CHANGE_NAME_PROFILE_FAILED = '@auth/CHANGE_NAME_PROFILE_FAILED',

  REFRESH_TOKEN_REQUEST = '@auth/REFRESH_TOKEN_REQUEST',
  REFRESH_TOKEN_SUCCESS = '@auth/REFRESH_TOKEN_SUCCESS',
  REFRESH_TOKEN_FAILED = '@auth/REFRESH_TOKEN_FAILED',

  UPDATE_FAVORITE_UNIT_REQUEST = '@auth/UPDATE_FAVORITE_UNIT_REQUEST',
  UPDATE_FAVORITE_UNIT_SUCCESS = '@auth/UPDATE_FAVORITE_UNIT_SUCCESS',
  UPDATE_FAVORITE_UNIT_FAILED = '@auth/UPDATE_FAVORITE_UNIT_FAILED',
}

const CreatedActions = createActions(
  {
    loginRequest: [],
    loginSuccess: ['payload'],
    loginFailed: [],

    logoutRequest: ['payload'],
    logoutSuccess: [],
    logoutFailed: [],

    getManagerRequest: [],
    getManagerSuccess: ['payload'],
    getManagerFailed: [],

    getAdminDetailsRequest: ['payload'],
    getAdminDetailsSuccess: ['payload'],
    getAdminDetailsFailed: [],

    changePasswordRequest: ['payload'],
    changePasswordSuccess: [],
    changePasswordFailed: [],

    changeNameProfileRequest: ['payload'],
    changeNameProfileSuccess: [],
    changeNameProfileFailed: [],

    refreshTokenRequest: [],
    refreshTokenSuccess: ['payload'],
    refreshTokenFailed: [],

    updateFavoriteUnitRequest: ['payload'],
    updateFavoriteUnitSuccess: ['payload'],
    updateFavoriteUnitFailed: [],

    updateManagerRequest: ['payload'],
    updateManagerSuccess: ['payload'],
    updateManagerFailed: [],
  },
  {
    prefix: '@auth/',
  },
);

export const Creators = CreatedActions.Creators as Actions;
