import { ActionCreators, createActions } from 'reduxsauce';
import { ScheduleItemProps, PaginateProps } from './reducer';

export enum Types {
  GET_SCHEDULES_REQUEST = '@schedule/GET_SCHEDULES_REQUEST',
  GET_SCHEDULES_SUCCESS = '@schedule/GET_SCHEDULES_SUCCESS',
  GET_SCHEDULES_FAILED = '@schedule/GET_SCHEDULES_FAILED',

  CREATE_SCHEDULE_REQUEST = '@schedule/CREATE_SCHEDULE_REQUEST',
  CREATE_SCHEDULE_SUCCESS = '@schedule/CREATE_SCHEDULE_SUCCESS',
  CREATE_SCHEDULE_FAILED = '@schedule/CREATE_SCHEDULE_FAILED',

  EDIT_SCHEDULE_REQUEST = '@schedule/EDIT_SCHEDULE_REQUEST',
  EDIT_SCHEDULE_SUCCESS = '@schedule/EDIT_SCHEDULE_SUCCESS',
  EDIT_SCHEDULE_FAILED = '@schedule/EDIT_SCHEDULE_FAILED',

  DELETE_SCHEDULE_REQUEST = '@schedule/DELETE_SCHEDULE_REQUEST',
  DELETE_SCHEDULE_SUCCESS = '@schedule/DELETE_SCHEDULE_SUCCESS',
  DELETE_SCHEDULE_FAILED = '@schedule/DELETE_SCHEDULE_FAILED',

  SHOW_MODAL = '@schedule/SHOW_MODAL',
  HIDE_MODAL = '@schedule/HIDE_MODAL',

  SET_SCHEDULES = '@schedule/SET_SCHEDULES',
  SET_EDITABLE_ITEM = '@schedule/SET_EDITABLE_ITEM',
  SET_SELECTED_DAY = '@schedule/SET_SELECTED_DAY',
}

interface Actions extends ActionCreators {
  getSchedulesRequest: (payload: { sector_id: string; day?: string; page: number }) => {
    type: Types.GET_SCHEDULES_REQUEST;
    payload: { sector_id: string; day?: string; page: number };
  };
  getSchedulesSuccess: (payload: {
    page: number;
    schedules: Array<ScheduleItemProps>;
    selecteds: Array<Date>;
    pagination: PaginateProps | null;
  }) => {
    type: Types.GET_SCHEDULES_SUCCESS;
    payload: {
      page: number;
      schedules: Array<ScheduleItemProps>;
      selecteds: Array<Date>;
      pagination: PaginateProps | null;
    };
  };
  getSchedulesFailed: () => {
    type: Types.GET_SCHEDULES_FAILED;
  };

  createScheduleRequest: (payload: {
    schedule: ScheduleItemProps;
    days: Array<number>;
    schedule_map: Array<{
      number_of_tables: number | null;
      number_of_people: number;
    }>;
    dayRequest?: string;
  }) => {
    type: Types.CREATE_SCHEDULE_REQUEST;
    payload: {
      schedule: ScheduleItemProps;
      days: Array<number>;
      schedule_map: Array<{
        number_of_tables: number | null;
        number_of_people: number;
      }>;
      dayRequest?: string;
    };
  };
  createScheduleSuccess: (payload: { item?: ScheduleItemProps }) => {
    type: Types.CREATE_SCHEDULE_SUCCESS;
    payload: { item?: ScheduleItemProps };
  };
  createScheduleFailed: () => {
    type: Types.CREATE_SCHEDULE_FAILED;
  };

  editScheduleRequest: (payload: {
    schedule: ScheduleItemProps;
    schedule_map: Array<{
      number_of_tables: number | null;
      number_of_people: number;
    }>;
    dayRequest?: string;
  }) => {
    type: Types.EDIT_SCHEDULE_REQUEST;
    payload: {
      schedule: ScheduleItemProps;
      schedule_map: Array<{
        number_of_tables: number | null;
        number_of_people: number;
      }>;
      dayRequest?: string;
    };
  };
  editScheduleSuccess: (payload: { schedule: ScheduleItemProps }) => {
    type: Types.EDIT_SCHEDULE_SUCCESS;
    payload: { schedule: ScheduleItemProps };
  };
  editScheduleFailed: () => {
    type: Types.EDIT_SCHEDULE_FAILED;
  };

  deleteScheduleRequest: (payload: { id: string | number; sector_id: string | number; day?: string | number }) => {
    type: Types.DELETE_SCHEDULE_REQUEST;
    payload: {
      id: string | number;
      sector_id: string | number;
      day?: string | number;
    };
  };
  deleteScheduleSuccess: (payload: { id: string }) => {
    type: Types.DELETE_SCHEDULE_SUCCESS;
    payload: { id: string };
  };
  deleteScheduleFailed: () => {
    type: Types.DELETE_SCHEDULE_FAILED;
  };

  showModal: () => {
    type: Types.SHOW_MODAL;
  };

  hideModal: () => {
    type: Types.HIDE_MODAL;
  };

  setSchedules: (payload: Array<Date>) => {
    type: Types.SET_SCHEDULES;
  };

  setEditableItem: (payload: { id: string }) => {
    type: Types.SET_EDITABLE_ITEM;
    payload: {
      id: string;
    };
  };

  setSelectedDay: (payload: { day: string }) => {
    type: Types.SET_SELECTED_DAY;
    payload: {
      day: string;
    };
  };
}

const CreatedActions = createActions(
  {
    getSchedulesRequest: ['payload'],
    getSchedulesSuccess: ['payload'],
    getSchedulesFailed: [],

    createScheduleRequest: ['payload'],
    createScheduleSuccess: ['payload'],
    createScheduleFailed: [],

    editScheduleRequest: ['payload'],
    editScheduleSuccess: ['payload'],
    editScheduleFailed: [],

    deleteScheduleRequest: ['payload'],
    deleteScheduleSuccess: ['payload'],
    deleteScheduleFailed: [],

    showModal: [],
    hideModal: [],
    setSchedules: ['payload'],
    setEditableItem: ['payload'],

    setSelectedDay: ['payload'],
  },
  {
    prefix: '@schedule/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
