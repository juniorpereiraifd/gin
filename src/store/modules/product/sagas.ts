import { AxiosResponse } from 'axios';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import api from 'src/services/api';
import type { Pagination } from 'src/types';
import { notification } from 'src/utils/helpers';
import * as Response from 'src/utils/response';
import { Creators as ProductCreators, Types as ProductTypes } from './actions';
import { GetItemsParams, ProductItemProps } from './reducer';

type AvailabilityProps = {
  origin_id?: string | number;
  active?: boolean;
  origin?: string;
};

type ReorderProductProps = {
  type: ProductTypes.REORDER_PRODUCTS_REQUEST;
  payload: {
    item_id: number | string;
    old_position: number;
    new_position: number;
  };
};

type DeleteItemType = {
  type: ProductTypes.DELETE_PRODUCT_REQUEST;
  payload: string | number | undefined;
};

type ActiveProps = {
  type: ProductTypes.CHANGE_ACTIVE_STATUS;
  payload: {
    category_item_id: string;
    active: boolean;
  };
};

type GetProductsFromMenuProps = {
  type: ProductTypes.GET_PRODUCTS_FROM_MENU;
  payload: GetItemsParams;
};

type CategoryId = {
  category_id: string | number;
};

type GetProduct = {
  type: ProductTypes.GET_PRODUCT_REQUEST;
  payload: {
    category_item_id: string;
  };
};

type EditProductVisibilities = {
  type: ProductTypes.EDIT_PRODUCT_VISIBILITIES;
  payload: {
    id?: string;
    item_id?: string;
    visibilities?: AvailabilityProps;
  };
};

type GetAllProductsFromCategoryProps = {
  type: ProductTypes.GET_ALL_PRODUCTS_FROM_CATEGORY;
  payload: CategoryId;
};

type GetProductsFromCategory = {
  success: boolean;
  data: ProductItemProps[];
  pagination: Pagination;
};

export function* getProduct(action: GetProduct) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `/menu/v1/units/${unity.id}/items/${action.payload}`
    );

    if (status === Response.HTTP_OK) {
      yield put(ProductCreators.getProductSuccess(response.data));
    }
  } catch (error) {
    yield put(ProductCreators.getProductFailed());
  }
}

export function* getProducts() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `/menu/v1/units/${unity.id}/items?pagination=0`
    );

    if (status === Response.HTTP_OK) {
      yield put(ProductCreators.getProductsSuccess(response.data));
    }
  } catch (error) {
    yield put(ProductCreators.getProductsFailed());
  }
}

export function* createProduct(
  action: ReturnType<typeof ProductCreators.createProductRequest>
) {
  try {
    const { unity } = yield select((state) => state.hall);
    const { imageBase64, category_id, ...productData } = action.product;

    const file_id = {
      name: imageBase64?.name,
      content: imageBase64?.content,
    };

    const { data: response } = yield call(
      api.post,
      `/menu/v1/units/${unity.id}/items`,
      productData
    );

    let image = null;
    if (imageBase64) {
      const { data: imageData } = yield call(
        api.post,
        `/menu/v1/units/${unity.id}/items/${response.data.id}/images`,
        { image: { ...file_id } }
      );

      image = imageData;
    }

    const linkInCategoryData = {
      category_id: category_id,
      item_id: response.data.id,
      active: true,
    };

    const { status: linkStatus, data: linkResponse } = yield call(
      api.post,
      `/menu/v1/units/${unity.id}/categories-items`,
      {
        ...linkInCategoryData,
      }
    );

    if (image) response.data.images = [image.data];

    if (linkStatus === Response.HTTP_CREATED) {
      yield put(ProductCreators.createProductSuccess(linkResponse.data));
      notification.success('Produto criado com sucesso!', '');
      yield put(
        ProductCreators.getProductsFromCategory({
          category_id,
          page: 1,
        })
      );
    }
  } catch (error) {
    yield put(ProductCreators.createProductFailed());
  }
}

export function* getProductsFromCategory(action: GetProductsFromMenuProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const {
      status,
      data: response,
    }: AxiosResponse<GetProductsFromCategory> = yield call(
      api.get,
      `menu/v1/units/${unity.id}/categories-items?category_id=${action.payload.category_id}&page=${action.payload.page}&per_page=10`
    );

    if (status === Response.HTTP_OK) {
      yield put(ProductCreators.getProductsFromCategorySuccess(response));
    }
  } catch (error) {
    yield put(ProductCreators.getProductsFromCategoryFailed());
  }
}

export function* getAllProductsFromCategory(
  action: GetAllProductsFromCategoryProps
) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `menu/v1/units/${unity.id}/categories-items?category_id=${action.payload}&pagination=0`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        ProductCreators.getAllProductsFromCategorySuccess(response.data)
      );
    }
  } catch (error) {
    yield put(ProductCreators.getProductsFromCategoryFailed());
  }
}

export function* reorderProduct(action: ReorderProductProps) {
  const { old_position, new_position, item_id } = action.payload;

  const {
    hall: { unity },
    category: { currentCategory },
  } = yield select((state) => state);

  const positions = {
    old_position,
    new_position,
  };

  const { status, data: response } = yield call(
    api.put,
    `/menu/v1/units/${unity.id}/categories-items/${item_id}/reordering`,
    positions
  );

  if (status === Response.HTTP_OK) {
    yield put(ProductCreators.activeProductSuccess(response.resource));
    yield put(
      ProductCreators.getProductsFromCategory({
        category_id: currentCategory?.id,
        page: 1,
      })
    );
  }

  yield put(ProductCreators.productPosition(response.resource));
}

export function* deleteProduct(action: DeleteItemType) {
  try {
    const {
      hall: { unity },
      category: { currentCategory },
    } = yield select((state) => state);

    const { status } = yield call(
      api.delete,
      `menu/v1/units/${unity?.id}/categories-items/${action.payload}`
    );

    if (status === Response.NO_CONTENT) {
      yield put(ProductCreators.deleteProductSuccess(action.payload));
      yield put(
        ProductCreators.getProductsFromCategory({
          category_id: currentCategory?.id,
          page: 1,
        })
      );
      notification.success('Produto removido com sucesso!', '');
    }
  } catch (error) {
    yield put(ProductCreators.deleteProductFailed());
  }
}

export function* changeActiveStatus(action: ActiveProps) {
  const {
    hall: { unity },
    category: { currentCategory },
  } = yield select((state) => state);

  const { status, data: response } = yield call(
    api.put,
    `/menu/v1/units/${unity.id}/categories-items/${action.payload.category_item_id}`,
    { active: action.payload.active }
  );

  if (status === Response.HTTP_OK) {
    yield put(ProductCreators.activeProductSuccess(response.data));
    yield put(
      ProductCreators.getProductsFromCategory({
        category_id: currentCategory?.id,
        page: 1,
      })
    );
  }
}

export function* editProduct(
  action: ReturnType<typeof ProductCreators.editProductRequest>
) {
  try {
    const {
      hall: { unity },
      category: { currentCategory },
    } = yield select((state) => state);
    const { imageBase64, ...productData } = action.product;

    const file_id = {
      name: imageBase64?.name,
      content: imageBase64?.content,
    };

    if (imageBase64) {
      yield call(
        api.post,
        `/menu/v1/units/${unity.id}/items/${productData.id}/images`,
        { image: { ...file_id } }
      );
    }

    const { status, data: response } = yield call(
      api.put,
      `/menu/v1/units/${unity.id}/items/${productData.id}`,
      productData
    );

    if (status === Response.HTTP_OK) {
      yield put(ProductCreators.editProductSuccess(response.data));
      yield put(ProductCreators.resetEditable());
      yield put(
        ProductCreators.getProductsFromCategory({
          category_id: currentCategory?.id,
          page: 1,
        })
      );
    }
  } catch (error) {
    yield put(ProductCreators.editProductFailed());
    yield put(ProductCreators.resetEditable());
  }
}

export function* editProductVisibilities(action: EditProductVisibilities) {
  try {
    const {
      hall: { unity },
      category: { currentCategory },
    } = yield select((state) => state);
    const { data: products } = yield select((state) => state.product);

    const { id: categoryId, item_id, visibilities } = action.payload;

    const { status, data: response } = yield call(
      api.put,
      `/menu/v1/units/${unity.id}/items/${item_id}`,
      { visibilities: visibilities }
    );

    const { active } = products.find(
      (item: ProductItemProps) => item.item_id === response.data.id
    );

    const editedProduct = {
      ...response.data,
      item_id: response.data.id,
      id: categoryId,
      active,
    };

    if (status === Response.HTTP_OK) {
      yield put(ProductCreators.editProductSuccess(editedProduct));
      yield put(
        ProductCreators.getProductsFromCategory({
          category_id: currentCategory?.id,
          page: 1,
        })
      );
    }
  } catch (error) {
    yield put(ProductCreators.editProductFailed());
    yield put(ProductCreators.resetEditable());
  }
}

export default all([
  takeLatest(ProductTypes.CREATE_PRODUCT_REQUEST, createProduct),
  takeLatest(ProductTypes.REORDER_PRODUCTS_REQUEST, reorderProduct),
  takeLatest(ProductTypes.GET_PRODUCTS_FROM_CATEGORY, getProductsFromCategory),
  takeLatest(ProductTypes.DELETE_PRODUCT_REQUEST, deleteProduct),
  takeLatest(ProductTypes.GET_PRODUCT_REQUEST, getProduct),
  takeLatest(ProductTypes.EDIT_PRODUCT_REQUEST, editProduct),
  takeLatest(ProductTypes.GET_PRODUCTS_REQUEST, getProducts),
  takeLatest(ProductTypes.CHANGE_ACTIVE_STATUS, changeActiveStatus),
  takeLatest(ProductTypes.EDIT_PRODUCT_VISIBILITIES, editProductVisibilities),
  takeLatest(
    ProductTypes.GET_ALL_PRODUCTS_FROM_CATEGORY,
    getAllProductsFromCategory
  ),
]);
