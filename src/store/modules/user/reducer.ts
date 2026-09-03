import produce from 'immer';
import { Types as UserTypes } from './actions';
import type { Pagination } from 'src/types';
import type { ModulesValues } from 'src/utils/constants';

export type LinkedUnit = {
  id: string;
  name: string;
};

export type UserItemProps = {
  id: string | number;
  name: string;
  email: string;
  avatar: string;
  position: string;
  scope: string;
  master: boolean;
  units?: Array<LinkedUnit>;
};

export type UnitModule = Record<ModulesValues, { enabledByUser?: boolean; enabledByUnit?: boolean; error?: boolean }>;

export type ModuleRestrictionByUnit = {
  admin_id: string;
  units: Array<{
    id: string;
    modules: UnitModule;
  }>;
};

export type UserProps = {
  loading: boolean;
  loadingEditable: boolean;
  loadingModuleRestrictions: {
    unit_id: string;
    loading: boolean;
  } | null;
  loadingTemporaryPassword: boolean;
  savingModuleRestrictions: {
    unit_id: string;
    saving: boolean;
  } | null;
  saving: boolean;
  data: Array<UserItemProps>;
  userModuleRestrictions: ModuleRestrictionByUnit | null;
  editable: UserItemProps | null;
  pagination: Pagination | null;
  isMutationDrawerOpen: boolean;
  temporaryPassword: string | null;
  errorTemporaryPassword?: boolean;
};

export const INITIAL_STATE: UserProps = {
  loading: true,
  loadingEditable: false,
  loadingModuleRestrictions: null,
  loadingTemporaryPassword: false,
  savingModuleRestrictions: null,
  saving: false,
  data: [],
  userModuleRestrictions: null,
  editable: null,
  pagination: null,
  isMutationDrawerOpen: false,
  temporaryPassword: null,
  errorTemporaryPassword: false,
};

const user = produce((draft: UserProps, action) => {
  switch (action.type) {
    case UserTypes.GET_USERS_REQUEST:
      draft.loading = true;
      if (action.payload.page == 1) {
        draft.data = [];
      }
      break;
    case UserTypes.GET_USERS_SUCCESS:
      draft.loading = false;
      draft.data = action.payload.users;
      draft.pagination = action.payload.pagination;
      break;
    case UserTypes.GET_USERS_FAILED:
      draft.loading = false;
      break;
    case UserTypes.GET_USER_REQUEST:
      draft.loadingEditable = true;
      break;
    case UserTypes.GET_USER_SUCCESS:
      draft.loadingEditable = false;
      draft.editable = action.payload;
      break;
    case UserTypes.GET_USER_FAILED:
      draft.loadingEditable = false;
      draft.editable = null;
      break;

    case UserTypes.CREATE_USER_REQUEST:
      draft.saving = true;
      break;
    case UserTypes.CREATE_USER_SUCCESS:
      draft.saving = false;
      draft.data.push(action.payload);
      draft.isMutationDrawerOpen = false;
      break;
    case UserTypes.CREATE_USER_FAILED:
      draft.saving = false;
      break;

    case UserTypes.UPDATE_USER_REQUEST:
      draft.saving = true;
      break;
    case UserTypes.UPDATE_USER_SUCCESS:
      draft.saving = false;
      draft.data = draft.data.map((user) => (user.id === action.payload.id ? { ...user, ...action.payload } : user));
      break;
    case UserTypes.UPDATE_USER_FAILED:
      draft.saving = false;
      break;

    case UserTypes.SEND_EMAIL_USER_REQUEST:
      draft.loading = true;
      break;
    case UserTypes.SEND_EMAIL_USER_SUCCESS:
      draft.loading = false;
      break;
    case UserTypes.SEND_EMAIL_USER_FAILED:
      draft.loading = false;
      break;
    case UserTypes.DELETE_USER_SUCCESS:
      draft.data = draft.data.filter((user) => user.id !== action.payload);
      break;

    case UserTypes.SET_MUTATION_DRAWER_OPEN:
      draft.isMutationDrawerOpen = action.payload.open;
      break;

    case UserTypes.GET_USER_MODULE_RESTRICTIONS_REQUEST:
      draft.loadingModuleRestrictions = {
        unit_id: action.payload.unitId,
        loading: true,
      };
      break;
    case UserTypes.GET_USER_MODULE_RESTRICTIONS_SUCCESS:
      draft.loadingModuleRestrictions = null;
      draft.userModuleRestrictions = action.payload;
      break;
    case UserTypes.GET_USER_MODULE_RESTRICTIONS_FAILED:
      draft.loadingModuleRestrictions = null;
      break;

    case UserTypes.UPDATE_USER_MODULE_RESTRICTION_REQUEST:
      draft.savingModuleRestrictions = {
        unit_id: action.payload.unitId,
        saving: true,
      };
      break;
    case UserTypes.UPDATE_USER_MODULE_RESTRICTION_SUCCESS:
      draft.savingModuleRestrictions = null;
      draft.userModuleRestrictions = action.payload;
      break;
    case UserTypes.UPDATE_USER_MODULE_RESTRICTION_FAILED:
      draft.savingModuleRestrictions = null;
      draft.userModuleRestrictions = action.payload;
      break;

    case UserTypes.GENERATE_TEMPORARY_PASSWORD_REQUEST:
      draft.loadingTemporaryPassword = true;
      draft.temporaryPassword = null;
      draft.errorTemporaryPassword = false;
      break;
    case UserTypes.GENERATE_TEMPORARY_PASSWORD_SUCCESS:
      draft.loadingTemporaryPassword = false;
      draft.temporaryPassword = action.payload.temporaryPassword;
      draft.errorTemporaryPassword = false;
      break;
    case UserTypes.GENERATE_TEMPORARY_PASSWORD_FAILED:
      draft.loadingTemporaryPassword = false;
      draft.errorTemporaryPassword = true;
      break;
    case UserTypes.CLEAR_TEMPORARY_PASSWORD:
      draft.temporaryPassword = null;
      draft.loadingTemporaryPassword = false;
      draft.errorTemporaryPassword = false;
      break;
  }
}, INITIAL_STATE);

export default user;
