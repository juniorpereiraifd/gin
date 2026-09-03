import { ActionCreators, createActions } from 'reduxsauce';
import type { Pagination } from 'src/types';
import { AmenitiesProps, UnityItemProps, Module, type UnitBaseInformation, type UnitAddress } from './reducer';

export enum Types {
  GET_UNITS_REQUEST = '@unity/GET_UNITS_REQUEST',
  GET_UNITS_SUCCESS = '@unity/GET_UNITS_SUCCESS',
  GET_UNITS_FAILED = '@unity/GET_UNITS_FAILED',

  CREATE_UNITY_REQUEST = '@unity/CREATE_UNITY_REQUEST',
  CREATE_UNITY_SUCCESS = '@unity/CREATE_UNITY_SUCCESS',
  CREATE_UNITY_FAILED = '@unity/CREATE_UNITY_FAILED',

  EDIT_UNITY_REQUEST = '@unity/EDIT_UNITY_REQUEST',
  EDIT_UNITY_SUCCESS = '@unity/EDIT_UNITY_SUCCESS',
  EDIT_UNITY_FAILED = '@unity/EDIT_UNITY_FAILED',

  EDIT_UNITY_LOGO_REQUEST = '@unity/EDIT_UNITY_LOGO_REQUEST',

  ACTIVE_UNITY_SUPPORT_RESTAURANT_REQUEST = '@unity/ACTIVE_UNITY_SUPPORT_RESTAURANT_REQUEST',
  ACTIVE_UNITY_SUPPORT_RESTAURANT_SUCCESS = '@unity/ACTIVE_UNITY_SUPPORT_RESTAURANT_SUCCESS',
  ACTIVE_UNITY_SUPPORT_RESTAURANT_FAILED = '@unity/ACTIVE_UNITY_SUPPORT_RESTAURANT_FAILED',

  GET_LIST_AMENITIES_REQUEST = '@unity/GET_LIST_AMENITIES_REQUEST',
  GET_LIST_AMENITIES_SUCCESS = '@unity/GET_LIST_AMENITIES_SUCCESS',
  GET_LIST_AMENITIES_FAILED = '@unity/GET_LIST_AMENITIES_FAILED',

  ADD_LIST_AMENITIES_REQUEST = '@unity/ADD_LIST_AMENITIES_REQUEST',
  ADD_LIST_AMENITIES_SUCCESS = '@unity/ADD_LIST_AMENITIES_SUCCESS',
  ADD_LIST_AMENITIES_FAILED = '@unity/ADD_LIST_AMENITIES_FAILED',

  GET_UNIT_MODULES_SETTINGS_REQUEST = '@unity/GET_UNIT_MODULES_SETTINGS_REQUEST',
  GET_UNIT_MODULES_SETTINGS_SUCCESS = '@unity/GET_UNIT_MODULES_SETTINGS_SUCCESS',
  GET_UNIT_MODULES_SETTINGS_FAILED = '@unity/GET_UNIT_MODULES_SETTINGS_FAILED',

  UPDATE_UNIT_MODULE_REQUEST = '@unity/UPDATE_UNIT_MODULE_REQUEST',
  UPDATE_UNIT_MODULE_SUCCESS = '@unity/UPDATE_UNIT_MODULE_SUCCESS',
  UPDATE_UNIT_MODULE_FAILED = '@unity/UPDATE_UNIT_MODULE_FAILED',

  RESET_UNITY_DATA = '@unity/RESET_UNITY_DATA',
}

interface Actions extends ActionCreators {
  getUnitsRequest: (payload: {
    page: number;
    unitName?: string;
    unitId?: string;
    per_page?: number;
    isCumulative?: boolean;
  }) => {
    type: Types.GET_UNITS_REQUEST;
    payload: {
      page: number;
      unitName?: string;
      unitId?: string;
      per_page?: number;
      isCumulative?: boolean;
    };
  };
  getUnitsSuccess: (payload: {
    units: Array<UnityItemProps>;
    pagination: Pagination;
    isCumulative?: boolean;
  }) => {
    type: Types.GET_UNITS_SUCCESS;
    payload: {
      units: Array<UnityItemProps>;
      pagination: Pagination;
      isCumulative?: boolean;
    };
  };
  getUnitsFailed: () => {
    type: Types.GET_UNITS_FAILED;
  };

  createUnityRequest: (payload: UnitBaseInformation) => {
    type: Types.CREATE_UNITY_REQUEST;
    payload: UnitBaseInformation;
  };
  createUnitySuccess: (payload: UnityItemProps) => {
    type: Types.CREATE_UNITY_REQUEST;
    payload: UnityItemProps;
  };

  createUnityFailed: () => {
    type: Types.CREATE_UNITY_FAILED;
  };

  editUnityRequest: (unity: Partial<UnitBaseInformation & UnitAddress>) => {
    type: Types.EDIT_UNITY_REQUEST;
    payload: Partial<UnitBaseInformation & UnitAddress>;
  };
  editUnitySuccess: (payload: UnityItemProps) => {
    type: Types.EDIT_UNITY_SUCCESS;
    payload: UnityItemProps;
  };
  editUnityFailed: () => {
    type: Types.EDIT_UNITY_FAILED;
  };

  editUnityLogoRequest: (unity: {
    id: string | null | undefined;
    profile_file_id?: { name: string; content: string } | null;
    cover_file_id?: { name: string; content: string } | null;
  }) => {
    type: Types.EDIT_UNITY_LOGO_REQUEST;
    payload: UnitBaseInformation & UnitAddress;
  };

  activeUnitySupportRestaurantRequest: (payload: {
    unitId: string;
    active: boolean;
  }) => {
    type: Types.ACTIVE_UNITY_SUPPORT_RESTAURANT_REQUEST;
  };
  activeUnitySupportRestaurantSuccess: (payload: Array<UnityItemProps>) => {
    type: Types.ACTIVE_UNITY_SUPPORT_RESTAURANT_SUCCESS;
  };

  activeUnitySupportRestaurantFailed: () => {
    type: Types.ACTIVE_UNITY_SUPPORT_RESTAURANT_FAILED;
  };

  getListAmenitiesRequest: () => {
    type: Types.GET_LIST_AMENITIES_REQUEST;
  };
  getListAmenitiesSuccess: (amenities: AmenitiesProps) => {
    type: Types.GET_LIST_AMENITIES_SUCCESS;
  };
  getListAmenitiesFailed: () => {
    type: Types.GET_LIST_AMENITIES_FAILED;
  };

  addListAmenitiesRequest: (payload: { amenities: string[] }) => {
    type: Types.ADD_LIST_AMENITIES_REQUEST;
  };
  addListAmenitiesSuccess: () => {
    type: Types.ADD_LIST_AMENITIES_SUCCESS;
  };
  addListAmenitiesFailed: () => {
    type: Types.ADD_LIST_AMENITIES_FAILED;
  };

  getUnitModulesSettingsRequest: () => {
    type: Types.GET_UNIT_MODULES_SETTINGS_REQUEST;
  };
  getUnitModulesSettingsSuccess: () => {
    type: Types.GET_UNIT_MODULES_SETTINGS_REQUEST;
  };
  getUnitModulesSettingsFailed: () => {
    type: Types.GET_UNIT_MODULES_SETTINGS_REQUEST;
  };

  updateUnitModuleRequest: (payload: { module: keyof Module; enabled: boolean }) => {
    type: Types.UPDATE_UNIT_MODULE_REQUEST;
    payload: {
      module: keyof Module;
      enabled: boolean;
    };
  };
  updateUnitModuleSuccess: () => {
    type: Types.UPDATE_UNIT_MODULE_SUCCESS;
  };
  updateUnitModuleFailed: () => {
    type: Types.UPDATE_UNIT_MODULE_FAILED;
  };

  resetUnityData: () => {
    type: Types.RESET_UNITY_DATA;
  };
}

const CreatedActions = createActions(
  {
    getUnitsRequest: ['payload'],
    getUnitsSuccess: ['payload'],
    getUnitsFailed: [],

    createUnityRequest: ['payload'],
    createUnitySuccess: ['payload'],
    createUnityFailed: [],

    editUnityRequest: ['payload'],
    editUnitySuccess: ['payload'],
    editUnityFailed: [],

    editUnityLogoRequest: ['payload'],

    activeUnitySupportRestaurantRequest: ['payload'],
    activeUnitySupportRestaurantSuccess: ['payload'],
    activeUnitySupportRestaurantFailed: [],

    getListAmenitiesRequest: [],
    getListAmenitiesSuccess: ['payload'],
    getListAmenitiesFailed: [],

    addListAmenitiesRequest: ['payload'],
    addListAmenitiesSuccess: [],
    addListAmenitiesFailed: [],

    getUnitModulesSettingsRequest: [],
    getUnitModulesSettingsSuccess: [],
    getUnitModulesSettingsFailed: [],

    updateUnitModuleRequest: ['payload'],
    updateUnitModuleSuccess: [],
    updateUnitModuleFailed: [],

    resetUnityData: [],
  },
  {
    prefix: '@unity/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
