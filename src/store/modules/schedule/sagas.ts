import { all, call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import * as Response from 'src/utils/response';
import { notification } from 'src/utils/helpers';
import { Types as ScheduleTypes, Creators as ScheduleCreators } from './actions';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import api from 'src/services/api';
import type { RootType } from '../rootReducer';

type DayProps = {
  [key: number]: string;
};

const daysOfWeek: DayProps = {
  1: 'Segundas-feiras',
  2: 'Terças-Feiras',
  3: 'Quartas-Feiras',
  4: 'Quintas-Feiras',
  5: 'Sextas-Feiras',
  6: 'Sabádos',
  7: 'Domingos',
};

export function* getSchedules(action: ReturnType<typeof ScheduleCreators.getSchedulesRequest>) {
  const { payload } = action;

  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `reservation/v1/units/${unity.id}/schedules?sector_id=${payload.sector_id}&per_page=25&weekday=${
        payload.day ? payload.day : ''
      }&page=${payload.page}&sort_field=started_at`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        ScheduleCreators.getSchedulesSuccess({
          page: payload.page,
          schedules: response.data,
          selecteds: response.data,
          pagination: response.pagination,
        })
      );
    }
  } catch (error) {
    yield put(ScheduleCreators.getSchedulesFailed());
  }
}

export function* createSchedule(action: ReturnType<typeof ScheduleCreators.createScheduleRequest>) {
  try {
    const {
      hall: { unity },
      schedule: { selectedDay },
    }: RootType = yield select((state) => state);
    const { status, data: response } = yield call(
      api.post,
      `reservation/v1/units/${unity?.id}/schedules`,
      action.payload
    );

    if (status === Response.HTTP_CREATED) {
      yield put(
        ScheduleCreators.createScheduleSuccess({
          item: action.payload.dayRequest === selectedDay ? response.data : undefined,
        })
      );

      if (action.payload.days?.reverse()[0] === action.payload.schedule.weekday) {
        notification.success(
          `A grade horária foi ajustada com sucesso!`,
          `Todas as informações da grade horária foram salvas com sucesso.`
        );
        yield put(HallCreators.getHallRequest(action.payload.schedule.sector_id.toString()));
      }
    }
  } catch (error) {
    yield put(ScheduleCreators.createScheduleFailed());
  }
}

export function* editSchedule(action: ReturnType<typeof ScheduleCreators.editScheduleRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.put,
      `reservation/v1/units/${unity.id}/schedules/${action.payload.schedule.id}`,
      action.payload
    );

    if (status === Response.HTTP_OK) {
      notification.success(
        `A grade horária de ${daysOfWeek[action.payload.schedule.weekday]} foi ajustada com sucesso!`,
        `Todas as informações da grade horária foram atualizadas com sucesso.`
      );

      yield all([
        put(ScheduleCreators.editScheduleSuccess({ schedule: response.data })),
        put(HallCreators.getHallRequest(action.payload.schedule.sector_id.toString())),
      ]);
    }
  } catch (error) {
    yield put(ScheduleCreators.editScheduleFailed());
  }
}

export function* deleteSchedule(action: ReturnType<typeof ScheduleCreators.deleteScheduleRequest>) {
  try {
    notification.warning(
      `Estamos processando sua solicitação!`,
      `A exclusão da grade horária está em processo, aguarde até concluirmos a requisição.`
    );
    const { unity } = yield select((state) => state.hall);

    const { status } = yield call(api.delete, `reservation/v1/units/${unity.id}/schedules/${action.payload.id}`);

    if (status === Response.NO_CONTENT) {
      notification.success(
        `A grade horária foi deletada com sucesso!`,
        `Todas as informações desta grade horária foram deletadas com sucesso.`
      );

      yield all([
        put(HallCreators.getHallRequest(action.payload.sector_id.toString())),
        put(ScheduleCreators.deleteScheduleSuccess({ id: action.payload.id.toString() })),
      ]);
    }
  } catch (error) {
    yield put(ScheduleCreators.deleteScheduleFailed());
  }
}

export default all([
  takeEvery(ScheduleTypes.CREATE_SCHEDULE_REQUEST, createSchedule),
  takeLatest(ScheduleTypes.EDIT_SCHEDULE_REQUEST, editSchedule),
  takeLatest(ScheduleTypes.DELETE_SCHEDULE_REQUEST, deleteSchedule),
  takeEvery(ScheduleTypes.GET_SCHEDULES_REQUEST, getSchedules),
]);
