import produce from 'immer';
import type { ModalProps, Pagination } from 'src/types';
import { ModalStateEnum } from 'src/types';
import { Types as ProductTypes } from './actions';
import { Tag } from '../menu/reducer';

type Price = {
  price: number;
  origin_id: string;
  origin_slug?: string | null;
};

type AvailabilityProps = {
  origin_id?: string | number;
  active?: boolean;
  origin?: string;
};

export type ActiveProps = {
  category_item_id?: string | number;
  active: boolean;
};

export type EditVisibilitiesProps = {
  id?: string | number;
  item_id?: string;
  visibilities?: AvailabilityProps;
};

type Image = {
  id: string;
  priority: number;
  image: string;
  created_at: string;
  updated_at: string;
};

export type ImageDataProps = {
  content: string;
  name?: string;
  property?: string;
};

export type ProductItemProps = {
  imageBase64?: ImageDataProps;
  item_id?: string;
  imageUrl?: string;
  images?: Array<Image>;
  id?: string | number;
  type?: string;
  title: {
    'pt-br': string;
  };
  description: {
    'pt-br': string | undefined;
  };
  price: number;
  for_adults_only: boolean;
  active?: boolean;
  prices?: Array<Price>;
  optionals?: number;
  tags?: Tag[];
  portion?: number;
  category_id?: string | number;
};

export type ProductItemPropsPayload = Omit<ProductItemProps, 'tags'> & {
  tags: { tag_id: string }[];
};

export type ItemType = {
  items?: Array<ProductItemProps>;
  pagination?: Pagination;
};

export type GetItemsParams = {
  category_id?: string | number;
  page?: number;
};

export type ProductReorderItemProps = {
  item_id: string | number;
  old_position?: number;
  new_position?: number;
};

export type ProductListProps = {
  page: number;
  menu_id: string;
};

export type ProductProps = {
  loading: boolean;
  saving: boolean;
  data: Array<ProductItemProps>;
  all: Array<ProductItemProps>;
  editable: ProductItemProps | null;
  isOpen: ModalProps;
  hasMore: boolean;
  pagination: Pagination | null;
  allProducts: Array<ProductItemProps>;
  allProductsLoading: boolean;
};

export const INITIAL_STATE: ProductProps = {
  loading: true,
  saving: false,
  data: [],
  all: [],
  hasMore: true,
  editable: null,
  isOpen: ModalStateEnum.CLOSED,
  pagination: null,
  allProducts: [],
  allProductsLoading: false,
};

const product = produce((draft: ProductProps, action) => {
  switch (action.type) {
    case ProductTypes.PRODUCT_POSITION: {
      const index = draft.data.findIndex(
        (product) => product.id === action.payload.id
      );
      draft.data.splice(index, 1);
      draft.data.splice(action.payload.priority, 0, action.payload);
      break;
    }
    case ProductTypes.GET_PRODUCTS_REQUEST:
      draft.loading = true;
      break;
    case ProductTypes.GET_PRODUCTS_SUCCESS:
      draft.loading = false;
      draft.all = action.payload;
      break;
    case ProductTypes.GET_PRODUCTS_FAILED:
      draft.loading = false;
      break;
    case ProductTypes.RESET_PRODUCTS_FROM_CATEGORY:
      draft.data = [];
      draft.pagination = null;
      draft.hasMore = true;
      break;
    case ProductTypes.GET_PRODUCT_REQUEST:
      break;
    case ProductTypes.GET_ALL_PRODUCTS_FROM_CATEGORY:
      draft.allProductsLoading = true;
      break;
    case ProductTypes.GET_ALL_PRODUCTS_FROM_CATEGORY_SUCCESS:
      draft.allProductsLoading = false;
      draft.allProducts = action.payload;
      break;
    case ProductTypes.GET_PRODUCT_SUCCESS:
      draft.editable = action.payload;
      break;
    case ProductTypes.GET_PRODUCTS_FROM_CATEGORY:
      draft.loading = true;
      break;
    case ProductTypes.GET_PRODUCTS_FROM_CATEGORY_SUCCESS:
      draft.loading = false;
      draft.data = action.payload.data;
      draft.pagination = action.payload.pagination;
      break;
    case ProductTypes.GET_PRODUCTS_FROM_CATEGORY_FAILED:
      draft.loading = false;
      break;
    case ProductTypes.RESET_EDITABLE_ITEM:
      draft.editable = null;
      break;
    case ProductTypes.GET_PRODUCT_FAILED:
      draft.loading = false;
      draft.editable = null;
      break;
    case ProductTypes.CREATE_PRODUCT_REQUEST:
      draft.saving = true;
      break;
    case ProductTypes.CREATE_PRODUCT_SUCCESS:
      draft.saving = false;
      draft.data.push(action.product);
      break;
    case ProductTypes.ACTIVE_PRODUCT_SUCCESS:
      draft.saving = false;
      draft.editable = null;
      draft.data[
        draft.data.findIndex((product) => product.id === action.payload.id)
      ] = action.payload;
      break;
    case ProductTypes.EDIT_PRODUCT_SUCCESS:
      draft.saving = false;
      draft.editable = null;
      draft.data[
        draft.data.findIndex((product) => product.id === action.product.id)
      ] = action.product;
      break;
    case ProductTypes.EDIT_PRODUCT_REQUEST:
      draft.saving = true;
      break;
    case ProductTypes.EDIT_PRODUCT_FAILED:
      draft.saving = false;
      break;
    case ProductTypes.CREATE_PRODUCT_FAILED:
      draft.saving = false;
      break;
    case ProductTypes.DELETE_PRODUCT_SUCCESS:
      draft.data = draft.data.filter(
        (product) => product.id !== action.payload
      );
      break;
    case ProductTypes.SHOW_MODAL:
      draft.isOpen = ModalStateEnum.OPENED;
      break;
    case ProductTypes.HIDE_MODAL:
      draft.isOpen = ModalStateEnum.CLOSED;
      break;
    case ProductTypes.LOADED_ALL_PRODUCTS:
      draft.hasMore = false;
      draft.loading = false;
  }
}, INITIAL_STATE);

export default product;
