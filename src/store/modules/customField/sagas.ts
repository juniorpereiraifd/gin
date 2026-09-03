import { AxiosError } from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import api from 'src/services/api';
import { formatErrors, notification } from 'src/utils/helpers';
import * as Response from 'src/utils/response';
import { Creators as CustomFieldCreators, Types as CustomFieldTypes } from './actions';

type GetCustomFieldsProps = {
  type: CustomFieldTypes.GET_CUSTOM_FIELDS_REQUEST;
  payload: {
    unitId: string;
    page: number;
  };
};

type DeleteCustomFieldProps = {
  type: CustomFieldTypes.DELETE_CUSTOM_FIELD_REQUEST;
  payload: {
    customFieldId: string;
    unitId: string;
  };
};

export function* getCustomFields(action: GetCustomFieldsProps) {
  const {
    payload: { unitId, page },
  } = action;

  try {
    const { status, data: response } = yield call(
      api.get,
      `/reservation/v1/units/${unitId}/custom-fields?page=${page}&per_page=10`
    );

    if (status === Response.HTTP_OK) {
      yield put(CustomFieldCreators.getCustomFieldsSuccess(response));
    }
  } catch (error) {
    yield put(CustomFieldCreators.getCustomFieldsFailed());
  }
}

export function* createCustomField(action: ReturnType<typeof CustomFieldCreators.createCustomFieldRequest>) {
  const {
    payload: { customField, unitId },
    onSuccessCallback,
  } = action;

  try {
    const { status, data: response } = yield call(api.post, `/reservation/v1/units/${unitId}/custom-fields`, {
      custom_fields: {
        name1: customField,
      },
    });

    if (status === Response.HTTP_CREATED) {
      notification.success(
        'O campo customizado foi criado com sucesso!',
        `A criação do campo ${customField.title} foi concluída.`
      );
      yield put(CustomFieldCreators.createCustomFieldSuccess(response.data));
      onSuccessCallback?.();
    }
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 400) {
      const errors = formatErrors(error.response?.data.errors);

      yield put(CustomFieldCreators.createCustomFieldFailed(errors));
    }
    yield put(CustomFieldCreators.createCustomFieldFailed([]));
  }
}

export function* editCustomField(action: ReturnType<typeof CustomFieldCreators.editCustomFieldRequest>) {
  const {
    payload: { customField, customFieldId, unitId },
    onSuccessCallback,
  } = action;

  try {
    const { status, data: response } = yield call(
      api.put,
      `/reservation/v1/units/${unitId}/custom-fields/${customFieldId}`,
      customField
    );

    if (status === Response.HTTP_OK) {
      notification.success(
        'O campo customizado foi alterado com sucesso!',
        `Solicitação para alterar o campo customizado ${customField.title} foi concluída, o campo foi alterado.`
      );
      yield put(CustomFieldCreators.editCustomFieldSuccess(response.data));
      onSuccessCallback?.();
    }
  } catch (error) {
    yield put(CustomFieldCreators.editCustomFieldFailed());
  }
}

export function* deleteCustomField(action: DeleteCustomFieldProps) {
  const {
    payload: { customFieldId, unitId },
  } = action;

  notification.warning(
    'Excluindo campo customizado!',
    'Solicitação para excluír o campo customizado está em processamento.'
  );
  try {
    const { status } = yield call(api.delete, `/reservation/v1/units/${unitId}/custom-fields/${customFieldId}`);

    if (status === Response.NO_CONTENT) {
      notification.success(
        'O campo customizado foi excluído com sucesso!',
        'Solicitação para excluir o campo customizado foi concluída.'
      );
      yield put(CustomFieldCreators.deleteCustomFieldSuccess(customFieldId));
    }
  } catch (error) {
    yield put(CustomFieldCreators.deleteCustomFieldFailed());
  }
}

export default all([
  takeLatest(CustomFieldTypes.GET_CUSTOM_FIELDS_REQUEST, getCustomFields),
  takeLatest(CustomFieldTypes.CREATE_CUSTOM_FIELD_REQUEST, createCustomField),
  takeLatest(CustomFieldTypes.EDIT_CUSTOM_FIELD_REQUEST, editCustomField),
  takeLatest(CustomFieldTypes.DELETE_CUSTOM_FIELD_REQUEST, deleteCustomField),
]);
