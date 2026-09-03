import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import { AxiosResponse, type AxiosError } from 'axios';
import * as Response from 'src/utils/response';
import { notification } from 'src/utils/helpers';

import { Types as WidgetTypes, Creators as WidgetCreators } from './actions';
import api from 'src/services/api';
import { WidgetProps } from './reducer';

export function* getWidgets(action: ReturnType<typeof WidgetCreators.getWidgetsRequest>) {
  const { payload } = action;

  try {
    const { status, data }: AxiosResponse = yield call(
      api.get,
      `reservation/v1/units/${payload.unity}/widgets?page=${payload.page}`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        WidgetCreators.getWidgetsSuccess({
          widgets: data.data,
          pagination: data.pagination,
        })
      );
    }
  } catch (error) {
    yield put(WidgetCreators.getWidgetsFailed());
  }
}

export function* getWidget(action: ReturnType<typeof WidgetCreators.getWidgetRequest>) {
  const { payload } = action;

  try {
    const { status, data: response }: AxiosResponse = yield call(api.get, `reservation/v1/widgets/${payload.id}`);

    if (status === Response.HTTP_OK) {
      yield put(WidgetCreators.getWidgetSuccess(response.data));
    }
  } catch (error) {
    yield put(WidgetCreators.getWidgetFailed());
  }
}

export function* searchWidgets(action: ReturnType<typeof WidgetCreators.searchWidgetsRequest>) {
  const { query, page, perPage, reset } = action.payload;

  try {
    const { status, data }: AxiosResponse = yield call(
      api.get,
      `reservation/v1/widgets?page=${page || 1}&per_page=${perPage || 15}${query ? `&query=${query}` : ''}`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        WidgetCreators.searchWidgetsSuccess({
          widgets: data.data,
          pagination: data.pagination,
          reset: reset ?? true,
        })
      );
    }
  } catch (error) {
    yield put(WidgetCreators.searchWidgetsFailed());
  }
}

export function* createWidget(action: ReturnType<typeof WidgetCreators.createWidgetRequest>) {
  const { payload } = action;
  try {
    const { status, data }: AxiosResponse = yield call(api.post, 'reservation/v1/widgets', payload.data);

    if (status === Response.HTTP_CREATED) {
      notification.success('Widget criado com sucesso', '');

      yield put(
        WidgetCreators.createWidgetSuccess({
          widget: data.data,
          unity: payload.unity,
        })
      );
    }
  } catch (err) {
    const error = err as AxiosError;
    notification.error(
      'Erro na criação do widget',
      error.response?.data?.message || 'Tivemos um problema ao criar o widget, tente novamente mais tarde.'
    );
    yield put(WidgetCreators.createWidgetFailed());
  }
}

export function* deleteWidget(action: ReturnType<typeof WidgetCreators.deleteWidgetRequest>) {
  const { payload } = action;
  notification.warning('Deletando Widget', 'Estamos processando sua solicitação para excluir o Widget');

  try {
    const { status }: AxiosResponse = yield call(api.delete, `reservation/v1/widgets/${payload}`);

    if (status === Response.NO_CONTENT) {
      yield put(WidgetCreators.deleteWidgetSuccess(payload));
      notification.success('Widget deletado com sucesso!', 'O Widget foi deletado com sucesso da sua base de dados');
    }
  } catch (error) {
    yield put(WidgetCreators.deleteWidgetFailed());
  }
}

export function* linkWidget(action: ReturnType<typeof WidgetCreators.linkWidgetRequest>) {
  const { payload } = action;
  const { searcheds } = yield select((state) => state.widget);
  const widget = searcheds.find((widget: WidgetProps) => widget.id === payload.widget);

  notification.warning('Vinculando Widget', 'Estamos processando sua solicitação para vincular o Widget nessa unidade');

  const body = {
    widget: {
      active: widget.active,
    },
    widget_units: [
      ...widget.units.filter((widget: { unit_id: string }) => widget.unit_id !== payload.unity),
      {
        unit_id: payload.unity,
        active: true,
      },
    ],
  };

  try {
    const { status, data }: AxiosResponse = yield call(api.put, `reservation/v1/widgets/${payload.widget}`, body);

    if (status === Response.HTTP_OK) {
      yield put(WidgetCreators.linkWidgetSuccess(data.data));
      notification.success('Widget vinculado com sucesso!', 'O Widget foi vinculado com sucesso desta unidade');
    }
  } catch (error) {
    yield put(WidgetCreators.deleteWidgetFailed());
  }
}

export function* saveGtmAndFbPixelCodes(action: ReturnType<typeof WidgetCreators.saveGtmAndFbPixelCodesWidgetRequest>) {
  const {
    payload: { widget, gtm_code, fb_pixel_code },
  } = action;

  const loadingMessage = `Salvando código do ${gtm_code ? 'Google GTM' : ''} ${
    fb_pixel_code ? 'Facebook Pixel' : ''
  } no Widget`;

  notification.warning(
    loadingMessage,
    'Estamos processando sua solicitação para salvar o(s) código(s) do Widget nessa unidade'
  );

  const body = {
    widget: {
      active: widget.active,
      gtm_code,
      fb_pixel_code,
    },
    widget_units: widget?.units?.map((item) => {
      return {
        id: item.id,
        unit_id: item.unit_id,
      };
    }),
  };

  try {
    const { status }: AxiosResponse = yield call(api.put, `reservation/v1/widgets/${widget.id}`, body);

    const successMessage = `O código ${gtm_code ? 'Google GTM' : 'Facebook Pixel'} foi salvo no Widget`;

    if (status === Response.HTTP_OK) {
      yield put(WidgetCreators.saveGtmAndFbPixelCodesWidgetSuccess());
      notification.success(successMessage, 'O Widget foi salvo com sucesso desta unidade');
    }
  } catch (error) {
    yield put(WidgetCreators.saveGtmAndFbPixelCodesWidgetFailed());
  }
}

export function* saveFieldsCustomizationRequest(
  action: ReturnType<typeof WidgetCreators.saveFieldsCustomizationRequest>
) {
  const {
    payload: { widget, instructions, fields_customization, show_products_field, show_state_field },
  } = action;

  const loadingMessage = `Salvando todas as personalizações de campos!`;

  notification.warning(loadingMessage, 'Estamos processando sua solicitação para salvar o(s) campos customizados');

  const body = {
    widget: {
      active: widget.active,
      instructions,
      show_products_field,
      show_state_field,
      metadata: {
        customization: fields_customization,
      },
    },
    widget_units: widget?.units?.map((item) => {
      return {
        id: item.id,
        unit_id: item.unit_id,
      };
    }),
  };

  try {
    const { status }: AxiosResponse = yield call(api.put, `reservation/v1/widgets/${widget.id}`, body);

    const successMessage = `Os campos personalizados foram salvos!`;

    if (status === Response.HTTP_OK) {
      yield put(WidgetCreators.saveGtmAndFbPixelCodesWidgetSuccess());
      notification.success(successMessage, 'O Widget foi salvo com sucesso desta unidade');
    }
  } catch (error) {
    yield put(WidgetCreators.saveGtmAndFbPixelCodesWidgetFailed());
  }
}

export function* unlinkWidget(action: ReturnType<typeof WidgetCreators.unlinkWidgetRequest>) {
  const { payload } = action;
  const { data } = yield select((state) => state.widget);
  const widget = data.find((widget: WidgetProps) => widget.id === payload.widget);

  notification.warning(
    'Desvinculando Widget',
    'Estamos processando sua solicitação para desvincular o Widget desta unidade'
  );

  const body = {
    widget: {
      active: widget.active,
    },
    widget_units: widget.units.filter((widget: { unit_id: string }) => widget.unit_id !== payload.unity),
  };

  try {
    const { status }: AxiosResponse = yield call(api.put, `reservation/v1/widgets/${payload.widget}`, body);

    if (status === Response.HTTP_OK) {
      yield put(WidgetCreators.unlinkWidgetSuccess(payload.widget));
      notification.success('Widget desvinculado com sucesso!', 'O Widget foi desvinculado com sucesso desta unidade');
    }
  } catch (error) {
    yield put(WidgetCreators.deleteWidgetFailed());
  }
}

export default all([
  takeLatest(WidgetTypes.GET_WIDGETS_REQUEST, getWidgets),
  takeLatest(WidgetTypes.GET_WIDGET_REQUEST, getWidget),
  takeLatest(WidgetTypes.SEARCH_WIDGETS_REQUEST, searchWidgets),
  takeLatest(WidgetTypes.CREATE_WIDGET_REQUEST, createWidget),
  takeLatest(WidgetTypes.DELETE_WIDGET_REQUEST, deleteWidget),
  takeLatest(WidgetTypes.LINK_WIDGET_REQUEST, linkWidget),
  takeLatest(WidgetTypes.UNLINK_WIDGET_REQUEST, unlinkWidget),
  takeLatest(WidgetTypes.SAVE_GTM_AND_FB_PIXEL_CODES_WIDGET_REQUEST, saveGtmAndFbPixelCodes),
  takeLatest(WidgetTypes.SAVE_FIELDS_CUSTOMIZATION_REQUEST, saveFieldsCustomizationRequest),
]);
