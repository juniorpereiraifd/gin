import produce from 'immer';
import { Types as DashboardTypes } from './actions';
import type { Pagination } from 'src/types';

export type AccountingTransaction = {
  code: string;
  date: string;
  fees: string;
  amount: string;
  split_rules: {
    percentage: string;
    receivable_amount: string;
  };
  payment_method: {
    type: 'pix' | 'credit';
    card_number: string;
    holder_name: string;
    authorization_code: string;
  };
  received_amount: number;
};

export type AccountingReport = {
  code: string;
  date: string;
  amount: number;
  currency: string;
  transaction: AccountingTransaction[];
};

type ReserveType = 'experience' | 'schedule' | 'noshow';

export type PaymentType = 'credit' | 'pix';

export const REPORTS_STATUS = ['visible', 'maintenance', 'disabled'] as const;

export type SalesSummary = {
  amount_total: number;
  sales_total: number;
  sales_by_type: {
    type: ReserveType;
    amount: string;
    quantity: 4;
  }[];
};

export type SalesDetails = {
  name: string;
  amount: number;
  date: string;
  time: string;
  transaction_date: string;
  payment_type: PaymentType;
};

export type SalesDetailsPaginationProps = {
  current_page: number;
  is_last_page: boolean;
  last_page: number;
  next_page: number;
  per_page: number;
  total: number;
};

export type SalesFilter = {
  startDate: string | null;
  endDate: string | null;
  experienceId: string | null;
  paymentType: PaymentType | null;
  visibility: {
    experience: boolean;
    schedule: boolean;
    noshow: boolean;
  };
};

export type GeneralReportProps = {
  seated_people_total: number;
  reservation: ReservationDashboardProps;
  line: LineDashboardProps;
  walkin: WalkinDashboardProps;
};

export type Daily = {
  date: string;
  seated_people_total: string;
  table_size: {
    size: string;
    total_seated: number;
  }[];
};

type DailyLineTotal = Daily & {
  seated_total: number;
};

export type TableSize = {
  size: string;
  total_seated: number;
};

export type LineDashboardProps = {
  seated_total: number;
  seated_people_total: number;
  seated_people_getin: number;
  line_total: number;
  people_total: number;
  waiting_time_average: number;
  people_average: number;
  billing: number;
  canceled_people_total: number;
  non_attendance_total: number;
  daily_line_total: DailyLineTotal[];
  line_total_by_weekday: {
    weekday: number;
    seated_total: string;
    seated_people_total: string;
  }[];
  table_size: TableSize[];
};

type DailyReservationTotal = Daily & {
  seated_reservation_total: number;
};

export type ReservationDashboardProps = {
  seated_people_total: number;
  seated_people_getin: number;
  reservation_total: number;
  people_average: number;
  people_total: number;
  billing: number;
  future_reservation_total: number;
  reservation_without_updating: number;
  canceled_people_total: number;
  canceled_total: number;
  unupdated_people_total: number;
  non_attendance_people_total: number;
  non_attendance_total: number;
  daily_reservation_total: DailyReservationTotal[];
  reservation_average_by_weekday: {
    weekday: number;
    seated_reservation_total: string;
    seated_people_total: string;
  }[];
  table_size: TableSize[];
};

type DailyWalkinTotal = Daily & {
  seated_walkin_total: number;
};

export type WalkinDashboardProps = {
  people_average: 0;
  seated_walkin_total: 0;
  seated_people_total: 0;
  daily: DailyWalkinTotal[];
  average_by_weekday: {
    weekday: number;
    seated_walkin_total: string;
    seated_people_total: string;
  }[];
  table_size: TableSize[];
};

export type AmountComunication = {
  email: number;
  sms: number;
  whatsapp: number;
  daily: {
    date: string;
    email_total: number;
    sms_total: number;
    whatsapp_total: number;
  }[];
};

export type CommunicationDashboardProps = {
  reservation: AmountComunication;
  line: AmountComunication;
  marketing: AmountComunication;
  nps: AmountComunication;
  giftback: AmountComunication;
};

export type DashboardProps = {
  saving: boolean;
  loading: boolean;
  loadingCommunication: boolean;
  loadingSalesSummary: boolean;
  loadingSalesDetails: boolean;
  loadingSalesCsv: boolean;
  errors: {
    name: string;
    errors: string[];
  }[];
  line: LineDashboardProps | null;
  reservation: ReservationDashboardProps | null;
  walkin: WalkinDashboardProps | null;
  dateFilterCustomerFlow: {
    startAt: Date;
    endAt: Date;
  } | null;
  communication: CommunicationDashboardProps | null;
  dateFilterCommunication: {
    startAt: Date;
    endAt: Date;
  } | null;
  salesFilter: SalesFilter;
  salesSummary: SalesSummary | null;
  salesDetails: SalesDetails[] | null;
  salesDetailsPagination: SalesDetailsPaginationProps | null;
  salesCsv: Blob | null;
  seated_people_total: number | null;
  loadingAccountingReportData: boolean;
  accountingReportData: AccountingReport[] | null;
  accountingReportDataPagination: Pagination | null;
  loadingExportAccountingReport: boolean;
};

export const INITIAL_STATE: DashboardProps = {
  saving: false,
  loading: true,
  loadingCommunication: true,
  loadingSalesSummary: true,
  loadingSalesDetails: true,
  loadingSalesCsv: false,
  errors: [],
  line: null,
  reservation: null,
  walkin: null,
  dateFilterCustomerFlow: null,
  communication: null,
  dateFilterCommunication: null,
  salesFilter: {
    startDate: null,
    endDate: null,
    experienceId: null,
    paymentType: null,
    visibility: {
      experience: true,
      schedule: true,
      noshow: true,
    },
  },
  salesSummary: null,
  salesDetails: null,
  salesDetailsPagination: null,
  salesCsv: null,
  seated_people_total: null,
  loadingAccountingReportData: false,
  accountingReportData: null,
  accountingReportDataPagination: null,
  loadingExportAccountingReport: false,
};

const dashboard = produce((draft: DashboardProps, action) => {
  switch (action.type) {
    case DashboardTypes.GET_DASHBOARD_DATA_REQUEST:
      draft.loading = true;
      draft.errors = [];
      draft.dateFilterCustomerFlow = action.payload.dateFilter;
      break;
    case DashboardTypes.GET_DASHBOARD_DATA_SUCCESS:
      draft.loading = false;
      draft.line = action.payload.line;
      draft.reservation = action.payload.reservation;
      draft.walkin = action.payload.walkin;
      draft.seated_people_total = action.payload.seated_people_total;
      break;
    case DashboardTypes.GET_DASHBOARD_DATA_FAILED:
      draft.loading = false;
      break;

    case DashboardTypes.GET_DASHBOARD_COMUNICATION_DATA_REQUEST:
      draft.loadingCommunication = true;
      draft.errors = [];
      draft.dateFilterCommunication = action.payload.dateFilter;
      break;
    case DashboardTypes.GET_DASHBOARD_COMUNICATION_DATA_SUCCESS:
      draft.loadingCommunication = false;

      draft.communication = action.payload.comunication;
      break;
    case DashboardTypes.GET_DASHBOARD_COMUNICATION_DATA_FAILED:
      draft.loadingCommunication = false;
      break;

    case DashboardTypes.GET_DASHBOARD_SALES_SUMMARY_REQUEST:
      draft.loadingSalesSummary = true;
      draft.errors = [];
      break;
    case DashboardTypes.GET_DASHBOARD_SALES_SUMMARY_SUCCESS:
      draft.loadingSalesSummary = false;
      draft.salesSummary = action.payload.salesSummary;
      break;
    case DashboardTypes.GET_DASHBOARD_SALES_SUMMARY_FAILED:
      draft.loadingSalesSummary = false;
      break;

    case DashboardTypes.GET_DASHBOARD_SALES_DETAILS_REQUEST:
      if (action.payload.exportReport === true) {
        draft.loadingSalesCsv = true;
      } else {
        draft.loadingSalesDetails = true;
      }
      draft.errors = [];
      break;
    case DashboardTypes.GET_DASHBOARD_SALES_DETAILS_SUCCESS:
      draft.loadingSalesDetails = false;
      draft.salesDetails = action.payload.salesDetails;
      draft.salesDetailsPagination = action.payload.salesDetailsPagination;
      break;
    case DashboardTypes.GET_DASHBOARD_SALES_DETAILS_FAILED:
      draft.loadingSalesDetails = false;
      break;

    case DashboardTypes.GET_SALES_CSV_DATA_REQUEST:
      draft.loadingSalesCsv = true;
      draft.errors = [];
      break;
    case DashboardTypes.GET_SALES_CSV_DATA_SUCCESS:
      draft.loadingSalesCsv = false;
      draft.salesCsv = action.payload.salesCsv;
      break;
    case DashboardTypes.GET_SALES_CSV_DATA_FAILED:
      draft.loadingSalesCsv = false;
      break;

    case DashboardTypes.UPDATE_SALES_FILTER:
      draft.salesFilter = action.payload;
      break;

    case DashboardTypes.GET_DASHBOARD_ACCOUNTING_REQUEST:
      draft.loadingAccountingReportData = true;
      break;
    case DashboardTypes.GET_DASHBOARD_ACCOUNTING_SUCCESS:
      draft.loadingAccountingReportData = false;
      draft.accountingReportData = action.payload.data;
      draft.accountingReportDataPagination = action.payload.pagination;
      break;
    case DashboardTypes.GET_DASHBOARD_ACCOUNTING_FAILED:
      draft.loadingAccountingReportData = false;
      break;

    case DashboardTypes.EXPORT_ACCOUNT_REPORT_REQUEST:
      draft.loadingExportAccountingReport = true;
      break;
    case DashboardTypes.EXPORT_ACCOUNT_REPORT_SUCCESS:
      draft.loadingExportAccountingReport = false;
      break;
    case DashboardTypes.EXPORT_ACCOUNT_REPORT_FAILED:
      draft.loadingExportAccountingReport = false;
      break;
  }
}, INITIAL_STATE);

export default dashboard;
