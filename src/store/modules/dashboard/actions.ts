import { ActionCreators, createActions } from 'reduxsauce';
import {
  GeneralReportProps,
  CommunicationDashboardProps,
  SalesSummary,
  SalesDetails,
  SalesDetailsPaginationProps,
  SalesFilter,
  type AccountingReport,
} from './reducer';
import type { Pagination } from 'src/types';

export enum Types {
  GET_DASHBOARD_DATA_REQUEST = '@dashboard/GET_DASHBOARD_DATA_REQUEST',
  GET_DASHBOARD_DATA_SUCCESS = '@dashboard/GET_DASHBOARD_DATA_SUCCESS',
  GET_DASHBOARD_DATA_FAILED = '@dashboard/GET_DASHBOARD_DATA_FAILED',

  GET_DASHBOARD_COMUNICATION_DATA_REQUEST = '@dashboard/GET_DASHBOARD_COMUNICATION_DATA_REQUEST',
  GET_DASHBOARD_COMUNICATION_DATA_SUCCESS = '@dashboard/GET_DASHBOARD_COMUNICATION_DATA_SUCCESS',
  GET_DASHBOARD_COMUNICATION_DATA_FAILED = '@dashboard/GET_DASHBOARD_COMUNICATION_DATA_FAILED',

  GET_DASHBOARD_SALES_SUMMARY_REQUEST = '@dashboard/GET_DASHBOARD_SALES_SUMMARY_REQUEST',
  GET_DASHBOARD_SALES_SUMMARY_SUCCESS = '@dashboard/GET_DASHBOARD_SALES_SUMMARY_SUCCESS',
  GET_DASHBOARD_SALES_SUMMARY_FAILED = '@dashboard/GET_DASHBOARD_SALES_SUMMARY_FAILED',

  GET_DASHBOARD_SALES_DETAILS_REQUEST = '@dashboard/GET_DASHBOARD_SALES_DETAILS_REQUEST',
  GET_DASHBOARD_SALES_DETAILS_SUCCESS = '@dashboard/GET_DASHBOARD_SALES_DETAILS_SUCCESS',
  GET_DASHBOARD_SALES_DETAILS_FAILED = '@dashboard/GET_DASHBOARD_SALES_DETAILS_FAILED',

  GET_DASHBOARD_ACCOUNTING_REQUEST = '@dashboard/GET_DASHBOARD_ACCOUNTING_REQUEST',
  GET_DASHBOARD_ACCOUNTING_SUCCESS = '@dashboard/GET_DASHBOARD_ACCOUNTING_SUCCESS',
  GET_DASHBOARD_ACCOUNTING_FAILED = '@dashboard/GET_DASHBOARD_ACCOUNTING_FAILED',

  EXPORT_ACCOUNT_REPORT_REQUEST = '@dashboard/EXPORT_ACCOUNT_REPORT_REQUEST',
  EXPORT_ACCOUNT_REPORT_SUCCESS = '@dashboard/EXPORT_ACCOUNT_REPORT_SUCCESS',
  EXPORT_ACCOUNT_REPORT_FAILED = '@dashboard/EXPORT_ACCOUNT_REPORT_FAILED',

  GET_SALES_CSV_DATA_REQUEST = '@dashboard/GET_SALES_CSV_DATA_REQUEST',
  GET_SALES_CSV_DATA_SUCCESS = '@dashboard/GET_SALES_CSV_DATA_SUCCESS',
  GET_SALES_CSV_DATA_FAILED = '@dashboard/GET_SALES_CSV_DATA_FAILED',

  UPDATE_SALES_FILTER = '@dashboard/UPDATE_SALES_FILTER',
}

interface Actions extends ActionCreators {
  getDashboardDataRequest: (payload: {
    unity_id: string;
    startAt?: string;
    endAt?: string;
    dateFilter?: {
      startAt: Date;
      endAt: Date;
    };
  }) => {
    type: Types.GET_DASHBOARD_DATA_REQUEST;
    payload: {
      unity_id: string;
      startAt?: string;
      endAt?: string;
      dateFilter?: {
        startAt: Date;
        endAt: Date;
      };
    };
  };
  getDashboardDataSuccess: (payload: GeneralReportProps) => {
    type: Types.GET_DASHBOARD_DATA_SUCCESS;
    payload: GeneralReportProps;
  };
  getDashboardDataFailed: () => {
    type: Types.GET_DASHBOARD_DATA_FAILED;
  };

  getDashboardComunicationDataRequest: (payload: {
    unity_id: string;
    startAt?: string;
    endAt?: string;
    dateFilter?: {
      startAt: Date;
      endAt: Date;
    };
  }) => {
    type: Types.GET_DASHBOARD_COMUNICATION_DATA_REQUEST;
    payload: {
      unity_id: string;
      startAt?: string;
      endAt?: string;
      dateFilter?: {
        startAt: Date;
        endAt: Date;
      };
    };
  };
  getDashboardComunicationDataSuccess: (payload: { comunication: CommunicationDashboardProps }) => {
    type: Types.GET_DASHBOARD_COMUNICATION_DATA_SUCCESS;
    payload: {
      comunication: CommunicationDashboardProps;
    };
  };
  getDashboardComunicationDataFailed: () => {
    type: Types.GET_DASHBOARD_COMUNICATION_DATA_FAILED;
  };

  getDashboardSalesSummaryRequest: () => {
    type: Types.GET_DASHBOARD_SALES_SUMMARY_REQUEST;
  };
  getDashboardSalesSummarySuccess: (payload: { salesSummary: SalesSummary }) => {
    type: Types.GET_DASHBOARD_SALES_SUMMARY_SUCCESS;
    payload: {
      salesSummary: SalesSummary;
    };
  };
  getDashboardSalesSummaryFailed: () => {
    type: Types.GET_DASHBOARD_SALES_SUMMARY_FAILED;
  };

  getDashboardAccountingRequest: (payload?: { page?: number; perPage?: number }) => {
    type: Types.GET_DASHBOARD_ACCOUNTING_REQUEST;
    payload?: {
      page?: number;
      perPage?: number;
    };
  };
  getDashboardAccountingSuccess: (payload: { data: AccountingReport; pagination: Pagination }) => {
    type: Types.GET_DASHBOARD_ACCOUNTING_SUCCESS;
    payload: { data: AccountingReport; pagination: Pagination };
  };
  getDashboardAccountingFailed: () => {
    type: Types.GET_DASHBOARD_ACCOUNTING_FAILED;
  };

  exportAccountReportRequest: () => {
    type: Types.EXPORT_ACCOUNT_REPORT_REQUEST;
  };
  exportAccountReportSuccess: () => {
    type: Types.EXPORT_ACCOUNT_REPORT_SUCCESS;
  };
  exportAccountReportFailed: () => {
    type: Types.EXPORT_ACCOUNT_REPORT_FAILED;
  };

  getDashboardSalesDetailsRequest: (payload: { page?: number; perPage?: number; exportReport?: boolean }) => {
    type: Types.GET_DASHBOARD_SALES_DETAILS_REQUEST;
    payload: { page?: number; perPage?: number; exportReport?: boolean };
  };
  getDashboardSalesDetailsSuccess: (payload: {
    salesDetails: SalesDetails;
    salesDetailsPagination: SalesDetailsPaginationProps;
  }) => {
    type: Types.GET_DASHBOARD_SALES_DETAILS_SUCCESS;
    payload: {
      salesDetails: SalesDetails;
      salesDetailsPagination: SalesDetailsPaginationProps;
    };
  };
  getDashboardSalesDetailsFailed: () => {
    type: Types.GET_DASHBOARD_SALES_DETAILS_FAILED;
  };

  getSalesCsvDataSuccess: (payload: { salesCsv: Blob }) => {
    type: Types.GET_SALES_CSV_DATA_SUCCESS;
    payload: {
      salesCsv: Blob;
    };
  };
  getSalesCsvDataFailed: () => {
    type: Types.GET_SALES_CSV_DATA_FAILED;
  };

  updateSalesFilter: (payload: SalesFilter) => {
    type: Types.UPDATE_SALES_FILTER;
    payload: SalesFilter;
  };
}

const CreatedActions = createActions(
  {
    getDashboardDataRequest: ['payload'],
    getDashboardDataSuccess: ['payload'],
    getDashboardDataFailed: [],

    getDashboardComunicationDataRequest: ['payload'],
    getDashboardComunicationDataSuccess: ['payload'],
    getDashboardComunicationDataFailed: [],

    getDashboardSalesSummaryRequest: [],
    getDashboardSalesSummarySuccess: ['payload'],
    getDashboardSalesSummaryFailed: [],

    getDashboardSalesDetailsRequest: ['payload'],
    getDashboardSalesDetailsSuccess: ['payload'],
    getDashboardSalesDetailsFailed: [],

    getDashboardAccountingRequest: ['payload'],
    getDashboardAccountingSuccess: ['payload'],
    getDashboardAccountingFailed: [],

    exportAccountReportRequest: [],
    exportAccountReportSuccess: [],
    exportAccountReportFailed: [],

    getSalesCsvDataRequest: ['payload'],
    getSalesCsvDataSuccess: ['payload'],
    getSalesCsvDataFailed: [],

    updateSalesFilter: ['payload'],
  },
  {
    prefix: '@dashboard/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
