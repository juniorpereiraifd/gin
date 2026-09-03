import { eventChannel } from 'redux-saga';
import { take, put } from 'redux-saga/effects';
import { notification } from 'src/utils/helpers';
import api from 'src/services/api';
import { resetTokenAndReattemptRequest } from 'src/services/resetTokenAndReattemptRequest';
import { store } from 'src/store';
import { Creators as AuthCreators } from 'src/store/modules/auth/actions';
import { LIST_FORCE_LOGOUT_USERS } from 'src/utils/constants';

function interceptor() {
  return eventChannel((emit) => {
    api.interceptors.response.use(
      (response) => {
        const user = store.getState().auth.user;

        if (LIST_FORCE_LOGOUT_USERS.includes(user?.id as string)) {
          emit(AuthCreators.logoutRequest());
        }

        return response;
      },

      async (error) => {
        const { response } = error;

        if (!response) {
          notification.error(
            'Houve um erro!',
            'Não foi possível conectar com o nosso servidor. Confirme se você tem uma conexão com a internet e tente novamente.',
            {
              duration: 0,
            }
          );

          return;
        }

        if (response.data.message && !response.data?.forceLogout) {
          notification.error('Houve um erro!', response.data?.message);
        }

        if ([401, 403].includes(response.status)) {
          return resetTokenAndReattemptRequest(error);
        }

        if ([400, 422].includes(response.status)) {
          if (response.data.errors) {
            const errorMessages = Object.values(response.data.errors)[0] as Array<string>;

            notification.error('Houve um erro!', errorMessages.join('; '));
          }

          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );

    return () => null; //eslint-disable-line
  });
}

export function* watchInterceptor() {
  const channel = interceptor();

  try {
    while (true) {
      const action: { type: string } = yield take(channel);
      yield put(action);
    }
  } finally {
    channel.close();
  }
}
