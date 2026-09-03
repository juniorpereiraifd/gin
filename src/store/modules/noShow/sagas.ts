import * as Response from 'src/utils/response';
import { all, put, select, takeLatest, call } from 'redux-saga/effects';
import { Types as NoShowTypes, Creators as NoShowCreators } from './actions';
import { NoShowItemProps } from './reducer';
import api from 'src/services/api';

export type CreateNoShowActionProps = {
  type: NoShowTypes.GET_NO_SHOW_REQUEST;
  payload: NoShowItemProps;
};

export function* getNoShows(
  action: ReturnType<typeof NoShowCreators.getNoShowRequest>
) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `/reservation/v1/units/${unity.id}/no-show-charging?page=${
        action.payload.page
      }&query=${
        action.payload.search ? action.payload.search : ''
      }&statuses=charged,pre-authorized&date_start=${
        action.payload.date_start ? action.payload.date_start : ''
      }&date_end=${action.payload.date_end ? action.payload.date_end : ''}`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        NoShowCreators.setPagination({
          is_last_page: response.pagination.is_last_page,
          current_page: response.pagination.current_page,
          total: response.pagination.total,
        })
      );
      yield put(NoShowCreators.getNoShowSuccess(response.data));
    }
  } catch (error) {
    yield put(NoShowCreators.getNoShowsFailed());
  }
}

export function* refundNoShows(
  action: ReturnType<typeof NoShowCreators.chargedNoShowRequest>
) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.post,
      `/reservation/v1/units/${unity.id}/no-show-charging/${action.payload.id}/refund`
    );

    if (status === Response.HTTP_OK) {
      yield put(NoShowCreators.chargedNoShowSuccess(response.data));
    }
  } catch (error) {
    yield put(NoShowCreators.chargedNoShowFailed({ id: action.payload.id }));
  }
}

export default all([
  takeLatest(NoShowTypes.GET_NO_SHOW_REQUEST, getNoShows),
  takeLatest(NoShowTypes.CHARGED_NO_SHOW_REQUEST, refundNoShows),
]);
