import { all, put, takeLatest, select, call } from 'redux-saga/effects';
import * as Response from 'src/utils/response';
import { AxiosError } from 'axios';
import { notification } from 'src/utils/helpers';
import api from 'src/services/api';

import { Types as CategoryTypes, Creators as CategoryCreators } from './actions';
import { CategoryItemProps } from './reducer';

type VisibilityType = {
  origin_id: number;
  active: boolean;
};

type CreateCategoryActionProps = {
  type: CategoryTypes.CREATE_CATEGORY_REQUEST;
  payload: {
    menu_id: string | number;
    title: {
      'pt-br': string;
    };
    active: boolean;
    visibilities: Array<VisibilityType>;
  };
};

type EditCategoryActionProps = {
  type: CategoryTypes.EDIT_CATEGORY_REQUEST;
  payload: {
    category: CategoryItemProps;
    language: string;
  };
};

type GetCategoriesFromMenuProps = {
  type: CategoryTypes.GET_CATEGORIES_FROM_MENU;
  payload: {
    menu_id: string;
  };
};

type GetCategoryFromMenuProps = {
  type: CategoryTypes.GET_CATEGORY_REQUEST;
  payload: {
    category_id: number;
    language?: string;
  };
};

type ReorderCategoryProps = {
  type: CategoryTypes.REORDER_CATEGORY_REQUEST;
  payload: {
    category_id: number | string;
    old_position: number;
    new_position: number;
  };
};

type DeleteCategoryProps = {
  type: CategoryTypes.DELETE_CATEGORY_REQUEST;
  payload: number;
};

type CloneCategoryProps = {
  type: CategoryTypes.CLONE_CATEGORY_REQUEST;
  payload: {
    menu_id: number | string;
    category_id: number | string;
    visibilities: Array<VisibilityType>;
  };
};

export function* getCategories(action: GetCategoriesFromMenuProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `menu/v1/units/${unity.id}/categories?menu_id=${action.payload}&pagination=0`,
    );

    if (status === Response.HTTP_OK) {
      yield put(CategoryCreators.getCategoriesSuccess(response.data));
    }
  } catch (error) {
    yield put(CategoryCreators.getCategoriesFailed());
  }
}

export function* getCategory(action: GetCategoryFromMenuProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `menu/v1/units/${unity.id}/categories/${action.payload.category_id}`,
    );

    if (status === Response.HTTP_OK) {
      yield put(CategoryCreators.getCategorySuccess(response.data));
    }
  } catch (error) {
    yield put(CategoryCreators.getCategoryFailed());
  }
}

export function* getCategoriesFromMenu(action: GetCategoriesFromMenuProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `menu/v1/units/${unity.id}/categories?menu_id=${action.payload}&pagination=0`,
    );

    if (status === Response.HTTP_OK) {
      yield put(CategoryCreators.getCategoriesFromMenuSuccess(response.data));
    }
  } catch (error) {
    yield put(CategoryCreators.getCategoriesFromMenuFailed());
  }
}

export function* createCloneCategory(action: CloneCategoryProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const data = {
      menu_id: action.payload.menu_id,
      visibilities: action.payload.visibilities,
    };

    const { status, data: response } = yield call(
      api.put,
      `/menu/v1/units/${unity.id}/categories/${action.payload.category_id}/clone`,
      data,
    );

    if (status === Response.HTTP_OK) {
      yield put(CategoryCreators.createCategorySuccess(response.data));
      notification.success('A categoria foi clonada com sucesso!', '');
    }
  } catch (error) {
    yield put(CategoryCreators.getCategoriesFromMenuFailed());
  }
}

export function* createCategory(action: CreateCategoryActionProps) {
  try {
    const {
      hall: { unity },
      menu: { editable },
    } = yield select((state) => state);

    action.payload.menu_id = editable.id;

    const { status, data: response } = yield call(api.post, `/menu/v1/units/${unity.id}/categories`, action.payload);

    if (status === Response.HTTP_CREATED) {
      yield all([put(CategoryCreators.createCategorySuccess(response.data))]);
    }
  } catch (error) {
    yield put(CategoryCreators.createCategoryFailed());
  }
}

export function* reorderCategory(action: ReorderCategoryProps) {
  const { old_position, new_position, category_id } = action.payload;

  const { unity } = yield select((state) => state.hall);

  const positions = {
    old_position,
    new_position,
  };

  const { status, data: response } = yield call(
    api.put,
    `/menu/v1/units/${unity.id}/categories/${category_id}/reordering`,
    positions,
  );

  if (status === Response.HTTP_OK) {
    yield put(CategoryCreators.categoryPosition(response.resource));
  }
}

export function* deleteCategory(action: DeleteCategoryProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status } = yield call(api.delete, `/menu/v1/units/${unity.id}/categories/${action.payload}`);

    if (status === Response.NO_CONTENT) {
      yield put(CategoryCreators.deleteCategorySuccess(action.payload));
    }
  } catch (err) {
    const error = err as AxiosError;
    notification.warning(
      'Erro ao deletar a categoria!',
      error.response?.data?.message || 'Algum erro inesperado aconteceu, tente novamente mais tarde.',
    );

    yield put(CategoryCreators.deleteCategoryFailed());
  }
}

export function* editCategory(action: EditCategoryActionProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.put,
      `/menu/v1/units/${unity.id}/categories/${action.payload.category.id}`,
      action.payload.category,
    );

    if (status === Response.HTTP_OK) {
      yield put(CategoryCreators.editCategorySuccess(response.data));
    }
  } catch (err) {
    const error = err as AxiosError;
    notification.warning(
      'Erro ao editar a categoria!',
      error.response?.data?.message || 'Algum erro inesperado aconteceu, tente novamente mais tarde.',
    );
    yield put(CategoryCreators.editCategoryFailed());
  }
}

export default all([
  takeLatest(CategoryTypes.GET_CATEGORIES_REQUEST, getCategories),
  takeLatest(CategoryTypes.GET_CATEGORY_REQUEST, getCategory),
  takeLatest(CategoryTypes.CREATE_CATEGORY_REQUEST, createCategory),
  takeLatest(CategoryTypes.EDIT_CATEGORY_REQUEST, editCategory),
  takeLatest(CategoryTypes.DELETE_CATEGORY_REQUEST, deleteCategory),
  takeLatest(CategoryTypes.REORDER_CATEGORY_REQUEST, reorderCategory),
  takeLatest(CategoryTypes.GET_CATEGORIES_FROM_MENU, getCategoriesFromMenu),
  takeLatest(CategoryTypes.CLONE_CATEGORY_REQUEST, createCloneCategory),
]);
