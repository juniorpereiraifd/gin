import produce from 'immer';
import { Types as AuthTypes } from './actions';

export const AUTH_STATUS = {
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  AUTHENTICATING: 'authenticating',
} as const;

export type AuthStatusKeys = keyof typeof AUTH_STATUS;

export type AuthStatusValues = (typeof AUTH_STATUS)[AuthStatusKeys];

export type UserProps = {
  id: number | string;
  name: string;
  email?: string;
  username?: string;
  telephone: string;
  avatar: string;
  position: string;
  scope: string;
  master: boolean;
  favorite_unit: string;
  created_at?: string;
  enabled_2fa?: boolean;
};

export type AdminUnit = {
  id: string | number;
  name: string;
};

export type AdminDetails = {
  units: AdminUnit[];
  [key: string]: unknown;
};

export type AuthProps = {
  loading: boolean;
  loadingUser: boolean;
  loadingRefresh: boolean;
  loadingFavoriteUnit: boolean;
  saving: boolean;
  savingChangePassword: boolean;
  check: boolean;
  verified: boolean;
  email: string | null;
  token: string | null;
  user: UserProps | null;
  password: string | null;
  searchingUserData: boolean;
  adminDetails: AdminDetails | null;
  loadingAdminDetails: boolean;
};

export const INITIAL_STATE: AuthProps = {
  verified: false,
  check: false,
  loading: false,
  loadingUser: false,
  loadingRefresh: false,
  loadingFavoriteUnit: false,
  saving: false,
  savingChangePassword: false,
  email: null,
  token: null,
  user: null,
  password: null,
  searchingUserData: false,
  adminDetails: null,
  loadingAdminDetails: false,
};

const auth = produce((draft: AuthProps, action) => {
  switch (action.type) {
    case AuthTypes.LOGIN_REQUEST:
      draft.loading = true;
      draft.searchingUserData = true;
      break;
    case AuthTypes.LOGIN_SUCCESS:
      draft.loading = false;
      draft.user = action.payload.user;
      draft.searchingUserData = false;
      break;
    case AuthTypes.LOGIN_FAILED:
      draft.loading = false;
      draft.searchingUserData = false;
      break;

    case AuthTypes.LOGOUT_SUCCESS:
      draft = INITIAL_STATE;
      break;

    case AuthTypes.CHANGE_NAME_PROFILE_REQUEST:
      draft.loading = true;
      break;

    case AuthTypes.CHANGE_NAME_PROFILE_SUCCESS:
      draft.loading = false;
      break;

    case AuthTypes.CHANGE_NAME_PROFILE_FAILED:
      draft.loading = false;
      break;

    case AuthTypes.REFRESH_TOKEN_REQUEST:
      draft.loadingRefresh = true;
      break;
    case AuthTypes.REFRESH_TOKEN_SUCCESS:
      draft.loadingRefresh = false;
      draft.token = action.payload.token;
      break;
    case AuthTypes.REFRESH_TOKEN_FAILED:
      draft.loadingRefresh = false;
      break;

    case AuthTypes.UPDATE_FAVORITE_UNIT_REQUEST:
      draft.loadingFavoriteUnit = true;
      break;
    case AuthTypes.UPDATE_FAVORITE_UNIT_SUCCESS:
      draft.loadingFavoriteUnit = false;
      if (draft.user) {
        draft.user.favorite_unit = action.payload.favorite_unit;
      } else {
        draft.user = action.payload;
      }
      break;

    case AuthTypes.UPDATE_MANAGER_REQUEST:
      draft.saving = true;

      break;
    case AuthTypes.UPDATE_MANAGER_SUCCESS:
      draft.saving = false;
      draft.user = action.payload;

      break;
    case AuthTypes.UPDATE_MANAGER_FAILED:
      draft.saving = false;

      break;

    case AuthTypes.CHANGE_PASSWORD_REQUEST:
      draft.savingChangePassword = true;

      break;
    case AuthTypes.CHANGE_PASSWORD_SUCCESS:
      draft.savingChangePassword = false;

      break;
    case AuthTypes.CHANGE_PASSWORD_FAILED:
      draft.savingChangePassword = false;

      break;

    case AuthTypes.GET_MANAGER_REQUEST:
      draft.loadingUser = true;

      break;
    case AuthTypes.GET_MANAGER_SUCCESS:
      draft.loadingUser = false;
      draft.user = action.payload;

      break;
    case AuthTypes.GET_MANAGER_FAILED:
      draft.loadingUser = false;

      break;

    case AuthTypes.GET_ADMIN_DETAILS_REQUEST:
      draft.loadingAdminDetails = true;

      break;
    case AuthTypes.GET_ADMIN_DETAILS_SUCCESS:
      draft.loadingAdminDetails = false;
      draft.adminDetails = action.payload;

      break;
    case AuthTypes.GET_ADMIN_DETAILS_FAILED:
      draft.loadingAdminDetails = false;
      draft.adminDetails = null;

      break;
  }
}, INITIAL_STATE);

export default auth;
