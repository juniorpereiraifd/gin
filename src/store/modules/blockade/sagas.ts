import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import {
  Types as BlockadeTypes,
  Creators as BlockadeCreators,
} from './actions';
import { AxiosError } from 'axios';
import api from 'src/services/api';
import * as Response from 'src/utils/response';
import { RootType } from 'src/store/modules/rootReducer';
import { notification, formatErrors } from 'src/utils/helpers';
import { BlockadeItemProps } from './reducer';
import dayjs from 'dayjs';

type GetBlockadesProps = {
  type: BlockadeTypes.GET_BLOCKADES_REQUEST;
  payload: {
    unity_id: string;
    page: number;
    start_at: string;
    end_at: string;
  };
};

type CreateBlockadeProps = {
  type: BlockadeTypes.CREATE_BLOCKADE_REQUEST;
  payload: BlockadeItemProps;
};

type EditBlockadeProps = {
  type: BlockadeTypes.EDIT_BLOCKADE_REQUEST;
  payload: BlockadeItemProps;
};

type DeleteBlockadeProps = {
  type: BlockadeTypes.DELETE_BLOCKADE_REQUEST;
  payload: string;
};

export function* getBlockades(action: GetBlockadesProps) {
  const { payload } = action;
  let filter = '';
  try {
    if (payload.start_at && payload.end_at) {
      filter = `&date_start=${dayjs(payload.start_at, 'DD/MM/YYYY').format(
        'YYYY-MM-DD'
      )}&date_end=${dayjs(payload.end_at, 'DD/MM/YYYY').format('YYYY-MM-DD')}`;
    }
    const { status, data: response } = yield call(
      api.get,
      `reservation/v1/units/${payload.unity_id}/blocks?page=${payload.page}&per_page=6${filter}`
    );

    if (status === Response.HTTP_OK) {
      yield put(BlockadeCreators.getBlockadesSuccess(response));
    }
  } catch (error) {
    yield put(BlockadeCreators.getBlockadesFailed());
  }
}

export function* createBlockade(action: CreateBlockadeProps) {
  const { payload } = action;

  try {
    const { unity } = yield select((state: RootType) => state.hall);

    const { status, data: response } = yield call(
      api.post,
      `reservation/v1/units/${unity.id}/blocks`,
      payload
    );

    if (status === Response.HTTP_CREATED || status === Response.HTTP_OK) {
      notification.success(
        'O Bloqueio foi criado com sucesso!',
        `Solicitação para criar o bloqueio ${payload.title} foi concluída.`
      );
      yield put(BlockadeCreators.createBlockadeSuccess(response.data));
    }
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 400) {
      const errors = formatErrors(error.response?.data.errors);

      yield put(BlockadeCreators.createBlockadeFailed(errors));
    }
    yield put(BlockadeCreators.createBlockadeFailed([]));
  }
}

export function* editBlockade(action: EditBlockadeProps) {
  const { payload } = action;

  try {
    const { unity } = yield select((state: RootType) => state.hall);

    const { status, data: response } = yield call(
      api.put,
      `reservation/v1/units/${unity.id}/blocks/${payload.id}`,
      payload
    );

    if (status === Response.HTTP_OK) {
      notification.success(
        'O Bloqueio foi alterado com sucesso!',
        `Solicitação para alterar o bloqueio ${payload.title} foi concluída, o bloqueio foi alterado.`
      );
      yield put(BlockadeCreators.editBlockadeSuccess(response.data));
    }
  } catch (error) {
    yield put(BlockadeCreators.editBlockadeFailed());
  }
}

export function* deleteBlockade(action: DeleteBlockadeProps) {
  const { payload } = action;
  notification.warning(
    'Excluíndo bloqueio!',
    'Solicitação para excluír o bloqueio está em processamento.'
  );
  try {
    const { unity } = yield select((state: RootType) => state.hall);

    const { status } = yield call(
      api.delete,
      `reservation/v1/units/${unity.id}/blocks/${payload}`
    );

    if (status === Response.NO_CONTENT) {
      notification.success(
        'O Bloqueio foi excluído com sucesso!',
        'Solicitação para excluír o bloqueio foi concluída.'
      );
      yield put(BlockadeCreators.deleteBlockadeSuccess(payload));
    }
  } catch (error) {
    yield put(BlockadeCreators.deleteBlockadeFailed());
  }
}

export default all([
  takeLatest(BlockadeTypes.GET_BLOCKADES_REQUEST, getBlockades),
  takeLatest(BlockadeTypes.CREATE_BLOCKADE_REQUEST, createBlockade),
  takeLatest(BlockadeTypes.EDIT_BLOCKADE_REQUEST, editBlockade),
  takeLatest(BlockadeTypes.DELETE_BLOCKADE_REQUEST, deleteBlockade),
]);
