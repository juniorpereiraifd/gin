import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import axios, { AxiosError } from 'axios';
import * as Response from 'src/utils/response';
import { notification, encodeRedirectUrl } from 'src/utils/helpers';
import { Types as AuthTypes, Creators as AuthCreators } from 'src/store/modules/auth/actions';
import api from 'src/services/api';
import { logoutOctadeskChat } from 'src/services/octadesk';
import type { RootType } from '../rootReducer';

export function* login() {
  try {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken !== null) {
      const { data, status } = yield call(api.get, 'auth/v1/me');

      if (status === Response.HTTP_OK) {
        yield put(
          AuthCreators.loginSuccess({
            token: accessToken,
            user: data.data,
          }),
        );
      }
    } else {
      notification.warning('Erro ao realizar login!', 'Algum erro inesperado aconteceu, tente novamente.');

      yield put(AuthCreators.logoutRequest());
      yield put(AuthCreators.loginFailed());
    }
  } catch (err) {
    notification.warning('Erro ao realizar login!', 'Algum erro inesperado aconteceu, tente novamente.');

    yield put(AuthCreators.logoutRequest());
    yield put(AuthCreators.loginFailed());
  }
}

export function* logout(action: ReturnType<typeof AuthCreators.logoutRequest>) {
  yield call(logoutOctadeskChat);
  yield put(AuthCreators.logoutSuccess());
  yield localStorage.clear();
  yield call(axios.get, import.meta.env.VITE_AUTH_BASE_URL + '/api/logout?mode=1', {
    withCredentials: true,
  });

  const currentPath = window.location.pathname || null;

  window.location.href = `${import.meta.env.VITE_AUTH_BASE_URL}${action.payload?.forceLogin ? `?openMode=1${currentPath !== null && action.payload.redirectAfterAuth === true ? `&redirect=${encodeRedirectUrl(currentPath)}` : ''}` : ''}`;
}

export function* getManager() {
  try {
    const { data, status } = yield call(api.get, 'auth/v1/me');

    if (status === Response.HTTP_OK) {
      yield put(AuthCreators.getManagerSuccess(data.data));
    } else {
      notification.warning('Erro ao buscar seus dados!', 'Algum erro inesperado aconteceu, tente novamente.');

      yield put(AuthCreators.getManagerFailed());
    }
  } catch (err) {
    notification.warning('Erro ao buscar seus dados!', 'Algum erro inesperado aconteceu, tente novamente.');

    yield put(AuthCreators.getManagerFailed());
  }
}

export function* getAdminDetails(action: ReturnType<typeof AuthCreators.getAdminDetailsRequest>) {
  try {
    const {
      auth: { user },
    }: RootType = yield select((state) => state);

    const { unitId } = action.payload;

    if (!user?.id) {
      yield put(AuthCreators.getAdminDetailsFailed());
      return;
    }

    const { data, status } = yield call(api.get, `auth/v1/units/${unitId}/admins/${user.id}`);

    if (status === Response.HTTP_OK) {
      yield put(AuthCreators.getAdminDetailsSuccess({ units: [], ...data?.data }));
    } else {
      yield put(AuthCreators.getAdminDetailsFailed());
    }
  } catch (error) {
    yield put(AuthCreators.getAdminDetailsFailed());
  }
}

export function* changeNameProfile(action: ReturnType<typeof AuthCreators.changeNameProfileRequest>) {
  const { payload } = action;
  try {
    const { user } = yield select((state) => state.auth);
    const { status, data } = yield call(api.put, `auth/v1/change-name/${user?.id}`, payload);
    if (status === Response.HTTP_OK) {
      notification.success('Nome atualizado com sucesso!', 'Seu perfil foi atualizado com sucesso');
      const token = String(localStorage.getItem('access_token'));
      yield put(
        AuthCreators.loginSuccess({
          token,
          user: {
            ...user,
            name: data.data.name,
          },
        }),
      );
      yield put(AuthCreators.changeNameProfileSuccess(payload));
    }
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 400) {
      if (error.response?.data?.errors) {
        notification.error(
          'Houve um erro ao atualizar seu nome!',
          'Tivemos um problema ao atualizar seu nome, tente novamente mais tarde.',
        );
      }
    }

    yield put(AuthCreators.changeNameProfileFailed());
  }
}

export function* updateManager(action: ReturnType<typeof AuthCreators.updateManagerRequest>) {
  try {
    const { id, ...manager } = action.payload;

    const { data, status } = yield call(api.put, `auth/v1/admins/${id}`, { ...manager });

    if (status === Response.HTTP_OK) {
      yield put(AuthCreators.updateManagerSuccess(data.data));

      notification.success('Dados atualizados com sucesso!', '');
    }
  } catch (error) {
    yield put(AuthCreators.updateManagerFailed());
  }
}

export function* changePassword(action: ReturnType<typeof AuthCreators.changePasswordRequest>) {
  try {
    const {
      auth: { user },
    }: RootType = yield select((state) => state);

    const { status } = yield call(api.put, `auth/v1/admins/${user?.id}/change-password`, { ...action.payload });

    if (status === Response.HTTP_OK) {
      yield put(AuthCreators.changePasswordSuccess());

      notification.success('Senha alterada com sucesso!', '');
    }
  } catch (error) {
    yield put(AuthCreators.changePasswordFailed());
  }
}

export function* refreshTokenFailed() {
  try {
    yield put(AuthCreators.logoutRequest({ forceLogin: true, redirectAfterAuth: true }));
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    notification.error(error.response?.data?.message || 'Erro ao deslogar.', '');
  }
}

export function* updateFavoriteUnit(action: ReturnType<typeof AuthCreators.updateFavoriteUnitRequest>) {
  const { payload } = action;
  try {
    const { data, status } = yield call(api.put, 'auth/v1/favorite', { unit_id: payload.favorite_unit });

    if (status === Response.HTTP_OK) {
      yield put(AuthCreators.updateFavoriteUnitSuccess(data.data));

      notification.success('Unidade favorita alterada com sucesso!', '');
    }
  } catch (error) {
    yield put(AuthCreators.updateFavoriteUnitFailed());
  }
}

export default all([
  takeLatest(AuthTypes.LOGIN_REQUEST, login),
  takeLatest(AuthTypes.LOGOUT_REQUEST, logout),
  takeLatest(AuthTypes.GET_MANAGER_REQUEST, getManager),
  takeLatest(AuthTypes.GET_ADMIN_DETAILS_REQUEST, getAdminDetails),
  takeLatest(AuthTypes.UPDATE_MANAGER_REQUEST, updateManager),
  takeLatest(AuthTypes.CHANGE_PASSWORD_REQUEST, changePassword),
  takeLatest(AuthTypes.CHANGE_NAME_PROFILE_REQUEST, changeNameProfile),
  takeLatest(AuthTypes.REFRESH_TOKEN_FAILED, refreshTokenFailed),
  takeLatest(AuthTypes.UPDATE_FAVORITE_UNIT_REQUEST, updateFavoriteUnit),
]);
