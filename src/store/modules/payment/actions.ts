import { ActionCreators, createActions } from 'reduxsauce';
import { TransactionProps, type TransactionsStatusProps, SellerProps } from './reducer';
import type { Pagination } from 'src/types';

export type CreatePJSellerRequestPayload = {
  unit_id: string;
  seller_type: 'business';
  mcc: string;
  ein: string;
  business_name: string;
  business_phone: string;
  business_email: string;
  business_address: {
    line1: string;
    line2?: string;
    line3?: string;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
    country_code: string;
  };
  owner: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    birthdate: string;
    taxpayer: string;
  };
  owner_address: {
    line1: string;
    line2?: string;
    line3?: string;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
    country_code: string;
  };
};

export type CreatePFSellerRequestPayload = {
  unit_id: string;
  seller_type: 'individual';
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  taxpayer: string;
  birthdate: string;
  mcc: string;
  address: {
    line1: string;
    line2: string;
    line3: string;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
    country_code: string;
  };
};

export enum Types {
  GET_TRANSACTIONS_REQUEST = '@payment/GET_TRANSACTIONS_REQUEST',
  GET_TRANSACTIONS_SUCCESS = '@payment/GET_TRANSACTIONS_SUCCESS',
  GET_TRANSACTIONS_FAILED = '@payment/GET_TRANSACTIONS_FAILED',

  GET_TRANSACTIONS_STATUS_REQUEST = '@payment/GET_TRANSACTIONS_STATUS_REQUEST',
  GET_TRANSACTIONS_STATUS_SUCCESS = '@payment/GET_TRANSACTIONS_STATUS_SUCCESS',
  GET_TRANSACTIONS_STATUS_FAILED = '@payment/GET_TRANSACTIONS_STATUS_FAILED',

  REFUND_TRANSACTION_REQUEST = '@payment/REFUND_TRANSACTION_REQUEST',
  REFUND_TRANSACTION_SUCCESS = '@payment/REFUND_TRANSACTION_SUCCESS',
  REFUND_TRANSACTION_FAILED = '@payment/REFUND_TRANSACTION_FAILED',

  GET_SELLERS_REQUEST = '@payment/GET_SELLERS_REQUEST',
  GET_SELLERS_SUCCESS = '@payment/GET_SELLERS_SUCCESS',
  GET_SELLERS_FAILED = '@payment/GET_SELLERS_FAILED',

  GET_SELLER_REQUEST = '@payment/GET_SELLER_REQUEST',
  GET_SELLER_SUCCESS = '@payment/GET_SELLER_SUCCESS',
  GET_SELLER_FAILED = '@payment/GET_SELLER_FAILED',

  CREATE_SELLER_REQUEST = '@payment/CREATE_SELLER_REQUEST',
  CREATE_SELLER_SUCCESS = '@payment/CREATE_SELLER_SUCCESS',
  CREATE_SELLER_FAILED = '@payment/CREATE_SELLER_FAILED',

  UPDATE_SELLER_REQUEST = '@payment/UPDATE_SELLER_REQUEST',
  UPDATE_SELLER_SUCCESS = '@payment/UPDATE_SELLER_SUCCESS',
  UPDATE_SELLER_FAILED = '@payment/UPDATE_SELLER_FAILED',

  DELETE_SELLER_REQUEST = '@payment/DELETE_SELLER_REQUEST',
  DELETE_SELLER_SUCCESS = '@payment/DELETE_SELLER_SUCCESS',
  DELETE_SELLER_FAILED = '@payment/DELETE_SELLER_FAILED',

  REFRESH_SELLER_STATUS_REQUEST = '@payment/REFRESH_SELLER_STATUS_REQUEST',
  REFRESH_SELLER_STATUS_SUCCESS = '@payment/REFRESH_SELLER_STATUS_SUCCESS',
  REFRESH_SELLER_STATUS_FAILED = '@payment/REFRESH_SELLER_STATUS_FAILED',
}

interface Actions extends ActionCreators {
  getTransactionsRequest: (payload: {
    page: number;
    start_date?: string;
    end_date?: string;
    status?: string;
    transaction_id?: string;
    reservation_id?: string;
  }) => {
    type: Types.GET_TRANSACTIONS_REQUEST;
    payload: {
      page: number;
      start_date?: string;
      end_date?: string;
      status?: string;
      transaction_id?: string;
      reservation_id?: string;
    };
  };
  getTransactionsSuccess: (payload: { transactions: Array<TransactionProps>; pagination: Pagination }) => {
    type: Types.GET_TRANSACTIONS_SUCCESS;
    payload: {
      transactions: Array<TransactionProps>;
      pagination: Pagination;
    };
  };
  getTransactionsFailed: () => {
    type: Types.GET_TRANSACTIONS_FAILED;
  };

  getTransactionsStatusRequest: () => {
    type: Types.GET_TRANSACTIONS_STATUS_REQUEST;
  };
  getTransactionsStatusSuccess: (payload: Array<TransactionsStatusProps>) => {
    type: Types.GET_TRANSACTIONS_STATUS_SUCCESS;
    payload: Array<TransactionsStatusProps>;
  };
  getTransactionsStatusFailed: () => {
    type: Types.GET_TRANSACTIONS_STATUS_FAILED;
  };

  refundTransactionRequest: (payload: { transactionId: string }) => {
    type: Types.REFUND_TRANSACTION_REQUEST;
    payload: {
      transactionId: string;
    };
  };
  refundTransactionSuccess: (payload: { transactionId: string }) => {
    type: Types.REFUND_TRANSACTION_SUCCESS;
    payload: {
      transactionId: string;
    };
  };
  refundTransactionFailed: () => {
    type: Types.REFUND_TRANSACTION_FAILED;
  };

  getSellersRequest: (payload: { page: number; unit_id?: string; status?: string; seller_type?: string }) => {
    type: Types.GET_SELLERS_REQUEST;
    payload: { page: number; unit_id?: string; status?: string; seller_type?: string };
  };
  getSellersSuccess: (payload: { sellers: SellerProps[]; pagination: Pagination }) => {
    type: Types.GET_SELLERS_SUCCESS;
    payload: {
      sellers: SellerProps[];
      pagination: Pagination;
    };
  };
  getSellersFailed: () => {
    type: Types.GET_SELLERS_FAILED;
  };

  getSellerRequest: (payload: { sellerId: string }) => {
    type: Types.GET_SELLER_REQUEST;
    payload: { sellerId: string };
  };
  getSellerSuccess: (payload: { seller: SellerProps }) => {
    type: Types.GET_SELLER_SUCCESS;
    payload: { seller: SellerProps };
  };
  getSellerFailed: () => {
    type: Types.GET_SELLER_FAILED;
  };

  createSellerRequest: (
    payload: CreatePJSellerRequestPayload | CreatePFSellerRequestPayload,
    onSuccess: (seller: SellerProps) => void,
  ) => {
    type: Types.CREATE_SELLER_REQUEST;
    payload: CreatePJSellerRequestPayload | CreatePFSellerRequestPayload;
    onSuccess: (seller: SellerProps) => void;
  };
  createSellerSuccess: (payload: { seller: SellerProps }) => {
    type: Types.CREATE_SELLER_SUCCESS;
    payload: { seller: SellerProps };
  };
  createSellerFailed: () => {
    type: Types.CREATE_SELLER_FAILED;
  };

  updateSellerRequest: (payload: {
    sellerId: string;
    data: Partial<CreatePJSellerRequestPayload | CreatePFSellerRequestPayload>;
  }) => {
    type: Types.UPDATE_SELLER_REQUEST;
    payload: { sellerId: string; data: Partial<CreatePJSellerRequestPayload | CreatePFSellerRequestPayload> };
  };
  updateSellerSuccess: (payload: { seller: SellerProps }) => {
    type: Types.UPDATE_SELLER_SUCCESS;
    payload: { seller: SellerProps };
  };
  updateSellerFailed: () => {
    type: Types.UPDATE_SELLER_FAILED;
  };

  deleteSellerRequest: (payload: { sellerId: string; onSuccess?: () => void }) => {
    type: Types.DELETE_SELLER_REQUEST;
    payload: { sellerId: string; onSuccess?: () => void };
  };
  deleteSellerSuccess: (payload: { sellerId: string }) => {
    type: Types.DELETE_SELLER_SUCCESS;
    payload: { sellerId: string };
  };
  deleteSellerFailed: () => {
    type: Types.DELETE_SELLER_FAILED;
  };

  refreshSellerStatusRequest: (payload: { sellerId: string }) => {
    type: Types.REFRESH_SELLER_STATUS_REQUEST;
    payload: { sellerId: string };
  };
  refreshSellerStatusSuccess: (payload: {
    sellerId: string;
    status: string;
    documents: Array<{ id: string; status: string }>;
  }) => {
    type: Types.REFRESH_SELLER_STATUS_SUCCESS;
    payload: { sellerId: string; status: string; documents: Array<{ id: string; status: string }> };
  };
  refreshSellerStatusFailed: () => {
    type: Types.REFRESH_SELLER_STATUS_FAILED;
  };
}

const CreatedActions = createActions(
  {
    getTransactionsRequest: ['payload'],
    getTransactionsSuccess: ['payload'],
    getTransactionsFailed: [],

    getTransactionsStatusRequest: [],
    getTransactionsStatusSuccess: ['payload'],
    getTransactionsStatusFailed: [],

    refundTransactionRequest: ['payload'],
    refundTransactionSuccess: ['payload'],
    refundTransactionFailed: [],

    getSellersRequest: ['payload'],
    getSellersSuccess: ['payload'],
    getSellersFailed: [],

    getSellerRequest: ['payload'],
    getSellerSuccess: ['payload'],
    getSellerFailed: [],

    createSellerRequest: ['payload', 'onSuccess'],
    createSellerSuccess: ['payload'],
    createSellerFailed: [],

    updateSellerRequest: ['payload'],
    updateSellerSuccess: ['payload'],
    updateSellerFailed: [],

    deleteSellerRequest: ['payload'],
    deleteSellerSuccess: ['payload'],
    deleteSellerFailed: [],

    refreshSellerStatusRequest: ['payload'],
    refreshSellerStatusSuccess: ['payload'],
    refreshSellerStatusFailed: [],
  },
  {
    prefix: '@payment/',
  },
);

export const PaymentCreators = CreatedActions.Creators as Actions;
