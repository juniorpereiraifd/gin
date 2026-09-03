import produce from 'immer';
import { Types as PaymentTypes } from './actions';
import { type Pagination } from 'src/types';

export type TransactionPaymentType = 'pix' | 'credit';

export type TransactionsStatusProps = {
  key: string;
  name: string;
};

export type TransactionProps = {
  id: string;
  payer: {
    name: string;
    identification: string;
  };
  type: TransactionPaymentType;
  amount: number;
  status: string;
  created_at: string;
};

export type SellerType = 'individual' | 'business';

export type BusinessMetadata = {
  business_name: string;
  business_email: string;
  business_phone: string;
  business_description: string;
  ein: string;
  business_address: {
    city: string;
    line1: string;
    line2: string;
    line3: string;
    state: string;
    postal_code: string;
    country_code: string;
    neighborhood: string;
  };
  business_website: string;
  business_twitter: string;
  business_facebook: string;
  statement_descriptor: string;
  business_revenue: number;
  business_opening_date: string;
  owner: {
    birthdate: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    taxpayer: string;
    revenue: string;
    address: {
      city: string;
      line1: string;
      line2: string;
      line3: string;
      state: string;
      postal_code: string;
      country_code: string;
      neighborhood: string;
    };
  };
};

export type PersonalMetadata = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  document_number: string;
  birthdate: string;
  address: {
    city: string;
    line1: string;
    line2: string;
    line3: string;
    state: string;
    postal_code: string;
    country_code: string;
    neighborhood: string;
  };
};

export type SellerDocumentStatus = 'pending' | 'approved' | 'rejected';

export type SellerStatus = 'pending' | 'enabled' | 'denied';

export type SellerProps = {
  id: string;
  unit_id: string;
  provider: string;
  external_reference: string;
  seller_type: SellerType;
  status: SellerStatus;
  metadata: Partial<BusinessMetadata> &
    Partial<PersonalMetadata> & {
      id: string;
      mcc: string;
      uri: string;
      type: SellerType;
      status: string;
      revenue: number;
      metadata: unknown[];
      resource: string;
      deliquent: boolean;
      is_mobile: boolean;
      created_at: string;
      updated_at: string;
      taxpayer: string;
      denied_reasons: unknown[];
      marketplace_id: string;
      account_balance: number;
      current_balance: number;
      document_number: string;
      show_profile_online: boolean;
      decline_on_fail_zipcode: boolean;
      decline_on_fail_security_code: boolean;
    };
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  documents: Array<{
    id: string;
    seller_credentialing_id: string;
    unit_id: string;
    category: string;
    file_path: string;
    status: SellerDocumentStatus;
    metadata: {
      id: string;
      status: string;
      category: string;
      uploaded_at: string;
    };
    created_at: string;
    updated_at: string;
  }>;
};

export type PaymentProps = {
  loading: boolean;
  loadingSeller: boolean;
  saving: boolean;
  updating: boolean;
  deleting: boolean;
  refreshingStatus: boolean;
  sellers: SellerProps[];
  sellersPagination: Pagination | null;
  selectedSeller: SellerProps | null;
  loadingTransactions: boolean;
  loadingTransactionsStatus: boolean;
  savingRefund: boolean;
  transactions: Array<TransactionProps>;
  transactionsStatus: Array<TransactionsStatusProps>;
  pagination: Pagination | null;
};

export const INITIAL_STATE: PaymentProps = {
  loading: false,
  loadingSeller: false,
  saving: false,
  updating: false,
  deleting: false,
  refreshingStatus: false,
  sellers: [],
  sellersPagination: null,
  selectedSeller: null,
  loadingTransactions: false,
  loadingTransactionsStatus: false,
  savingRefund: false,
  transactions: [],
  transactionsStatus: [],
  pagination: null,
};

const payment = produce((draft: PaymentProps, action) => {
  switch (action.type) {
    case PaymentTypes.GET_TRANSACTIONS_REQUEST:
      draft.loadingTransactions = true;
      break;
    case PaymentTypes.GET_TRANSACTIONS_SUCCESS:
      draft.loadingTransactions = false;
      draft.transactions = action.payload.transactions;
      draft.pagination = action.payload.pagination;
      break;
    case PaymentTypes.GET_TRANSACTIONS_FAILED:
      draft.loadingTransactions = false;
      break;

    case PaymentTypes.GET_TRANSACTIONS_STATUS_REQUEST:
      draft.loadingTransactionsStatus = true;
      break;
    case PaymentTypes.GET_TRANSACTIONS_STATUS_SUCCESS:
      draft.loadingTransactionsStatus = false;
      draft.transactionsStatus = action.payload;
      break;
    case PaymentTypes.GET_TRANSACTIONS_STATUS_FAILED:
      draft.loadingTransactionsStatus = false;
      break;

    case PaymentTypes.REFUND_TRANSACTION_REQUEST:
      draft.savingRefund = true;
      break;
    case PaymentTypes.REFUND_TRANSACTION_SUCCESS:
      draft.savingRefund = false;
      draft.transactions = draft.transactions.map((transaction) =>
        transaction.id === action.payload.transactionId ? { ...transaction, status: 'refunded' } : transaction,
      );
      break;
    case PaymentTypes.REFUND_TRANSACTION_FAILED:
      draft.savingRefund = false;
      break;

    case PaymentTypes.GET_SELLERS_REQUEST:
      if (action.payload.page && action.payload.page === 1) {
        draft.sellers = [];
        draft.sellersPagination = null;
      }

      draft.loading = true;
      break;
    case PaymentTypes.GET_SELLERS_SUCCESS:
      draft.loading = false;
      draft.sellers = action.payload.sellers;
      draft.sellersPagination = action.payload.pagination;
      break;
    case PaymentTypes.GET_SELLERS_FAILED:
      draft.loading = false;
      break;

    case PaymentTypes.CREATE_SELLER_REQUEST:
      draft.saving = true;
      break;
    case PaymentTypes.CREATE_SELLER_SUCCESS:
      draft.saving = false;
      draft.sellers.unshift(action.payload.seller);
      break;
    case PaymentTypes.CREATE_SELLER_FAILED:
      draft.saving = false;
      break;

    case PaymentTypes.UPDATE_SELLER_REQUEST:
      draft.updating = true;
      break;
    case PaymentTypes.UPDATE_SELLER_SUCCESS:
      draft.updating = false;
      draft.sellers = draft.sellers.map((seller) =>
        seller.id === action.payload.seller.id ? action.payload.seller : seller,
      );
      if (draft.selectedSeller?.id === action.payload.seller.id) {
        draft.selectedSeller = action.payload.seller;
      }
      break;
    case PaymentTypes.UPDATE_SELLER_FAILED:
      draft.updating = false;
      break;

    case PaymentTypes.GET_SELLER_REQUEST:
      draft.loadingSeller = true;
      break;
    case PaymentTypes.GET_SELLER_SUCCESS:
      draft.loadingSeller = false;
      draft.selectedSeller = action.payload.seller;
      break;
    case PaymentTypes.GET_SELLER_FAILED:
      draft.loadingSeller = false;
      break;

    case PaymentTypes.DELETE_SELLER_REQUEST:
      draft.deleting = true;
      break;
    case PaymentTypes.DELETE_SELLER_SUCCESS:
      draft.deleting = false;
      draft.sellers = draft.sellers.filter((seller) => seller.id !== action.payload.sellerId);

      if (draft.selectedSeller?.id === action.payload.sellerId) {
        draft.selectedSeller = null;
      }
      break;
    case PaymentTypes.DELETE_SELLER_FAILED:
      draft.deleting = false;
      break;

    case PaymentTypes.REFRESH_SELLER_STATUS_REQUEST:
      draft.refreshingStatus = true;
      break;
    case PaymentTypes.REFRESH_SELLER_STATUS_SUCCESS:
      draft.refreshingStatus = false;
      draft.sellers = draft.sellers.map((seller) =>
        seller.id === action.payload.sellerId ? { ...seller, status: action.payload.status } : seller,
      );
      if (draft.selectedSeller !== null && draft.selectedSeller?.id === action.payload.sellerId) {
        draft.selectedSeller.status = action.payload.status;
        draft.selectedSeller.documents = draft.selectedSeller.documents.map((doc) => {
          const updated = action.payload.documents.find((d: { id: string }) => d.id === doc.id);
          return updated ? { ...doc, status: updated.status } : doc;
        });
      }
      break;
    case PaymentTypes.REFRESH_SELLER_STATUS_FAILED:
      draft.refreshingStatus = false;
      break;
  }
}, INITIAL_STATE);

export default payment;
