import * as Response from 'src/utils/response';
import { all, put, select, takeLatest, call } from 'redux-saga/effects';
import {
  Types as ReservationTypes,
  Creators as ReservationCreators,
} from './actions';
import { notification } from 'src/utils/helpers';
import { NotificationEmailItemProps } from './reducer';
import api from 'src/services/api';
import { RootType } from '../rootReducer';

type CreateNotificationEmailProps = {
  type: ReservationTypes.CREATE_NOTIFICATION_EMAIL_REQUEST;
  payload: {
    email: string;
  };
};

type EditNotificationEmailProps = {
  type: ReservationTypes.EDIT_NOTIFICATION_EMAIL_REQUEST;
  payload: NotificationEmailItemProps;
};

type DeleteNotificationEmailProps = {
  type: ReservationTypes.DELETE_NOTIFICATION_EMAIL_REQUEST;
  payload: NotificationEmailItemProps;
};

export function* getNotificationEmails() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `reservation/v1/units/${unity.id}/notifications`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        ReservationCreators.getNotificationEmailsSuccess(response.data)
      );
    }
  } catch (error) {
    yield put(ReservationCreators.getNotificationEmailsFailed());
  }
}
export function* createNotificationEmail(action: CreateNotificationEmailProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.post,
      `reservation/v1/units/${unity.id}/notifications`,
      action.payload
    );

    if (status === Response.HTTP_CREATED) {
      notification.success(
        'O e-mail para notificações foi criado!',
        `O e-mail ${action.payload.email} usado para notificações, foi criado com sucesso.`
      );

      yield put(
        ReservationCreators.createNotificationEmailSuccess(response.data)
      );
    }
  } catch (error) {
    yield put(ReservationCreators.createNotificationEmailFailed());
  }
}

export function* editNotificationEmail(action: EditNotificationEmailProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.put,
      `reservation/v1/units/${unity.id}/notifications/${action.payload.id}`,
      action.payload
    );

    if (status === Response.HTTP_OK) {
      notification.success(
        'O e-mail foi alterado!',
        `O e-mail solicitado foi alterado com sucesso.`
      );

      yield put(
        ReservationCreators.editNotificationEmailSuccess(response.data)
      );
    }
  } catch (error) {
    yield put(ReservationCreators.createNotificationEmailFailed());
  }
}

export function* deleteNotificationEmail(action: DeleteNotificationEmailProps) {
  const { id } = action.payload;
  try {
    const { unity } = yield select((state) => state.hall);

    const { status } = yield call(
      api.delete,
      `reservation/v1/units/${unity.id}/notifications/${id}`
    );

    if (status === Response.NO_CONTENT) {
      notification.success(
        'O e-mail para notificações foi deletado!',
        `O e-mail ${action.payload.email} usado para notificações, foi deletado com sucesso.`
      );

      yield put(ReservationCreators.deleteNotificationEmailSuccess(id));
    }
  } catch (error) {
    yield put(ReservationCreators.createNotificationEmailFailed());
  }
}

export function* getReservationSettings() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `/reservation/v1/units/${unity.id}/settings`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        ReservationCreators.getReservationSettingsSuccess(response.data[0])
      );
    }
  } catch (error) {
    yield put(ReservationCreators.getReservationSettingsFailed());
  }
}

export function* updateReservationSettings(
  action: ReturnType<
    typeof ReservationCreators.updateReservationSettingsRequest
  >
) {
  try {
    const {
      hall: { unity },
      reservation: { settings },
    }: RootType = yield select((state) => state);

    const { status, data: response } = yield call(
      api.put,
      `/reservation/v1/units/${unity?.id}/settings/${settings?.id}`,
      action.payload
    );

    if (status === Response.HTTP_OK) {
      yield put(
        ReservationCreators.updateReservationSettingsSuccess(response.data)
      );

      notification.success(
        'Configurações de reservas atualizadas com sucesso!',
        ''
      );
    }
  } catch (error) {
    yield put(ReservationCreators.updateReservationSettingsFailed());
  }
}

export default all([
  takeLatest(
    ReservationTypes.GET_NOTIFICATION_EMAILS_REQUEST,
    getNotificationEmails
  ),
  takeLatest(
    ReservationTypes.CREATE_NOTIFICATION_EMAIL_REQUEST,
    createNotificationEmail
  ),
  takeLatest(
    ReservationTypes.EDIT_NOTIFICATION_EMAIL_REQUEST,
    editNotificationEmail
  ),
  takeLatest(
    ReservationTypes.DELETE_NOTIFICATION_EMAIL_REQUEST,
    deleteNotificationEmail
  ),
  takeLatest(
    ReservationTypes.GET_RESERVATION_SETTINGS_REQUEST,
    getReservationSettings
  ),
  takeLatest(
    ReservationTypes.UPDATE_RESERVATION_SETTINGS_REQUEST,
    updateReservationSettings
  ),
]);
