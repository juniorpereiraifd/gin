import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { AxiosError } from 'axios';
import * as Response from 'src/utils/response';
import { notification } from 'src/utils/helpers';

import {
  Types as BookingExperiencesTypes,
  Creators as BookingExperiencesCreators,
} from 'src/store/modules/bookingExperiences/actions';
import api from 'src/services/api';
import { RootType } from '../rootReducer';
import { BookingExperienceValuesInputFields } from 'src/screens/modules/reservation/pages/ExperiencesPage/utils';

type DeleteExperienceProps = {
  type: BookingExperiencesTypes.DELETE_EXPERIENCE_REQUEST;
  payload: string;
};

type EditExperienceProps = {
  type: BookingExperiencesTypes.EDIT_EXPERIENCE_REQUEST;
  payload: BookingExperienceValuesInputFields;
};

type ChangeStatusExperienceProps = {
  type: BookingExperiencesTypes.CHANGE_STATUS_EXPERIENCE_REQUEST;
  payload: {
    id: string;
    active: boolean;
  };
};

export function* createExperienceRequest(
  action: ReturnType<typeof BookingExperiencesCreators.createExperienceRequest>,
) {
  const { unity } = yield select((state: RootType) => state.hall);

  try {
    const { status } = yield call(api.post, `/reservation/v1/units/${unity.id}/products`, {
      ...action.payload,
    });

    if (status === Response.HTTP_OK || status === Response.HTTP_CREATED) {
      yield put(BookingExperiencesCreators.getExperiencesRequest({ unit_id: unity.id }));
      yield put(BookingExperiencesCreators.createExperienceSuccess());
      yield put(BookingExperiencesCreators.setMutationDrawerOpen({ open: false }));
      notification.success('Experiência cadastrada com sucesso!', '');
    }
  } catch (err) {
    const error = err as AxiosError;
    yield put(BookingExperiencesCreators.createExperienceFailure());

    notification.error(
      'Houve um erro ao cadastrar a experiência.',
      error.response?.data?.message || 'Tivemos um problema ao atualizar a experiência, tente novamente mais tarde.',
    );
  }
}

export function* getExperiencesRequest(action: ReturnType<typeof BookingExperiencesCreators.getExperiencesRequest>) {
  const { page, unit_id, title } = action.payload;
  const hasTitle = title !== undefined && title !== '';

  try {
    const {
      bookingExperiences: { experiencesListFilters },
    }: RootType = yield select((state: RootType) => state);

    const isAllStatus =
      (experiencesListFilters?.status.includes('active') && experiencesListFilters?.status.includes('inactive')) ||
      experiencesListFilters?.status.length === 0;

    const { data: response, status } = yield call(
      api.get,
      `/reservation/v1/units/${unit_id}/products?page=${page ?? 1}&per_page=10${hasTitle ? `&search=${title}` : ''}${
        isAllStatus === true ? '' : `&active=${experiencesListFilters?.status[0] === 'active' ? '1' : '0'}`
      }`,
    );

    if (status === Response.HTTP_OK || status === Response.HTTP_CREATED) {
      yield put(
        BookingExperiencesCreators.getExperiencesSuccess({
          experiences: response.data,
          isSearch: hasTitle,
          pagination: response.pagination,
        }),
      );
    }
  } catch (err) {
    const error = err as AxiosError;
    yield put(BookingExperiencesCreators.getExperiencesFailure());

    notification.error(
      'Houve um erro ao carregar as experiências.',
      error.response?.data?.message || 'Tivemos um problema ao carregar as experiências, tente novamente mais tarde.',
    );
  }
}

export function* getExperienceRequest(action: ReturnType<typeof BookingExperiencesCreators.getExperienceRequest>) {
  try {
    const { experienceId } = action.payload;
    const {
      hall: { unity },
    }: RootType = yield select((state: RootType) => state);

    const { data: response, status } = yield call(
      api.get,
      `/reservation/v1/units/${unity?.id}/products/${experienceId}`,
    );

    if (status === Response.HTTP_OK) {
      yield put(BookingExperiencesCreators.getExperienceSuccess(response.data));
    }
  } catch (err) {
    const error = err as AxiosError;
    notification.error(
      'Houve ao buscar dados da experiência.',
      error.response?.data?.message ||
        'Tivemos um problema ao carregar os dados da experiência, tente novamente mais tarde.',
    );
    yield put(BookingExperiencesCreators.getExperienceFailure());
  }
}

export function* getExperienceCategories() {
  try {
    const { data: response, status } = yield call(api.get, `/reservation/v1/products/categories`);

    if (status === Response.HTTP_OK) {
      yield put(BookingExperiencesCreators.getExperienceCategoriesSuccess(response.data));
    }
  } catch (err) {
    const error = err as AxiosError;
    notification.error(
      'Houve um erro ao buscar as categorias.',
      error.response?.data?.message ||
        'Tivemos um problema ao carregar os dados das categorias, tente novamente mais tarde.',
    );
    yield put(BookingExperiencesCreators.getExperienceFailure());
  }
}

export function* deleteExperienceRequest(action: DeleteExperienceProps) {
  const { unity } = yield select((state: RootType) => state.hall);

  try {
    const { status } = yield call(api.delete, `/reservation/v1/units/${unity.id}/products/${action.payload}`);

    if (status === Response.HTTP_OK || status === Response.NO_CONTENT) {
      notification.success('Experiência deletada com sucesso!', '');
      yield put(BookingExperiencesCreators.deleteExperienceSuccess(action.payload));
    }
  } catch (err) {
    const error = err as AxiosError;
    yield put(BookingExperiencesCreators.deleteExperienceFailure());

    notification.error(
      'Houve um erro ao deletar a experiência.',
      error.response?.data?.message || 'Tivemos um problema ao deletar a experiência, tente novamente mais tarde.',
    );
  }
}

export function* editExperienceRequest(action: EditExperienceProps) {
  const { unity } = yield select((state: RootType) => state.hall);

  try {
    const { status, data: response } = yield call(
      api.put,
      `/reservation/v1/units/${unity.id}/products/${action.payload.id}`,
      action.payload,
    );

    if (status === Response.HTTP_OK) {
      yield put(BookingExperiencesCreators.editExperienceSuccess(response.data));
      yield put(BookingExperiencesCreators.setMutationDrawerOpen({ open: false }));
      notification.success('Experiência atualizada com sucesso!', '');
    }
  } catch (err) {
    const error = err as AxiosError;
    yield put(BookingExperiencesCreators.editExperienceFailure());

    notification.error(
      'Houve um erro ao atualizar a experiência.',
      error.response?.data?.message || 'Tivemos um problema ao atualizar a experiência, tente novamente mais tarde.',
    );
  }
}

export function* changeStatusExperienceRequest(action: ChangeStatusExperienceProps) {
  const { unity } = yield select((state: RootType) => state.hall);

  try {
    const { status, data: response } = yield call(
      api.put,
      `/reservation/v1/units/${unity.id}/products/${action.payload.id}/active`,
      {
        active: action.payload.active,
      },
    );

    if (status === Response.HTTP_OK) {
      yield put(BookingExperiencesCreators.changeStatusExperienceResult(response.data));
      notification.success('Status da experiência atualizado com sucesso!', '');
    }
  } catch (err) {
    const error = err as AxiosError;
    yield put(
      BookingExperiencesCreators.changeStatusExperienceResult({
        id: action.payload.id,
        active: !action.payload.active,
      }),
    );

    notification.error(
      'Houve um erro ao atualizar o status da experiência.',
      error.response?.data?.message ||
        'Tivemos um problema ao atualizar o status da experiência, tente novamente mais tarde.',
    );
  }
}

export default all([
  takeLatest(BookingExperiencesTypes.CREATE_EXPERIENCE_REQUEST, createExperienceRequest),
  takeLatest(BookingExperiencesTypes.GET_EXPERIENCES_REQUEST, getExperiencesRequest),
  takeLatest(BookingExperiencesTypes.GET_EXPERIENCE_REQUEST, getExperienceRequest),
  takeLatest(BookingExperiencesTypes.GET_EXPERIENCE_CATEGORIES_REQUEST, getExperienceCategories),
  takeLatest(BookingExperiencesTypes.DELETE_EXPERIENCE_REQUEST, deleteExperienceRequest),
  takeLatest(BookingExperiencesTypes.EDIT_EXPERIENCE_REQUEST, editExperienceRequest),
  takeLatest(BookingExperiencesTypes.CHANGE_STATUS_EXPERIENCE_REQUEST, changeStatusExperienceRequest),
]);
