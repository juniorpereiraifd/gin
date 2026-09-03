import { ActionCreators, createActions } from 'reduxsauce';
import { PhotoItemProps } from './reducer';

interface Actions extends ActionCreators {
  getPhotosRequest: () => {
    type: Types.GET_PHOTOS_REQUEST;
  };
  getPhotosSuccess: (
    payload: Array<PhotoItemProps>
  ) => {
    type: Types.GET_PHOTOS_SUCCESS;
    payload: Array<PhotoItemProps>;
  };
  getPhotosFailed: () => {
    type: Types.GET_PHOTOS_FAILED;
  };

  createPhotoRequest: (payload: {
    name: string;
    content: string;
  }) => {
    type: Types.CREATE_PHOTO_REQUEST;
    payload: {
      name: string;
      content: string;
    };
  };
  createPhotoSuccess: (
    payload: PhotoItemProps
  ) => {
    type: Types.CREATE_PHOTO_SUCCESS;
    payload: PhotoItemProps;
  };
  createPhotoFailed: () => {
    type: Types.CREATE_PHOTO_FAILED;
  };

  deletePhotoRequest: (
    payload: PhotoItemProps
  ) => {
    type: Types.DELETE_PHOTO_REQUEST;
    payload: PhotoItemProps;
  };
  deletePhotoSuccess: (
    payload: PhotoItemProps
  ) => {
    type: Types.DELETE_PHOTO_SUCCESS;
    payload: PhotoItemProps;
  };
  deletePhotoFailed: () => {
    type: Types.DELETE_PHOTO_FAILED;
  };
}

export enum Types {
  GET_PHOTOS_REQUEST = '@photo/GET_PHOTOS_REQUEST',
  GET_PHOTOS_SUCCESS = '@photo/GET_PHOTOS_SUCCESS',
  GET_PHOTOS_FAILED = '@photo/GET_PHOTOS_FAILED',

  CREATE_PHOTO_REQUEST = '@photo/CREATE_PHOTO_REQUEST',
  CREATE_PHOTO_SUCCESS = '@photo/CREATE_PHOTO_SUCCESS',
  CREATE_PHOTO_FAILED = '@photo/CREATE_PHOTO_FAILED',

  DELETE_PHOTO_REQUEST = '@photo/DELETE_PHOTO_REQUEST',
  DELETE_PHOTO_SUCCESS = '@photo/DELETE_PHOTO_SUCCESS',
  DELETE_PHOTO_FAILED = '@photo/DELETE_PHOTO_FAILED',
}

const CreatedActions = createActions(
  {
    getPhotosRequest: ['payload'],
    getPhotosSuccess: ['payload'],
    getPhotosFailed: [],

    createPhotoRequest: ['payload'],
    createPhotoSuccess: ['payload'],
    createPhotoFailed: [],

    deletePhotoRequest: ['payload'],
    deletePhotoSuccess: ['payload'],
    deletePhotoFailed: [],
  },
  {
    prefix: '@photo/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
