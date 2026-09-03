import * as Response from 'src/utils/response';
import { all, put, select, takeLatest, call } from 'redux-saga/effects';
import { Types as ShiftTypes, Creators as ShiftCreators } from './actions';
import api from 'src/services/api';
import { notification } from 'src/utils/helpers';

export function* getShifts() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `reservation/v1/units/${unity.id}/periods?pagination=false`
    );

    if (status === Response.HTTP_OK) {
      yield put(ShiftCreators.getShiftsSuccess(response.data));
    }
  } catch (error) {
    yield put(ShiftCreators.getShiftsFailed());
  }
}

export function* createShift(
  action: ReturnType<typeof ShiftCreators.createShiftRequest>
) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.post,
      `reservation/v1/units/${unity.id}/periods`,
      action.payload
    );

    if (status === Response.HTTP_CREATED) {
      yield put(ShiftCreators.createShiftSuccess(response.data));
    }
  } catch (error) {
    yield put(ShiftCreators.createShiftFailed());
  }
}

export function* editShift(
  action: ReturnType<typeof ShiftCreators.editShiftRequest>
) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.put,
      `reservation/v1/units/${unity.id}/periods/${action.payload.id}`,
      action.payload
    );

    if (status === Response.HTTP_OK) {
      yield put(ShiftCreators.editShiftSuccess(response.data));
    }
  } catch (error) {
    yield put(ShiftCreators.editShiftFailed());
  }
}

export function* deleteShift(
  action: ReturnType<typeof ShiftCreators.deleteShiftRequest>
) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status } = yield call(
      api.delete,
      `reservation/v1/units/${unity.id}/periods/${action.payload.id}`
    );

    if (status === 204) {
      notification.success(
        'O Turno foi deletado com sucesso!',
        `O turno "${action.payload.name}" foi deletado com sucesso!`
      );
      yield put(ShiftCreators.deleteShiftSuccess(action.payload.id));
    }
  } catch (error) {
    yield put(ShiftCreators.createShiftFailed());
  }
}

export default all([
  takeLatest(ShiftTypes.GET_SHIFTS_REQUEST, getShifts),
  takeLatest(ShiftTypes.CREATE_SHIFT_REQUEST, createShift),
  takeLatest(ShiftTypes.EDIT_SHIFT_REQUEST, editShift),
  takeLatest(ShiftTypes.DELETE_SHIFT_REQUEST, deleteShift),
]);
