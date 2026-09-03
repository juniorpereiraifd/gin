import * as Response from 'src/utils/response';
import { all, put, select, takeLatest, call } from 'redux-saga/effects';
import {
  Types as RestrictionTypes,
  Creators as RestrictionCreators,
} from './actions';
import { notification } from 'src/utils/helpers';
import { WEEKDAYS } from 'src/utils/constants';

import api from 'src/services/api';

type GetRestrictionsActionProps = {
  type: RestrictionTypes.GET_RESTRICTIONS_REQUEST;
  payload: string;
};

type CreateRestrictionActionProps = {
  type: RestrictionTypes.CREATE_RESTRICTION_REQUEST;
  payload: {
    menu: string;
    weekday: Array<number>;
    starts_at: string;
    ends_at: string;
  };
};

export function* getRestrictions(action: GetRestrictionsActionProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `menu/v1/units/${unity.id}/menus/${action.payload}/restrictions?pagination=0`
    );

    if (status === Response.HTTP_OK) {
      yield put(RestrictionCreators.getRestrictionsSuccess(response.data));
    }
  } catch (error) {
    yield put(RestrictionCreators.getRestrictionsFailed());
  }
}

export function* createRestriction(action: CreateRestrictionActionProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.post,
      `menu/v1/units/${unity.id}/menus/${action.payload.menu}/restrictions`,
      action.payload
    );

    if (status === Response.HTTP_OK) {
      yield put(RestrictionCreators.createRestrictionSuccess(response.data));
    }
  } catch (error) {
    yield put(RestrictionCreators.createRestrictionFailed());
  }
}

export function* deleteRestriction(
  action: ReturnType<typeof RestrictionCreators.deleteRestrictionRequest>
) {
  notification.warning(
    `Deletando horário de "${
      WEEKDAYS[action.payload.weekday]
    } (${action.payload.starts_at.slice(
      0,
      -3
    )} - ${action.payload.ends_at.slice(0, -3)})"`,
    'Estamos processando sua solicitação para deletar o horário.'
  );
  try {
    const { unity } = yield select((state) => state.hall);

    const { status } = yield call(
      api.delete,
      `menu/v1/units/${unity.id}/menus/${action.payload.menu}/restrictions/${action.payload.id}`
    );

    if (status === Response.NO_CONTENT) {
      notification.success(
        'Horário deletado com sucesso!',
        `O horário de"${
          WEEKDAYS[action.payload.weekday]
        } (${action.payload.starts_at.slice(
          0,
          -3
        )} - ${action.payload.ends_at.slice(0, -3)})" foi deletado com sucesso`
      );
      yield put(RestrictionCreators.deleteRestrictionSuccess(action.payload));
    }
  } catch (error) {
    yield put(RestrictionCreators.deleteRestrictionFailed());
  }
}

export default all([
  takeLatest(RestrictionTypes.GET_RESTRICTIONS_REQUEST, getRestrictions),
  takeLatest(RestrictionTypes.CREATE_RESTRICTION_REQUEST, createRestriction),
  takeLatest(RestrictionTypes.DELETE_RESTRICTION_REQUEST, deleteRestriction),
]);
