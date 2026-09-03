import type { AddedUnitOfForm } from 'src/components/BackOffice/Promotions/PromotionAdditionModal';
import produce from 'immer';
import type { Base64, Pagination } from 'src/types';
import { PromotionTypes } from './actions';

export type UnitParticipating = 'accepted' | 'rejected';

type UnitParticipatingData = {
  unit_id: string;
  name: string;
  rescue_limit: number;
  participants: number;
  status: 'active' | 'inactive';
  participating: UnitParticipating;
  created_at: Date | string;
  updated_at: Date | string;
};

export type SetUnitParticipatingInThePromotionResponse = {
  success: boolean;
  data: UnitParticipatingData;
};

export type UnitOfPromotionPending = {
  unit_id: string;
  status: string;
  participating: string;
  rescue_limit: number | null;
};

export type PromotionPending = Omit<PromotionData, 'units'> & {
  unit: UnitOfPromotionPending;
};

export type GetCheckParticipatingPromotions = {
  success: boolean;
  data: PromotionPending[];
  pagination: Pagination;
};

export type UnitsOfAddedPromotion = {
  unit_id: string;
  name: string;
  rescue_limit: number;
};

export type AddPromotionProps = {
  title: string;
  start_at: string;
  end_at: string;
  message?: string;
  discount?: number;
  banner?: {
    name: string;
    content: Base64;
  };
  redirect_url?: string;
  item?: string;
  product: 'menu' | 'line' | 'reservation';
  status: 'active' | 'inactive';
  restriction?: 'one' | 'unlimited';
  units: UnitsOfAddedPromotion[];
};

export type GetUnitsDataFromCsv = {
  success: boolean;
  data: UnitsOfAddedPromotion[];
};

export type GetPromotionsResponse = {
  success: boolean;
  data: PromotionData[];
  pagination: Pagination;
};

export type GetCustomersResponse = {
  success: boolean;
  data: CustomerData[];
  pagination: Pagination;
};

export type GetCustomerDetailResponse = {
  success: boolean;
  data: ProductOfCustomer[];
  pagination: Pagination;
};

export type ProductOfCustomer = {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  item: string;
  message: string;
  number_rescued: number;
  number_registered: number;
  number_vouchers: number;
  product: 'menu' | 'line' | 'reservation';
  status: 'active' | 'inactive';
  discount: string;
  created_at: Date | string;
  updated_at: Date | string;
};

export type QueryFilterCustomers = {
  product: 'menu' | 'line' | 'reservation';
  status: 'active' | 'inactive';
  query: string;
  start_at: string;
  end_at: string;
  campaign: string;
};

export type CustomerData = {
  unit_id: string;
  name: string;
  rescue_limit: number;
  participants: number;
  status: 'active' | 'inactive';
  created_at: Date | string;
  updated_at: Date | string;
};

export type UnitOfPromotion = {
  unit_id: string;
  name: string;
  rescue_limit: number;
  participants: number;
  status: string;
  created_at: Date | string;
  updated_at: Date | string;
};

export type PromotionData = {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  message: string;
  discount: number;
  item: string;
  banner: string;
  redirect_url?: string;
  product: 'menu' | 'line' | 'reservation';
  status: 'active' | 'inactive';
  restriction: 'one' | 'unlimited';
  units: UnitOfPromotion[];
  created_at: Date | string;
  updated_at: Date | string;
};

export type IncludeUnitsInThePromotionData = {
  id: string;
  units: AddedUnitOfForm[];
};

export type PromotionsReducerProps = {
  isLoading: boolean;
  promotions: {
    data: PromotionData[];
    pagination: Pagination | null;
    csvModel: Blob | null;
    unitsDataFromCsv: UnitsOfAddedPromotion[];
  };
  customers: {
    data: CustomerData[];
    pagination: Pagination | null;
    csv: Blob | null;
    currentPromotions: {
      data: ProductOfCustomer[];
      pagination: Pagination | null;
    };
    historyPromotions: {
      data: ProductOfCustomer[];
      pagination: Pagination | null;
    };
  };
  optInEnterPromotionModal: boolean;
  selectedPromotion: PromotionPending | null;
  participatingPromotions: GetCheckParticipatingPromotions | null;
};

export const INITIAL_STATE: PromotionsReducerProps = {
  isLoading: false,
  promotions: {
    data: [],
    pagination: null,
    csvModel: null,
    unitsDataFromCsv: [],
  },
  customers: {
    data: [],
    pagination: null,
    csv: null,
    currentPromotions: {
      data: [],
      pagination: null,
    },
    historyPromotions: {
      data: [],
      pagination: null,
    },
  },
  optInEnterPromotionModal: false,
  selectedPromotion: null,
  participatingPromotions: null,
};

const promotionsReducer = produce((draft: PromotionsReducerProps, action) => {
  switch (action.type) {
    case PromotionTypes.GET_PROMOTIONS_REQUEST:
      draft.isLoading = true;
      break;

    case PromotionTypes.GET_PROMOTIONS_SUCCESS:
      draft.isLoading = false;
      draft.promotions.data = action.payload.data;
      draft.promotions.pagination = action.payload.pagination;
      break;

    case PromotionTypes.GET_PROMOTIONS_FAILED:
      draft.isLoading = false;
      break;

    case PromotionTypes.GET_PROMOTION_DETAILS_REQUEST:
      draft.isLoading = true;
      break;

    case PromotionTypes.GET_PROMOTION_DETAILS_SUCCESS: {
      const promotionsState =
        action.responseType === 'current'
          ? 'currentPromotions'
          : 'historyPromotions';

      draft.isLoading = false;
      draft.customers[promotionsState].data = action.payload.data;
      draft.customers[promotionsState].pagination = action.payload.pagination;
      break;
    }

    case PromotionTypes.GET_PROMOTION_DETAILS_FAILED:
      draft.isLoading = false;
      break;

    case PromotionTypes.CREATE_PROMOTION_REQUEST:
      draft.isLoading = true;
      break;

    case PromotionTypes.CREATE_PROMOTION_SUCCESS:
      draft.isLoading = false;
      break;

    case PromotionTypes.CREATE_PROMOTION_FAILED:
      draft.isLoading = false;
      break;

    case PromotionTypes.EDIT_PROMOTION_REQUEST:
      draft.isLoading = true;
      break;

    case PromotionTypes.EDIT_PROMOTION_SUCCESS:
      draft.isLoading = false;
      break;

    case PromotionTypes.EDIT_PROMOTION_FAILED:
      draft.isLoading = false;
      break;

    case PromotionTypes.DELETE_PROMOTION_REQUEST:
      draft.isLoading = true;
      break;

    case PromotionTypes.DELETE_PROMOTION_SUCCESS:
      draft.isLoading = false;
      break;

    case PromotionTypes.DELETE_PROMOTION_FAILED:
      draft.isLoading = false;
      break;

    case PromotionTypes.GET_CSV_MODEL_FOR_ADD_UNITS_REQUEST:
      draft.isLoading = true;
      break;

    case PromotionTypes.GET_CSV_MODEL_FOR_ADD_UNITS_SUCCESS:
      draft.isLoading = false;
      draft.promotions.csvModel = action.payload;
      break;

    case PromotionTypes.GET_CSV_MODEL_FOR_ADD_UNITS_FAILED:
      draft.isLoading = false;
      break;

    case PromotionTypes.IMPORT_UNITS_DATA_FROM_CSV_REQUEST:
      draft.isLoading = true;
      break;

    case PromotionTypes.IMPORT_UNITS_DATA_FROM_CSV_SUCCESS:
      draft.isLoading = false;
      draft.promotions.unitsDataFromCsv = action.payload;
      break;

    case PromotionTypes.IMPORT_UNITS_DATA_FROM_CSV_FAILED:
      draft.isLoading = false;
      break;

    case PromotionTypes.GET_CUSTOMERS_REQUEST:
      draft.isLoading = true;
      break;

    case PromotionTypes.GET_CUSTOMERS_SUCCESS:
      draft.isLoading = false;
      draft.customers.data = action.payload.data;
      draft.customers.pagination = action.payload.pagination;
      break;

    case PromotionTypes.GET_CUSTOMERS_FAILED:
      draft.isLoading = false;
      break;

    case PromotionTypes.GET_CUSTOMERS_CSV_REQUEST:
      draft.isLoading = true;
      break;

    case PromotionTypes.GET_CUSTOMERS_CSV_SUCCESS:
      draft.isLoading = false;
      draft.customers.csv = action.payload;
      break;

    case PromotionTypes.GET_CUSTOMERS_CSV_FAILED:
      draft.isLoading = false;
      break;

    case PromotionTypes.CHECK_PARTICIPATING_PROMOTIONS_REQUEST:
      draft.isLoading = true;
      break;

    case PromotionTypes.CHECK_PARTICIPATING_PROMOTIONS_SUCCESS:
      draft.isLoading = false;
      draft.participatingPromotions = action.payload;
      draft.selectedPromotion = action.payload.data[0];
      break;

    case PromotionTypes.CHECK_PARTICIPATING_PROMOTIONS_FAILED:
      draft.isLoading = false;
      break;

    case PromotionTypes.SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_REQUEST:
      draft.isLoading = true;
      break;

    case PromotionTypes.SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_SUCCESS:
      draft.isLoading = false;
      break;

    case PromotionTypes.SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_FAILED:
      draft.isLoading = false;
      break;

    case PromotionTypes.RESET_CUSTOMERS_CSV:
      draft.customers.csv = null;
      break;

    case PromotionTypes.RESET_PARTICIPATING_PROMOTIONS:
      draft.participatingPromotions = null;
      draft.selectedPromotion = null;
      break;

    case PromotionTypes.HANDLE_TOGGLE_OPTIN_ENTER_PROMOTION:
      draft.optInEnterPromotionModal = !draft.optInEnterPromotionModal;
      break;
  }
}, INITIAL_STATE);

export default promotionsReducer;
