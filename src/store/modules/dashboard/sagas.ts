import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import { Types as DashboardTypes, Creators as DashboardCreators } from './actions';
import { SalesFilter } from './reducer';
import { RootType } from 'src/store/modules/rootReducer';
import api from 'src/services/api';
import * as Response from 'src/utils/response';
import { AxiosError } from 'axios';
import { message } from 'antd';
import { notification } from 'src/utils/helpers';

type GetSalesUrlProps = {
  type: 'summary' | 'details';
  unity: { id: string };
  startDate: string;
  endDate: string;
  experienceId: string | null;
  paymentType: SalesFilter['paymentType'];
  visibility: SalesFilter['visibility'];
  exportReport?: boolean;
  pagination?: {
    page: number;
    perPage: number;
  };
};

const getSalesUrl = (props: GetSalesUrlProps) => {
  const { type, unity, startDate, endDate, experienceId, paymentType, exportReport, visibility, pagination } = props;

  let url = `/reservation/v1/units/${unity.id}/reports/sales/${type}?start_date=${startDate}&end_date=${endDate}`;

  if (pagination !== undefined && exportReport === false) {
    url += `&page=${pagination.page}&per_page=${pagination.perPage}`;
  }

  if ((experienceId || null) !== null) {
    url += `&experience_id=${experienceId}`;
  }

  if ((paymentType || null) !== null) {
    url += `&payment_type=${paymentType}`;
  }

  if (exportReport === true && type === 'details') {
    url += '&export=true';
  }

  function updateListParam(param: string, listType: { [key: string]: boolean }): string | null {
    const types: string[] = [];

    for (const key in listType) {
      if (listType[key] === true) {
        types.push(key);
      }
    }

    if (Object.values(listType).every((value) => value === true)) {
      return null;
    }

    if (types.length === 0) {
      return null;
    }

    return `${param}${types.join(',')}`;
  }

  url += updateListParam('&reserve_type=', visibility) || '';

  return url;
};

export function* getDashboardData(action: ReturnType<typeof DashboardCreators.getDashboardDataRequest>) {
  const {
    payload: { unity_id, startAt, endAt },
  } = action;
  try {
    const { status, data: response } = yield call(
      api.get,
      `/restaurant/v1/units/${unity_id}/reports/general${
        startAt !== undefined ? `?start_date=${startAt}${endAt !== undefined ? `&end_date=${endAt}` : ''}` : ''
      }`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        DashboardCreators.getDashboardDataSuccess({
          reservation: response.data.reservation,
          line: response.data.line,
          seated_people_total: response.data.seated_people_total,
          walkin: response.data.walkin,
        })
      );
    }
  } catch (error) {
    yield put(DashboardCreators.getDashboardDataFailed());
  }
}

export function* getDashboardComunication(
  action: ReturnType<typeof DashboardCreators.getDashboardComunicationRequest>
) {
  const {
    payload: { unity_id, startAt, endAt },
  } = action;
  try {
    const { status, data: response } = yield call(
      api.get,
      `/message/v1/units/${unity_id}/reports/general${
        startAt !== undefined ? `?start_date=${startAt}${endAt !== undefined ? `&end_date=${endAt}` : ''}` : ''
      }`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        DashboardCreators.getDashboardComunicationDataSuccess({
          comunication: response.data,
        })
      );
    }
  } catch (error) {
    yield put(DashboardCreators.getDashboardComunicationDataFailed());
  }
}

export function* getDashboardSalesSummary() {
  const { unity } = yield select((state: RootType) => state.hall);
  const {
    salesFilter: { startDate, endDate, experienceId, paymentType, visibility },
  } = yield select((state: RootType) => state.dashboard);

  const salesSummaryUrl = getSalesUrl({
    type: 'summary',
    unity,
    startDate,
    endDate,
    experienceId,
    paymentType,
    visibility,
  });

  try {
    const { status, data: response } = yield call(api.get, salesSummaryUrl);

    if (status === Response.HTTP_OK) {
      yield put(
        DashboardCreators.getDashboardSalesSummarySuccess({
          salesSummary: response.data,
        })
      );
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    message.error(
      err.response?.data?.message ||
        'Desculpe, houve algum problema ao buscar os dados de vendas, por favor, tente novamente.'
    );

    yield put(DashboardCreators.getDashboardSalesSummaryFailed());
  }
}

export function* getDashboardSalesDetails(
  action: ReturnType<typeof DashboardCreators.getDashboardSalesDetailsRequest>
) {
  const { page = 1, perPage = 15, exportReport = false } = action.payload;
  const { unity } = yield select((state: RootType) => state.hall);
  const {
    salesFilter: { startDate, endDate, experienceId, paymentType, visibility },
  } = yield select((state: RootType) => state.dashboard);

  const salesDetailsUrl = getSalesUrl({
    type: 'details',
    unity,
    startDate,
    endDate,
    experienceId,
    paymentType,
    visibility,
    exportReport,
    pagination: {
      page,
      perPage,
    },
  });

  try {
    const { status, data: response } = yield call(api.get, salesDetailsUrl);

    if (status === Response.HTTP_OK) {
      if (exportReport === true) {
        yield put(
          DashboardCreators.getSalesCsvDataSuccess({
            salesCsv: response,
          })
        );
      } else {
        yield put(
          DashboardCreators.getDashboardSalesDetailsSuccess({
            salesDetails: response.data,
            salesDetailsPagination: response.pagination,
          })
        );
      }
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    message.error(
      err.response?.data?.message || exportReport === true
        ? 'Desculpe, houve algum problema ao tentar exportar os dados do relatório detalhado de vendas, por favor, tente novamente.'
        : 'Desculpe, houve algum problema ao buscar os dados do relatório detalhado de vendas, por favor, tente novamente.'
    );

    yield put(DashboardCreators.getDashboardSalesDataFailed());
  }
}

export function* getDashboardAccounting(action: ReturnType<typeof DashboardCreators.getDashboardAccountingRequest>) {
  try {
    const { payload } = action;
    const {
      hall: { unity },
      dashboard: { salesFilter },
    }: RootType = yield select((state) => state);

    const { status, data: response } = yield call(
      api.get,
      `/payment/v1/units/${unity?.id}/reports/accounting?start_date=${salesFilter.startDate}&end_date=${
        salesFilter.endDate
      }&page=${payload?.page || 1}&per_page=${payload?.perPage || 15}`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        DashboardCreators.getDashboardAccountingSuccess({
          data: response.data,
          pagination: response.pagination,
        })
      );
    }
  } catch (error) {
    yield put(DashboardCreators.getDashboardAccountingFailed());
  }
}

export function* exportAccountingReport() {
  try {
    const {
      hall: { unity },
      dashboard: { salesFilter },
    }: RootType = yield select((state) => state);

    const { status } = yield call(api.post, `/payment/v1/units/${unity?.id}/reports/export`, {
      type: 'accounting',
      start_date: salesFilter.startDate,
      end_date: salesFilter.endDate,
    });

    if (status === Response.HTTP_CREATED) {
      yield put(DashboardCreators.exportAccountReportSuccess());
      notification.success(
        'Solicitação de exportação feita com sucesso',
        'Você receberá o relatório no seu email assim que estiver pronto.'
      );
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    notification.error(
      err.response?.data?.message ||
        'Ocorreu algum erro na solicitação de exportação do relatório, tente novamente mais tarde.',
      ''
    );
    yield put(DashboardCreators.exportAccountReportFailed());
  }
}

export default all([
  takeLatest(DashboardTypes.GET_DASHBOARD_DATA_REQUEST, getDashboardData),
  takeLatest(DashboardTypes.GET_DASHBOARD_COMUNICATION_DATA_REQUEST, getDashboardComunication),
  takeLatest(DashboardTypes.GET_DASHBOARD_SALES_SUMMARY_REQUEST, getDashboardSalesSummary),
  takeLatest(DashboardTypes.GET_DASHBOARD_SALES_DETAILS_REQUEST, getDashboardSalesDetails),
  takeLatest(DashboardTypes.GET_DASHBOARD_ACCOUNTING_REQUEST, getDashboardAccounting),
  takeLatest(DashboardTypes.EXPORT_ACCOUNT_REPORT_REQUEST, exportAccountingReport),
]);
