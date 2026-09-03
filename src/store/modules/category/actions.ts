import { Key } from 'react';
import { ActionCreators, createActions } from 'reduxsauce';
import {
  CategoryItemProps,
  CategoryReorderItemProps,
  CreateCategoryItemProps,
  CloneCategoryItemProps,
} from './reducer';

export enum Types {
  GET_CATEGORIES_REQUEST = '@category/GET_CATEGORIES_REQUEST',
  GET_CATEGORY_REQUEST = '@category/GET_CATEGORY_REQUEST',
  GET_CATEGORIES_SUCCESS = '@category/GET_CATEGORIES_SUCCESS',
  GET_CATEGORY_SUCCESS = '@category/GET_CATEGORY_SUCCESS',
  GET_CATEGORIES_FAILED = '@category/GET_CATEGORIES_FAILED',
  GET_CATEGORY_FAILED = '@category/GET_CATEGORY_FAILED',

  GET_CATEGORIES_FROM_MENU = '@category/GET_CATEGORIES_FROM_MENU',
  GET_CATEGORIES_FROM_MENU_SUCCESS = '@category/GET_CATEGORIES_FROM_MENU_SUCCESS',
  GET_CATEGORIES_FROM_MENU_FAILED = '@category/GET_CATEGORIES_FROM_MENU_FAILED',
  RESET_CATEGORIES_FROM_MENU = '@category/RESET_CATEGORIES_FROM_MENU',

  GET_PRODUCTS_FROM_CATEGORY = '@category/GET_PRODUCTS_FROM_CATEGORY',
  GET_PRODUCTS_FROM_CATEGORY_SUCCESS = '@category/GET_PRODUCTS_FROM_CATEGORY_SUCCESS',
  GET_PRODUCTS_FROM_CATEGORY_FAILED = '@category/GET_PRODUCTS_FROM_CATEGORY_FAILED',
  RESET_PRODUCTS_FROM_CATEGORY = '@category/RESET_PRODUCTS_FROM_CATEGORY',

  CREATE_CATEGORY_REQUEST = '@category/CREATE_CATEGORY_REQUEST',
  CREATE_CATEGORY_SUCCESS = '@category/CREATE_CATEGORY_SUCCESS',
  CREATE_CATEGORY_FAILED = '@category/CREATE_CATEGORY_FAILED',

  DELETE_CATEGORY_REQUEST = '@category/DELETE_CATEGORY_REQUEST',
  DELETE_CATEGORY_SUCCESS = '@category/DELETE_CATEGORY_SUCCESS',
  DELETE_CATEGORY_FAILED = '@category/DELETE_CATEGORY_FAILED',

  REORDER_CATEGORY_REQUEST = '@category/REORDER_CATEGORY_REQUEST',
  REORDER_CATEGORY_FAILED = '@category/REORDER_CATEGORY_FAILED',

  EDIT_CATEGORY_REQUEST = '@category/EDIT_CATEGORY_REQUEST',
  EDIT_CATEGORY_SUCCESS = '@category/EDIT_CATEGORY_SUCCESS',
  EDIT_CATEGORY_FAILED = '@category/EDIT_CATEGORY_FAILED',

  CATEGORY_POSITION = '@category/CATEGORY_POSITION',

  SET_CURRENT_CATEGORY = '@category/SET_CURRENT_CATEGORY',

  CLONE_CATEGORY_REQUEST = '@category/CLONE_CATEGORY_REQUEST',

  SHOW_MODAL = '@category/SHOW_MODAL',
  HIDE_MODAL = '@category/HIDE_MODAL',
}

interface Actions extends ActionCreators {
  categoryPosition: (
    category: CategoryItemProps
  ) => {
    type: Types.CATEGORY_POSITION;
  };
  getCategoriesRequest: (
    menu_id: number | Key
  ) => {
    type: Types.GET_CATEGORIES_REQUEST;
  };
  getCategoryRequest: (payload: {
    category_id: string | number;
  }) => {
    type: Types.GET_CATEGORY_REQUEST;
  };
  getCategoriesFromMenu: (
    menu_id: number | Key
  ) => {
    type: Types.GET_CATEGORIES_FROM_MENU;
  };
  getCategoriesFromMenuSuccess: (
    categories: Array<CategoryItemProps>
  ) => {
    type: Types.GET_CATEGORIES_FROM_MENU_SUCCESS;
  };
  getCategoriesFromMenuFailed: () => {
    type: Types.GET_CATEGORIES_FROM_MENU_FAILED;
  };
  getProductsFromCategory: (
    category_id: number
  ) => {
    type: Types.GET_PRODUCTS_FROM_CATEGORY;
  };
  resetCategoriesFromMenu: () => {
    type: Types.RESET_CATEGORIES_FROM_MENU;
  };
  getCategoriesSuccess: (
    categories: Array<CategoryItemProps>
  ) => {
    type: Types.GET_CATEGORIES_SUCCESS;
    payload: Array<CategoryItemProps>;
  };
  getCategorySuccess: (
    category: CategoryItemProps
  ) => {
    type: Types.GET_CATEGORY_SUCCESS;
    payload: CategoryItemProps;
  };
  getCategoriesFailed: () => {
    type: Types.GET_CATEGORIES_FAILED;
  };
  getCategoryFailed: () => {
    type: Types.GET_CATEGORY_FAILED;
  };
  createCategoryRequest: (
    payload: CreateCategoryItemProps
  ) => {
    type: Types.CREATE_CATEGORY_REQUEST;
  };
  cloneCategoryRequest: (
    category: CloneCategoryItemProps
  ) => {
    type: Types.CLONE_CATEGORY_REQUEST;
  };
  reorderCategoryRequest: (
    category: CategoryReorderItemProps
  ) => {
    type: Types.REORDER_CATEGORY_REQUEST;
  };
  editCategoryRequest: (payload: {
    category: CategoryItemProps;
  }) => {
    type: Types.EDIT_CATEGORY_REQUEST;
  };
  setCurrentCategory: (
    category: CategoryItemProps | null
  ) => {
    type: Types.SET_CURRENT_CATEGORY;
  };
  editCategorySuccess: (
    category: CategoryItemProps
  ) => {
    type: Types.EDIT_CATEGORY_SUCCESS;
  };
  editCategoryFailed: () => {
    type: Types.EDIT_CATEGORY_FAILED;
  };
  createCategorySuccess: (
    category: CategoryItemProps
  ) => {
    type: Types.CREATE_CATEGORY_SUCCESS;
    payload: string;
  };
  createCategoryFailed: () => {
    type: Types.CREATE_CATEGORY_FAILED;
  };
  deleteCategoryRequest: (
    category_id: string | undefined | number
  ) => {
    type: Types.DELETE_CATEGORY_REQUEST;
  };
  deleteCategorySuccess: (
    user_id: string | number
  ) => {
    type: Types.DELETE_CATEGORY_SUCCESS;
    payload: string;
  };
  deleteCategoryFailed: () => {
    type: Types.DELETE_CATEGORY_FAILED;
  };
  showModal: () => {
    type: Types.SHOW_MODAL;
  };

  hideModal: () => {
    type: Types.HIDE_MODAL;
  };
}

const CreatedActions = createActions(
  {
    categoryPosition: ['payload'],

    getCategoriesRequest: ['payload'],
    getCategoriesSuccess: ['payload'],
    getCategoriesFailed: [],

    getCategoriesFromMenu: ['payload'],
    getCategoriesFromMenuSuccess: ['payload'],
    getCategoriesFromMenuFailed: [],
    resetCategoriesFromMenu: [],

    getProductsFromCategory: [],

    getCategoryRequest: ['payload'],
    getCategorySuccess: ['payload'],
    getCategoryFailed: [],

    createCategoryRequest: ['payload'],
    createCategorySuccess: ['payload'],
    createCategoryFailed: [],

    cloneCategoryRequest: ['payload'],

    editCategoryRequest: ['payload'],
    editCategorySuccess: ['payload'],
    editCategoryFailed: [],

    deleteCategoryRequest: ['payload'],
    deleteCategorySuccess: ['payload'],
    deleteCategoryFailed: [],

    setCurrentCategory: ['payload'],

    reorderCategoryRequest: ['payload'],

    showModal: [],
    hideModal: [],
  },
  {
    prefix: '@category/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
