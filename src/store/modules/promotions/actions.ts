import type { PromotionType } from 'src/components/BackOffice/Promotions/PromotionsContent';
import { ActionCreators, createActions } from 'reduxsauce';
import type {
  AddPromotionProps,
  GetCheckParticipatingPromotions,
  GetCustomerDetailResponse,
  GetCustomersResponse,
  GetPromotionsResponse,
  IncludeUnitsInThePromotionData,
  PromotionData,
  QueryFilterCustomers,
  UnitParticipating,
  UnitsOfAddedPromotion,
} from './reducer';

export enum PromotionTypes {
  GET_PROMOTIONS_REQUEST = '@promotions/GET_PROMOTIONS_REQUEST',
  GET_PROMOTIONS_SUCCESS = '@promotions/GET_PROMOTIONS_SUCCESS',
  GET_PROMOTIONS_FAILED = '@promotions/GET_PROMOTIONS_FAILED',

  GET_PROMOTION_DETAILS_REQUEST = '@promotions/GET_PROMOTION_DETAILS_REQUEST',
  GET_PROMOTION_DETAILS_SUCCESS = '@promotions/GET_PROMOTION_DETAILS_SUCCESS',
  GET_PROMOTION_DETAILS_FAILED = '@promotions/GET_PROMOTION_DETAILS_FAILED',

  CREATE_PROMOTION_REQUEST = '@promotions/CREATE_PROMOTION_REQUEST',
  CREATE_PROMOTION_SUCCESS = '@promotions/CREATE_PROMOTION_SUCCESS',
  CREATE_PROMOTION_FAILED = '@promotions/CREATE_PROMOTION_FAILED',

  EDIT_PROMOTION_REQUEST = '@promotions/EDIT_PROMOTION_REQUEST',
  EDIT_PROMOTION_SUCCESS = '@promotions/EDIT_PROMOTION_SUCCESS',
  EDIT_PROMOTION_FAILED = '@promotions/EDIT_PROMOTION_FAILED',

  INCLUDE_UNITS_IN_THE_PROMOTION_REQUEST = '@promotions/INCLUDE_UNITS_IN_THE_PROMOTION_REQUEST',
  INCLUDE_UNITS_IN_THE_PROMOTION_SUCCESS = '@promotions/INCLUDE_UNITS_IN_THE_PROMOTION_SUCCESS',
  INCLUDE_UNITS_IN_THE_PROMOTION_FAILED = '@promotions/INCLUDE_UNITS_IN_THE_PROMOTION_FAILED',

  DELETE_PROMOTION_REQUEST = '@promotions/DELETE_PROMOTION_REQUEST',
  DELETE_PROMOTION_SUCCESS = '@promotions/DELETE_PROMOTION_SUCCESS',
  DELETE_PROMOTION_FAILED = '@promotions/DELETE_PROMOTION_FAILED',

  GET_CSV_MODEL_FOR_ADD_UNITS_REQUEST = '@promotions/GET_CSV_MODEL_FOR_ADD_UNITS_REQUEST',
  GET_CSV_MODEL_FOR_ADD_UNITS_SUCCESS = '@promotions/GET_CSV_MODEL_FOR_ADD_UNITS_SUCCESS',
  GET_CSV_MODEL_FOR_ADD_UNITS_FAILED = '@promotions/GET_CSV_MODEL_FOR_ADD_UNITS_FAILED',

  IMPORT_UNITS_DATA_FROM_CSV_REQUEST = '@promotions/IMPORT_UNITS_DATA_FROM_CSV_REQUEST',
  IMPORT_UNITS_DATA_FROM_CSV_SUCCESS = '@promotions/IMPORT_UNITS_DATA_FROM_CSV_SUCCESS',
  IMPORT_UNITS_DATA_FROM_CSV_FAILED = '@promotions/IMPORT_UNITS_DATA_FROM_CSV_FAILED',

  GET_CUSTOMERS_REQUEST = '@promotions/GET_CUSTOMERS_REQUEST',
  GET_CUSTOMERS_SUCCESS = '@promotions/GET_CUSTOMERS_SUCCESS',
  GET_CUSTOMERS_FAILED = '@promotions/GET_CUSTOMERS_FAILED',

  GET_CUSTOMERS_CSV_REQUEST = '@promotions/GET_CUSTOMERS_CSV_REQUEST',
  GET_CUSTOMERS_CSV_SUCCESS = '@promotions/GET_CUSTOMERS_CSV_SUCCESS',
  GET_CUSTOMERS_CSV_FAILED = '@promotions/GET_CUSTOMERS_CSV_FAILED',

  CHECK_PARTICIPATING_PROMOTIONS_REQUEST = '@promotions/CHECK_PARTICIPATING_PROMOTIONS_REQUEST',
  CHECK_PARTICIPATING_PROMOTIONS_SUCCESS = '@promotions/CHECK_PARTICIPATING_PROMOTIONS_SUCCESS',
  CHECK_PARTICIPATING_PROMOTIONS_FAILED = '@promotions/CHECK_PARTICIPATING_PROMOTIONS_FAILED',

  SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_REQUEST = '@promotions/SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_REQUEST',
  SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_SUCCESS = '@promotions/SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_SUCCESS',
  SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_FAILED = '@promotions/SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_FAILED',

  RESET_CUSTOMERS_CSV = '@promotions/RESET_CUSTOMERS_CSV',

  RESET_PARTICIPATING_PROMOTIONS = '@promotions/RESET_PARTICIPATING_PROMOTIONS',

  HANDLE_TOGGLE_OPTIN_ENTER_PROMOTION = '@promotions/HANDLE_TOGGLE_OPTIN_ENTER_PROMOTION',
}

interface PromotionActions extends ActionCreators {
  getPromotionsRequest: () => {
    type: PromotionTypes.GET_PROMOTIONS_REQUEST;
  };

  getPromotionsSuccess: (
    payload: GetPromotionsResponse
  ) => {
    type: PromotionTypes.GET_PROMOTIONS_SUCCESS;
    payload: GetPromotionsResponse;
  };

  getPromotionsFailed: () => {
    type: PromotionTypes.GET_PROMOTIONS_FAILED;
  };

  getPromotionDetailsRequest: (payload: {
    id: string;
    type: 'current' | 'historic';
    pagination?: number;
  }) => {
    type: PromotionTypes.GET_PROMOTION_DETAILS_REQUEST;
    payload: {
      id: string;
      type: 'current' | 'historic';
      pagination?: number;
    };
  };

  getPromotionDetailsSuccess: (
    responseType: 'current' | 'historic',
    payload: GetCustomerDetailResponse
  ) => {
    type: PromotionTypes.GET_PROMOTION_DETAILS_SUCCESS;
    responseType: 'current' | 'historic';
    payload: GetCustomerDetailResponse;
  };

  getPromotionDetailsFailed: () => {
    type: PromotionTypes.GET_PROMOTION_DETAILS_FAILED;
  };

  createPromotionRequest: (payload: {
    newPromotion: AddPromotionProps;
    promotionType: PromotionType;
  }) => {
    type: PromotionTypes.CREATE_PROMOTION_REQUEST;
    payload: {
      newPromotion: AddPromotionProps;
      promotionType: PromotionType;
    };
  };

  createPromotionSuccess: () => {
    type: PromotionTypes.CREATE_PROMOTION_SUCCESS;
  };

  createPromotionFailed: () => {
    type: PromotionTypes.CREATE_PROMOTION_FAILED;
  };

  editPromotionRequest: (payload: {
    promotionType: PromotionType;
    promotion: Partial<PromotionData>;
  }) => {
    type: PromotionTypes.EDIT_PROMOTION_REQUEST;
    payload: {
      promotionType: PromotionType;
      promotion: Partial<PromotionData>;
    };
  };

  editPromotionSuccess: () => {
    type: PromotionTypes.EDIT_PROMOTION_SUCCESS;
  };

  editPromotionFailed: () => {
    type: PromotionTypes.EDIT_PROMOTION_FAILED;
  };

  includeUnitsInThePromotionRequest: (
    payload: IncludeUnitsInThePromotionData
  ) => {
    type: PromotionTypes.INCLUDE_UNITS_IN_THE_PROMOTION_REQUEST;
    payload: IncludeUnitsInThePromotionData;
  };

  includeUnitsInThePromotionSuccess: () => {
    type: PromotionTypes.INCLUDE_UNITS_IN_THE_PROMOTION_SUCCESS;
  };

  includeUnitsInThePromotionFailed: () => {
    type: PromotionTypes.INCLUDE_UNITS_IN_THE_PROMOTION_FAILED;
  };

  deletePromotionRequest: (payload: {
    promotionId: string;
  }) => {
    type: PromotionTypes.DELETE_PROMOTION_REQUEST;
    payload: { promotionId: string };
  };

  deletePromotionSuccess: () => {
    type: PromotionTypes.DELETE_PROMOTION_SUCCESS;
  };

  deletePromotionFailed: () => {
    type: PromotionTypes.DELETE_PROMOTION_FAILED;
  };

  getCsvModelForAddUnitsRequest: () => {
    type: PromotionTypes.GET_CSV_MODEL_FOR_ADD_UNITS_REQUEST;
  };

  getCsvModelForAddUnitsSuccess: (
    payload: Blob
  ) => {
    type: PromotionTypes.GET_CSV_MODEL_FOR_ADD_UNITS_SUCCESS;
    payload: Blob;
  };

  getCsvModelForAddUnitsFailed: () => {
    type: PromotionTypes.GET_CSV_MODEL_FOR_ADD_UNITS_FAILED;
  };

  importUnitsDataFromCsvRequest: (
    payload: File
  ) => {
    type: PromotionTypes.IMPORT_UNITS_DATA_FROM_CSV_REQUEST;
    payload: File;
  };

  importUnitsDataFromCsvSuccess: (
    payload: UnitsOfAddedPromotion[]
  ) => {
    type: PromotionTypes.IMPORT_UNITS_DATA_FROM_CSV_SUCCESS;
    payload: UnitsOfAddedPromotion[];
  };

  importUnitsDataFromCsvFailed: () => {
    type: PromotionTypes.IMPORT_UNITS_DATA_FROM_CSV_FAILED;
  };

  getCustomersRequest: (payload: {
    page: number;
    params?: Partial<QueryFilterCustomers>;
  }) => {
    type: PromotionTypes.GET_CUSTOMERS_REQUEST;
    payload: {
      page: number;
      params?: Partial<QueryFilterCustomers>;
    };
  };

  getCustomersSuccess: (
    payload: GetCustomersResponse
  ) => {
    type: PromotionTypes.GET_CUSTOMERS_SUCCESS;
    payload: GetCustomersResponse;
  };

  getCustomersFailed: () => {
    type: PromotionTypes.GET_CUSTOMERS_FAILED;
  };

  getCustomersCsvRequest: () => {
    type: PromotionTypes.GET_CUSTOMERS_CSV_REQUEST;
  };

  getCustomersCsvSuccess: (
    payload: Blob
  ) => {
    type: PromotionTypes.GET_CUSTOMERS_CSV_SUCCESS;
    payload: Blob;
  };

  getCustomersCsvFailed: () => {
    type: PromotionTypes.GET_CUSTOMERS_CSV_FAILED;
  };

  checkParticipatingPromotionsRequest: (payload: {
    unitId: string;
    participating: 'pending' | 'accepted' | 'rejected';
  }) => {
    type: PromotionTypes.CHECK_PARTICIPATING_PROMOTIONS_REQUEST;
    payload: {
      unitId: string;
      participating: 'pending' | 'accepted' | 'rejected';
    };
  };

  checkParticipatingPromotionsSuccess: (
    payload: GetCheckParticipatingPromotions
  ) => {
    type: PromotionTypes.CHECK_PARTICIPATING_PROMOTIONS_SUCCESS;
    payload: GetCheckParticipatingPromotions;
  };

  checkParticipatingPromotionsFailed: () => {
    type: PromotionTypes.CHECK_PARTICIPATING_PROMOTIONS_FAILED;
  };

  setUnitParticipatingInThePromotionRequest: (payload: {
    unitId: string;
    promotionId: string;
    participating: UnitParticipating;
  }) => {
    type: PromotionTypes.SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_REQUEST;
    payload: {
      unitId: string;
      promotionId: string;
      participating: UnitParticipating;
    };
  };

  setUnitParticipatingInThePromotionSuccess: () => {
    type: PromotionTypes.SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_SUCCESS;
  };

  setUnitParticipatingInThePromotionFailed: () => {
    type: PromotionTypes.SET_UNIT_PARTICIPATING_IN_THE_PROMOTION_FAILED;
  };

  resetCustomersCsv: () => {
    type: PromotionTypes.RESET_CUSTOMERS_CSV;
  };

  resetParticipatingPromotions: () => {
    type: PromotionTypes.RESET_PARTICIPATING_PROMOTIONS;
  };

  handleToggleOptinEnterPromotion: () => {
    type: PromotionTypes.HANDLE_TOGGLE_OPTIN_ENTER_PROMOTION;
  };
}

const PromotionActions = createActions(
  {
    getPromotionsRequest: [],
    getPromotionsSuccess: ['payload'],
    getPromotionsFailed: [],

    getPromotionDetailsRequest: ['payload'],
    getPromotionDetailsSuccess: ['responseType', 'payload'],
    getPromotionDetailsFailed: [],

    createPromotionRequest: ['payload'],
    createPromotionSuccess: [],
    createPromotionFailed: [],

    editPromotionRequest: ['payload'],
    editPromotionSuccess: [],
    editPromotionFailed: [],

    includeUnitsInThePromotionRequest: ['payload'],
    includeUnitsInThePromotionSuccess: [],
    includeUnitsInThePromotionFailed: [],

    deletePromotionRequest: ['payload'],
    deletePromotionSuccess: [],
    deletePromotionFailed: [],

    getCsvModelForAddUnitsRequest: [],
    getCsvModelForAddUnitsSuccess: ['payload'],
    getCsvModelForAddUnitsFailed: [],

    importUnitsDataFromCsvRequest: ['payload'],
    importUnitsDataFromCsvSuccess: ['payload'],
    importUnitsDataFromCsvFailed: [],

    getCustomersRequest: ['payload'],
    getCustomersSuccess: ['payload'],
    getCustomersFailed: [],

    getCustomersCsvRequest: [],
    getCustomersCsvSuccess: ['payload'],
    getCustomersCsvFailed: [],

    checkParticipatingPromotionsRequest: ['payload'],
    checkParticipatingPromotionsSuccess: ['payload'],
    checkParticipatingPromotionsFailed: [],

    setUnitParticipatingInThePromotionRequest: ['payload'],
    setUnitParticipatingInThePromotionSuccess: [],
    setUnitParticipatingInThePromotionFailed: [],

    resetCustomersCsv: [],

    resetParticipatingPromotions: [],

    handleToggleOptinEnterPromotion: [],
  },
  {
    prefix: '@promotions/',
  }
);

export const PromotionCreators = PromotionActions.Creators as PromotionActions;
