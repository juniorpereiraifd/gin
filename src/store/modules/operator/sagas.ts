import * as Response from 'src/utils/response';
import { all, put, select, takeLatest, call } from 'redux-saga/effects';
import { Types as OperatorTypes, Creators as OperatorCreators } from './actions';
import { OperatorItemProps } from './reducer';
import api from 'src/services/api';
import { notification } from 'src/utils/helpers';
import type { AxiosError } from 'axios';

export function* getOperators(action: ReturnType<typeof OperatorCreators.getOperatorsRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);
    const { page, perPage } = action.payload;

    const { status, data: response } = yield call(
      api.get,
      `auth/v1/units/${unity.id}/agents?page=${page}${perPage ? `&per_page=${perPage}` : ''}`,
    );

    if (status === Response.HTTP_OK) {
      yield put(OperatorCreators.getOperatorsSuccess({ operators: response.data, pagination: response.pagination }));
    }
  } catch (error) {
    yield put(OperatorCreators.getOperatorsFailed());
  }
}

export function* getOperator(action: ReturnType<typeof OperatorCreators.getOperatorRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);
    const { payload, options } = action;

    const { status, data: response } = yield call(api.get, `auth/v1/units/${unity.id}/agents/${payload.operatorId}`);

    if (status === Response.HTTP_OK) {
      yield put(OperatorCreators.getOperatorSuccess({ operator: response.data }));

      if (options?.editable) {
        yield put(OperatorCreators.setOperatorEditable({ operator: response.data as OperatorItemProps }));
      }
    }
  } catch (error) {
    yield put(OperatorCreators.getOperatorFailed());
  }
}

export function* createOperator(action: ReturnType<typeof OperatorCreators.createOperatorRequest>) {
  try {
    const { operator } = action.payload;
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(api.post, `auth/v1/units/${unity.id}/agents`, operator);

    if (status === Response.HTTP_CREATED) {
      notification.success('Operador cadastrado com sucesso!', '');
      yield put(OperatorCreators.createOperatorSuccess({ operator: response.data }));
    }
  } catch (error) {
    yield put(OperatorCreators.createOperatorFailed());
  }
}

export function* deleteOperator(action: ReturnType<typeof OperatorCreators.deleteOperatorRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);

    notification.warning('Processando solicitação para exclusão do operador', '');

    const { status } = yield call(api.delete, `auth/v1/units/${unity.id}/agents/${action.payload.operatorId}`);

    if (status === Response.NO_CONTENT) {
      notification.success('Operador excluído com sucesso', '');
      yield put(OperatorCreators.deleteOperatorSuccess({ operatorId: action.payload.operatorId }));
    }
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    notification.error(
      'Erro ao tentar excluir operador.',
      error.response?.data?.message || 'Houve um erro ao tentar excluir o operador, tente novamente mais tarde.',
    );
    yield put(OperatorCreators.deleteOperatorFailed());
  }
}

export function* disconnectOperator(action: ReturnType<typeof OperatorCreators.disconnectOperatorRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);

    notification.warning('Processando solicitação para encerrar sessão do operador', '');

    const { status } = yield call(
      api.delete,
      `auth/v1/units/${unity.id}/agents/${action.payload.operatorId}/logout-sessions`,
    );

    if (status === Response.NO_CONTENT) {
      notification.success('Sessão do operador encerrada com sucesso', '');
      yield put(OperatorCreators.disconnectOperatorSuccess({ operatorId: action.payload.operatorId }));
    }
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    notification.error(
      'Erro na solicitação de encerramento de sessão.',
      error.response?.data?.message ||
        'Houve um erro ao tentar encerrar a sessão do operador, tente novamente mais tarde.',
    );
    yield put(OperatorCreators.disconnectOperatorFailed());
  }
}

export function* editOperator(action: ReturnType<typeof OperatorCreators.editOperatorRequest>) {
  try {
    const {
      operator: { id, ...restOperator },
    } = action.payload;
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(api.put, `auth/v1/units/${unity.id}/agents/${id}`, restOperator);

    if (status === Response.HTTP_OK) {
      notification.success('Operador atualizado com sucesso!', '');
      yield put(OperatorCreators.editOperatorSuccess({ operator: response.data }));
    }
  } catch (error) {
    yield put(OperatorCreators.createOperatorFailed());
  }
}

export default all([
  takeLatest(OperatorTypes.GET_OPERATORS_REQUEST, getOperators),
  takeLatest(OperatorTypes.GET_OPERATOR_REQUEST, getOperator),
  takeLatest(OperatorTypes.CREATE_OPERATOR_REQUEST, createOperator),
  takeLatest(OperatorTypes.EDIT_OPERATOR_REQUEST, editOperator),
  takeLatest(OperatorTypes.DELETE_OPERATOR_REQUEST, deleteOperator),
  takeLatest(OperatorTypes.DISCONNECT_OPERATOR_REQUEST, disconnectOperator),
]);
