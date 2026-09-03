import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import api from 'src/services/api';
import * as Response from 'src/utils/response';
import { RootType } from '../rootReducer';
import { Types as VoucherTypes, Creators as VoucherCreators } from './actions';
import { notification } from 'src/utils/helpers';

type updateVouchersActionProps = {
  type: VoucherTypes.GET_VOUCHERS_UPDATE_REQUEST;
  payload: number | string;
};

export function* getVouchers(action: ReturnType<typeof VoucherCreators.getVouchersRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);

    if (unity) {
      const { status, data: response } = yield call(
        api.get,
        `voucher/v1/units/${unity.id}/vouchers?page=${action.payload?.page ? action.payload.page : 1}&per_page=${
          action.payload.perPage ?? '15'
        }${action.payload.isSearch && action.payload.search ? `&query=${action.payload.search}` : ''}`
      );

      if (status === Response.HTTP_OK) {
        yield put(
          VoucherCreators.getVouchersSuccess({
            vouchers: response.data,
            pagination: response.pagination,
            isSearch: action.payload.isSearch,
          })
        );
      }
    }
  } catch (error) {
    yield put(VoucherCreators.getVouchersFailed());
  }
}

export function* getVouchersStatistics() {
  try {
    const { unity } = yield select((state) => state.hall);

    if (unity) {
      const { status, data: response } = yield call(api.get, `voucher/v1/units/${unity.id}/statistics`);

      if (status === Response.HTTP_OK) {
        yield put(VoucherCreators.getVouchersStatisticsSuccess(response.data));
      }
    }
  } catch (error) {
    yield put(VoucherCreators.getVouchersFailed());
  }
}

export function* updateVoucher(action: updateVouchersActionProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    if (unity) {
      const { status, data: response } = yield call(
        api.put,
        `voucher/v1/units/${unity.id}/vouchers/${action.payload}/validate`
      );

      if (status === Response.HTTP_OK) {
        yield put(VoucherCreators.getVouchersUpdateSuccess(response.data));
      }
    }
  } catch (error) {
    yield put(VoucherCreators.getVouchersUpdateFailed());
  }
}

export function* getVoucherSettings() {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { status, data: response } = yield call(api.get, `/voucher/v1/units/${unity.id}/settings`);

    if (status === Response.HTTP_OK) {
      yield put(VoucherCreators.getVoucherSettingsSuccess(response.data[0]));
    }
  } catch (error) {
    yield put(VoucherCreators.getVoucherSettingsFailed());
  }
}

export function* updateVoucherSettings(action: ReturnType<typeof VoucherCreators.updateVoucherSettingsRequest>) {
  try {
    const {
      hall: { unity },
      voucher: { settings },
    }: RootType = yield select((state: RootType) => state);

    const { status, data: response } = yield call(
      api.put,
      `/voucher/v1/units/${unity?.id}/settings/${settings?.id}`,
      action.payload
    );

    if (status === Response.HTTP_OK) {
      yield put(VoucherCreators.updateVoucherSettingsSuccess(response.data));
      notification.success('Configurações de giftback atualizadas com sucesso!', '');
    }
  } catch (error) {
    yield put(VoucherCreators.updateVoucherSettingsFailed());
  }
}

export function* getGiftbackPeriods() {
  try {
    const {
      hall: { unity },
      voucher: { settings },
    }: RootType = yield select((state) => state);

    if (unity && settings) {
      const { status, data: response } = yield call(
        api.get,
        `/voucher/v1/units/${unity.id}/settings/${settings.id}/giftback-periods?pagination=0`
      );

      if (status === Response.HTTP_OK) {
        yield put(
          VoucherCreators.getGiftbackPeriodsSuccess({
            periods: response.data,
          })
        );
      }
    } else {
      notification.error('Erro ao buscar os turnos do giftback', '');
      yield put(VoucherCreators.getVouchersFailed());
    }
  } catch (error) {
    notification.error('Erro ao buscar os turnos do giftback', '');
    yield put(VoucherCreators.getVouchersFailed());
  }
}

export function* createGiftbackPeriod(action: ReturnType<typeof VoucherCreators.createGiftbackPeriodRequest>) {
  try {
    const {
      hall: { unity },
      voucher: { settings },
    }: RootType = yield select((state: RootType) => state);

    if (unity && settings) {
      const { status, data: response } = yield call(
        api.post,
        `/voucher/v1/units/${unity.id}/settings/${settings.id}/giftback-periods`,
        action.payload
      );

      if (status === Response.HTTP_CREATED) {
        yield put(VoucherCreators.createGiftbackPeriodSuccess(response.data));
        notification.success('Turno de giftback criado com sucesso!', '');
      }
    } else {
      notification.error('Erro ao criar o turno de giftback', '');
      yield put(VoucherCreators.createGiftbackPeriodFailed());
    }
  } catch (error) {
    notification.error('Erro ao criar o turno de giftback', '');
    yield put(VoucherCreators.createGiftbackPeriodFailed());
  }
}

export function* updateGiftbackPeriod(action: ReturnType<typeof VoucherCreators.updateGiftbackPeriodRequest>) {
  try {
    const {
      hall: { unity },
      voucher: { settings },
    }: RootType = yield select((state: RootType) => state);

    if (unity && settings) {
      const { status, data: response } = yield call(
        api.put,
        `/voucher/v1/units/${unity.id}/settings/${settings.id}/giftback-periods/${action.payload.id}`,
        action.payload
      );

      if (status === Response.HTTP_OK) {
        yield put(VoucherCreators.updateGiftbackPeriodSuccess(response.data));
        notification.success('Turno de giftback editado com sucesso!', '');
      }
    } else {
      notification.error('Erro ao editar o turno de giftback', '');
      yield put(VoucherCreators.updateGiftbackPeriodFailed());
    }
  } catch (error) {
    notification.error('Erro ao editar o turno de giftback', '');
    yield put(VoucherCreators.updateGiftbackPeriodFailed());
  }
}

export function* deleteGiftbackPeriod(action: ReturnType<typeof VoucherCreators.deleteGiftbackPeriodRequest>) {
  try {
    const {
      hall: { unity },
      voucher: { settings },
    }: RootType = yield select((state: RootType) => state);

    if (unity && settings) {
      const { status } = yield call(
        api.delete,
        `/voucher/v1/units/${unity.id}/settings/${settings.id}/giftback-periods/${action.payload.id}`
      );

      if (status === Response.NO_CONTENT) {
        yield put(VoucherCreators.deleteGiftbackPeriodSuccess(action.payload));
        notification.success('Turno de giftback excluído com sucesso!', '');
      }
    } else {
      notification.error('Erro ao excluir o turno de giftback', '');
      yield put(VoucherCreators.deleteGiftbackPeriodFailed());
    }
  } catch (error) {
    notification.error('Erro ao excluir o turno de giftback', '');
    yield put(VoucherCreators.deleteGiftbackPeriodFailed());
  }
}

export function* updateVoucherStatus(action: ReturnType<typeof VoucherCreators.updateVoucherStatusRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);
    const { id, status: voucherStatus } = action.payload;

    if (unity) {
      const { status, data: response } = yield call(
        api.put,
        `voucher/v1/units/${unity.id}/vouchers/${id}/change-status`,
        {
          status: voucherStatus,
        }
      );

      if (status === Response.HTTP_OK) {
        yield put(VoucherCreators.updateVoucherStatusSuccess(response.data));
        notification.success('Status do giftback alterado com sucesso!', '');
      }
    }
  } catch (error) {
    yield put(VoucherCreators.updateVoucherStatusFailed());
  }
}

export default all([
  takeLatest(VoucherTypes.GET_VOUCHERS_REQUEST, getVouchers),
  takeLatest(VoucherTypes.GET_VOUCHERS_STATISTICS_REQUEST, getVouchersStatistics),
  takeLatest(VoucherTypes.GET_VOUCHERS_UPDATE_REQUEST, updateVoucher),
  takeLatest(VoucherTypes.GET_VOUCHER_SETTINGS_REQUEST, getVoucherSettings),
  takeLatest(VoucherTypes.UPDATE_VOUCHER_SETTINGS_REQUEST, updateVoucherSettings),
  takeLatest(VoucherTypes.GET_GIFTBACK_PERIODS_REQUEST, getGiftbackPeriods),
  takeLatest(VoucherTypes.CREATE_GIFTBACK_PERIOD_REQUEST, createGiftbackPeriod),
  takeLatest(VoucherTypes.UPDATE_GIFTBACK_PERIOD_REQUEST, updateGiftbackPeriod),
  takeLatest(VoucherTypes.DELETE_GIFTBACK_PERIOD_REQUEST, deleteGiftbackPeriod),
  takeLatest(VoucherTypes.UPDATE_VOUCHER_STATUS_REQUEST, updateVoucherStatus),
]);
