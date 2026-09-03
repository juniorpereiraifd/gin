import { ActionCreators, createActions } from 'reduxsauce';
import {
  VoucherItemProps,
  PaginateProps,
  VoucherStatisticsProps,
  VoucherSettings,
  WeekdayPeriod,
  type VoucherStatus,
} from './reducer';

export enum Types {
  GET_VOUCHERS_REQUEST = '@voucher/GET_VOUCHERS_REQUEST',
  GET_VOUCHERS_SUCCESS = '@voucher/GET_VOUCHERS_SUCCESS',
  GET_VOUCHERS_FAILED = '@voucher/GET_VOUCHERS_FAILED',

  GET_VOUCHERS_STATISTICS_REQUEST = '@voucher/GET_VOUCHERS_STATISTICS_REQUEST',
  GET_VOUCHERS_STATISTICS_SUCCESS = '@voucher/GET_VOUCHERS_STATISTICS_SUCCESS',
  GET_VOUCHERS_STATISTICS_FAILED = '@voucher/GET_VOUCHERS_STATISTICS_FAILED',

  GET_VOUCHERS_UPDATE_REQUEST = '@voucher/GET_VOUCHERS_UPDATE_REQUEST',
  GET_VOUCHERS_UPDATE_SUCCESS = '@voucher/GET_VOUCHERS_UPDATE_SUCCESS',
  GET_VOUCHERS_UPDATE_FAILED = '@voucher/GET_VOUCHERS_UPDATE_FAILED',

  GET_VOUCHER_SETTINGS_REQUEST = '@voucher/GET_VOUCHER_SETTINGS_REQUEST',
  GET_VOUCHER_SETTINGS_SUCCESS = '@voucher/GET_VOUCHER_SETTINGS_SUCCESS',
  GET_VOUCHER_SETTINGS_FAILED = '@voucher/GET_VOUCHER_SETTINGS_FAILED',

  UPDATE_VOUCHER_SETTINGS_REQUEST = '@voucher/UPDATE_VOUCHER_SETTINGS_REQUEST',
  UPDATE_VOUCHER_SETTINGS_SUCCESS = '@voucher/UPDATE_VOUCHER_SETTINGS_SUCCESS',
  UPDATE_VOUCHER_SETTINGS_FAILED = '@voucher/UPDATE_VOUCHER_SETTINGS_FAILED',

  UPDATE_VOUCHER_STATUS_REQUEST = '@voucher/UPDATE_VOUCHER_STATUS_REQUEST',
  UPDATE_VOUCHER_STATUS_SUCCESS = '@voucher/UPDATE_VOUCHER_STATUS_SUCCESS',
  UPDATE_VOUCHER_STATUS_FAILED = '@voucher/UPDATE_VOUCHER_STATUS_FAILED',

  GET_GIFTBACK_PERIODS_REQUEST = '@voucher/GET_GIFTBACK_PERIODS_REQUEST',
  GET_GIFTBACK_PERIODS_SUCCESS = '@voucher/GET_GIFTBACK_PERIODS_SUCCESS',
  GET_GIFTBACK_PERIODS_FAILED = '@voucher/GET_GIFTBACK_PERIODS_FAILED',

  CREATE_GIFTBACK_PERIOD_REQUEST = '@voucher/CREATE_GIFTBACK_PERIOD_REQUEST',
  CREATE_GIFTBACK_PERIOD_SUCCESS = '@voucher/CREATE_GIFTBACK_PERIOD_SUCCESS',
  CREATE_GIFTBACK_PERIOD_FAILED = '@voucher/CREATE_GIFTBACK_PERIOD_FAILED',

  UPDATE_GIFTBACK_PERIOD_REQUEST = '@voucher/UPDATE_GIFTBACK_PERIOD_REQUEST',
  UPDATE_GIFTBACK_PERIOD_SUCCESS = '@voucher/UPDATE_GIFTBACK_PERIOD_SUCCESS',
  UPDATE_GIFTBACK_PERIOD_FAILED = '@voucher/UPDATE_GIFTBACK_PERIOD_FAILED',

  DELETE_GIFTBACK_PERIOD_REQUEST = '@voucher/DELETE_GIFTBACK_PERIOD_REQUEST',
  DELETE_GIFTBACK_PERIOD_SUCCESS = '@voucher/DELETE_GIFTBACK_PERIOD_SUCCESS',
  DELETE_GIFTBACK_PERIOD_FAILED = '@voucher/DELETE_GIFTBACK_PERIOD_FAILED',

  SET_GIFTBACK_PERIOD_MODAL_VISIBLE = '@voucher/SET_GIFTBACK_PERIOD_MODAL_VISIBLE',
}

interface Actions extends ActionCreators {
  getVouchersRequest: (payload: { page?: number; perPage?: number; search?: string; isSearch: boolean }) => {
    type: Types.GET_VOUCHERS_REQUEST;
    payload: {
      page?: number;
      perPage?: number;
      search?: string;
      isSearch: boolean;
    };
  };
  getVouchersSuccess: (payload: {
    vouchers: Array<VoucherItemProps>;
    pagination: PaginateProps;
    isSearch: boolean;
  }) => {
    type: Types.GET_VOUCHERS_SUCCESS;
  };
  getVouchersFailed: () => {
    type: Types.GET_VOUCHERS_FAILED;
  };

  getVouchersStatisticsRequest: () => {
    type: Types.GET_VOUCHERS_STATISTICS_REQUEST;
  };
  getVouchersStatisticsSuccess: (payload: VoucherStatisticsProps) => {
    type: Types.GET_VOUCHERS_STATISTICS_SUCCESS;
  };
  getVouchersStatisticsFailed: () => {
    type: Types.GET_VOUCHERS_STATISTICS_FAILED;
  };

  getVouchersUpdateRequest: (voucher: number | string) => {
    type: Types.GET_VOUCHERS_UPDATE_REQUEST;
  };
  getVouchersUpdateSuccess: (payload: Array<VoucherItemProps>) => {
    type: Types.GET_VOUCHERS_UPDATE_SUCCESS;
  };
  getVouchersUpdateFailed: () => {
    type: Types.GET_VOUCHERS_UPDATE_FAILED;
  };

  getVoucherSettingsRequest: () => {
    type: Types.GET_VOUCHER_SETTINGS_REQUEST;
  };
  getVoucherSettingsSuccess: (payload: VoucherSettings) => {
    type: Types.GET_VOUCHER_SETTINGS_SUCCESS;
    payload: VoucherSettings;
  };
  getVoucherSettingsFailed: () => {
    type: Types.GET_VOUCHER_SETTINGS_FAILED;
  };

  updateVoucherSettingsRequest: (payload: Partial<VoucherSettings>) => {
    type: Types.UPDATE_VOUCHER_SETTINGS_REQUEST;
    payload: Partial<VoucherSettings>;
  };
  updateVoucherSettingsSuccess: (payload: VoucherSettings) => {
    type: Types.UPDATE_VOUCHER_SETTINGS_SUCCESS;
    payload: VoucherSettings;
  };
  updateVoucherSettingsFailed: () => {
    type: Types.UPDATE_VOUCHER_SETTINGS_FAILED;
  };

  updateVoucherStatusRequest: (payload: { id: number | string; status: VoucherStatus }) => {
    type: Types.UPDATE_VOUCHER_STATUS_REQUEST;
    payload: { id: number | string; status: VoucherStatus };
  };
  updateVoucherStatusSuccess: (payload: VoucherItemProps) => {
    type: Types.UPDATE_VOUCHER_STATUS_SUCCESS;
    payload: VoucherItemProps;
  };
  updateVoucherStatusFailed: () => {
    type: Types.UPDATE_VOUCHER_STATUS_FAILED;
  };

  getGiftbackPeriodsRequest: () => {
    type: Types.GET_GIFTBACK_PERIODS_REQUEST;
  };
  getGiftbackPeriodsSuccess: (payload: { periods: Array<WeekdayPeriod> }) => {
    type: Types.GET_GIFTBACK_PERIODS_SUCCESS;
    payload: {
      periods: Array<WeekdayPeriod>;
    };
  };
  getGiftbackPeriodsFailed: () => {
    type: Types.GET_GIFTBACK_PERIODS_FAILED;
  };

  createGiftbackPeriodRequest: (payload: Omit<WeekdayPeriod, 'id'>) => {
    type: Types.CREATE_GIFTBACK_PERIOD_REQUEST;
    payload: Omit<WeekdayPeriod, 'id'>;
  };
  createGiftbackPeriodSuccess: (payload: WeekdayPeriod) => {
    type: Types.CREATE_GIFTBACK_PERIOD_SUCCESS;
    payload: WeekdayPeriod;
  };
  createGiftbackPeriodFailed: () => {
    type: Types.CREATE_GIFTBACK_PERIOD_FAILED;
  };

  updateGiftbackPeriodRequest: (payload: WeekdayPeriod) => {
    type: Types.UPDATE_GIFTBACK_PERIOD_REQUEST;
    payload: WeekdayPeriod;
  };
  updateGiftbackPeriodSuccess: (payload: WeekdayPeriod) => {
    type: Types.UPDATE_GIFTBACK_PERIOD_SUCCESS;
    payload: WeekdayPeriod;
  };
  updateGiftbackPeriodFailed: () => {
    type: Types.UPDATE_GIFTBACK_PERIOD_FAILED;
  };

  deleteGiftbackPeriodRequest: (payload: WeekdayPeriod) => {
    type: Types.DELETE_GIFTBACK_PERIOD_REQUEST;
    payload: WeekdayPeriod;
  };
  deleteGiftbackPeriodSuccess: (payload: WeekdayPeriod) => {
    type: Types.DELETE_GIFTBACK_PERIOD_SUCCESS;
    payload: WeekdayPeriod;
  };
  deleteGiftbackPeriodFailed: () => {
    type: Types.DELETE_GIFTBACK_PERIOD_FAILED;
  };

  setGiftbackPeriodModalVisible: (payload: { open: boolean; type: 'create' | 'edit' }) => {
    type: Types.SET_GIFTBACK_PERIOD_MODAL_VISIBLE;
    payload: { open: boolean; type: 'create' | 'edit' };
  };
}

const CreatedActions = createActions(
  {
    getVouchersRequest: ['payload'],
    getVouchersSuccess: ['payload'],
    getVouchersFailed: [],

    getVouchersStatisticsRequest: [],
    getVouchersStatisticsSuccess: ['payload'],
    getVouchersStatisticsFailed: [],

    getVouchersUpdateRequest: ['payload'],
    getVouchersUpdateSuccess: ['payload'],
    getVouchersUpdateFailed: [],

    getVoucherSettingsRequest: [],
    getVoucherSettingsSuccess: ['payload'],
    getVoucherSettingsFailed: [],

    updateVoucherSettingsRequest: ['payload'],
    updateVoucherSettingsSuccess: ['payload'],
    updateVoucherSettingsFailed: [],

    updateVoucherStatusRequest: ['payload'],
    updateVoucherStatusSuccess: ['payload'],
    updateVoucherStatusFailed: [],

    getGiftbackPeriodsRequest: [],
    getGiftbackPeriodsSuccess: ['payload'],
    getGiftbackPeriodsFailed: [],

    createGiftbackPeriodRequest: ['payload'],
    createGiftbackPeriodSuccess: ['payload'],
    createGiftbackPeriodFailed: [],

    updateGiftbackPeriodRequest: ['payload'],
    updateGiftbackPeriodSuccess: ['payload'],
    updateGiftbackPeriodFailed: [],

    deleteGiftbackPeriodRequest: ['payload'],
    deleteGiftbackPeriodSuccess: ['payload'],
    deleteGiftbackPeriodFailed: [],

    setGiftbackPeriodModalVisible: ['payload'],
  },
  {
    prefix: '@voucher/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
