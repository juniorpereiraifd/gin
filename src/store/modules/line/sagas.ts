import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { Types as LineType, Creators as LineCreators } from './actions';
import api from 'src/services/api';
import { RootType } from 'src/store/modules/rootReducer';
import * as Response from 'src/utils/response';
import { notification } from 'src/utils/helpers';

export function* getLineSettings() {
  try {
    const { unity } = yield select((state: RootType) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `line/v1/units/${unity.id}/settings`
    );

    if (status === Response.HTTP_OK) {
      yield put(LineCreators.getLineSettingsSuccess(response.data[0]));
    }
  } catch (error) {
    yield put(LineCreators.getLineSettingsFailed());
  }
}

export function* updateLineSettings(
  action: ReturnType<typeof LineCreators.updateLineSettingsRequest>
) {
  try {
    const {
      hall: { unity },
      line: { settings },
    }: RootType = yield select((state) => state);

    const { status, data: response } = yield call(
      api.put,
      `line/v1/units/${unity?.id}/settings/${settings?.id}`,
      action.payload
    );

    if (status === Response.HTTP_OK) {
      notification.success(
        'Configurações de fila de espera atualizadas com sucesso!',
        ''
      );
      yield put(LineCreators.updateLineSettingsSuccess(response.data));
    }
  } catch (error) {
    yield put(LineCreators.updateLineSettingsFailed());
  }
}

export default all([
  takeLatest(LineType.GET_LINE_SETTINGS_REQUEST, getLineSettings),
  takeLatest(LineType.UPDATE_LINE_SETTINGS_REQUEST, updateLineSettings),
]);
