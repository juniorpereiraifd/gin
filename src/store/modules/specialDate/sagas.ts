import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { Types as SpecialDateTypes, Creators as SpecialDateCreators } from './actions';
import api from 'src/services/api';
import { AxiosError } from 'axios';
import * as Response from 'src/utils/response';
import { notification, formatErrors } from 'src/utils/helpers';
import { RootType } from 'src/store/modules/rootReducer';
import { SpecialDateItemProps } from './reducer';
import dayjs from 'dayjs';

type GetSpecialDatesProps = {
  type: SpecialDateTypes.GET_SPECIAL_DATES_REQUEST;
  payload: {
    unity_id: string;
    page: number;
    start_at: string;
    end_at: string;
  };
};

type CreateSpecialDatesProps = {
  type: SpecialDateTypes.CREATE_SPECIAL_DATE_REQUEST;
  payload: SpecialDateItemProps;
};

type EditSpecialDateProps = {
  type: SpecialDateTypes.EDIT_SPECIAL_DATE_REQUEST;
  payload: SpecialDateItemProps;
};

type DeleteSpecialDateProps = {
  type: SpecialDateTypes.DELETE_SPECIAL_DATE_REQUEST;
  payload: string;
};

export function* getSpecialDate(action: ReturnType<typeof SpecialDateCreators.getSpecialDateRequest>) {
  try {
    const { unity } = yield select((state: RootType) => state.hall);
    const { schedule_id } = action.payload;

    const { status, data: response } = yield call(api.get, `reservation/v1/units/${unity.id}/schedules/${schedule_id}`);

    if (status === Response.HTTP_OK) {
      const { schedule_map, schedule_product, ...item } = response.data;
      const mapped: SpecialDateItemProps = {
        schedule: item,
        schedule_map: schedule_map,
        ...(schedule_product && { schedule_product: schedule_product }),
      };

      yield put(SpecialDateCreators.getSpecialDateSuccess(mapped));
    }
  } catch (error) {
    yield put(SpecialDateCreators.getSpecialDateFailed());
  }
}

export function* getSpecialDates(action: GetSpecialDatesProps) {
  const { payload } = action;
  let filter = '';
  try {
    if (payload.start_at && payload.end_at) {
      filter = `&start_date=${dayjs(payload.start_at, 'DD/MM/YYYY').format(
        'YYYY-MM-DD',
      )}&end_date=${dayjs(payload.end_at, 'DD/MM/YYYY').format('YYYY-MM-DD')}`;
    }
    const { status, data: response } = yield call(
      api.get,
      `reservation/v1/units/${payload.unity_id}/schedules/special/filter?page=${payload.page}&per_page=6${filter}&sort_field=date&sort_direction=DESC`,
    );

    if (status === Response.HTTP_OK) {
      yield put(SpecialDateCreators.getSpecialDatesSuccess(response));
    }
  } catch (error) {
    yield put(SpecialDateCreators.getSpecialDatesFailed());
  }
}

export function* createSpecialDate(action: CreateSpecialDatesProps) {
  const { payload } = action;

  try {
    const { unity } = yield select((state: RootType) => state.hall);

    const { status, data: response } = yield call(api.post, `reservation/v1/units/${unity.id}/schedules`, payload);

    if (status === Response.HTTP_CREATED || status === Response.HTTP_OK) {
      notification.success(
        'A data especial foi criada com sucesso!',
        `A criação da data especial ${payload.schedule.name} foi concluída.`,
      );
      yield put(SpecialDateCreators.createSpecialDateSuccess(response.data));
    }
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 400) {
      const errors = formatErrors(error.response?.data.errors);

      yield put(SpecialDateCreators.createSpecialDateFailed(errors));
    }
    yield put(SpecialDateCreators.createSpecialDateFailed([]));
  }
}

export function* editSpecialDate(action: EditSpecialDateProps) {
  const { payload } = action;

  try {
    const { unity } = yield select((state: RootType) => state.hall);

    const { status, data: response } = yield call(
      api.put,
      `reservation/v1/units/${unity.id}/schedules/${payload.schedule.id}`,
      payload,
    );

    if (status === Response.HTTP_OK) {
      notification.success(
        'A data especial foi alterada com sucesso!',
        `Solicitação para alterar a data especial ${payload.schedule.name} foi concluída, a data foi alterada.`,
      );
      yield put(SpecialDateCreators.editSpecialDateSuccess(response.data));
    }
  } catch (error) {
    yield put(SpecialDateCreators.editSpecialDateFailed());
  }
}

export function* deleteSpecialDate(action: DeleteSpecialDateProps) {
  const { payload } = action;
  notification.warning('Excluíndo data especial!', 'Solicitação para excluír a data especial está em processamento.');
  try {
    const { unity } = yield select((state: RootType) => state.hall);

    const { status } = yield call(api.delete, `reservation/v1/units/${unity.id}/schedules/${payload}`);

    if (status === Response.NO_CONTENT) {
      notification.success(
        'A data especial foi excluída com sucesso!',
        'Solicitação para excluir a data especial foi concluída.',
      );
      yield put(SpecialDateCreators.deleteSpecialDateSuccess(payload));
    }
  } catch (error) {
    yield put(SpecialDateCreators.deleteSpecialDateFailed());
  }
}

export default all([
  takeLatest(SpecialDateTypes.GET_SPECIAL_DATE_REQUEST, getSpecialDate),
  takeLatest(SpecialDateTypes.GET_SPECIAL_DATES_REQUEST, getSpecialDates),
  takeLatest(SpecialDateTypes.CREATE_SPECIAL_DATE_REQUEST, createSpecialDate),
  takeLatest(SpecialDateTypes.EDIT_SPECIAL_DATE_REQUEST, editSpecialDate),
  takeLatest(SpecialDateTypes.DELETE_SPECIAL_DATE_REQUEST, deleteSpecialDate),
]);
