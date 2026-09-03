import produce from 'immer';
import type { Base64, Pagination } from 'src/types';
import type { SmsVariablesProps } from '../comunication/reducer';
import { MarketingTypes } from './actions';

export type MarketingSettings = {
  enabled: boolean;
  id: string;
  unit_id: string;
  sms_franchise: number;
};

export type CustomerData = {
  id: string;
  unit_id: string;
  user_id: string;
  reference_type: string;
  name: string;
  mobile: string;
  email: string;
  last_visit_at: string;
  amount_of_visits: number;
  birthdate: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
};

export type Campaign = {
  name: string;
  shipping_at_date: string | null;
  shipping_at_time: string | null;
  segmentation: Segmentation;
};

export type Segmentation = {
  name: string;
  id: string | null;
};

export type SMSTemplate = {
  id: string;
  title: string;
  model: string;
  subject: string;
  body: string;
  personalized_button: boolean;
  button_name?: string;
  slug_button_name?: SlugsEmailButton;
  link?: string;
  image?: string;
  created_at: string | Date;
  updated_at: string | Date;
};

export type EmailTemplate = {
  title: string;
  model: string;
  subject: string;
  body: string;
  personalized_button: boolean;
  button_name?: string;
  slug_button_name?: SlugsEmailButton | '';
  link?: string;
  image?: {
    name: string;
    content: Base64 | string;
  } | null;
};

export type Segmentations =
  | 'dont_come_back_thirty'
  | 'dont_come_back_sixty'
  | 'dont_come_back_ninety'
  | 'birthdays'
  | 'reservation_noshow'
  | 'canceled'
  | 'all';

export type SlugsEmailButton =
  | 'make-reservation'
  | 'see-menu'
  | 'see-restaurant'
  | 'custom-link';

export type NewEmailCampaign = {
  campaign: Campaign;
  segmentation?: Segmentation;
  template: EmailTemplate;
};

export type NewSMSCampaignData = {
  campaign: Campaign;
  segmentation?: Segmentation;
  template: {
    body: string;
  };
};

export type EmailTemplateData = {
  id: string;
  title: string;
  model: 'classic' | string;
  subject: string;
  body: string;
  link: string;
  personalized_button: boolean;
  image: string;
  created_at: Date | string;
  updated_at: Date | string;
};

export type ViewsData = {
  sent: number;
  received: number;
  open: number;
  single_clicks: number;
  canceled_subscriptions: number;
};

export type EmailCampaignData = {
  id: string;
  name: string;
  segmentation: Segmentations;
  shipping_at_date: string | Date;
  shipping_at_time: string;
  created_at: string | Date;
  updated_at: string | Date;
  template: EmailTemplate;
  views: ViewsData;
  status?: string;
};

export type SMSCampaignData = {
  id: string;
  name: string;
  type: string;
  segmentation: Segmentations;
  shipping_at_date: string | Date;
  shipping_at_time: string;
  status: string;
  customers_total: number;
  delivered_total: number;
  failed_total: number;
  created_at: string | Date;
  updated_at: string | Date;
  template: SMSTemplate;
};

export type SMSReportData = {
  available_balance: number;
  total: number;
};

export type ImportListData = {
  name: string;
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
};

export type ErrorsListData = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  birthdate: Date | string;
  error: {
    name_required?: string;
    mobile_required?: string;
    mobile_format?: string;
    email_format?: string;
    birthdate_format?: string;
  };
  created_at: Date | string;
  updated_at: Date | string;
};

export type ListData = {
  id: string;
  name: string;
};

export type DetailsListData = {
  id: string;
  name: string;
  activities_total: number;
  created_at: Date | string;
  updated_at: Date | string;
};

export type ImportCsv = {
  step: 1 | 2 | 3 | 4;
  example: Blob | null;
  errors: {
    data: ErrorsListData[];
    pagination: Pagination | null;
    csv: Blob | null;
  };
  isLoading: boolean;
  importedList: ImportListData | null;
  details: DetailsListData | null;
};

export type ImportType = {
  name: string;
  file: File | '';
};

export type ImportCustomersResponse = {
  success: boolean;
  data: ImportListData;
};

export type CustomerResponse = {
  success?: boolean;
  data: CustomerData[];
  pagination: Pagination | null;
};

export type GetCustomersResponse = {
  all: CustomerResponse;
  dont_come_back_thirty: CustomerResponse;
  dont_come_back_sixty: CustomerResponse;
  dont_come_back_ninety: CustomerResponse;
  birthdays: CustomerResponse;
  reservation_noshow: CustomerResponse;
  canceled: CustomerResponse;
  list: CustomerResponse;
};

export type GetFilteredCustomers = {
  segmentation?: Segmentations | 'dont_come_back';
  days?: string;
  list_id?: string;
  per_page?: number;
  page: number;
};

export type GetFilteredCustomersResponse = {
  success: boolean;
  data: CustomerData[];
  pagination: Pagination;
  filter?: string;
};

export type GetEmailCampaignsResponse = {
  success: boolean;
  data: EmailCampaignData[];
  pagination: Pagination;
};

export type GetSMSVariablesResponse = {
  success: boolean;
  data: SmsVariablesProps[];
};

export type GetSMSCampaignsResponse = {
  success: boolean;
  data: SMSCampaignData[];
  pagination: Pagination;
};

export type GetEmailCampaignResponse = {
  success: boolean;
  data: EmailCampaignData;
};

export type GetSMSCampaignResponse = {
  success: boolean;
  data: SMSCampaignData;
};

export type GetReportSMSCampaignResponse = {
  success: boolean;
  data: SMSReportData[];
};

export type GetImportCustomersErrorsResponse = {
  success: boolean;
  data: ErrorsListData[];
  pagination: Pagination | null;
};

export type GetListsResponse = {
  success: boolean;
  data: ListData[];
};

export type GetDetailslistResponse = {
  success: boolean;
  data: DetailsListData;
};

export type GetCsvCustomers = {
  segmentation?: Segmentations;
  days?: string;
  list_id?: string;
};

export type GetCsvCustomersResponse = {
  segmentation: Segmentations;
  list_id: string | undefined;
  data: Blob;
};

export type GetCampaignsRequest = {
  campaignName?: string;
  page: number;
  per_page?: number;
};

export type SendSMSTestRequest = {
  phone: string;
  text: string;
};

export type CustomerDataObj = {
  data: CustomerData[];
  pagination: Pagination | null;
};

export type MarketingReducerProps = {
  isLoading: boolean;
  customers: {
    all: {
      data: CustomerData[];
      pagination: Pagination | null;
    };
    birthdays: {
      data: CustomerData[];
      pagination: Pagination | null;
    };
    reservation_noshow: {
      data: CustomerData[];
      pagination: Pagination | null;
    };
    canceled: {
      data: CustomerData[];
      pagination: Pagination | null;
    };
    dont_come_back_thirty: {
      data: CustomerData[];
      pagination: Pagination | null;
    };
    dont_come_back_sixty: {
      data: CustomerData[];
      pagination: Pagination | null;
    };
    dont_come_back_ninety: {
      data: CustomerData[];
      pagination: Pagination | null;
    };
    list: {
      data: CustomerData[];
      pagination: Pagination | null;
    };
  };
  csv: {
    all: Blob | null;
    birthdays: Blob | null;
    reservation_noshow: Blob | null;
    canceled: Blob | null;
    dont_come_back_ninety: Blob | null;
    dont_come_back_thirty: Blob | null;
    dont_come_back_sixty: Blob | null;
    list?: Blob | null;
  };
  emailCampaigns: {
    data: EmailCampaignData[];
    pagination: Pagination | null;
  };
  emailCampaignSelected: EmailCampaignData | null;
  smsCampaigns: {
    data: SMSCampaignData[];
    reportData: SMSReportData | null;
    variables: SmsVariablesProps[];
    pagination: Pagination | null;
  };
  smsCampaignSelected: SMSCampaignData | null;
  importCsv: ImportCsv;
  lists: ListData[];
  isCRMUnit: boolean;
  loadingSettings: boolean;
  savingSettings: boolean;
  settings: MarketingSettings | null;
};

export const INITIAL_STATE: MarketingReducerProps = {
  isLoading: false,
  customers: {
    all: {
      data: [],
      pagination: null,
    },
    birthdays: {
      data: [],
      pagination: null,
    },
    reservation_noshow: {
      data: [],
      pagination: null,
    },
    canceled: {
      data: [],
      pagination: null,
    },
    dont_come_back_thirty: {
      data: [],
      pagination: null,
    },
    dont_come_back_sixty: {
      data: [],
      pagination: null,
    },
    dont_come_back_ninety: {
      data: [],
      pagination: null,
    },
    list: {
      data: [],
      pagination: null,
    },
  },
  csv: {
    all: null,
    birthdays: null,
    reservation_noshow: null,
    canceled: null,
    dont_come_back_ninety: null,
    dont_come_back_thirty: null,
    dont_come_back_sixty: null,
    list: null,
  },
  emailCampaigns: {
    data: [],
    pagination: null,
  },
  emailCampaignSelected: null,
  smsCampaigns: {
    data: [],
    reportData: null,
    variables: [],
    pagination: null,
  },
  smsCampaignSelected: null,
  importCsv: {
    step: 1,
    example: null,
    errors: {
      data: [],
      pagination: null,
      csv: null,
    },
    isLoading: false,
    importedList: null,
    details: null,
  },
  lists: [],
  isCRMUnit: false,
  loadingSettings: false,
  savingSettings: false,
  settings: null,
};

const marketingReducer = produce((draft: MarketingReducerProps, action) => {
  switch (action.type) {
    case MarketingTypes.GET_CUSTOMERS_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.GET_CUSTOMERS_SUCCESS:
      draft.isLoading = false;
      draft.customers = action.payload;

      break;

    case MarketingTypes.GET_CUSTOMERS_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.GET_FILTERED_CUSTOMERS_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.GET_FILTERED_CUSTOMERS_SUCCESS:
      draft.isLoading = false;

      if (action.payload.filter === 'birthdays') {
        draft.customers.birthdays.data = action.payload.data;
        draft.customers.birthdays.pagination = action.payload.pagination;
      } else if (action.payload.filter === 'reservation_noshow') {
        draft.customers.reservation_noshow.data = action.payload.data;
        draft.customers.reservation_noshow.pagination =
          action.payload.pagination;
      } else if (action.payload.filter === 'canceled') {
        draft.customers.canceled.data = action.payload.data;
        draft.customers.canceled.pagination = action.payload.pagination;
      } else if (action.payload.filter === 'dont_come_back_thirty') {
        draft.customers.dont_come_back_thirty.data = action.payload.data;
        draft.customers.dont_come_back_thirty.pagination =
          action.payload.pagination;
      } else if (action.payload.filter === 'dont_come_back_sixty') {
        draft.customers.dont_come_back_sixty.data = action.payload.data;
        draft.customers.dont_come_back_thirty.pagination =
          action.payload.pagination;
      } else if (action.payload.filter === 'dont_come_back_ninety') {
        draft.customers.dont_come_back_ninety.data = action.payload.data;
        draft.customers.dont_come_back_ninety.pagination =
          action.payload.pagination;
      } else if (action.payload.filter === 'all') {
        draft.customers.all.data = action.payload.data;
        draft.customers.all.pagination = action.payload.pagination;
      } else {
        draft.customers.list.data = action.payload.data;
        draft.customers.list.pagination = action.payload.pagination;
      }

      break;

    case MarketingTypes.GET_FILTERED_CUSTOMERS_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.RESET_CUSTOMERS:
      draft.customers = {
        all: { data: [], pagination: null },
        birthdays: { data: [], pagination: null },
        reservation_noshow: { data: [], pagination: null },
        canceled: { data: [], pagination: null },
        dont_come_back_thirty: { data: [], pagination: null },
        dont_come_back_sixty: { data: [], pagination: null },
        dont_come_back_ninety: { data: [], pagination: null },
        list: { data: [], pagination: null },
      };
      draft.csv = {
        all: null,
        birthdays: null,
        reservation_noshow: null,
        canceled: null,
        dont_come_back_ninety: null,
        dont_come_back_thirty: null,
        dont_come_back_sixty: null,
      };
      break;

    case MarketingTypes.RESET_EMAIL_CAMPAIGNS:
      draft.emailCampaigns = {
        data: [],
        pagination: null,
      };
      break;

    case MarketingTypes.RESET_EMAIL_CAMPAIGN_SELECT:
      draft.emailCampaignSelected = null;
      break;

    case MarketingTypes.RESET_SMS_CAMPAIGNS:
      draft.smsCampaigns = {
        data: [],
        reportData: null,
        variables: [],
        pagination: null,
      };
      break;

    case MarketingTypes.RESET_SMS_CAMPAIGN_SELECT:
      draft.smsCampaignSelected = null;
      break;

    case MarketingTypes.RESET_CSV_CUSTOMERS:
      draft.csv = {
        all: null,
        dont_come_back_ninety: null,
        dont_come_back_thirty: null,
        dont_come_back_sixty: null,
        birthdays: null,
        reservation_noshow: null,
        canceled: null,
        list: null,
      };
      break;

    case MarketingTypes.RESET_IMPORT_CSV_CUSTOMERS:
      draft.importCsv = {
        errors: {
          data: [],
          pagination: null,
          csv: null,
        },
        example: null,
        importedList: null,
        details: null,
        step: 1,
        isLoading: false,
      };
      break;

    case MarketingTypes.GET_CSV_CUSTOMERS_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.GET_CSV_CUSTOMERS_SUCCESS:
      draft.isLoading = false;

      if (action.payload.list_id) {
        draft.csv.list = action.payload.data;
      } else {
        draft.csv[action.payload.segmentation as keyof typeof draft.csv] =
          action.payload.data;
      }

      break;

    case MarketingTypes.GET_CSV_CUSTOMERS_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.CREATE_EMAIL_CAMPAIGN_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.CREATE_EMAIL_CAMPAIGN_SUCCESS:
      draft.isLoading = false;
      break;

    case MarketingTypes.CREATE_EMAIL_CAMPAIGN_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.CREATE_SMS_CAMPAIGN_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.CREATE_SMS_CAMPAIGN_SUCCESS:
      draft.isLoading = false;
      break;

    case MarketingTypes.CREATE_SMS_CAMPAIGN_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.GET_EMAIL_CAMPAIGNS_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.GET_EMAIL_CAMPAIGNS_SUCCESS:
      draft.isLoading = false;
      draft.emailCampaigns.data = action.payload.data;
      draft.emailCampaigns.pagination = action.payload.pagination;
      break;

    case MarketingTypes.GET_EMAIL_CAMPAIGNS_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.GET_SMS_VARIABLES_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.GET_SMS_VARIABLES_SUCCESS:
      draft.isLoading = false;
      draft.smsCampaigns.variables = action.payload.data;
      break;

    case MarketingTypes.GET_SMS_VARIABLES_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.GET_SMS_CAMPAIGNS_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.GET_SMS_CAMPAIGNS_SUCCESS:
      draft.isLoading = false;
      draft.smsCampaigns.data = action.payload.data;
      draft.smsCampaigns.pagination = action.payload.pagination;
      break;

    case MarketingTypes.GET_SMS_CAMPAIGNS_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.GET_EMAIL_CAMPAIGN_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.GET_EMAIL_CAMPAIGN_SUCCESS:
      draft.isLoading = false;
      draft.emailCampaignSelected = action.payload.data;
      if (draft?.emailCampaignSelected?.template) {
        draft.emailCampaignSelected.template.image = {
          name: 'photo',
          content: action.payload.data.template.image,
        };
      }
      break;

    case MarketingTypes.GET_EMAIL_CAMPAIGN_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.GET_SMS_CAMPAIGN_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.GET_SMS_CAMPAIGN_SUCCESS:
      draft.isLoading = false;
      draft.smsCampaignSelected = action.payload.data;
      break;

    case MarketingTypes.GET_SMS_CAMPAIGN_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.SEND_SMS_TEST_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.SEND_SMS_TEST_SUCCESS:
      draft.isLoading = false;
      break;

    case MarketingTypes.SEND_SMS_TEST_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.DELETE_SMS_CAMPAIGN_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.DELETE_SMS_CAMPAIGN_SUCCESS:
      draft.isLoading = false;
      draft.smsCampaigns.data = draft.smsCampaigns.data.filter(
        (campaign) => campaign.id !== action?.payload.campaignId
      );
      break;

    case MarketingTypes.DELETE_EMAIL_CAMPAIGN_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.DELETE_EMAIL_CAMPAIGN_SUCCESS:
      draft.isLoading = false;
      draft.emailCampaigns.data = draft.emailCampaigns.data.filter(
        (campaign) => campaign.id !== action?.payload.campaignId
      );
      break;

    case MarketingTypes.DELETE_SMS_CAMPAIGN_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.GET_REPORT_SMS_CAMPAIGN_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.GET_REPORT_SMS_CAMPAIGN_SUCCESS:
      draft.isLoading = false;
      draft.smsCampaigns = {
        ...draft.smsCampaigns,
        reportData: action.payload.data,
      };
      break;

    case MarketingTypes.GET_REPORT_SMS_CAMPAIGN_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.GET_CSV_CUSTOMERS_EXAMPLE_REQUEST:
      draft.importCsv.isLoading = true;
      break;

    case MarketingTypes.GET_CSV_CUSTOMERS_EXAMPLE_SUCCESS:
      draft.importCsv.isLoading = false;
      draft.importCsv.example = action.payload;
      break;

    case MarketingTypes.GET_CSV_CUSTOMERS_EXAMPLE_FAILED:
      draft.importCsv.isLoading = false;
      break;

    case MarketingTypes.IMPORT_CUSTOMERS_REQUEST:
      draft.importCsv.isLoading = true;
      break;

    case MarketingTypes.IMPORT_CUSTOMERS_SUCCESS:
      draft.importCsv.isLoading = false;
      draft.importCsv.importedList = action.payload;
      break;

    case MarketingTypes.IMPORT_CUSTOMERS_FAILED:
      draft.importCsv.isLoading = false;
      break;

    case MarketingTypes.GET_IMPORT_CUSTOMERS_ERRORS_REQUEST:
      draft.importCsv.isLoading = true;
      break;

    case MarketingTypes.GET_IMPORT_CUSTOMERS_ERRORS_SUCCESS:
      draft.importCsv.isLoading = false;
      draft.importCsv.errors.data = action.payload.data;
      draft.importCsv.errors.pagination = action.payload.pagination;
      break;

    case MarketingTypes.GET_IMPORT_CUSTOMERS_ERRORS_FAILED:
      draft.importCsv.isLoading = false;
      break;

    case MarketingTypes.GET_CSV_IMPORT_CUSTOMERS_ERRORS_REQUEST:
      draft.importCsv.isLoading = true;
      break;

    case MarketingTypes.GET_CSV_IMPORT_CUSTOMERS_ERRORS_SUCCESS:
      draft.importCsv.isLoading = false;
      draft.importCsv.errors.csv = action.payload;
      break;

    case MarketingTypes.GET_CSV_IMPORT_CUSTOMERS_ERRORS_FAILED:
      draft.importCsv.isLoading = false;
      break;

    case MarketingTypes.GET_LISTS_REQUEST:
      draft.isLoading = true;
      break;

    case MarketingTypes.GET_LISTS_SUCCESS:
      draft.isLoading = false;
      draft.lists = action.payload;
      break;

    case MarketingTypes.GET_LISTS_FAILED:
      draft.isLoading = false;
      break;

    case MarketingTypes.GET_DETAILS_LIST_REQUEST:
      draft.importCsv.isLoading = true;
      break;

    case MarketingTypes.GET_DETAILS_LIST_SUCCESS:
      draft.importCsv.isLoading = false;
      draft.importCsv.details = action.payload;
      break;

    case MarketingTypes.GET_DETAILS_LIST_FAILED:
      draft.importCsv.isLoading = false;
      break;

    case MarketingTypes.DELETE_LIST_REQUEST:
      draft.importCsv.isLoading = true;
      break;

    case MarketingTypes.DELETE_LIST_SUCCESS:
      draft.importCsv.isLoading = false;
      break;

    case MarketingTypes.DELETE_LIST_FAILED:
      draft.importCsv.isLoading = false;
      break;

    case MarketingTypes.SET_IS_CRM_UNIT:
      draft.isCRMUnit = action.payload.isCRMUnit;
      break;

    case MarketingTypes.SET_STEP_CUSTOMERS_IMPORT:
      draft.importCsv.step = action.payload;
      break;

    case MarketingTypes.GET_MARKETING_SETTINGS_REQUEST:
      draft.loadingSettings = true;
      break;
    case MarketingTypes.GET_MARKETING_SETTINGS_SUCCESS:
      draft.loadingSettings = false;
      draft.settings = action.payload;
      break;
    case MarketingTypes.GET_MARKETING_SETTINGS_FAILED:
      draft.loadingSettings = false;
      break;

    case MarketingTypes.UPDATE_MARKETING_SETTINGS_REQUEST:
      draft.savingSettings = true;
      break;
    case MarketingTypes.UPDATE_MARKETING_SETTINGS_SUCCESS:
      draft.savingSettings = false;
      draft.settings = action.payload;
      break;
    case MarketingTypes.UPDATE_MARKETING_SETTINGS_FAILED:
      draft.savingSettings = false;
      break;
  }
}, INITIAL_STATE);

export default marketingReducer;
