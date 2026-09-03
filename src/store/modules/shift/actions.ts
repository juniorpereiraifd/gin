import { ActionCreators, createActions } from 'reduxsauce';
import { UnityItemProps } from 'src/store/modules/unity/reducer';
import { ShiftFormProps } from 'src/pages/Halls';
import { ShiftItemProps } from './reducer';

export enum Types {
  GET_SHIFTS_REQUEST = '@shift/GET_SHIFTS_REQUEST',
  GET_SHIFTS_SUCCESS = '@shift/GET_SHIFTS_SUCCESS',
  GET_SHIFTS_FAILED = '@shift/GET_SHIFTS_FAILED',

  CREATE_SHIFT_REQUEST = '@shift/CREATE_SHIFT_REQUEST',
  CREATE_SHIFT_SUCCESS = '@shift/CREATE_SHIFT_SUCCESS',
  CREATE_SHIFT_FAILED = '@shift/CREATE_SHIFT_FAILED',

  SET_EDITABLE_ITEM = '@shift/SET_EDITABLE_ITEM',
  EDIT_SHIFT_REQUEST = '@shift/EDIT_SHIFT_REQUEST',
  EDIT_SHIFT_SUCCESS = '@shift/EDIT_SHIFT_SUCCESS',
  EDIT_SHIFT_FAILED = '@shift/EDIT_SHIFT_FAILED',

  DELETE_SHIFT_REQUEST = '@shift/DELETE_SHIFT_REQUEST',
  DELETE_SHIFT_SUCCESS = '@shift/DELETE_SHIFT_SUCCESS',
  DELETE_SHIFT_FAILED = '@shift/DELETE_SHIFT_FAILED',

  OPEN_MODAL = '@shift/OPEN_MODAL',
  CLOSE_MODAL = '@shift/CLOSE_MODAL',
}

interface Actions extends ActionCreators {
  getShiftsRequest: () => {
    type: Types.GET_SHIFTS_REQUEST;
  };
  getShiftsSuccess: (
    payload: ShiftItemProps[]
  ) => {
    type: Types.GET_SHIFTS_SUCCESS;
    payload: ShiftItemProps[];
  };
  getShiftsFailed: () => {
    type: Types.GET_SHIFTS_FAILED;
  };

  createShiftRequest: (
    payload: ShiftFormProps
  ) => {
    type: Types.CREATE_SHIFT_REQUEST;
    payload: ShiftFormProps;
  };
  createShiftSuccess: (
    payload: ShiftItemProps
  ) => {
    type: Types.CREATE_SHIFT_SUCCESS;
    payload: ShiftItemProps;
  };
  createShiftFailed: () => {
    type: Types.CREATE_SHIFT_FAILED;
  };

  editShiftRequest: (
    payload: { id: string } & ShiftFormProps
  ) => {
    type: Types.EDIT_SHIFT_REQUEST;
    payload: { id: string } & ShiftFormProps;
  };
  editShiftSuccess: (
    payload: UnityItemProps
  ) => {
    type: Types.EDIT_SHIFT_SUCCESS;
  };
  editShiftFailed: () => {
    type: Types.EDIT_SHIFT_FAILED;
  };

  deleteShiftRequest: (
    payload: ShiftItemProps
  ) => {
    type: Types.DELETE_SHIFT_REQUEST;
    payload: ShiftItemProps;
  };
  deleteShiftSuccess: (
    payload: string
  ) => {
    type: Types.DELETE_SHIFT_SUCCESS;
    payload: string;
  };
  deleteShiftFailed: () => {
    type: Types.DELETE_SHIFT_FAILED;
  };

  openModal: () => {
    type: Types.OPEN_MODAL;
  };

  closeModal: () => {
    type: Types.CLOSE_MODAL;
  };
}

const CreatedActions = createActions(
  {
    getShiftsRequest: [],
    getShiftsSuccess: ['payload'],
    getShiftsFailed: [],

    createShiftRequest: ['payload'],
    createShiftSuccess: ['payload'],
    createShiftFailed: [],

    setEditableItem: ['payload'],
    editShiftRequest: ['payload'],
    editShiftSuccess: ['payload'],
    editShiftFailed: [],

    deleteShiftRequest: ['payload'],
    deleteShiftSuccess: ['payload'],
    deleteShiftFailed: [],

    openModal: [],
    closeModal: [],
  },
  {
    prefix: '@shift/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
