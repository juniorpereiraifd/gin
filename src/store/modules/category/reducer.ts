import produce from 'immer';
import { Types as CategoryTypes } from './actions';
import { ModalStateEnum, ModalProps } from 'src/types';

type AvailabilityProps = {
  origin_id?: string | number;
  active?: boolean;
  origin?: string;
};

export type CategoryItemProps = {
  id: string | number;
  title: {
    'pt-br': string;
  };
  active: boolean;
  priority?: number | string;
  visibilities: Array<AvailabilityProps> | undefined;
};

export type CreateCategoryItemProps = {
  menu_id?: number | string;
  category_id?: number | string;
  title: {
    'pt-br': string;
  };
  active: boolean;
};

export type CloneCategoryItemProps = {
  menu_id?: string | number;
  category_id?: string | number;
  visibilities?: Array<AvailabilityProps>;
};

export type CategoryReorderItemProps = {
  category_id: string | number;
  old_position: number;
  new_position: number;
};

export type CategoryProps = {
  loading: boolean;
  saving: boolean;
  data: Array<CategoryItemProps>;
  editable: CategoryItemProps | null;
  categoriesFromMenu: Array<CategoryItemProps>;
  isOpen: ModalProps;
  loadingCategories: boolean;
  loadingCategory: boolean;
  loadingProducts: boolean;
  onDeleting: boolean;
  currentCategory: CategoryItemProps | null;
};

export const INITIAL_STATE: CategoryProps = {
  loading: false,
  loadingCategories: false,
  loadingCategory: false,
  loadingProducts: false,
  saving: false,
  data: [],
  editable: null,
  onDeleting: false,
  categoriesFromMenu: [],
  isOpen: ModalStateEnum.CLOSED,
  currentCategory: null,
};

const category = produce((draft: CategoryProps, action) => {
  switch (action.type) {
    case CategoryTypes.CATEGORY_POSITION: {
      const index = draft.data.findIndex(
        (category) => category.id === action.payload.id
      );
      draft.data.splice(index, 1);
      draft.data.splice(action.payload.priority, 0, action.payload);
      break;
    }
    case CategoryTypes.GET_CATEGORIES_REQUEST:
      draft.loading = true;
      break;
    case CategoryTypes.GET_CATEGORIES_SUCCESS:
      draft.loading = false;
      draft.data = action.payload;
      break;
    case CategoryTypes.GET_CATEGORIES_FROM_MENU:
      draft.loadingCategories = true;
      break;
    case CategoryTypes.GET_PRODUCTS_FROM_CATEGORY:
      draft.loadingProducts = true;
      break;
    case CategoryTypes.GET_CATEGORIES_FROM_MENU_SUCCESS:
      draft.loadingCategories = false;
      draft.categoriesFromMenu = action.payload;
      break;
    case CategoryTypes.GET_CATEGORIES_FROM_MENU_FAILED:
      draft.loadingCategories = false;
      break;
    case CategoryTypes.RESET_CATEGORIES_FROM_MENU:
      draft.categoriesFromMenu = [];
      break;
    case CategoryTypes.GET_CATEGORIES_FAILED:
      draft.loading = false;
      break;
    case CategoryTypes.GET_CATEGORY_REQUEST:
      draft.loadingCategory = true;
      break;
    case CategoryTypes.GET_CATEGORY_SUCCESS:
      draft.editable = action.payload;
      draft.loadingCategory = false;
      break;
    case CategoryTypes.GET_CATEGORY_FAILED:
      draft.editable = null;
      draft.loadingCategory = false;
      break;
    case CategoryTypes.CREATE_CATEGORY_REQUEST:
      draft.saving = true;
      break;
    case CategoryTypes.CREATE_CATEGORY_SUCCESS:
      draft.saving = false;
      draft.data.push(action.payload);
      break;
    case CategoryTypes.EDIT_CATEGORY_REQUEST:
      draft.saving = true;
      break;
    case CategoryTypes.SET_CURRENT_CATEGORY:
      draft.currentCategory = action.payload;
      break;
    case CategoryTypes.EDIT_CATEGORY_SUCCESS:
      draft.saving = false;
      draft.data[
        draft.data.findIndex((category) => category.id === action.payload.id)
      ] = action.payload;
      break;
    case CategoryTypes.EDIT_CATEGORY_FAILED:
      draft.saving = false;
      break;
    case CategoryTypes.CREATE_CATEGORY_FAILED:
      draft.saving = false;
      break;
    case CategoryTypes.DELETE_CATEGORY_SUCCESS:
      draft.onDeleting = false;
      draft.data = draft.data.filter(
        (category) => category.id !== action.payload
      );
      break;
    case CategoryTypes.DELETE_CATEGORY_REQUEST:
      draft.onDeleting = true;
      break;
    case CategoryTypes.SHOW_MODAL:
      draft.isOpen = ModalStateEnum.OPENED;
      break;
    case CategoryTypes.HIDE_MODAL:
      draft.isOpen = ModalStateEnum.CLOSED;
      break;
  }
}, INITIAL_STATE);

export default category;
