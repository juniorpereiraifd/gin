import { ActionCreators, createActions } from 'reduxsauce';
import {
  ProductItemProps,
  ProductItemPropsPayload,
  ProductReorderItemProps,
  ItemType,
  GetItemsParams,
  ActiveProps,
  EditVisibilitiesProps,
} from './reducer';

export enum Types {
  GET_PRODUCTS_REQUEST = '@product/GET_PRODUCTS_REQUEST',
  GET_PRODUCT_REQUEST = '@product/GET_PRODUCT_REQUEST',
  GET_PRODUCTS_SUCCESS = '@product/GET_PRODUCTS_SUCCESS',
  GET_PRODUCT_SUCCESS = '@product/GET_PRODUCT_SUCCESS',
  GET_PRODUCTS_FAILED = '@product/GET_PRODUCTS_FAILED',
  GET_PRODUCT_FAILED = '@product/GET_PRODUCT_FAILED',

  GET_PRODUCTS_FROM_MENU = '@product/GET_PRODUCTS_FROM_MENU',
  GET_PRODUCTS_FROM_MENU_SUCCESS = '@product/GET_PRODUCTS_FROM_MENU_SUCCESS',
  GET_PRODUCTS_FROM_MENU_FAILED = '@product/GET_PRODUCTS_FROM_MENU_FAILED',

  CREATE_PRODUCT_REQUEST = '@product/CREATE_PRODUCT_REQUEST',
  CREATE_PRODUCT_SUCCESS = '@product/CREATE_PRODUCT_SUCCESS',
  CREATE_PRODUCT_FAILED = '@product/CREATE_PRODUCT_FAILED',

  DELETE_PRODUCT_REQUEST = '@product/DELETE_PRODUCT_REQUEST',
  DELETE_PRODUCT_SUCCESS = '@product/DELETE_PRODUCT_SUCCESS',
  DELETE_PRODUCT_FAILED = '@product/DELETE_PRODUCT_FAILED',

  REORDER_PRODUCTS_REQUEST = '@product/REORDER_PRODUCTS_REQUEST',
  REORDER_PRODUCT_FAILED = '@product/REORDER_PRODUCT_FAILED',

  EDIT_PRODUCT_VISIBILITIES = '@product/EDIT_PRODUCT_VISIBILITIES',

  EDIT_PRODUCT_REQUEST = '@product/EDIT_PRODUCT_REQUEST',
  EDIT_PRODUCT_SUCCESS = '@product/EDIT_PRODUCT_SUCCESS',
  EDIT_PRODUCT_FAILED = '@product/EDIT_PRODUCT_FAILED',

  GET_PRODUCTS_FROM_CATEGORY = '@product/GET_PRODUCTS_FROM_CATEGORY',
  GET_PRODUCTS_FROM_CATEGORY_SUCCESS = '@product/GET_PRODUCTS_FROM_CATEGORY_SUCCESS',
  GET_PRODUCTS_FROM_CATEGORY_FAILED = '@product/GET_PRODUCTS_FROM_CATEGORY_FAILED',
  RESET_PRODUCTS_FROM_CATEGORY = '@product/RESET_PRODUCTS_FROM_CATEGORY',

  GET_ALL_PRODUCTS_FROM_CATEGORY = '@product/GET_ALL_PRODUCTS_FROM_CATEGORY',

  GET_ALL_PRODUCTS_FROM_CATEGORY_SUCCESS = '@product/GET_ALL_PRODUCTS_FROM_CATEGORY_SUCCESS',

  SET_EDITABLE_ITEM = '@product/SET_EDITABLE_ITEM',

  RESET_EDITABLE_ITEM = '@product/RESET_EDITABLE_ITEM',

  LOADED_ALL_PRODUCTS = '@product/LOADED_ALL_PRODUCTS',

  CHANGE_ACTIVE_STATUS = '@product/CHANGE_ACTIVE_STATUS',
  ACTIVE_PRODUCT_SUCCESS = '@product/ACTIVE_PRODUCT_SUCCESS',

  PRODUCT_POSITION = '@product/PRODUCT_POSITION',

  SHOW_MODAL = '@product/SHOW_MODAL',
  HIDE_MODAL = '@product/HIDE_MODAL',
}

interface Actions extends ActionCreators {
  productPosition: (
    product: ProductItemProps
  ) => {
    type: Types.PRODUCT_POSITION;
  };
  getProductsRequest: () => {
    type: Types.GET_PRODUCTS_REQUEST;
  };
  getProductRequest: (
    category_item_id: number | string | undefined
  ) => {
    type: Types.GET_PRODUCT_REQUEST;
  };
  resetProductsFromCategory: () => {
    type: Types.RESET_PRODUCTS_FROM_CATEGORY;
  };
  loadedAllProducts: () => {
    type: Types.LOADED_ALL_PRODUCTS;
  };
  changeActiveStatus: (
    data: ActiveProps
  ) => {
    type: Types.CHANGE_ACTIVE_STATUS;
  };
  getProductsSuccess: (
    products: Array<ProductItemProps>
  ) => {
    type: Types.GET_PRODUCTS_SUCCESS;
    payload: Array<ProductItemProps>;
  };
  activeProductSuccess: (
    products: Array<ProductItemProps>
  ) => {
    type: Types.ACTIVE_PRODUCT_SUCCESS;
  };
  getProductsFromCategory: (
    data: GetItemsParams
  ) => {
    type: Types.GET_PRODUCTS_FROM_CATEGORY;
  };
  getProductsFromCategorySuccess: (
    items: ItemType
  ) => {
    type: Types.GET_PRODUCTS_FROM_CATEGORY_SUCCESS;
  };
  getProductsFromFailed: () => {
    type: Types.GET_PRODUCTS_FROM_CATEGORY_FAILED;
  };
  getProductSuccess: (
    product: ProductItemProps
  ) => {
    type: Types.GET_PRODUCT_SUCCESS;
    payload: ProductItemProps;
  };
  getProductsFailed: () => {
    type: Types.GET_PRODUCTS_FAILED;
  };
  getProductFailed: () => {
    type: Types.GET_PRODUCT_FAILED;
  };
  createProductRequest: (
    product: ProductItemPropsPayload
  ) => {
    type: Types.CREATE_PRODUCT_REQUEST;
    product: ProductItemPropsPayload;
  };
  reorderProductsRequest: (
    product: ProductReorderItemProps
  ) => {
    type: Types.REORDER_PRODUCTS_REQUEST;
  };
  getAllProductsFromCategory: (
    category_id: string
  ) => {
    type: Types.GET_ALL_PRODUCTS_FROM_CATEGORY;
  };
  getAllProductsFromCategorySuccess: (
    products: Array<ProductItemProps>
  ) => {
    type: Types.GET_ALL_PRODUCTS_FROM_CATEGORY_SUCCESS;
  };
  editProductRequest: (
    product: ProductItemPropsPayload
  ) => {
    type: Types.EDIT_PRODUCT_REQUEST;
    product: ProductItemPropsPayload;
  };
  editProductSuccess: (
    product: ProductItemProps
  ) => {
    type: Types.EDIT_PRODUCT_SUCCESS;
    product: ProductItemProps;
  };
  editProductFailed: () => {
    type: Types.EDIT_PRODUCT_FAILED;
  };
  editProductVisibilities: (
    item: EditVisibilitiesProps
  ) => {
    type: Types.EDIT_PRODUCT_VISIBILITIES;
  };
  createProductSuccess: (
    product: ProductItemProps
  ) => {
    type: Types.CREATE_PRODUCT_SUCCESS;
    payload: ProductItemProps;
  };
  createProductFailed: () => {
    type: Types.CREATE_PRODUCT_FAILED;
  };
  deleteProductRequest: (
    category_item_id: string | number | undefined
  ) => {
    type: Types.DELETE_PRODUCT_REQUEST;
  };
  deleteProductSuccess: (
    category_item_id: string | number | undefined
  ) => {
    type: Types.DELETE_PRODUCT_SUCCESS;
  };
  deleteProductFailed: () => {
    type: Types.DELETE_PRODUCT_FAILED;
  };
  resetEditable: () => {
    type: Types.RESET_EDITABLE_ITEM;
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
    getProductsRequest: ['payload'],
    getProductsSuccess: ['payload'],
    getProductsFailed: [],

    getProductRequest: ['payload'],
    getProductSuccess: ['payload'],
    getProductFailed: [],

    createProductRequest: ['product'],
    createProductSuccess: ['product'],
    createProductFailed: [],

    deleteProductRequest: ['payload'],
    deleteProductSuccess: ['payload'],
    deleteProductFailed: [],

    resetProductsFromCategory: [],

    getProductsFromCategory: ['payload'],
    getProductsFromCategorySuccess: ['payload'],
    getProductsFromCategoryFailed: ['payload'],

    reorderProductsRequest: ['payload'],

    changeActiveStatus: ['payload'],

    loadedAllProducts: [],

    editProductRequest: ['product'],

    getAllProductsFromCategory: ['payload'],

    getAllProductsFromCategorySuccess: ['payload'],

    activeProductSuccess: ['payload'],

    editProductSuccess: ['product'],
    editProductFailed: [],

    productPosition: ['payload'],

    editProductVisibilities: ['payload'],

    resetEditable: [],

    showModal: [],
    hideModal: [],
  },
  {
    prefix: '@product/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
