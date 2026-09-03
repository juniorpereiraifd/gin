import { all, put, takeLatest, delay, select, call } from 'redux-saga/effects';
import * as Response from 'src/utils/response';
import { RootType } from 'src/store/modules/rootReducer';
import api from 'src/services/api';

import { Types as OptionalTypes, Creators as OptionalCreators } from './action';

type CreateOptionalActionProps = {
  type: OptionalTypes.CREATE_OPTIONAL_REQUEST;
  payload: {
    id: number;
    title: string;
    type: string;
  };
};

type EditOptionalActionProps = {
  type: OptionalTypes.EDIT_OPTIONAL_REQUEST;
  payload: {
    id: number;
    title: string;
    type: string;
  };
};

export function* getOptional(
  action: ReturnType<typeof OptionalCreators.loadEditInfo>
) {
  try {
    const { unity } = yield select((state: RootType) => state.hall);
    if (unity) {
      const { status, data: response } = yield call(
        api.get,
        `menu/v1/units/${unity?.id}/complements/${action.payload.id}`
      );
      if (status === Response.HTTP_OK) {
        yield put(OptionalCreators.getOptionalSuccess(response.data));
      }
    }
  } catch (error) {
    yield put(OptionalCreators.getOptionalFailed());
  }
}

export function* getOptionals() {
  try {
    const { unity } = yield select((state: RootType) => state.hall);
    if (unity) {
      const { status, data: response } = yield call(
        api.get,
        `menu/v1/units/${unity?.id}/complements?pagination=0`
      );
      if (status === Response.HTTP_OK) {
        yield put(OptionalCreators.getOptionalsSuccess(response.data));
      }
    }
  } catch (error) {
    yield put(OptionalCreators.getOptionalsFailed());
  }
}

export function* createOptional(action: CreateOptionalActionProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.post,
      `/menu/v1/units/${unity?.id}/complements`,
      action.payload
    );

    if (status === Response.HTTP_CREATED) {
      yield put(OptionalCreators.createOptionalSuccess(response.data));
    }
  } catch (error) {
    yield put(OptionalCreators.createOptionalFailed());
  }
}

export function* reorderOptional() {
  yield delay(100);
}

export function* deleteOptional(
  action: ReturnType<typeof OptionalCreators.deleteOptionalRequest>
) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status } = yield call(
      api.delete,
      `/menu/v1/units/${unity?.id}/complements/${action.payload.id}`
    );

    if (status === Response.NO_CONTENT) {
      yield put(OptionalCreators.deleteOptionalSuccess(action.payload.id));
    }
  } catch (error) {
    yield put(OptionalCreators.deleteOptionalFailed());
  }
}

export function* editOptional(action: EditOptionalActionProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.put,
      `/menu/v1/units/${unity?.id}/complements/${action.payload.id}`,
      action.payload
    );

    if (status === Response.HTTP_OK) {
      yield put(OptionalCreators.editOptionalSuccess(response.data));
    }
  } catch (error) {
    yield put(OptionalCreators.editOptionalFailed());
  }
}

export default all([
  takeLatest(OptionalTypes.LOAD_EDIT_INFO, getOptional),
  takeLatest(OptionalTypes.GET_OPTIONALS_REQUEST, getOptionals),
  takeLatest(OptionalTypes.CREATE_OPTIONAL_REQUEST, createOptional),
  takeLatest(OptionalTypes.EDIT_OPTIONAL_REQUEST, editOptional),
  takeLatest(OptionalTypes.DELETE_OPTIONAL_REQUEST, deleteOptional),
  takeLatest(OptionalTypes.REORDER_OPTIONAL_REQUEST, reorderOptional),
]);
