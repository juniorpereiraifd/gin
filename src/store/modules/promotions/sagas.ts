import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import api from 'src/services/api';
import { UNITS_PER_PAGE } from 'src/utils/constants';
import { notification } from 'src/utils/helpers';
import * as Response from 'src/utils/response';
import { PromotionCreators, PromotionTypes } from './actions';
import type {
  GetCheckParticipatingPromotions,
  GetCustomerDetailResponse,
  GetCustomersResponse,
  GetPromotionsResponse,
  GetUnitsDataFromCsv,
  SetUnitParticipatingInThePromotionResponse,
} from './reducer';

export function* getPromotions() {
  try {
    const { status, data }: AxiosResponse<GetPromotionsResponse> = yield call(
      api.get,
      '/promotion/v1/promotions?pagination=0'
    );

    if (status === Response.HTTP_OK) {
      yield put(PromotionCreators.getPromotionsSuccess(data));
    }
  } catch (error) {
    yield put(PromotionCreators.getPromotionsFailed());
  }
}

export function* getPromotionDetails(
  action: ReturnType<typeof PromotionCreators.getPromotionDetailsRequest>
) {
  const { id, type, pagination } = action.payload;

  const parsedParam = Object.assign(
    {},
    type === 'current' && { current: dayjs().format('YYYY-MM-DD') },
    type === 'historic' && { historic: dayjs().format('YYYY-MM-DD') },
    pagination && { pagination }
  );

  try {
    const {
      status,
      data,
    }: AxiosResponse<GetCustomerDetailResponse> = yield call(
      api.get,
      `/promotion/v1/promotions/units/${id}`,
      { params: parsedParam }
    );

    if (status === Response.HTTP_OK) {
      yield put(PromotionCreators.getPromotionDetailsSuccess(type, data));
    }
  } catch (error) {
    yield put(PromotionCreators.getPromotionDetailsFailed());
  }
}

export function* createPromotion(
  action: ReturnType<typeof PromotionCreators.createPromotionRequest>
) {
  const { newPromotion, promotionType } = action.payload;

  try {
    const { status }: AxiosResponse = yield call(
      api.post,
      promotionType === 'get-in'
        ? '/promotion/v1/promotions'
        : '/promotion/v1/promotions/by-link',
      newPromotion
    );

    if (status === Response.HTTP_CREATED) {
      yield put(PromotionCreators.createPromotionSuccess());
      notification.success(
        'Promoção criada com sucesso!',
        `Promoção: ${newPromotion.title}`
      );
      yield put(PromotionCreators.getPromotionsRequest());
    }
  } catch (error) {
    yield put(PromotionCreators.createPromotionFailed());
  }
}

export function* getCsvModelForAddUnits() {
  api.defaults.responseType = 'blob';
  try {
    const { status, data }: AxiosResponse<Blob> = yield call(
      api.get,
      '/promotion/v1/promotions/units/csv-export-model'
    );

    if (status === Response.HTTP_OK) {
      yield put(PromotionCreators.getCsvModelForAddUnitsSuccess(data));
    }
  } catch (error) {
    yield put(PromotionCreators.getCsvModelForAddUnitsFailed());
  } finally {
    api.defaults.responseType = undefined;
  }
}

export function* editPromotion(
  action: ReturnType<typeof PromotionCreators.editPromotionRequest>
) {
  const { promotion, promotionType } = action.payload;

  try {
    const { status }: AxiosResponse = yield call(
      api.put,
      promotionType === 'get-in'
        ? `/promotion/v1/promotions/${promotion.id}`
        : `/promotion/v1/promotions/${promotion.id}/by-link`,
      promotion
    );

    if (status === Response.HTTP_OK) {
      yield put(PromotionCreators.editPromotionSuccess());
      notification.success('Promoção editada com sucesso!', '');
      yield put(PromotionCreators.getPromotionsRequest());
    }
  } catch (error) {
    yield put(PromotionCreators.editPromotionFailed());
  }
}

export function* includeUnitsInThePromotion(
  action: ReturnType<typeof PromotionCreators.includeUnitsInThePromotionRequest>
) {
  const { id, units } = action.payload;

  try {
    const { status }: AxiosResponse = yield call(
      api.post,
      `/promotion/v1/promotions/${id}`,
      { units }
    );

    if ([Response.HTTP_OK, Response.NO_CONTENT].includes(status)) {
      yield put(PromotionCreators.includeUnitsInThePromotionSuccess());
      notification.success('Unidades incluídas com sucesso!', '');
      yield put(PromotionCreators.getPromotionsRequest());
    }
  } catch (error) {
    yield put(PromotionCreators.includeUnitsInThePromotionFailed());
  }
}

export function* checkParticipatingPromotions(
  action: ReturnType<
    typeof PromotionCreators.checkParticipatingPromotionsRequest
  >
) {
  yield put(PromotionCreators.resetParticipatingPromotions());

  const { unitId, participating } = action.payload;

  try {
    const {
      status,
      data,
    }: AxiosResponse<GetCheckParticipatingPromotions> = yield call(
      api.get,
      `/promotion/v1/units/${unitId}/promotions?participating=${participating}`
    );

    if (status === Response.HTTP_OK) {
      yield all([
        put(PromotionCreators.checkParticipatingPromotionsSuccess(data)),
        put(PromotionCreators.handleToggleOptinEnterPromotion()),
      ]);
    }
  } catch (error) {
    yield all([
      put(PromotionCreators.checkParticipatingPromotionsFailed()),
      put(PromotionCreators.resetParticipatingPromotions()),
    ]);
  }
}

export function* setUnitParticipatingInThePromotion(
  action: ReturnType<
    typeof PromotionCreators.setUnitParticipatingInThePromotionRequest
  >
) {
  const { unitId, promotionId, participating } = action.payload;

  try {
    const {
      status,
    }: AxiosResponse<SetUnitParticipatingInThePromotionResponse> = yield call(
      api.put,
      `/promotion/v1/units/${unitId}/promotions/${promotionId}/to-participate`,
      { participating }
    );

    if (status === Response.HTTP_OK) {
      yield put(PromotionCreators.setUnitParticipatingInThePromotionSuccess());
      yield put(PromotionCreators.handleToggleOptinEnterPromotion());
      yield put(
        PromotionCreators.checkParticipatingPromotionsRequest({
          unitId,
          participating: 'pending',
        })
      );
    }
  } catch (error) {
    yield put(PromotionCreators.setUnitParticipatingInThePromotionFailed());
  }
}

export function* deletePromotion(
  action: ReturnType<typeof PromotionCreators.deletePromotionRequest>
) {
  const {
    payload: { promotionId },
  } = action;

  try {
    const { status }: AxiosResponse = yield call(
      api.delete,
      `/promotion/v1/promotions/${promotionId}`
    );

    if (status === Response.NO_CONTENT) {
      yield put(PromotionCreators.deletePromotionSuccess());
      notification.success('Promoção deletada com sucesso!', '');
      yield put(PromotionCreators.getPromotionsRequest());
    }
  } catch (error) {
    yield put(PromotionCreators.deletePromotionFailed());
  }
}

export function* importUnitsDataFromCsv(
  action: ReturnType<typeof PromotionCreators.importUnitsDataFromCsvRequest>
) {
  const { payload } = action;
  try {
    const formData = new FormData();
    formData.append('csv', payload);

    const { status, data }: AxiosResponse<GetUnitsDataFromCsv> = yield call(
      api.post,
      '/promotion/v1/promotions/units/csv-import',
      formData
    );

    if (status === Response.HTTP_OK) {
      yield put(PromotionCreators.importUnitsDataFromCsvSuccess(data.data));
    }
  } catch (error) {
    yield put(PromotionCreators.importUnitsDataFromCsvFailed());
  }
}

export function* getCustomers(
  action: ReturnType<typeof PromotionCreators.getCustomersRequest>
) {
  try {
    const { page, params } = action.payload;

    const {
      status,
      data,
    }: AxiosResponse<GetCustomersResponse> = yield call(
      api.get,
      `/promotion/v1/promotions/units?pagination=${page}&per_page=${UNITS_PER_PAGE}`,
      { params }
    );

    if (status === Response.HTTP_OK) {
      yield put(PromotionCreators.getCustomersSuccess(data));
    }
  } catch (error) {
    yield put(PromotionCreators.getCustomersFailed());
  }
}

export function* getCustomersCsv() {
  api.defaults.responseType = 'blob';
  try {
    const { status, data }: AxiosResponse<Blob> = yield call(
      api.get,
      '/promotion/v1/promotions/units/csv-export'
    );

    if (status === Response.HTTP_OK) {
      yield put(PromotionCreators.getCustomersCsvSuccess(data));
    }
  } catch (error) {
    yield put(PromotionCreators.getCustomersCsvFailed());
  } finally {
    api.defaults.responseType = undefined;
  }
}

const promotionsSagas = all([
  takeLatest(PromotionTypes.GET_PROMOTIONS_REQUEST, getPromotions),
  takeLatest(PromotionTypes.CREATE_PROMOTION_REQUEST, createPromotion),
  takeLatest(PromotionTypes.EDIT_PROMOTION_REQUEST, editPromotion),
  takeLatest(
    PromotionTypes.INCLUDE_UNITS_IN_THE_PROMOTION_REQUEST,
    includeUnitsInThePromotion
  ),
  takeLatest(PromotionTypes.DELETE_PROMOTION_REQUEST, deletePromotion),
  takeLatest(
    PromotionTypes.GET_CSV_MODEL_FOR_ADD_UNITS_REQUEST,
    getCsvModelForAddUnits
  ),
  takeLatest(
    PromotionTypes.IMPORT_UNITS_DATA_FROM_CSV_REQUEST,
    importUnitsDataFromCsv
  ),
  takeLatest(PromotionTypes.GET_CUSTOMERS_REQUEST, getCustomers),
  takeLatest(PromotionTypes.GET_CUSTOMERS_CSV_REQUEST, getCustomersCsv),
  takeEvery(PromotionTypes.GET_PROMOTION_DETAILS_REQUEST, getPromotionDetails),
  takeLatest(
    PromotionTypes.CHECK_PARTICIPATING_PROMOTIONS_REQUEST,
    checkParticipatingPromotions
  ),
  takeLatest(
    PromotionTypes.SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_REQUEST,
    setUnitParticipatingInThePromotion
  ),
]);

export default promotionsSagas;
