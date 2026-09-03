import * as Response from 'src/utils/response';
import { all, put, takeLatest, call, select, getContext } from 'redux-saga/effects';
import { Types as HallTypes, Creators as HallCreators } from './actions';
import { RootType } from 'src/store/modules/rootReducer';
import { AxiosError } from 'axios';
import { notification } from 'src/utils/helpers';

import api from 'src/services/api';
import type { TableMap } from './reducer';

type GetUnityActionProps = {
  type: HallTypes.GET_UNITY_REQUEST;
  payload: {
    id: string;
    forceUpdate?: boolean;
  };
};

export function* getUnity(action: GetUnityActionProps) {
  const { id, forceUpdate } = action.payload;
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    if ((unity?.id || '').toString() === id && !forceUpdate) {
      yield put(HallCreators.getUnitySuccess(unity));
    } else {
      const { status, data } = yield call(api.get, `restaurant/v1/units/${id}`);
      if (status === Response.HTTP_OK) {
        yield put(HallCreators.getUnitySuccess(data.data));
      } else {
        yield put(HallCreators.getUnityFailed());
      }
    }
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === Response.NOT_FOUND) {
      window.location.href = '/units';
    }
    yield put(HallCreators.getUnityFailed());
  }
}

export function* getHalls(action: ReturnType<typeof HallCreators.getHallsRequest>) {
  try {
    const { unity } = yield select((state: RootType) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `reservation/v1/units/${unity.id}/sectors?page=${action.payload.page}&per_page=${
        action.payload.perPage || '6'
      }&sort_direction=DESC${!action.payload.active ? '&active=1' : ''}`
    );
    if (status === Response.HTTP_OK) {
      yield put(
        HallCreators.getHallsSuccess({
          data: response.data,
          pagination: response.pagination,
        })
      );
    }
  } catch (error) {
    yield put(HallCreators.getHallsFailed());
  }
}

export function* getHall(action: ReturnType<typeof HallCreators.getHall>) {
  const { payload } = action;
  try {
    const { unity } = yield select((state: RootType) => state.hall);

    if (unity) {
      const { status, data: response } = yield call(api.get, `reservation/v1/units/${unity.id}/sectors/${payload}`);
      if (status === Response.HTTP_OK) {
        yield put(HallCreators.getHallSuccess(response.data));
      }
    }
  } catch (error) {
    yield put(HallCreators.getHallsFailed());
    window.location.href = '/units';
  }
}

export function* createHall(action: ReturnType<typeof HallCreators.createHallRequest>) {
  const { navigate } = yield getContext('router');
  const { hall, onSuccessCallback } = action.payload;
  try {
    const { unity } = yield select((state: RootType) => state.hall);
    const { status, data: response } = yield call(api.post, `reservation/v1/units/${unity.id}/sectors`, hall);
    if (status === Response.HTTP_CREATED) {
      onSuccessCallback?.();
      yield put(HallCreators.createHallSuccess(response.data));
      yield navigate(`/units/${unity.id}/reservation/halls/${response.data.id}/edit`);
    }
  } catch (error) {
    yield put(HallCreators.createHallFailed());
  }
}

export function* deleteHall(action: ReturnType<typeof HallCreators.deleteHallRequest>) {
  const { navigate } = yield getContext('router');
  try {
    const { unity } = yield select((state: RootType) => state.hall);
    if (unity) {
      const { status } = yield call(api.delete, `reservation/v1/units/${unity.id}/sectors/${action.payload.id}`);
      if (status === Response.NO_CONTENT) {
        notification.success(
          'O salão foi deletado com sucesso!',
          `O salão "${action.payload.name}" foi deletado com sucesso, com isso todos os seus dados também foram apagados.`
        );
        yield all([put(HallCreators.deleteHallSuccess()), navigate(-1)]);
      }
    }
  } catch (error) {
    yield put(HallCreators.createHallFailed());
  }
}

export function* changeHallStatus(action: ReturnType<typeof HallCreators.changeStatusHallRequest>) {
  try {
    const { unity } = yield select((state: RootType) => state.hall);
    if (unity) {
      const { status, data: response } = yield call(
        api.put,
        `reservation/v1/units/${unity.id}/sectors/${action.payload.hall_id}`,
        {
          active: action.payload.active,
        }
      );
      if (status === Response.HTTP_OK) {
        notification.success('Sucesso ao alterar status do salão', `O status do salão foi alterado com sucesso.`);
        yield put(HallCreators.changeStatusHallSuccess(response));
      }
    }
  } catch (error) {
    yield put(HallCreators.changeStatusHallFailed());
  }
}

export function* changeHallFlexible(action: ReturnType<typeof HallCreators.changeFlexibleHallRequest>) {
  try {
    const { unity } = yield select((state: RootType) => state.hall);
    if (unity) {
      const { status, data: response } = yield call(
        api.put,
        `reservation/v1/units/${unity.id}/sectors/${action.payload.hall_id}`,
        {
          flexible: action.payload.flexible,
        }
      );
      if (status === Response.HTTP_OK) {
        notification.success(
          'Sucesso ao alterar a flexibilidade do salão',
          `A opção "Cadeira Vazia" foi ${action.payload.flexible ? 'ativada' : 'desativada'} com sucesso`
        );
        yield put(HallCreators.changeStatusFlexibleHallSuccess(response));
      }
    }
  } catch (error) {
    yield put(HallCreators.changeFlexibleHallFailed());
  }
}

export function* updateHall(action: ReturnType<typeof HallCreators.updateHallRequest>) {
  const { hall, onCallbackSuccess } = action.payload;
  try {
    const { unity } = yield select((state: RootType) => state.hall);
    const { status, data: response } = yield call(api.put, `reservation/v1/units/${unity.id}/sectors/${hall.id}`, hall);
    if (status === Response.HTTP_OK) {
      onCallbackSuccess?.();
      yield put(HallCreators.updateHallSuccess(response.data));
      yield put(
        HallCreators.getHallsRequest({
          page: 1,
          reset: true,
        })
      );
    }
  } catch (err) {
    const error = err as AxiosError;
    if (error?.response?.status === Response.NOT_FOUND) {
      notification.error(
        'Erro ao atualizar salão',
        `Houve um erro ao atualizar o salão "${hall.name}", tente novamente mais tarde.`
      );
    }
    yield put(HallCreators.createHallFailed());
  }
}

type SafeCreateTableMapReturn = {
  success: boolean;
  table: TableMap;
  status?: number;
  error?: string;
};

function* safeCreateTableMap(unityId: string, hallId: string, table: TableMap) {
  try {
    const { data, status } = yield call(api.post, `reservation/v1/units/${unityId}/sectors/${hallId}/table-map`, {
      number: table.number,
      min_people: table.min_people,
      max_people: table.max_people,
    });

    return { success: true, status, table: data.data };
  } catch (error) {
    return { success: false, error, table };
  }
}

export function* createTableMap() {
  try {
    const {
      hall: { unity, hall, selectedTableMap },
    }: RootType = yield select((state: RootType) => state);

    if (unity && hall && selectedTableMap && selectedTableMap.length > 0) {
      const requests = selectedTableMap
        .filter((item) => item.draft)
        .map((table) => call(safeCreateTableMap, unity.id, hall.id, table));

      const responses: Array<SafeCreateTableMapReturn> = yield all(requests);

      const succeeded = responses.filter((item) => item.success);
      const failed = responses.filter((item) => !item.success);

      if (succeeded.length > 0) {
        yield put(HallCreators.createTableMapSuccess({ tableCreated: succeeded.map((item) => item.table) }));

        notification.success(`${succeeded.length > 1 ? 'Mesas criadas' : 'Mesa criada'} com sucesso.`, '', {
          placement: 'topRight',
        });
      }

      if (failed.length > 0) {
        yield put(HallCreators.createTableMapFailed());
      }
    }
  } catch (err) {
    const error = err as AxiosError;

    notification.error(
      'Houve um erro ao criar as mesas.',
      error.response?.data?.message || 'Tivemos um problema ao tentar cadastrar as mesas, tente novamente mais tarde.',
      { placement: 'topRight' }
    );

    yield put(HallCreators.createTableMapFailed());
  }
}

export function* updateTable(action: ReturnType<typeof HallCreators.updateTableRequest>) {
  try {
    const { payload } = action;
    const {
      hall: { unity, hall },
    }: RootType = yield select((state: RootType) => state);

    if (unity && hall && payload.registeredTable) {
      const { status } = yield call(
        api.put,
        `reservation/v1/units/${unity.id}/sectors/${hall.id}/table-map/${payload.registeredTable.id}`,
        {
          number: payload.table.number,
          min_people: payload.table.min_people,
          max_people: payload.table.max_people,
        }
      );

      if (status === Response.HTTP_OK) {
        payload.onSuccessCallback?.();
        yield put(HallCreators.updateTableSuccess({ table: payload.table, selectedTable: payload.selectedTable }));
        notification.success('Mesa editada com sucesso', '', {
          placement: 'topRight',
        });
      }
    }
  } catch (err) {
    const error = err as AxiosError;

    notification.error(
      'Houve um erro ao editar a mesa.',
      error.response?.data?.message || 'Tivemos um problema ao tentar editar a mesa, tente novamente mais tarde.',
      {
        placement: 'topRight',
      }
    );

    yield put(HallCreators.updateTableFailed());
  }
}

export function* deleteTable(action: ReturnType<typeof HallCreators.deleteTableRequest>) {
  try {
    const { payload } = action;
    const {
      hall: { unity, hall },
    }: RootType = yield select((state: RootType) => state);

    if (unity && hall && payload.registeredTable) {
      const { status } = yield call(
        api.delete,
        `reservation/v1/units/${unity.id}/sectors/${hall.id}/table-map/${payload.registeredTable.id}`
      );

      if (status === Response.NO_CONTENT) {
        payload.onSuccessCallback?.();
        yield put(HallCreators.deleteTableSuccess({ table: payload.table }));
        notification.success('Mesa excluída com sucesso', '', {
          placement: 'topRight',
        });
      }
    }
  } catch (err) {
    const error = err as AxiosError;

    notification.error(
      'Houve um erro ao excluir a mesa.',
      error.response?.data?.message || 'Tivemos um problema ao tentar excluir a mesa, tente novamente mais tarde.',
      {
        placement: 'topRight',
      }
    );

    yield put(HallCreators.deleteTableFailed());
  }
}

type SafeDeleteTableMapReturn = {
  success: boolean;
  tableId: string;
  status?: number;
  error?: string;
};

function* safeDeleteTableMap(unityId: string, hallId: string, tableId?: string) {
  try {
    const { status } = yield call(api.delete, `reservation/v1/units/${unityId}/sectors/${hallId}/table-map/${tableId}`);

    return { success: true, status, tableId };
  } catch (error) {
    return { success: false, error, tableId };
  }
}

export function* deleteTableMap() {
  try {
    const {
      hall: { unity, hall },
    }: RootType = yield select((state: RootType) => state);

    if (unity && hall && hall.map.length > 0) {
      const requests = hall.map.map((table) => call(safeDeleteTableMap, unity.id, hall.id, table.id));

      const responses: Array<SafeDeleteTableMapReturn> = yield all(requests);

      const succeeded = responses.filter((item) => item.success);
      const failed = responses.filter((item) => !item.success);

      if (succeeded.length > 0) {
        yield put(HallCreators.deleteTableMapSuccess({ tables: succeeded.map((item) => item.tableId) }));

        notification.success(`${succeeded.length > 1 ? 'Mesas excluídas' : 'Mesa excluída'} com sucesso.`, '', {
          placement: 'topRight',
        });
      }

      if (failed.length > 0) {
        yield put(HallCreators.deleteTableMapFailed());
      }
    }
  } catch (err) {
    const error = err as AxiosError;

    notification.error(
      'Houve um erro ao excluir as mesas.',
      error.response?.data?.message || 'Tivemos um problema ao tentar excluir as mesas, tente novamente mais tarde.',
      { placement: 'topRight' }
    );

    yield put(HallCreators.deleteTableMapFailed());
  }
}

export default all([
  takeLatest(HallTypes.GET_UNITY_REQUEST, getUnity),
  takeLatest(HallTypes.GET_HALLS_REQUEST, getHalls),
  takeLatest(HallTypes.GET_HALL_REQUEST, getHall),
  takeLatest(HallTypes.CREATE_HALL_REQUEST, createHall),
  takeLatest(HallTypes.DELETE_HALL_REQUEST, deleteHall),
  takeLatest(HallTypes.CHANGE_STATUS_HALL_REQUEST, changeHallStatus),
  takeLatest(HallTypes.CHANGE_FLEXIBLE_HALL_REQUEST, changeHallFlexible),
  takeLatest(HallTypes.UPDATE_HALL_REQUEST, updateHall),
  takeLatest(HallTypes.CREATE_TABLE_MAP_REQUEST, createTableMap),
  takeLatest(HallTypes.UPDATE_TABLE_REQUEST, updateTable),
  takeLatest(HallTypes.DELETE_TABLE_REQUEST, deleteTable),
  takeLatest(HallTypes.DELETE_TABLE_MAP_REQUEST, deleteTableMap),
]);
