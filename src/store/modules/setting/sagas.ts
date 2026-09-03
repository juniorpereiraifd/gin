import * as Response from 'src/utils/response';
import { all, put, select, takeLatest, call } from 'redux-saga/effects';
import { Types as SettingTypes, Creators as SettingCreators } from './actions';
import { Creators as ReservationCreators } from '../reservation/actions';
import { notification } from 'src/utils/helpers';
import api from 'src/services/api';

type SetShowLineProps = {
  type: SettingTypes.SHOW_IN_LINE_REQUEST;
  payload: { show_in_line: boolean };
};

export function* getSetting() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(api.get, `reservation/v1/units/${unity.id}/settings`);

    if (status === Response.HTTP_OK && response.data[0]) {
      yield put(SettingCreators.getSettingSuccess(response.data[0]));
    }
  } catch (error) {
    yield put(SettingCreators.getSettingFailed());
  }
}

export function* getGoogleReserveIntegrationStatus() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `reservation/v1/units/${unity.id}/google-reserve/merchant/status`,
    );

    if (status === Response.HTTP_OK) {
      yield put(SettingCreators.getGoogleReserveStatusSuccess(response.data));
    }
  } catch (error) {
    yield put(SettingCreators.getGoogleReserveStatusFailed());
  }
}

export function* getMenuSetting() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(api.get, `menu/v1/units/${unity.id}/settings`);

    if (status === Response.HTTP_OK && response.data[0]) {
      yield put(SettingCreators.getMenuSettingSuccess(response.data[0]));
    }
  } catch (error) {
    yield put(SettingCreators.getMenuSettingFailed());
  }
}

export function* setShowInReservation(action: ReturnType<typeof SettingCreators.showInReservationRequest>) {
  const {
    payload: { show_in_reservation },
  } = action;

  const enablePreviewMessage = `${
    show_in_reservation ? 'Habilitando' : 'Desabilitando'
  } a visualização de cardápio no widget`;

  notification.warning(
    enablePreviewMessage,
    'Estamos processando a sua solicitação para alterar a visualização do botão do cardápio no widget',
  );

  try {
    const {
      hall: { unity },
      setting: { menu },
    } = yield select((state) => state);

    const { status, data: response } = yield call(
      api.put,
      `menu/v1/units/${unity.id}/settings/${menu.id}`,
      action.payload,
    );

    if (status === Response.HTTP_OK) {
      notification.success(
        'Solicitação concluída com sucesso!',
        'A alteração da visualização do botão do cardápio no widget foi concluída.',
      );

      yield put(SettingCreators.showInReservationSuccess(response.data.show_in_reservation));
    }
  } catch (error) {
    yield put(SettingCreators.showInReservationFailed());
  }
}

export function* setShowInLine(action: SetShowLineProps) {
  const {
    payload: { show_in_line },
  } = action;

  const enablePreviewMessage = `${
    show_in_line ? 'Habilitando' : 'Desabilitando'
  } a visualização de cardápio no widget de fila`;

  notification.warning(
    enablePreviewMessage,
    'Estamos processando a sua solicitação para alterar a visualização do botão do cardápio no widget',
  );

  try {
    const {
      hall: { unity },
      setting: { menu },
    } = yield select((state) => state);

    const { status, data: response } = yield call(
      api.put,
      `menu/v1/units/${unity.id}/settings/${menu.id}`,
      action.payload,
    );

    if (status === Response.HTTP_OK) {
      notification.success(
        'Solicitação concluída com sucesso!',
        'A alteração da visualização do botão do cardápio no widget foi concluída.',
      );

      yield put(SettingCreators.showInLineSuccess(response.data.show_in_line));
    }
  } catch (error) {
    yield put(SettingCreators.showInLineFailed());
  }
}

export function* saveSetting(action: ReturnType<typeof SettingCreators.saveSettingRequest>) {
  notification.warning(
    'Salvando as configurações de reserva',
    'Estamos processando a sua solicitação para alterar as configurações de reserva desta unidade',
  );
  try {
    const {
      hall: { unity },
      setting: { reservation },
      reservation: { settings },
    } = yield select((state) => state);

    const { status, data: response } = yield call(
      api.put,
      `reservation/v1/units/${unity.id}/settings/${reservation.id}`,
      action.payload,
    );

    if (status === Response.HTTP_OK || status === Response.HTTP_CREATED) {
      notification.success(
        'Configurações salvas com sucesso!',
        'A alteração das configurações de reserva desta unidade foram atualizadas.',
      );

      yield put(SettingCreators.saveSettingSuccess(response.data));
      yield put(
        ReservationCreators.updateReservationSettingsSuccess({
          ...settings,
          ...response.data,
        }),
      );
    }
  } catch (error) {
    yield put(SettingCreators.saveSettingFailed());
  }
}

export function* saveMenuSetting(action: ReturnType<typeof SettingCreators.saveMenuSettingRequest>) {
  notification.warning(
    'Salvando as configurações de cardápio',
    'Estamos processando a sua solicitação para alterar as configurações de cardápio desta unidade',
  );
  try {
    const {
      hall: { unity },
      setting: { menu },
    } = yield select((state) => state);

    const { status, data: response } = yield call(
      api.put,
      `menu/v1/units/${unity.id}/settings/${menu.id}`,
      action.payload,
    );

    if (status === Response.HTTP_OK) {
      notification.success(
        'Configurações salvas com sucesso!',
        'A alteração das configurações de cardápio desta unidade foram atualizadas.',
      );

      yield put(SettingCreators.saveMenuSettingSuccess(response.data));
    }
  } catch (error) {
    yield put(SettingCreators.saveMenuSettingFailed());
  }
}

export default all([
  takeLatest(SettingTypes.GET_SETTING_REQUEST, getSetting),
  takeLatest(SettingTypes.GET_GOOGLE_RESERVE_STATUS_REQUEST, getGoogleReserveIntegrationStatus),
  takeLatest(SettingTypes.GET_MENU_SETTING_REQUEST, getMenuSetting),
  takeLatest(SettingTypes.SHOW_IN_RESERVATION_REQUEST, setShowInReservation),
  takeLatest(SettingTypes.SHOW_IN_LINE_REQUEST, setShowInLine),
  takeLatest(SettingTypes.SAVE_SETTING_REQUEST, saveSetting),
  takeLatest(SettingTypes.SAVE_MENU_SETTING_REQUEST, saveMenuSetting),
]);
