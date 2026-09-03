import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  Types as ComunicationTypes,
  Creators as ComunicationCreators,
} from './actions';
import api from 'src/services/api';
import * as Response from 'src/utils/response';
import { AxiosError } from 'axios';
import { message } from 'antd';
import { notification } from 'src/utils/helpers';

export function* getSmsMessage(
  action: ReturnType<typeof ComunicationCreators.getSmsMessageDataRequest>
) {
  try {
    const { service, unitId } = action.payload;

    const { data: response, status } = yield call(
      api.get,
      `/message/v1/units/${unitId}/sms/messages?service=${service}`
    );

    if (status === Response.HTTP_OK) {
      const newData = [];

      for (const key in response.data) {
        newData.push(response.data[key]);
      }

      yield put(
        ComunicationCreators.getSmsMessageDataSuccess({
          data: newData,
          service,
        })
      );
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    message.error(err.response?.data?.message || 'Erro ao buscar as mensagens');

    yield put(ComunicationCreators.getSmsMessageDataFailed());
  }
}

export function* getSettingsMessage(
  action: ReturnType<typeof ComunicationCreators.getSettingsMessageRequest>
) {
  try {
    const { unitId } = action.payload;
    const { data: response, status } = yield call(
      api.get,
      `/message/v1/units/${unitId}/settings`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        ComunicationCreators.getSettingsMessageSuccess(
          response.data.length ? response.data[0] : null
        )
      );
    }
  } catch (error) {
    yield put(ComunicationCreators.getSettingsMessageFailed());
  }
}

export function* editSmsMessage(
  action: ReturnType<typeof ComunicationCreators.editSettingsMessageRequest>
) {
  try {
    const { unitId, customSmsData, settingId } = action.payload;
    const body = { custom_sms: customSmsData };

    const { data: response, status } = yield call(
      api.put,
      `/message/v1/units/${unitId}/settings/${settingId}`,
      body
    );

    if (status === Response.HTTP_OK) {
      yield put(ComunicationCreators.editSettingsMessageSuccess(response.data));
      notification.success('Mensagem customizada com sucesso', '');
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    message.error(
      err.response?.data?.message ||
        'Erro ao editar as configurações de mensagem'
    );

    yield put(ComunicationCreators.editSettingsMessageFailed());
  }
}

export function* updateMessageSending(
  action: ReturnType<typeof ComunicationCreators.updateMessageSendingRequest>
) {
  try {
    const { unitId, channel, service, value } = action.payload;

    const { status } = yield call(
      api.put,
      `/message/v1/units/${unitId}/settings/${channel}/${service}`,
      { active: value }
    );

    if (status === Response.NO_CONTENT) {
      yield put(ComunicationCreators.updateMessageSendingSuccess());

      notification.success(
        'Sucesso!',
        'Suas configurações de comunicação foram atualizadas com sucesso.'
      );
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    notification.error(
      err.response?.data?.message ||
        'Desculpe, mas ocorreu algum erro ao editar as configurações de comunicação. Por favor, tente novamente.',
      ''
    );

    yield put(ComunicationCreators.updateMessageSendingFailed());
  }
}

export default all([
  takeLatest(ComunicationTypes.GET_SMS_MESSAGE_DATA_REQUEST, getSmsMessage),
  takeLatest(
    ComunicationTypes.GET_SETTINGS_MESSAGE_REQUEST,
    getSettingsMessage
  ),
  takeLatest(ComunicationTypes.EDIT_SETTINGS_MESSAGE_REQUEST, editSmsMessage),
  takeLatest(
    ComunicationTypes.UPDATE_MESSAGE_SENDING_REQUEST,
    updateMessageSending
  ),
]);
