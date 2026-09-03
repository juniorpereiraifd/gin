import { ActionCreators, createActions } from 'reduxsauce';
import {
  CustomerResponse,
  GetCampaignsRequest,
  GetCsvCustomers,
  GetCsvCustomersResponse,
  GetFilteredCustomers,
  GetCustomersResponse,
  GetEmailCampaignResponse,
  GetEmailCampaignsResponse,
  GetFilteredCustomersResponse,
  GetReportSMSCampaignResponse,
  GetSMSCampaignResponse,
  GetSMSCampaignsResponse,
  GetSMSVariablesResponse,
  NewEmailCampaign,
  NewSMSCampaignData,
  SendSMSTestRequest,
  ImportListData,
  ImportType,
  GetImportCustomersErrorsResponse,
  ListData,
  DetailsListData,
  MarketingSettings,
} from './reducer';

export enum MarketingTypes {
  GET_CUSTOMERS_REQUEST = '@marketing/GET_CUSTOMERS_REQUEST',
  GET_CUSTOMERS_SUCCESS = '@marketing/GET_CUSTOMERS_SUCCESS',
  GET_CUSTOMERS_FAILED = '@marketing/GET_CUSTOMERS_FAILED',

  GET_FILTERED_CUSTOMERS_REQUEST = '@marketing/GET_FILTERED_CUSTOMERS_REQUEST',
  GET_FILTERED_CUSTOMERS_SUCCESS = '@marketing/GET_FILTERED_CUSTOMERS_SUCCESS',
  GET_FILTERED_CUSTOMERS_FAILED = '@marketing/GET_FILTERED_CUSTOMERS_FAILED',

  GET_CSV_CUSTOMERS_REQUEST = '@marketing/GET_CSV_CUSTOMERS_REQUEST',
  GET_CSV_CUSTOMERS_SUCCESS = '@marketing/GET_CSV_CUSTOMERS_SUCCESS',
  GET_CSV_CUSTOMERS_FAILED = '@marketing/GET_CSV_CUSTOMERS_FAILED',

  CREATE_EMAIL_CAMPAIGN_REQUEST = '@marketing/CREATE_EMAIL_CAMPAIGN_REQUEST',
  CREATE_EMAIL_CAMPAIGN_SUCCESS = '@marketing/CREATE_EMAIL_CAMPAIGN_SUCCESS',
  CREATE_EMAIL_CAMPAIGN_FAILED = '@marketing/CREATE_EMAIL_CAMPAIGN_FAILED',

  UPDATE_EMAIL_CAMPAIGN_REQUEST = '@marketing/UPDATE_EMAIL_CAMPAIGN_REQUEST',
  UPDATE_EMAIL_CAMPAIGN_SUCCESS = '@marketing/UPDATE_EMAIL_CAMPAIGN_SUCCESS',
  UPDATE_EMAIL_CAMPAIGN_FAILED = '@marketing/UPDATE_EMAIL_CAMPAIGN_FAILED',

  GET_EMAIL_CAMPAIGNS_REQUEST = '@marketing/GET_EMAIL_CAMPAIGNS_REQUEST',
  GET_EMAIL_CAMPAIGNS_SUCCESS = '@marketing/GET_EMAIL_CAMPAIGNS_SUCCESS',
  GET_EMAIL_CAMPAIGNS_FAILED = '@marketing/GET_EMAIL_CAMPAIGNS_FAILED',

  GET_EMAIL_CAMPAIGN_REQUEST = '@marketing/GET_EMAIL_CAMPAIGN_REQUEST',
  GET_EMAIL_CAMPAIGN_SUCCESS = '@marketing/GET_EMAIL_CAMPAIGN_SUCCESS',
  GET_EMAIL_CAMPAIGN_FAILED = '@marketing/GET_EMAIL_CAMPAIGN_FAILED',

  CREATE_SMS_CAMPAIGN_REQUEST = '@marketing/CREATE_SMS_CAMPAIGN_REQUEST',
  CREATE_SMS_CAMPAIGN_SUCCESS = '@marketing/CREATE_SMS_CAMPAIGN_SUCCESS',
  CREATE_SMS_CAMPAIGN_FAILED = '@marketing/CREATE_SMS_CAMPAIGN_FAILED',

  UPDATE_SMS_CAMPAIGN_REQUEST = '@marketing/UPDATE_SMS_CAMPAIGN_REQUEST',
  UPDATE_SMS_CAMPAIGN_SUCCESS = '@marketing/UPDATE_SMS_CAMPAIGN_SUCCESS',
  UPDATE_SMS_CAMPAIGN_FAILED = '@marketing/UPDATE_SMS_CAMPAIGN_FAILED',

  GET_SMS_VARIABLES_REQUEST = '@marketing/GET_SMS_VARIABLES_REQUEST',
  GET_SMS_VARIABLES_SUCCESS = '@marketing/GET_SMS_VARIABLES_SUCCESS',
  GET_SMS_VARIABLES_FAILED = '@marketing/GET_SMS_VARIABLES_FAILED',

  GET_SMS_CAMPAIGNS_REQUEST = '@marketing/GET_SMS_CAMPAIGNS_REQUEST',
  GET_SMS_CAMPAIGNS_SUCCESS = '@marketing/GET_SMS_CAMPAIGNS_SUCCESS',
  GET_SMS_CAMPAIGNS_FAILED = '@marketing/GET_SMS_CAMPAIGNS_FAILED',

  GET_SMS_CAMPAIGN_REQUEST = '@marketing/GET_SMS_CAMPAIGN_REQUEST',
  GET_SMS_CAMPAIGN_SUCCESS = '@marketing/GET_SMS_CAMPAIGN_SUCCESS',
  GET_SMS_CAMPAIGN_FAILED = '@marketing/GET_SMS_CAMPAIGN_FAILED',

  SEND_SMS_TEST_REQUEST = '@marketing/SEND_SMS_TEST_REQUEST',
  SEND_SMS_TEST_SUCCESS = '@marketing/SEND_SMS_TEST_SUCCESS',
  SEND_SMS_TEST_FAILED = '@marketing/SEND_SMS_TEST_FAILED',

  DELETE_SMS_CAMPAIGN_REQUEST = '@marketing/DELETE_SMS_CAMPAIGN_REQUEST',
  DELETE_SMS_CAMPAIGN_SUCCESS = '@marketing/DELETE_SMS_CAMPAIGN_SUCCESS',
  DELETE_SMS_CAMPAIGN_FAILED = '@marketing/DELETE_SMS_CAMPAIGN_FAILED',

  DELETE_EMAIL_CAMPAIGN_REQUEST = '@marketing/DELETE_EMAIL_CAMPAIGN_REQUEST',
  DELETE_EMAIL_CAMPAIGN_SUCCESS = '@marketing/DELETE_EMAIL_CAMPAIGN_SUCCESS',
  DELETE_EMAIL_CAMPAIGN_FAILED = '@marketing/DELETE_EMAIL_CAMPAIGN_FAILED',

  GET_REPORT_SMS_CAMPAIGN_REQUEST = '@marketing/GET_REPORT_SMS_CAMPAIGN_REQUEST',
  GET_REPORT_SMS_CAMPAIGN_SUCCESS = '@marketing/GET_REPORT_SMS_CAMPAIGN_SUCCESS',
  GET_REPORT_SMS_CAMPAIGN_FAILED = '@marketing/GET_REPORT_SMS_CAMPAIGN_FAILED',

  RESET_CUSTOMERS = '@marketing/RESET_CUSTOMERS',

  RESET_EMAIL_CAMPAIGNS = '@marketing/RESET_EMAIL_CAMPAIGNS',
  RESET_EMAIL_CAMPAIGN_SELECT = '@marketing/RESET_EMAIL_CAMPAIGN_SELECT',

  RESET_SMS_CAMPAIGNS = '@marketing/RESET_SMS_CAMPAIGNS',
  RESET_SMS_CAMPAIGN_SELECT = '@marketing/RESET_SMS_CAMPAIGN_SELECT',

  RESET_CSV_CUSTOMERS = '@marketing/RESET_CSV_CUSTOMERS',
  RESET_IMPORT_CSV_CUSTOMERS = '@marketing/RESET_IMPORT_CSV_CUSTOMERS',

  GET_CSV_CUSTOMERS_EXAMPLE_REQUEST = '@marketing/GET_CSV_CUSTOMERS_EXAMPLE_REQUEST',
  GET_CSV_CUSTOMERS_EXAMPLE_SUCCESS = '@marketing/GET_CSV_CUSTOMERS_EXAMPLE_SUCCESS',
  GET_CSV_CUSTOMERS_EXAMPLE_FAILED = '@marketing/GET_CSV_CUSTOMERS_EXAMPLE_FAILED',

  GET_IMPORT_CUSTOMERS_ERRORS_REQUEST = '@marketing/GET_IMPORT_CUSTOMERS_ERRORS_REQUEST',
  GET_IMPORT_CUSTOMERS_ERRORS_SUCCESS = '@marketing/GET_IMPORT_CUSTOMERS_ERRORS_SUCCESS',
  GET_IMPORT_CUSTOMERS_ERRORS_FAILED = '@marketing/GET_IMPORT_CUSTOMERS_ERRORS_FAILED',

  GET_CSV_IMPORT_CUSTOMERS_ERRORS_REQUEST = '@marketing/GET_CSV_IMPORT_CUSTOMERS_ERRORS_REQUEST',
  GET_CSV_IMPORT_CUSTOMERS_ERRORS_SUCCESS = '@marketing/GET_CSV_IMPORT_CUSTOMERS_ERRORS_SUCCESS',
  GET_CSV_IMPORT_CUSTOMERS_ERRORS_FAILED = '@marketing/GET_CSV_IMPORT_CUSTOMERS_ERRORS_FAILED',

  IMPORT_CUSTOMERS_REQUEST = '@marketing/IMPORT_CUSTOMERS_REQUEST',
  IMPORT_CUSTOMERS_SUCCESS = '@marketing/IMPORT_CUSTOMERS_SUCCESS',
  IMPORT_CUSTOMERS_FAILED = '@marketing/IMPORT_CUSTOMERS_FAILED',

  GET_DETAILS_LIST_REQUEST = '@marketing/GET_DETAILS_LIST_REQUEST',
  GET_DETAILS_LIST_SUCCESS = '@marketing/GET_DETAILS_LIST_SUCCESS',
  GET_DETAILS_LIST_FAILED = '@marketing/GET_DETAILS_LIST_FAILED',

  GET_LISTS_REQUEST = '@marketing/GET_LISTS_REQUEST',
  GET_LISTS_SUCCESS = '@marketing/GET_LISTS_SUCCESS',
  GET_LISTS_FAILED = '@marketing/GET_LISTS_FAILED',

  DELETE_LIST_REQUEST = '@marketing/DELETE_LIST_REQUEST',
  DELETE_LIST_SUCCESS = '@marketing/DELETE_LIST_SUCCESS',
  DELETE_LIST_FAILED = '@marketing/DELETE_LIST_FAILED',

  SET_IS_CRM_UNIT = '@marketing/SET_IS_CRM_UNIT',
  SET_STEP_CUSTOMERS_IMPORT = '@marketing/SET_STEP_CUSTOMERS_IMPORT',

  GET_MARKETING_SETTINGS_REQUEST = '@marketing/GET_MARKETING_SETTINGS_REQUEST',
  GET_MARKETING_SETTINGS_SUCCESS = '@marketing/GET_MARKETING_SETTINGS_SUCCESS',
  GET_MARKETING_SETTINGS_FAILED = '@marketing/GET_MARKETING_SETTINGS_FAILED',

  UPDATE_MARKETING_SETTINGS_REQUEST = '@marketing/UPDATE_MARKETING_SETTINGS_REQUEST',
  UPDATE_MARKETING_SETTINGS_SUCCESS = '@marketing/UPDATE_MARKETING_SETTINGS_SUCCESS',
  UPDATE_MARKETING_SETTINGS_FAILED = '@marketing/UPDATE_MARKETING_SETTINGS_FAILED',
}

interface MarketingActions extends ActionCreators {
  getCustomersRequest: () => {
    type: MarketingTypes.GET_CUSTOMERS_REQUEST;
  };

  getCustomersSuccess: (
    payload: GetCustomersResponse
  ) => {
    type: MarketingTypes.GET_CUSTOMERS_SUCCESS;
    payload: GetCustomersResponse;
  };

  getCustomersFailed: () => {
    type: MarketingTypes.GET_CUSTOMERS_FAILED;
  };

  getFilteredCustomersRequest: (
    payload: GetFilteredCustomers
  ) => {
    type: MarketingTypes.GET_FILTERED_CUSTOMERS_REQUEST;
    payload: GetFilteredCustomers;
  };

  getFilteredCustomersSuccess: (
    payload: CustomerResponse
  ) => {
    type: MarketingTypes.GET_FILTERED_CUSTOMERS_SUCCESS;
    payload: GetFilteredCustomersResponse;
  };

  getFilteredCustomersFailed: () => {
    type: MarketingTypes.GET_FILTERED_CUSTOMERS_FAILED;
  };

  getCsvCustomersRequest: (
    payload: GetCsvCustomers
  ) => {
    type: MarketingTypes.GET_CSV_CUSTOMERS_REQUEST;
    payload: GetCsvCustomers;
  };

  getCsvCustomersSuccess: (
    payload: GetCsvCustomersResponse
  ) => {
    type: MarketingTypes.GET_CSV_CUSTOMERS_SUCCESS;
    payload: GetCsvCustomersResponse;
  };

  getCsvCustomersFailed: () => {
    type: MarketingTypes.GET_CSV_CUSTOMERS_FAILED;
  };

  createEmailCampaignRequest: (
    payload: NewEmailCampaign
  ) => {
    type: MarketingTypes.CREATE_EMAIL_CAMPAIGN_REQUEST;
    payload: NewEmailCampaign;
  };

  createEmailCampaignSuccess: () => {
    type: MarketingTypes.CREATE_EMAIL_CAMPAIGN_SUCCESS;
  };

  createEmailCampaignFailed: () => {
    type: MarketingTypes.CREATE_EMAIL_CAMPAIGN_FAILED;
  };

  updateEmailCampaignRequest: (payload: {
    id: string;
    payload: NewEmailCampaign;
  }) => {
    type: MarketingTypes.UPDATE_EMAIL_CAMPAIGN_REQUEST;
    payload: {
      id: string;
      payload: NewEmailCampaign;
    };
  };

  updateEmailCampaignSuccess: () => {
    type: MarketingTypes.UPDATE_EMAIL_CAMPAIGN_SUCCESS;
  };

  updateEmailCampaignFailed: () => {
    type: MarketingTypes.UPDATE_EMAIL_CAMPAIGN_FAILED;
  };

  createSMSCampaignRequest: (
    payload: NewSMSCampaignData
  ) => {
    type: MarketingTypes.CREATE_SMS_CAMPAIGN_REQUEST;
    payload: NewSMSCampaignData;
  };

  createSMSCampaignSuccess: () => {
    type: MarketingTypes.CREATE_SMS_CAMPAIGN_SUCCESS;
  };

  createSMSCampaignFailed: () => {
    type: MarketingTypes.CREATE_SMS_CAMPAIGN_FAILED;
  };

  updateSMSCampaignRequest: (payload: {
    id: string;
    payload: NewSMSCampaignData;
  }) => {
    type: MarketingTypes.UPDATE_SMS_CAMPAIGN_REQUEST;
    payload: {
      id: string;
      payload: NewSMSCampaignData;
    };
  };

  updateSMSCampaignSuccess: () => {
    type: MarketingTypes.UPDATE_SMS_CAMPAIGN_SUCCESS;
  };

  updateSMSCampaignFailed: () => {
    type: MarketingTypes.UPDATE_SMS_CAMPAIGN_FAILED;
  };

  getEmailCampaignsRequest: (
    payload: GetCampaignsRequest
  ) => {
    type: MarketingTypes.GET_EMAIL_CAMPAIGNS_REQUEST;
    payload: GetCampaignsRequest;
  };

  getEmailCampaignsSuccess: (
    payload: GetEmailCampaignsResponse
  ) => {
    type: MarketingTypes.GET_EMAIL_CAMPAIGNS_SUCCESS;
    payload: GetEmailCampaignsResponse;
  };

  getEmailCampaignsFailed: () => {
    type: MarketingTypes.GET_EMAIL_CAMPAIGNS_FAILED;
  };

  getSMSVariablesRequest: () => {
    type: MarketingTypes.GET_SMS_VARIABLES_REQUEST;
  };

  getSMSVariablesSuccess: (
    payload: GetSMSVariablesResponse
  ) => {
    type: MarketingTypes.GET_SMS_VARIABLES_SUCCESS;
    payload: GetSMSVariablesResponse;
  };

  getSMSVariablesFailed: () => {
    type: MarketingTypes.GET_SMS_VARIABLES_FAILED;
  };

  getSMSCampaignsRequest: (
    payload: GetCampaignsRequest
  ) => {
    type: MarketingTypes.GET_SMS_CAMPAIGNS_REQUEST;
    payload: GetCampaignsRequest;
  };

  getSMSCampaignsSuccess: (
    payload: GetSMSCampaignsResponse
  ) => {
    type: MarketingTypes.GET_SMS_CAMPAIGNS_SUCCESS;
    payload: GetSMSCampaignsResponse;
  };

  getSMSCampaignsFailed: () => {
    type: MarketingTypes.GET_SMS_CAMPAIGNS_FAILED;
  };

  getEmailCampaignRequest: (payload: {
    campaignId: string;
  }) => {
    type: MarketingTypes.GET_EMAIL_CAMPAIGN_REQUEST;
    payload: {
      campaignId: string;
    };
  };

  getEmailCampaignSuccess: (
    payload: GetEmailCampaignResponse
  ) => {
    type: MarketingTypes.GET_EMAIL_CAMPAIGN_SUCCESS;
    payload: GetEmailCampaignResponse;
  };

  getEmailCampaignFailed: () => {
    type: MarketingTypes.GET_EMAIL_CAMPAIGN_FAILED;
  };

  getSMSCampaignRequest: (payload: {
    campaignId: string;
  }) => {
    type: MarketingTypes.GET_SMS_CAMPAIGN_REQUEST;
    payload: {
      campaignId: string;
    };
  };

  getSMSCampaignSuccess: (
    payload: GetSMSCampaignResponse
  ) => {
    type: MarketingTypes.GET_SMS_CAMPAIGN_SUCCESS;
    payload: GetSMSCampaignResponse;
  };

  getSMSCampaignFailed: () => {
    type: MarketingTypes.GET_SMS_CAMPAIGN_FAILED;
  };

  sendSMSTestRequest: (
    payload: SendSMSTestRequest
  ) => {
    type: MarketingTypes.SEND_SMS_TEST_REQUEST;
    payload: SendSMSTestRequest;
  };

  sendSMSTestSuccess: () => {
    type: MarketingTypes.SEND_SMS_TEST_SUCCESS;
  };

  sendSMSTestFailed: () => {
    type: MarketingTypes.SEND_SMS_TEST_FAILED;
  };

  deleteSMSCampaignRequest: (payload: {
    campaignId: string;
  }) => {
    type: MarketingTypes.DELETE_SMS_CAMPAIGN_REQUEST;
    payload: {
      campaignId: string;
    };
  };

  deleteSMSCampaignSuccess: (payload: {
    campaignId: string;
  }) => {
    type: MarketingTypes.DELETE_SMS_CAMPAIGN_SUCCESS;
    payload: {
      campaignId: string;
    };
  };

  deleteSMSCampaignFailed: () => {
    type: MarketingTypes.DELETE_SMS_CAMPAIGN_FAILED;
  };

  deleteEmailCampaignRequest: (payload: {
    campaignId: string;
  }) => {
    type: MarketingTypes.DELETE_EMAIL_CAMPAIGN_REQUEST;
    payload: {
      campaignId: string;
    };
  };

  deleteEmailCampaignSuccess: (payload: {
    campaignId: string;
  }) => {
    type: MarketingTypes.DELETE_EMAIL_CAMPAIGN_SUCCESS;
    payload: {
      campaignId: string;
    };
  };

  deleteEmailCampaignFailed: () => {
    type: MarketingTypes.DELETE_EMAIL_CAMPAIGN_FAILED;
  };

  getReportSMSCampaignRequest: () => {
    type: MarketingTypes.GET_REPORT_SMS_CAMPAIGN_REQUEST;
  };

  getReportSMSCampaignSuccess: (
    payload: GetReportSMSCampaignResponse
  ) => {
    type: MarketingTypes.GET_REPORT_SMS_CAMPAIGN_SUCCESS;
    payload: GetReportSMSCampaignResponse;
  };

  getReportSMSCampaignFailed: () => {
    type: MarketingTypes.GET_REPORT_SMS_CAMPAIGN_FAILED;
  };

  importCustomersRequest: (
    payload: ImportType
  ) => {
    type: MarketingTypes.IMPORT_CUSTOMERS_REQUEST;
    payload: ImportType;
  };

  importCustomersSuccess: (
    payload: ImportListData
  ) => {
    type: MarketingTypes.IMPORT_CUSTOMERS_SUCCESS;
    payload: ImportListData;
  };

  importCustomersFailed: () => {
    type: MarketingTypes.IMPORT_CUSTOMERS_FAILED;
  };

  getImportCustomersErrorsRequest: (payload: {
    listId: string;
  }) => {
    type: MarketingTypes.GET_IMPORT_CUSTOMERS_ERRORS_REQUEST;
    payload: {
      listId: string;
    };
  };

  getImportCustomersErrorsSuccess: (
    payload: GetImportCustomersErrorsResponse
  ) => {
    type: MarketingTypes.GET_IMPORT_CUSTOMERS_ERRORS_SUCCESS;
    payload: GetImportCustomersErrorsResponse;
  };

  getImportCustomersErrorsFailed: () => {
    type: MarketingTypes.GET_IMPORT_CUSTOMERS_ERRORS_SUCCESS;
  };

  getCsvImportCustomersErrorsRequest: (payload: {
    listId: string;
  }) => {
    type: MarketingTypes.GET_CSV_IMPORT_CUSTOMERS_ERRORS_REQUEST;
    payload: {
      listId: string;
    };
  };
  getCsvImportCustomersErrorsSuccess: (
    payload: Blob
  ) => {
    type: MarketingTypes.GET_CSV_IMPORT_CUSTOMERS_ERRORS_SUCCESS;
    payload: Blob;
  };
  getCsvImportCustomersErrorsFailed: () => {
    type: MarketingTypes.GET_CSV_IMPORT_CUSTOMERS_ERRORS_FAILED;
  };

  getListsRequest: () => {
    type: MarketingTypes.GET_LISTS_REQUEST;
  };

  getListsSuccess: (
    payload: ListData[]
  ) => {
    type: MarketingTypes.GET_LISTS_SUCCESS;
    payload: ListData[];
  };

  getListsFailed: () => {
    type: MarketingTypes.GET_LISTS_FAILED;
  };

  getDetailsListRequest: (payload: {
    listId: string;
  }) => {
    type: MarketingTypes.GET_DETAILS_LIST_REQUEST;
    payload: {
      listId: string;
    };
  };

  getDetailsListSuccess: (
    payload: DetailsListData
  ) => {
    type: MarketingTypes.GET_DETAILS_LIST_SUCCESS;
    payload: DetailsListData;
  };

  getDetailsListFailed: () => {
    type: MarketingTypes.GET_DETAILS_LIST_FAILED;
  };

  deleteListRequest: (payload: {
    listId: string;
  }) => {
    type: MarketingTypes.DELETE_LIST_REQUEST;
    payload: {
      listId: string;
    };
  };

  deleteListSuccess: () => {
    type: MarketingTypes.DELETE_LIST_SUCCESS;
  };

  deleteListFailed: () => {
    type: MarketingTypes.DELETE_LIST_FAILED;
  };

  getCsvCustomersExampleRequest: () => {
    type: MarketingTypes.GET_CSV_CUSTOMERS_EXAMPLE_REQUEST;
  };

  getCsvCustomersExampleSuccess: (
    payload: Blob
  ) => {
    type: MarketingTypes.GET_CSV_CUSTOMERS_EXAMPLE_SUCCESS;
    payload: Blob;
  };

  getCsvCustomersExampleFailed: () => {
    type: MarketingTypes.GET_CSV_CUSTOMERS_EXAMPLE_FAILED;
  };

  resetCustomers: () => {
    type: MarketingTypes.RESET_CUSTOMERS;
  };

  resetEmailCampaigns: () => {
    type: MarketingTypes.RESET_EMAIL_CAMPAIGNS;
  };

  resetEmailCampaignSelect: () => {
    type: MarketingTypes.RESET_EMAIL_CAMPAIGN_SELECT;
  };

  resetSMSCampaigns: () => {
    type: MarketingTypes.RESET_SMS_CAMPAIGNS;
  };

  resetSMSCampaignSelect: () => {
    type: MarketingTypes.RESET_SMS_CAMPAIGN_SELECT;
  };

  resetCsvCustomers: () => {
    type: MarketingTypes.RESET_CSV_CUSTOMERS;
  };

  resetImportCsvCustomers: () => {
    type: MarketingTypes.RESET_IMPORT_CSV_CUSTOMERS;
  };

  setIsCRMUnit: (payload: {
    isCRMUnit: boolean;
  }) => {
    type: MarketingTypes.SET_IS_CRM_UNIT;
    payload: {
      isCRMUnit: boolean;
    };
  };

  setStepCustomersImport: (
    payload: 1 | 2 | 3 | 4
  ) => {
    type: MarketingTypes.SET_STEP_CUSTOMERS_IMPORT;
    payload: 1 | 2 | 3 | 4;
  };

  getMarketingSettingsRequest: () => {
    type: MarketingTypes.GET_MARKETING_SETTINGS_REQUEST;
  };
  getMarketingSettingsSuccess: (
    payload: MarketingSettings
  ) => {
    type: MarketingTypes.GET_MARKETING_SETTINGS_SUCCESS;
    payload: MarketingSettings;
  };
  getMarketingSettingsFailed: () => {
    type: MarketingTypes.GET_MARKETING_SETTINGS_FAILED;
  };

  updateMarketingSettingsRequest: (
    payload: Partial<MarketingSettings>
  ) => {
    type: MarketingTypes.UPDATE_MARKETING_SETTINGS_REQUEST;
    payload: Partial<MarketingSettings>;
  };
  updateMarketingSettingsSuccess: (
    payload: MarketingSettings
  ) => {
    type: MarketingTypes.UPDATE_MARKETING_SETTINGS_SUCCESS;
    payload: MarketingSettings;
  };
  updateMarketingSettingsFailed: () => {
    type: MarketingTypes.UPDATE_MARKETING_SETTINGS_FAILED;
  };
}

const MarketingActions = createActions(
  {
    getCustomersRequest: [],
    getCustomersSuccess: ['payload'],
    getCustomersFailed: [],

    getFilteredCustomersRequest: ['payload'],
    getFilteredCustomersSuccess: ['payload'],
    getFilteredCustomersFailed: [],

    getCsvCustomersRequest: ['payload'],
    getCsvCustomersSuccess: ['payload'],
    getCsvCustomersFailed: [],

    createEmailCampaignRequest: ['payload'],
    createEmailCampaignSuccess: [],
    createEmailCampaignFailed: [],

    updateEmailCampaignRequest: ['payload'],
    updateEmailCampaignSuccess: [],
    updateEmailCampaignFailed: [],

    createSMSCampaignRequest: ['payload'],
    createSMSCampaignSuccess: [],
    createSMSCampaignFailed: [],

    updateSMSCampaignRequest: ['payload'],
    updateSMSCampaignSuccess: [],
    updateSMSCampaignFailed: [],

    getEmailCampaignsRequest: ['payload'],
    getEmailCampaignsSuccess: ['payload'],
    getEmailCampaignsFailed: [],

    getSMSVariablesRequest: [],
    getSMSVariablesSuccess: ['payload'],
    getSMSVariablesFailed: [],

    getSMSCampaignsRequest: ['payload'],
    getSMSCampaignsSuccess: ['payload'],
    getSMSCampaignsFailed: [],

    getEmailCampaignRequest: ['payload'],
    getEmailCampaignSuccess: ['payload'],
    getEmailCampaignFailed: [],

    getSMSCampaignRequest: ['payload'],
    getSMSCampaignSuccess: ['payload'],
    getSMSCampaignFailed: [],

    sendSMSTestRequest: ['payload'],
    sendSMSTestSuccess: [],
    sendSMSTestFailed: [],

    deleteEmailCampaignRequest: ['payload'],
    deleteEmailCampaignSuccess: ['payload'],
    deleteEmailCampaignFailed: [],

    deleteSMSCampaignRequest: ['payload'],
    deleteSMSCampaignSuccess: ['payload'],
    deleteSMSCampaignFailed: [],

    getReportSMSCampaignRequest: [],
    getReportSMSCampaignSuccess: ['payload'],
    getReportSMSCampaignFailed: [],

    getCsvCustomersExampleRequest: [],
    getCsvCustomersExampleSuccess: ['payload'],
    getCsvCustomersExampleFailed: [],

    importCustomersRequest: ['payload'],
    importCustomersSuccess: ['payload'],
    importCustomersFailed: [],

    getImportCustomersErrorsRequest: ['payload'],
    getImportCustomersErrorsSuccess: ['payload'],
    getImportCustomersErrorsFailed: [],

    getCsvImportCustomersErrorsRequest: ['payload'],
    getCsvImportCustomersErrorsSuccess: ['payload'],
    getCsvImportCustomersErrorsFailed: [],

    getListsRequest: [''],
    getListsSuccess: ['payload'],
    getListsFailed: [''],

    getDetailsListRequest: ['payload'],
    getDetailsListSuccess: ['payload'],
    getDetailsListFailed: [''],

    deleteListRequest: ['payload'],
    deleteListSuccess: [''],
    deleteListFailed: [''],

    resetCustomers: [],

    resetEmailCampaigns: [],
    resetEmailCampaignSelect: [],

    resetSMSCampaigns: [],
    resetSMSCampaignSelect: [],

    resetCsvCustomers: [],
    resetImportCsvCustomers: [],

    setStepCustomersImport: ['payload'],
    setIsCRMUnit: ['payload'],

    getMarketingSettingsRequest: [],
    getMarketingSettingsSuccess: ['payload'],
    getMarketingSettingsFailed: [],

    updateMarketingSettingsRequest: ['payload'],
    updateMarketingSettingsSuccess: ['payload'],
    updateMarketingSettingsFailed: [],
  },
  {
    prefix: '@marketing/',
  }
);

export const MarketingCreators = MarketingActions.Creators as MarketingActions;
