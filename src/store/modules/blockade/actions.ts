import { ActionCreators, createActions } from 'reduxsauce';
import { BlockadeItemProps } from './reducer';

interface Actions extends ActionCreators {
  getBlockadesRequest: (payload: {
    unity_id: string;
    page: number;
    start_at?: string;
    end_at?: string;
    with_filter?: boolean;
  }) => {
    type: Types.GET_BLOCKADES_REQUEST;
    payload: {
      unity_id: string;
      page: number;
      start_at?: string;
      end_at?: string;
      with_filter?: boolean;
    };
  };
  getBlockadesSuccess: (
    units: Array<BlockadeItemProps>
  ) => {
    type: Types.GET_BLOCKADES_SUCCESS;
    payload: Array<BlockadeItemProps>;
  };
  getBlockadesFailed: () => {
    type: Types.GET_BLOCKADES_FAILED;
  };

  createBlockadeRequest: (
    blockade: BlockadeItemProps
  ) => {
    type: Types.CREATE_BLOCKADE_REQUEST;
  };
  createBlockadeSuccess: (
    blockade: BlockadeItemProps
  ) => {
    type: Types.CREATE_BLOCKADE_SUCCESS;
    payload: BlockadeItemProps;
  };
  createBlockadeFailed: (
    payload: Array<{ name: string; errors: Array<string> }>
  ) => {
    type: Types.CREATE_BLOCKADE_FAILED;
    payload: Array<{ name: string; errors: Array<string> }>;
  };

  setEditableItem: (
    blockade: BlockadeItemProps
  ) => {
    type: Types.SET_EDITABLE_ITEM;
    payload: BlockadeItemProps;
  };

  editBlockadeRequest: (
    blockade: BlockadeItemProps
  ) => {
    type: Types.EDIT_BLOCKADE_REQUEST;
  };
  editBlockadeSuccess: (
    blockade: BlockadeItemProps
  ) => {
    type: Types.EDIT_BLOCKADE_SUCCESS;
    payload: BlockadeItemProps;
  };
  editBlockadeFailed: () => {
    type: Types.EDIT_BLOCKADE_FAILED;
  };

  deleteBlockadeRequest: (
    blockade_id: string
  ) => {
    type: Types.DELETE_BLOCKADE_REQUEST;
  };
  deleteBlockadeSuccess: (
    blockade_id: string
  ) => {
    type: Types.DELETE_BLOCKADE_SUCCESS;
  };
  deleteBlockadeFailed: () => {
    type: Types.DELETE_BLOCKADE_FAILED;
  };

  showModal: () => {
    type: Types.SHOW_MODAL;
  };

  hideModal: () => {
    type: Types.HIDE_MODAL;
  };
}

export enum Types {
  GET_BLOCKADES_REQUEST = '@blockade/GET_BLOCKADES_REQUEST',
  GET_BLOCKADES_SUCCESS = '@blockade/GET_BLOCKADES_SUCCESS',
  GET_BLOCKADES_FAILED = '@blockade/GET_BLOCKADES_FAILED',

  CREATE_BLOCKADE_REQUEST = '@blockade/CREATE_BLOCKADE_REQUEST',
  CREATE_BLOCKADE_SUCCESS = '@blockade/CREATE_BLOCKADE_SUCCESS',
  CREATE_BLOCKADE_FAILED = '@blockade/CREATE_BLOCKADE_FAILED',

  SET_EDITABLE_ITEM = '@blockade/SET_EDITABLE_ITEM',
  EDIT_BLOCKADE_REQUEST = '@blockade/EDIT_BLOCKADE_REQUEST',
  EDIT_BLOCKADE_SUCCESS = '@blockade/EDIT_BLOCKADE_SUCCESS',
  EDIT_BLOCKADE_FAILED = '@blockade/EDIT_BLOCKADE_FAILED',

  DELETE_BLOCKADE_REQUEST = '@blockade/DELETE_BLOCKADE_REQUEST',
  DELETE_BLOCKADE_SUCCESS = '@blockade/DELETE_BLOCKADE_SUCCESS',
  DELETE_BLOCKADE_FAILED = '@blockade/DELETE_BLOCKADE_FAILED',

  SHOW_MODAL = '@blockade/SHOW_MODAL',
  HIDE_MODAL = '@blockade/HIDE_MODAL',
}

const CreatedActions = createActions(
  {
    getBlockadesRequest: ['payload'],
    getBlockadesSuccess: ['payload'],
    getBlockadesFailed: [],

    createBlockadeRequest: ['payload'],
    createBlockadeSuccess: ['payload'],
    createBlockadeFailed: ['payload'],

    setEditableItem: ['payload'],
    editBlockadeRequest: ['payload'],
    editBlockadeSuccess: ['payload'],
    editBlockadeFailed: [],

    deleteBlockadeRequest: ['payload'],
    deleteBlockadeSuccess: ['payload'],
    deleteBlockadeFailed: [],

    showModal: [],
    hideModal: [],
  },
  {
    prefix: '@blockade/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
