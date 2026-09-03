import { AxiosResponse, AxiosError } from 'axios';
import {
  all,
  call,
  getContext,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import api from 'src/services/api';
import { RootType } from 'src/store/modules/rootReducer';
import { notification } from 'src/utils/helpers';
import * as Response from 'src/utils/response';
import { MarketingCreators, MarketingTypes } from './actions';
import {
  CustomerResponse,
  GetEmailCampaignResponse,
  GetEmailCampaignsResponse,
  GetFilteredCustomersResponse,
  GetReportSMSCampaignResponse,
  GetSMSCampaignResponse,
  GetSMSCampaignsResponse,
  GetSMSVariablesResponse,
  ImportCustomersResponse,
  GetImportCustomersErrorsResponse,
  GetListsResponse,
  GetDetailslistResponse,
} from './reducer';

export function* getCustomers() {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const endpoint = `/marketing/v1/units/${unity.id}/customers`;
    const [
      dataAll,
      dataBirthdays,
      dataReservationNoshow,
      dataCanceled,
      dataDontComeBack30,
      dataDontComeBack60,
      dataDontComeBack90,
    ]: [
      AxiosResponse<CustomerResponse>,
      AxiosResponse<CustomerResponse>,
      AxiosResponse<CustomerResponse>,
      AxiosResponse<CustomerResponse>,
      AxiosResponse<CustomerResponse>,
      AxiosResponse<CustomerResponse>,
      AxiosResponse<CustomerResponse>
    ] = yield all([
      call(api.get, `${endpoint}?segmentation=all`),
      call(api.get, `${endpoint}?segmentation=birthdays`),
      call(api.get, `${endpoint}?segmentation=reservation_noshow`),
      call(api.get, `${endpoint}?segmentation=canceled`),
      call(api.get, `${endpoint}?segmentation=dont_come_back&days=30`),
      call(api.get, `${endpoint}?segmentation=dont_come_back&days=60`),
      call(api.get, `${endpoint}?segmentation=dont_come_back&days=90`),
    ]);

    const valid = [
      dataAll,
      dataBirthdays,
      dataReservationNoshow,
      dataCanceled,
      dataDontComeBack30,
      dataDontComeBack60,
      dataDontComeBack90,
    ];

    if (valid.every((res) => res.status === Response.HTTP_OK)) {
      yield put(
        MarketingCreators.getCustomersSuccess({
          all: dataAll.data,
          birthdays: dataBirthdays.data,
          reservation_noshow: dataReservationNoshow.data,
          canceled: dataCanceled.data,
          dont_come_back_thirty: dataDontComeBack30.data,
          dont_come_back_sixty: dataDontComeBack60.data,
          dont_come_back_ninety: dataDontComeBack90.data,
          list: { data: [], pagination: null },
        })
      );
    }
  } catch (error) {
    yield put(MarketingCreators.getCustomersFailed());
    notification.error(
      'Houve um erro!',
      'Não foi possível buscar clientes da segmentação'
    );
  }
}

export function* getFilteredCustomers(
  action: ReturnType<typeof MarketingCreators.getFilteredCustomersRequest>
) {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { page, per_page, segmentation, list_id, days } = action.payload;

    const endpoint = `/marketing/v1/units/${unity.id}/customers`;

    const parsedParam = Object.assign(
      {},
      page && { page: page },
      per_page && { per_page: per_page },
      segmentation && { segmentation: segmentation },
      list_id && { list_id: list_id },
      days && { days: days }
    );

    const {
      status,
      data,
    }: AxiosResponse<GetFilteredCustomersResponse> = yield call(
      api.get,
      endpoint,
      {
        params: parsedParam,
      }
    );

    if (status === Response.HTTP_OK) {
      if (segmentation) {
        data.filter = segmentation;

        if (days) {
          switch (days) {
            case '30':
              data.filter += '_thirty';
              break;

            case '60':
              data.filter += '_sixty';
              break;
          }
        }
      }
      yield put(MarketingCreators.getFilteredCustomersSuccess(data));
    }
  } catch (error) {
    yield put(MarketingCreators.getFilteredCustomersFailed());
    notification.error(
      'Houve um erro!',
      'Não foi possível buscar Clientes da segmentação'
    );
  }
}

export function* getCsvCustomers(
  action: ReturnType<typeof MarketingCreators.getCsvCustomersRequest>
) {
  api.defaults.responseType = 'blob';
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { segmentation, days, list_id } = action.payload;

    const parsedParam = Object.assign(
      {},
      segmentation && { segmentation: segmentation.includes('dont_come_back') ? 'dont_come_back' : segmentation },
      days && { days: days },
      list_id && { list_id: list_id }
    );

    const { status, data }: AxiosResponse<Blob> = yield call(
      api.get,
      `marketing/v1/units/${unity.id}/customers/export`,
      {
        params: parsedParam,
      }
    );

    if (status === Response.HTTP_OK) {
      let segmentationName = segmentation || 'all';

      if (segmentation == 'dont_come_back_ninety') {
        if (days) {
          switch (days) {
            case '30':
              segmentationName = 'dont_come_back_thirty';
              break;

            case '60':
              segmentationName = 'dont_come_back_sixty';
              break;
      
            case '90':
              segmentationName = 'dont_come_back_ninety';
              break;
          }
        }
      }
      yield put(
        MarketingCreators.getCsvCustomersSuccess({
          segmentation: segmentationName,
          list_id: list_id,
          data: data,
        })
      );
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível efetuar o download.'
    );
    yield put(MarketingCreators.getCsvCustomersFailed());
  } finally {
    api.defaults.responseType = undefined;
  }
}

export function* createEmailCampaign(
  action: ReturnType<typeof MarketingCreators.createEmailCampaignRequest>
) {
  const { navigate } = yield getContext('router');

  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const campaign = action.payload;

    const { status } = yield call(
      api.post,
      `/marketing/v1/units/${unity.id}/campaigns/email`,
      campaign
    );

    if (status === Response.HTTP_CREATED) {
      notification.success('Campanha criada com sucesso!', '');
      yield put(MarketingCreators.createEmailCampaignSuccess());
      yield navigate(`/units/${unity.id}/marketing/campaigns/`);
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível cadastrar a campanha.'
    );
    yield put(MarketingCreators.createEmailCampaignFailed());
  }
}

export function* updateEmailCampaign(
  action: ReturnType<typeof MarketingCreators.updateEmailCampaignRequest>
) {
  try {
    const { navigate } = yield getContext('router');
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const campaign = action.payload.payload;

    const { status } = yield call(
      api.put,
      `/marketing/v1/units/${unity.id}/campaigns/email/${action.payload.id}`,
      campaign
    );

    if (status === Response.HTTP_OK) {
      notification.success('Campanha atualizada com sucesso!', '');
      yield put(MarketingCreators.updateEmailCampaignSuccess());
      yield navigate(`/units/${unity.id}/marketing/campaigns/`);
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível atualizar a campanha.'
    );
    yield put(MarketingCreators.updateEmailCampaignFailed());
  }
}

export function* deleteEmailCampaign(
  action: ReturnType<typeof MarketingCreators.deleteEmailCampaignRequest>
) {
  try {
    const { navigate } = yield getContext('router');
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { campaignId } = action.payload;

    const { status }: AxiosResponse = yield call(
      api.delete,
      `/marketing/v1/units/${unity.id}/campaigns/email/${campaignId}`
    );

    if (status === Response.NO_CONTENT) {
      yield put(MarketingCreators.deleteEmailCampaignSuccess({ campaignId }));
      notification.success('Campanha deletada com sucesso!', '');
      yield navigate(`/units/${unity.id}/marketing/campaigns`);
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível deletar a campanha selecionada'
    );
    yield put(MarketingCreators.deleteEmailCampaignFailed());
  }
}

export function* createSMSCampaign(
  action: ReturnType<typeof MarketingCreators.createSMSCampaignRequest>
) {
  try {
    const { navigate } = yield getContext('router');
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const campaign = action.payload;

    const { status } = yield call(
      api.post,
      `/marketing/v1/units/${unity.id}/campaigns/sms`,
      campaign
    );

    if (status === Response.HTTP_CREATED) {
      notification.success('Campanha criada com sucesso!', '');
      yield put(MarketingCreators.createSMSCampaignSuccess());
      yield navigate(`/units/${unity.id}/marketing/campaigns/`);
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível cadastrar a campanha.'
    );
    yield put(MarketingCreators.createSMSCampaignFailed());
  }
}

export function* updateSMSCampaign(
  action: ReturnType<typeof MarketingCreators.updateSMSCampaignRequest>
) {
  try {
    const { navigate } = yield getContext('router');

    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const campaign = action.payload.payload;

    const { status } = yield call(
      api.put,
      `/marketing/v1/units/${unity.id}/campaigns/sms/${action.payload.id}`,
      campaign
    );

    if (status === Response.HTTP_CREATED) {
      notification.success('Campanha atualizada com sucesso!', '');
      yield put(MarketingCreators.updateSMSCampaignSuccess());
      yield navigate(`/units/${unity.id}/marketing/campaigns/`);
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível atualizar a campanha.'
    );
    yield put(MarketingCreators.updateSMSCampaignFailed());
  }
}

export function* getEmailCampaigns(
  action: ReturnType<typeof MarketingCreators.getEmailCampaignsRequest>
) {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { page, campaignName, per_page } = action.payload;

    const parsedParam = Object.assign(
      {},
      page && { page: page },
      per_page && { per_page: per_page },
      campaignName && { search: campaignName }
    );

    const {
      status,
      data,
    }: AxiosResponse<GetEmailCampaignsResponse> = yield call(
      api.get,
      `/marketing/v1/units/${unity.id}/campaigns/email`,
      {
        params: parsedParam,
      }
    );

    if (status === Response.HTTP_OK) {
      yield put(MarketingCreators.getEmailCampaignsSuccess(data));
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível buscar as campanhas'
    );
    yield put(MarketingCreators.getEmailCampaignsFailed());
  }
}

export function* getSMSVariables() {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { status, data }: AxiosResponse<GetSMSVariablesResponse> = yield call(
      api.get,
      `/marketing/v1/units/${unity.id}/campaigns/sms/variables`
    );

    if (status === Response.HTTP_OK) {
      yield put(MarketingCreators.getSMSVariablesSuccess(data));
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível buscar as campanhas'
    );
    yield put(MarketingCreators.getSMSCampaignsFailed());
  }
}

export function* getSMSCampaigns(
  action: ReturnType<typeof MarketingCreators.getSMSCampaignsRequest>
) {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { page, campaignName } = action.payload;

    const parsedParam = Object.assign(
      {},
      page && { page: page },
      campaignName && { search: campaignName }
    );

    const { status, data }: AxiosResponse<GetSMSCampaignsResponse> = yield call(
      api.get,
      `/marketing/v1/units/${unity.id}/campaigns/sms`,
      {
        params: parsedParam,
      }
    );

    if (status === Response.HTTP_OK) {
      yield put(MarketingCreators.getSMSCampaignsSuccess(data));
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível buscar as campanhas'
    );
    yield put(MarketingCreators.getSMSCampaignsFailed());
  }
}

export function* getEmailCampaign(
  action: ReturnType<typeof MarketingCreators.getEmailCampaignRequest>
) {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const {
      status,
      data,
    }: AxiosResponse<GetEmailCampaignResponse> = yield call(
      api.get,
      `/marketing/v1/units/${unity.id}/campaigns/email/${action.payload.campaignId}`
    );

    if (status === Response.HTTP_OK) {
      yield put(MarketingCreators.getEmailCampaignSuccess(data));
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível solicitar os dados da campanha selecionada'
    );
    yield put(MarketingCreators.getEmailCampaignFailed());
  }
}

export function* getSMSCampaign(
  action: ReturnType<typeof MarketingCreators.getSMSCampaignRequest>
) {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { campaignId } = action.payload;

    const { status, data }: AxiosResponse<GetSMSCampaignResponse> = yield call(
      api.get,
      `/marketing/v1/units/${unity.id}/campaigns/sms/detail/${campaignId}`
    );

    if (status === Response.HTTP_OK) {
      yield put(MarketingCreators.getSMSCampaignSuccess(data));
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível solicitar os dados da campanha selecionada'
    );
    yield put(MarketingCreators.getSMSCampaignFailed());
  }
}

export function* deleteSMSCampaign(
  action: ReturnType<typeof MarketingCreators.deleteSMSCampaignRequest>
) {
  try {
    const { navigate } = yield getContext('router');
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { campaignId } = action.payload;

    const { status }: AxiosResponse = yield call(
      api.delete,
      `/marketing/v1/units/${unity.id}/campaigns/sms/${campaignId}`
    );

    if (status === Response.NO_CONTENT) {
      yield put(MarketingCreators.deleteSMSCampaignSuccess({ campaignId }));
      notification.success('Campanha deletada com sucesso!', '');
      yield navigate(`/units/${unity.id}/marketing/campaigns`);
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível deletar a campanha selecionada'
    );
    yield put(MarketingCreators.deleteSMSCampaignFailed());
  }
}

export function* sendSMSTest(
  action: ReturnType<typeof MarketingCreators.sendSMSTestRequest>
) {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { phone, text } = action.payload;

    const { status }: AxiosResponse = yield call(
      api.post,
      `/marketing/v1/units/${unity.id}/campaigns/sms/preview`,
      {
        mobile: phone,
        text,
      }
    );

    if (status === Response.NO_CONTENT) {
      yield put(MarketingCreators.sendSMSTestSuccess());
      notification.success('SMS Teste enviado com sucesso!', '');
    }
  } catch (error) {
    notification.error('Houve um erro!', 'Não foi possível enviar o SMS Teste');
    yield put(MarketingCreators.sendSMSTestFailed());
  }
}

export function* getReportSMSCampaign() {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const {
      status,
      data,
    }: AxiosResponse<GetReportSMSCampaignResponse> = yield call(
      api.get,
      `/marketing/v1/units/${unity.id}/campaigns/sms/credit/balance-report`
    );

    if (status === Response.HTTP_OK) {
      yield put(MarketingCreators.getReportSMSCampaignSuccess(data));
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível solicitar os dados de relatórios da campanha'
    );
    yield put(MarketingCreators.getReportSMSCampaignFailed());
  }
}

export function* getExampleCsvCustomersImport() {
  api.defaults.responseType = 'blob';
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const endpoint = `marketing/v1/units/${unity.id}/customers/lists/example`;

    const { status, data }: AxiosResponse<Blob> = yield call(api.get, endpoint);

    if (status === Response.HTTP_OK) {
      yield put(MarketingCreators.getCsvCustomersExampleSuccess(data));
      notification.success(
        'Download concluido',
        'O download foi realizado com sucesso'
      );
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível efetuar o download.'
    );
    yield put(MarketingCreators.getCsvCustomersExampleFailed());
  } finally {
    api.defaults.responseType = undefined;
  }
}

export function* importCustomers(
  action: ReturnType<typeof MarketingCreators.importCustomersRequest>
) {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { payload } = action;

    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('name', payload.name);

    const endpoint = `/marketing/v1/units/${unity.id}/customers/lists/import`;

    const { status, data }: AxiosResponse<ImportCustomersResponse> = yield call(
      api.post,
      endpoint,
      formData
    );
    if (status === Response.HTTP_CREATED) {
      yield put(MarketingCreators.importCustomersSuccess(data.data));
      yield put(MarketingCreators.setStepCustomersImport(4));
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;

    if (err.response?.status === Response.HTTP_REQUEST_ENTITY_TOO_LARGE) {
      notification.error(
        'Atenção!',
        'O tamanho máximo do arquivo aceito é de 1MB e/ou 1000 linhas.'
      );
    } else {
      if (err.response?.status !== Response.HTTP_BAD_REQUEST) {
        notification.error(
          'Houve um erro!',
          'Não foi possível importar os clientes do arquivo enviado.'
        );
      }
    }

    yield put(MarketingCreators.importCustomersFailed());
    yield put(MarketingCreators.setStepCustomersImport(2));
  }
}

export function* getImportCustomersErrors(
  action: ReturnType<typeof MarketingCreators.getImportCustomersErrorsRequest>
) {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { payload } = action;

    const endpoint = `/marketing/v1/units/${unity.id}/customers/lists/${payload.listId}/errors`;

    const {
      status,
      data,
    }: AxiosResponse<GetImportCustomersErrorsResponse> = yield call(
      api.get,
      endpoint
    );

    if (status === Response.HTTP_OK) {
      yield put(MarketingCreators.getImportCustomersErrorsSuccess(data));
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível identificar os erros encontrados durante o processamento do arquivo enviado'
    );
    yield put(MarketingCreators.getImportCustomersErrorsFailed());
  }
}

export function* getCsvImportCustomersErrors(
  action: ReturnType<typeof MarketingCreators.getCsvImportCustomersErrors>
) {
  api.defaults.responseType = 'blob';
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { payload } = action;

    const endpoint = `marketing/v1/units/${unity.id}/customers/lists/${payload.listId}/errors/export`;

    const { status, data }: AxiosResponse<Blob> = yield call(api.get, endpoint);

    if (status === Response.HTTP_OK) {
      yield put(MarketingCreators.getCsvImportCustomersErrorsSuccess(data));
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível efetuar o download.'
    );
    yield put(MarketingCreators.getCsvImportCustomersErrorsFailed());
  } finally {
    api.defaults.responseType = undefined;
  }
}

export function* getLists() {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const endpoint = `/marketing/v1/units/${unity.id}/customers/lists`;

    const { status, data }: AxiosResponse<GetListsResponse> = yield call(
      api.get,
      endpoint
    );

    if (status === Response.HTTP_OK) {
      yield put(MarketingCreators.getListsSuccess(data.data));
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível buscar as listas importadas'
    );
    yield put(MarketingCreators.getListsFailed());
  }
}

export function* getDetailsList(
  action: ReturnType<typeof MarketingCreators.getDetailsList>
) {
  try {
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { payload } = action;

    const endpoint = `/marketing/v1/units/${unity.id}/customers/lists/detail/${payload.listId}`;

    const { status, data }: AxiosResponse<GetDetailslistResponse> = yield call(
      api.get,
      endpoint
    );

    if (status === Response.HTTP_OK) {
      yield put(MarketingCreators.getDetailsListSuccess(data.data));
    }
  } catch (error) {
    notification.error(
      'Houve um erro!',
      'Não foi possível buscar os clientes que foram importados.'
    );
    yield put(MarketingCreators.getDetailsListFailed());
  }
}

export function* deleteList(
  action: ReturnType<typeof MarketingCreators.deleteList>
) {
  try {
    const { navigate } = yield getContext('router');
    const {
      hall: { unity },
    } = yield select((state: RootType) => state);

    const { payload } = action;

    const endpoint = `/marketing/v1/units/${unity.id}/customers/lists/${payload.listId}`;

    const { status } = yield call(api.delete, endpoint);

    if (status === Response.NO_CONTENT) {
      notification.success('Sucesso!', 'A lista selecionada foi deletada.');
      yield put(MarketingCreators.deleteListSuccess());
      yield navigate(`/units/${unity?.id}/marketing/customers`);
    }
  } catch (error) {
    notification.error('Houve um erro!', 'Não foi possível deletar a lista.');
    yield put(MarketingCreators.deleteListFailed());
  }
}

export function* getMarketingSettings() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(
      api.get,
      `/marketing/v1/units/${unity.id}/settings`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        MarketingCreators.getMarketingSettingsSuccess(response.data[0])
      );
    }
  } catch (error) {
    yield put(MarketingCreators.getMarketingSettingsFailed());
  }
}

export function* updateMarketingSettings(
  action: ReturnType<typeof MarketingCreators.updateMarketingSettingsRequest>
) {
  try {
    const {
      hall: { unity },
      marketing: { settings },
    }: RootType = yield select((state) => state);

    const { status, data: response } = yield call(
      api.put,
      `/marketing/v1/units/${unity?.id}/settings/${settings?.id}`,
      action.payload
    );

    if (status === Response.HTTP_OK) {
      yield put(
        MarketingCreators.updateMarketingSettingsSuccess(response.data)
      );

      notification.success(
        'Configurações de marketing atualizadas com sucesso!',
        ''
      );
    }
  } catch (error) {
    yield put(MarketingCreators.updateMarketingSettingsFailed());
  }
}

export default all([
  takeLatest(MarketingTypes.GET_CUSTOMERS_REQUEST, getCustomers),
  takeLatest(
    MarketingTypes.GET_FILTERED_CUSTOMERS_REQUEST,
    getFilteredCustomers
  ),
  takeLatest(MarketingTypes.GET_CSV_CUSTOMERS_REQUEST, getCsvCustomers),
  takeLatest(MarketingTypes.CREATE_EMAIL_CAMPAIGN_REQUEST, createEmailCampaign),
  takeLatest(MarketingTypes.UPDATE_EMAIL_CAMPAIGN_REQUEST, updateEmailCampaign),
  takeLatest(MarketingTypes.CREATE_SMS_CAMPAIGN_REQUEST, createSMSCampaign),
  takeLatest(MarketingTypes.UPDATE_SMS_CAMPAIGN_REQUEST, updateSMSCampaign),
  takeLatest(MarketingTypes.GET_EMAIL_CAMPAIGNS_REQUEST, getEmailCampaigns),
  takeLatest(MarketingTypes.GET_SMS_VARIABLES_REQUEST, getSMSVariables),
  takeLatest(MarketingTypes.GET_SMS_CAMPAIGNS_REQUEST, getSMSCampaigns),
  takeLatest(MarketingTypes.GET_EMAIL_CAMPAIGN_REQUEST, getEmailCampaign),
  takeLatest(MarketingTypes.GET_SMS_CAMPAIGN_REQUEST, getSMSCampaign),
  takeLatest(MarketingTypes.DELETE_SMS_CAMPAIGN_REQUEST, deleteSMSCampaign),
  takeLatest(MarketingTypes.DELETE_EMAIL_CAMPAIGN_REQUEST, deleteEmailCampaign),
  takeLatest(MarketingTypes.SEND_SMS_TEST_REQUEST, sendSMSTest),
  takeLatest(
    MarketingTypes.GET_REPORT_SMS_CAMPAIGN_REQUEST,
    getReportSMSCampaign
  ),
  takeLatest(
    MarketingTypes.GET_CSV_CUSTOMERS_EXAMPLE_REQUEST,
    getExampleCsvCustomersImport
  ),
  takeLatest(MarketingTypes.IMPORT_CUSTOMERS_REQUEST, importCustomers),
  takeLatest(
    MarketingTypes.GET_IMPORT_CUSTOMERS_ERRORS_REQUEST,
    getImportCustomersErrors
  ),
  takeLatest(
    MarketingTypes.GET_CSV_IMPORT_CUSTOMERS_ERRORS_REQUEST,
    getCsvImportCustomersErrors
  ),
  takeLatest(MarketingTypes.GET_LISTS_REQUEST, getLists),
  takeLatest(MarketingTypes.GET_DETAILS_LIST_REQUEST, getDetailsList),
  takeLatest(MarketingTypes.DELETE_LIST_REQUEST, deleteList),
  takeLatest(
    MarketingTypes.GET_MARKETING_SETTINGS_REQUEST,
    getMarketingSettings
  ),
  takeLatest(
    MarketingTypes.UPDATE_MARKETING_SETTINGS_REQUEST,
    updateMarketingSettings
  ),
]);
