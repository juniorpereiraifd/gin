import { ActionCreators, createActions } from 'reduxsauce';
import { UnityItemProps } from 'src/store/modules/unity/reducer';
import { HallItemProps, type MutableTableMap, type Table, type TableMap } from './reducer';

export enum Types {
  GET_UNITY_REQUEST = '@hall/GET_UNITY_REQUEST',
  GET_UNITY_SUCCESS = '@hall/GET_UNITY_SUCCESS',
  GET_UNITY_FAILED = '@hall/GET_UNITY_FAILED',

  GET_HALLS_REQUEST = '@hall/GET_HALLS_REQUEST',
  GET_HALLS_SUCCESS = '@hall/GET_HALLS_SUCCESS',
  GET_HALLS_FAILED = '@hall/GET_HALLS_FAILED',

  GET_HALL_REQUEST = '@hall/GET_HALL_REQUEST',
  GET_HALL_SUCCESS = '@hall/GET_HALL_SUCCESS',
  GET_HALL_FAILED = '@hall/GET_HALL_FAILED',

  CREATE_HALL_REQUEST = '@hall/CREATE_HALL_REQUEST',
  CREATE_HALL_SUCCESS = '@hall/CREATE_HALL_SUCCESS',
  CREATE_HALL_FAILED = '@hall/CREATE_HALL_FAILED',

  UPDATE_HALL_REQUEST = '@hall/UPDATE_HALL_REQUEST',
  UPDATE_HALL_SUCCESS = '@hall/UPDATE_HALL_SUCCESS',
  UPDATE_HALL_FAILED = '@hall/UPDATE_HALL_FAILED',

  DELETE_HALL_REQUEST = '@hall/DELETE_HALL_REQUEST',
  DELETE_HALL_SUCCESS = '@hall/DELETE_HALL_SUCCESS',
  DELETE_HALL_FAILED = '@hall/DELETE_HALL_FAILED',

  CHANGE_STATUS_HALL_REQUEST = '@hall/CHANGE_STATUS_HALL_REQUEST',
  CHANGE_STATUS_HALL_SUCCESS = '@hall/CHANGE_STATUS_HALL_SUCCESS',
  CHANGE_STATUS_HALL_FAILED = '@hall/CHANGE_STATUS_HALL_FAILED',

  CHANGE_FLEXIBLE_HALL_REQUEST = '@hall/CHANGE_FLEXIBLE_HALL_REQUEST',
  CHANGE_FLEXIBLE_HALL_SUCCESS = '@hall/CHANGE_FLEXIBLE_HALL_SUCCESS',
  CHANGE_FLEXIBLE_HALL_FAILED = '@hall/CHANGE_FLEXIBLE_HALL_FAILED',

  SET_TABLE_MAP = '@hall/SET_TABLE_MAP',

  CREATE_TABLE_MAP_REQUEST = '@hall/CREATE_TABLE_MAP_REQUEST',
  CREATE_TABLE_MAP_SUCCESS = '@hall/CREATE_TABLE_MAP_SUCCESS',
  CREATE_TABLE_MAP_FAILED = '@hall/CREATE_TABLE_MAP_FAILED',

  UPDATE_TABLE_REQUEST = '@hall/UPDATE_TABLE_REQUEST',
  UPDATE_TABLE_SUCCESS = '@hall/UPDATE_TABLE_SUCCESS',
  UPDATE_TABLE_FAILED = '@hall/UPDATE_TABLE_FAILED',

  DELETE_TABLE_REQUEST = '@hall/DELETE_TABLE_REQUEST',
  DELETE_TABLE_SUCCESS = '@hall/DELETE_TABLE_SUCCESS',
  DELETE_TABLE_FAILED = '@hall/DELETE_TABLE_FAILED',

  DELETE_TABLE_MAP_REQUEST = '@hall/DELETE_TABLE_MAP_REQUEST',
  DELETE_TABLE_MAP_SUCCESS = '@hall/DELETE_TABLE_MAP_SUCCESS',
  DELETE_TABLE_MAP_FAILED = '@hall/DELETE_TABLE_MAP_FAILED',

  SET_EDITABLE_TABLE = '@hall/SET_EDITABLE_TABLE',

  RESET_HALL = '@hall/RESET_HALL',
}

interface Actions extends ActionCreators {
  getUnityRequest: (payload: { id: string; forceUpdate?: boolean }) => {
    type: Types.GET_UNITY_REQUEST;
    payload: {
      id: string;
      forceUpdate?: boolean;
    };
  };
  getUnitySuccess: (payload: UnityItemProps) => {
    type: Types.GET_UNITY_SUCCESS;
  };
  getUnityFailed: () => {
    type: Types.GET_UNITY_FAILED;
  };

  getHallsRequest: (payload: { page: number; perPage?: number; reset?: boolean; active?: boolean }) => {
    type: Types.GET_HALLS_REQUEST;
    payload: {
      page: number;
      perPage?: number;
      reset?: boolean;
      active?: boolean;
    };
  };
  getHallsSuccess: (payload: {
    data: HallItemProps[];
    pagination: {
      is_last_page: boolean;
      current_page: number;
    };
  }) => {
    type: Types.GET_HALLS_SUCCESS;
    payload: {
      data: HallItemProps[];
      pagination: {
        is_last_page: boolean;
        current_page: number;
      };
    };
  };
  getHallsFailed: () => {
    type: Types.GET_HALLS_FAILED;
  };

  getHallRequest: (id: string) => {
    type: Types.GET_HALL_REQUEST;
  };
  getHallSuccess: (payload: HallItemProps) => {
    type: Types.GET_HALL_SUCCESS;
    payload: HallItemProps;
  };
  getHallFailed: () => {
    type: Types.GET_HALL_FAILED;
  };

  createHallRequest: (payload: {
    hall: {
      name: string;
      type: string;
    };
    onSuccessCallback?: VoidFunction;
  }) => {
    type: Types.CREATE_HALL_REQUEST;
    payload: {
      hall: {
        name: string;
        type: string;
      };
      onSuccessCallback?: VoidFunction;
    };
  };
  createHallSuccess: (payload: HallItemProps) => {
    type: Types.CREATE_HALL_SUCCESS;
    payload: HallItemProps;
  };
  createHallFailed: () => {
    type: Types.CREATE_HALL_FAILED;
  };

  createTableMapRequest: () => {
    type: Types.CREATE_TABLE_MAP_REQUEST;
  };
  createTableMapSuccess: (payload: { tableCreated: Array<TableMap> }) => {
    type: Types.CREATE_TABLE_MAP_SUCCESS;
    payload: { tableCreated: Array<TableMap> };
  };
  createTableMapFailed: () => {
    type: Types.CREATE_TABLE_MAP_FAILED;
  };

  updateHallRequest: (payload: { hall: { id: string; name: string }; onCallbackSuccess?: VoidFunction }) => {
    type: Types.UPDATE_HALL_REQUEST;
    payload: { hall: { id: string; name: string }; onCallbackSuccess?: VoidFunction };
  };
  updateHallSuccess: (payload: HallItemProps) => {
    type: Types.UPDATE_HALL_SUCCESS;
    payload: HallItemProps;
  };
  updateHallFailed: () => {
    type: Types.UPDATE_HALL_FAILED;
  };

  deleteHallRequest: (hall: HallItemProps) => {
    type: Types.DELETE_HALL_REQUEST;
    payload: HallItemProps;
  };
  deleteHallSuccess: () => {
    type: Types.DELETE_HALL_SUCCESS;
  };
  deleteHallFailed: () => {
    type: Types.DELETE_HALL_FAILED;
  };
  changeStatusHallRequest: (payload: { hall_id: string; active: boolean }) => {
    type: Types.CHANGE_STATUS_HALL_REQUEST;
    payload: {
      hall_id: string;
      active: boolean;
    };
  };
  changeStatusHallSuccess: (payload: HallItemProps) => {
    type: Types.CHANGE_STATUS_HALL_SUCCESS;
    payload: HallItemProps;
  };
  changeStatusHallFailed: () => {
    type: Types.CHANGE_STATUS_HALL_FAILED;
  };

  changeFlexibleHallRequest: (payload: { hall_id: string; flexible: boolean }) => {
    type: Types.CHANGE_FLEXIBLE_HALL_REQUEST;
    payload: {
      hall_id: string;
      flexible: boolean;
    };
  };
  changeFlexibleHallSuccess: (payload: HallItemProps) => {
    type: Types.CHANGE_FLEXIBLE_HALL_SUCCESS;
    payload: HallItemProps;
  };
  changeFlexibleHallFailed: () => {
    type: Types.CHANGE_FLEXIBLE_HALL_FAILED;
  };

  setTableMap: (tableMap: Array<MutableTableMap> | null) => {
    type: Types.SET_TABLE_MAP;
    tableMap: Array<MutableTableMap> | null;
  };

  deleteTableRequest: (payload: {
    table: Table;
    registeredTable: TableMap | undefined;
    onSuccessCallback?: VoidFunction;
  }) => {
    type: Types.DELETE_TABLE_REQUEST;
    payload: { table: Table; registeredTable: TableMap | undefined; onSuccessCallback?: VoidFunction };
  };
  deleteTableSuccess: (payload: { table: Table }) => {
    type: Types.DELETE_TABLE_SUCCESS;
    payload: { table: Table };
  };
  deleteTableFailed: () => {
    type: Types.DELETE_TABLE_FAILED;
  };

  deleteTableMapRequest: () => {
    type: Types.DELETE_TABLE_MAP_REQUEST;
  };
  deleteTableMapSuccess: (payload: { tables: Array<string> }) => {
    type: Types.DELETE_TABLE_MAP_SUCCESS;
    payload: { tables: Array<string> };
  };
  deleteTableMapFailed: () => {
    type: Types.DELETE_TABLE_MAP_FAILED;
  };

  updateTableRequest: (payload: {
    table: Table;
    selectedTable: Table | null;
    registeredTable: TableMap | undefined;
    onSuccessCallback?: VoidFunction;
  }) => {
    type: Types.UPDATE_TABLE_REQUEST;
    payload: {
      table: Table;
      selectedTable: Table | null;
      registeredTable: TableMap | undefined;
      onSuccessCallback?: VoidFunction;
    };
  };
  updateTableSuccess: (payload: { table: Table; selectedTable: Table | null }) => {
    type: Types.UPDATE_TABLE_SUCCESS;
    payload: { table: Table; selectedTable: Table | null };
  };
  updateTableFailed: () => {
    type: Types.UPDATE_TABLE_FAILED;
  };

  setEditableTable: (table: Table | null) => {
    type: Types.SET_EDITABLE_TABLE;
    table: Table | null;
  };

  resetHall: () => {
    type: Types.RESET_HALL;
  };
}

const CreatedActions = createActions(
  {
    getUnityRequest: ['payload'],
    getUnitySuccess: ['payload'],
    getUnityFailed: [],

    getHallsRequest: ['payload'],
    getHallsSuccess: ['payload'],
    getHallsFailed: [],

    getHallRequest: ['payload'],
    getHallSuccess: ['payload'],
    getHallFailed: [],

    createHallRequest: ['payload'],
    createHallSuccess: ['payload'],
    createHallFailed: [],

    updateHallRequest: ['payload'],
    updateHallSuccess: ['payload'],
    updateHallFailed: [],

    deleteHallRequest: ['payload'],
    deleteHallSuccess: [],
    deleteHallFailed: [],

    changeStatusHallRequest: ['payload'],
    changeStatusHallSuccess: ['payload'],
    changeStatusHallFailed: [],

    changeFlexibleHallRequest: ['payload'],
    changeFlexibleHallSuccess: ['payload'],
    changeFlexibleHallFailed: [],

    setTableMap: ['tableMap'],

    createTableMapRequest: [],
    createTableMapSuccess: ['payload'],
    createTableMapFailed: [],

    updateTableRequest: ['payload'],
    updateTableSuccess: ['payload'],
    updateTableFailed: [],

    deleteTableRequest: ['payload'],
    deleteTableSuccess: ['payload'],
    deleteTableFailed: [],

    deleteTableMapRequest: [],
    deleteTableMapSuccess: ['payload'],
    deleteTableMapFailed: [],

    setEditableTable: ['table'],

    resetHall: [],
  },
  {
    prefix: '@hall/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
