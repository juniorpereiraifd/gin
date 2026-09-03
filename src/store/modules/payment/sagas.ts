import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import { AxiosResponse, type AxiosError } from 'axios';
import * as Response from 'src/utils/response';
import { Types as PaymentTypes, PaymentCreators } from './actions';
import api from 'src/services/api';
import { notification } from 'src/utils/helpers';
import type { RootType } from '../rootReducer';

export function* getTransactions(action: ReturnType<typeof PaymentCreators.getTransactionsRequest>) {
  try {
    const {
      hall: { unity },
    }: RootType = yield select((state) => state);
    const { page, start_date, end_date, status: transactionStatus, transaction_id, reservation_id } = action.payload;

    const params = new URLSearchParams({ page: String(page) });

    if (transactionStatus) params.append('status', transactionStatus);
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    if (transaction_id) params.append('external_reference', transaction_id);
    if (reservation_id) params.append('internal_reference', reservation_id);

    const { status, data: response } = yield call(
      api.get,
      `/payment/v1/units/${unity?.id}/transactions?${params.toString()}`,
    );

    if (status === Response.HTTP_OK) {
      yield put(
        PaymentCreators.getTransactionsSuccess({
          transactions: response.data,
          pagination: response.pagination,
        }),
      );
    }
  } catch (error) {
    yield put(PaymentCreators.getTransactionsFailed());
  }
}

export function* getSellers(action: ReturnType<typeof PaymentCreators.getSellersRequest>) {
  try {
    const { payload } = action;

    const params = new URLSearchParams({ page: String(payload.page) });

    if (payload.unit_id) params.append('unit_id', payload.unit_id);
    if (payload.status) params.append('status', payload.status);
    if (payload.seller_type) params.append('seller_type', payload.seller_type);

    const { status, data: response }: AxiosResponse = yield call(
      api.get,
      `/payment/v1/seller-credentialing?${params.toString()}`,
    );

    if (status === Response.HTTP_OK) {
      yield put(
        PaymentCreators.getSellersSuccess({
          sellers: response.data,
          pagination: response.pagination,
        }),
      );
    }
  } catch (error) {
    yield put(PaymentCreators.getSellersFailed());
  }
}

export function* getTransactionsStatus() {
  try {
    const { status, data: response } = yield call(api.get, '/payment/v1/transactions/status');

    if (status === Response.HTTP_OK) {
      yield put(PaymentCreators.getTransactionsStatusSuccess(response.data));
    }
  } catch (error) {
    yield put(PaymentCreators.getTransactionsStatusFailed());
  }
}

export function* refundTransaction(action: ReturnType<typeof PaymentCreators.refundTransactionRequest>) {
  try {
    const {
      hall: { unity },
    }: RootType = yield select((state) => state);

    const { status } = yield call(
      api.post,
      `/payment/v1/units/${unity?.id}/transactions/${action.payload.transactionId}/refund`,
    );

    if (status === Response.NO_CONTENT) {
      notification.success('O reembolso foi realizado com sucesso!', '');
      yield put(PaymentCreators.refundTransactionSuccess({ transactionId: action.payload.transactionId }));
    }
  } catch (error) {
    yield put(PaymentCreators.refundTransactionFailed());
  }
}

export function* getSeller(action: ReturnType<typeof PaymentCreators.getSellerRequest>) {
  try {
    const { payload } = action;

    const { status, data }: AxiosResponse = yield call(api.get, `/payment/v1/seller-credentialing/${payload.sellerId}`);

    if (status === Response.HTTP_OK) {
      yield put(
        PaymentCreators.getSellerSuccess({
          seller: data.data,
        }),
      );
    }
  } catch (error) {
    yield put(PaymentCreators.getSellerFailed());
  }
}

export function* createSeller(action: ReturnType<typeof PaymentCreators.createSellerRequest>) {
  try {
    const { payload, onSuccess } = action;

    const { status, data: response }: AxiosResponse = yield call(api.post, `/payment/v1/seller-credentialing`, payload);

    if (status === Response.HTTP_CREATED) {
      yield put(
        PaymentCreators.createSellerSuccess({
          seller: response.data,
        }),
      );

      onSuccess(response.data);
      notification.success('Vendedor criado com sucesso', '');
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    notification.error('Erro ao criar vendedor', err.response?.data?.message || 'Tente novamente mais tarde');

    yield put(PaymentCreators.createSellerFailed());
  }
}

export function* updateSeller(action: ReturnType<typeof PaymentCreators.updateSellerRequest>) {
  try {
    const { payload } = action;

    const { status, data }: AxiosResponse = yield call(
      api.put,
      `/payment/v1/seller-credentialing/${payload.sellerId}`,
      payload.data,
    );

    if (status === Response.HTTP_OK) {
      yield put(
        PaymentCreators.updateSellerSuccess({
          seller: data,
        }),
      );

      notification.success('Vendedor atualizado com sucesso', '');
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    notification.error('Erro ao editar vendedor', err.response?.data?.message || 'Tente novamente mais tarde');

    yield put(PaymentCreators.updateSellerFailed());
  }
}

export function* deleteSeller(action: ReturnType<typeof PaymentCreators.deleteSellerRequest>) {
  try {
    const { payload } = action;

    const { status }: AxiosResponse = yield call(api.delete, `/payment/v1/seller-credentialing/${payload.sellerId}`);

    if (status === Response.NO_CONTENT) {
      yield put(PaymentCreators.deleteSellerSuccess({ sellerId: payload.sellerId }));
      payload.onSuccess?.();
      notification.success('Vendedor excluído com sucesso', '');
    }
  } catch (error) {
    yield put(PaymentCreators.deleteSellerFailed());
    notification.error('Erro ao excluir vendedor', 'Tente novamente mais tarde');
  }
}

export function* refreshSellerStatus(action: ReturnType<typeof PaymentCreators.refreshSellerStatusRequest>) {
  try {
    const { payload } = action;

    const { status, data }: AxiosResponse = yield call(
      api.get,
      `/payment/v1/seller-credentialing/${payload.sellerId}/status`,
    );

    if (status === Response.HTTP_OK) {
      yield put(
        PaymentCreators.refreshSellerStatusSuccess({
          sellerId: payload.sellerId,
          status: data.status,
          documents: data.documents.uploaded,
        }),
      );
    }
  } catch (error) {
    yield put(PaymentCreators.refreshSellerStatusFailed());
    notification.error('Erro ao atualizar status', 'Tente novamente mais tarde');
  }
}

export default all([
  takeLatest(PaymentTypes.GET_TRANSACTIONS_REQUEST, getTransactions),
  takeLatest(PaymentTypes.GET_TRANSACTIONS_STATUS_REQUEST, getTransactionsStatus),
  takeLatest(PaymentTypes.REFUND_TRANSACTION_REQUEST, refundTransaction),
  takeLatest(PaymentTypes.GET_SELLERS_REQUEST, getSellers),
  takeLatest(PaymentTypes.GET_SELLER_REQUEST, getSeller),
  takeLatest(PaymentTypes.CREATE_SELLER_REQUEST, createSeller),
  takeLatest(PaymentTypes.UPDATE_SELLER_REQUEST, updateSeller),
  takeLatest(PaymentTypes.DELETE_SELLER_REQUEST, deleteSeller),
  takeLatest(PaymentTypes.REFRESH_SELLER_STATUS_REQUEST, refreshSellerStatus),
]);
