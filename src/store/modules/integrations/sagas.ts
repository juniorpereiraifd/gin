import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { type AxiosResponse, type AxiosError } from 'axios';
import * as Response from 'src/utils/response';
import { Types as IntegrationsTypes, IntegrationsCreators } from './actions';
import api from 'src/services/api';
import { notification } from 'src/utils/helpers';
import type { RootType } from '../rootReducer';

export function* getIntegratorStatus(action: ReturnType<typeof IntegrationsCreators.getIntegratorStatusRequest>) {
  const { integrator } = action.payload;

  try {
    const {
      hall: { unity },
    }: RootType = yield select((state) => state);

    const { status, data: response }: AxiosResponse = yield call(
      api.get,
      `/auth/v1/units/${unity?.id}/user_api/${integrator}`,
    );

    if (status === Response.HTTP_OK) {
      yield put(
        IntegrationsCreators.getIntegratorStatusSuccess({
          integrator,
          status: {
            integrator,
            enabled: Boolean(response.data?.enabled),
          },
        }),
      );
    }
  } catch (error) {
    yield put(IntegrationsCreators.getIntegratorStatusFailed({ integrator }));
  }
}

export function* toggleIntegrator(action: ReturnType<typeof IntegrationsCreators.toggleIntegratorRequest>) {
  const { integrator, onSuccess } = action.payload;

  try {
    const {
      hall: { unity },
      integrations: { statusByIntegrator },
    }: RootType = yield select((state) => state);

    const { status, data: response }: AxiosResponse = yield call(
      api.put,
      `/auth/v1/units/${unity?.id}/user_api/${integrator}`,
    );

    if (status === Response.HTTP_OK || status === Response.NO_CONTENT) {
      const previousEnabled = statusByIntegrator[integrator]?.enabled ?? false;
      const enabled = typeof response?.data?.enabled === 'boolean' ? response.data.enabled : !previousEnabled;

      yield put(IntegrationsCreators.toggleIntegratorSuccess({ integrator, enabled }));

      onSuccess?.(enabled);
      notification.success(enabled ? 'Integração habilitada com sucesso!' : 'Integração desabilitada com sucesso!', '');
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    notification.error('Erro ao atualizar integração', err.response?.data?.message || 'Tente novamente mais tarde');

    yield put(IntegrationsCreators.toggleIntegratorFailed({ integrator }));
  }
}

export default all([
  takeLatest(IntegrationsTypes.GET_INTEGRATOR_STATUS_REQUEST, getIntegratorStatus),
  takeLatest(IntegrationsTypes.TOGGLE_INTEGRATOR_REQUEST, toggleIntegrator),
]);
