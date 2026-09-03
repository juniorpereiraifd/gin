import produce from 'immer';
import { Types as VouchersTypes } from './actions';
import dayjs from 'dayjs';

export type Period = {
  name: string;
  hour_start: string;
  hour_end: string;
  discount_percentage: number;
};

export type WeekdayPeriod = Period & {
  id: string;
  day_of_week: string;
};

export type VoucherCommunicationService = 'line' | 'reservation' | 'nps';

export type VoucherSettings = {
  id: number;
  prefix_code: string;
  discount_percentage: number;
  quantity: number;
  starting_date: string;
  ending_date: string;
  giftback_reservation_enabled: boolean;
  giftback_line_enabled: boolean;
  giftback_nps_enabled: boolean;
  term_of_use: number;
  enabled: boolean;
};

export type VoucherStatisticsProps = {
  count: number;
  count_validated: number;
  amount: number;
};

export type VoucherStatus = 'pending' | 'used' | 'canceled' | 'expired' | 'available' | 'out-of-period';

export type VoucherItemProps = {
  id: string | number;
  title: string;
  code: string;
  value: number;
  used: boolean;
  discount?: number;
  status: VoucherStatus;
};

export type PaginateProps = {
  total: number;
  current_page: number;
  next_page: number;
  last_page: number;
  per_page: number;
  is_last_page: boolean;
};

type Weekday = '1' | '2' | '3' | '4' | '5' | '6' | '7';

type PeriodsByWeekday = Array<{
  weekday: Weekday;
  periods: Array<WeekdayPeriod>;
}>;

const DefaultPeriodsByWeekday: PeriodsByWeekday = [
  {
    weekday: '1',
    periods: [],
  },
  {
    weekday: '2',
    periods: [],
  },
  {
    weekday: '3',
    periods: [],
  },
  {
    weekday: '4',
    periods: [],
  },
  {
    weekday: '5',
    periods: [],
  },
  {
    weekday: '6',
    periods: [],
  },
  {
    weekday: '7',
    periods: [],
  },
];

export type VourcherProps = {
  saving: boolean;
  savingSettings: boolean;
  savingPeriods: boolean;
  loading: boolean;
  loadingSettings: boolean;
  loadingPeriodsByWeekday: boolean;
  data: Array<VoucherItemProps>;
  settings: VoucherSettings | null;
  pagination: PaginateProps | null;
  statistics?: VoucherStatisticsProps;
  idInValidate: number | string | null;
  periodsByWeekday: PeriodsByWeekday;
  isGiftbackPeriodModalCreateVisible: boolean;
  isGiftbackPeriodModalEditVisible: boolean;
};

export const INITIAL_STATE: VourcherProps = {
  saving: false,
  savingSettings: false,
  savingPeriods: false,
  loading: true,
  loadingSettings: false,
  loadingPeriodsByWeekday: false,
  data: [],
  settings: null,
  pagination: null,
  idInValidate: null,
  periodsByWeekday: DefaultPeriodsByWeekday,
  isGiftbackPeriodModalCreateVisible: false,
  isGiftbackPeriodModalEditVisible: false,
};

const voucher = produce((draft: VourcherProps, action) => {
  switch (action.type) {
    case VouchersTypes.GET_VOUCHERS_REQUEST:
      draft.loading = true;
      break;
    case VouchersTypes.GET_VOUCHERS_SUCCESS:
      draft.loading = false;
      draft.data =
        action.payload.isSearch || action.payload.pagination.current_page === 1
          ? action.payload.vouchers
          : draft.data.concat(action.payload.vouchers);
      draft.pagination = action.payload.pagination;
      break;
    case VouchersTypes.GET_VOUCHERS_FAILED:
      draft.loading = false;
      draft.data = [];
      draft.pagination = null;
      break;
    case VouchersTypes.GET_VOUCHERS_STATISTICS_REQUEST:
      draft.loading = true;
      break;
    case VouchersTypes.GET_VOUCHERS_STATISTICS_SUCCESS:
      draft.loading = false;
      draft.statistics = action.payload;
      break;
    case VouchersTypes.GET_VOUCHERS_STATISTICS_FAILED:
      draft.loading = false;
      break;
    case VouchersTypes.GET_VOUCHERS_UPDATE_REQUEST:
      draft.loading = true;
      draft.idInValidate = action.payload;
      break;
    case VouchersTypes.GET_VOUCHERS_UPDATE_SUCCESS: {
      draft.data = draft.data.map((item) => {
        if (item.id === action.payload.id)
          return {
            ...item,
            used: true,
          };
        return item;
      });
      draft.idInValidate = null;

      break;
    }
    case VouchersTypes.GET_VOUCHERS_UPDATE_FAILED:
      draft.loading = false;
      break;

    case VouchersTypes.GET_VOUCHER_SETTINGS_REQUEST:
      draft.loadingSettings = true;
      break;
    case VouchersTypes.GET_VOUCHER_SETTINGS_SUCCESS:
      draft.loadingSettings = false;
      draft.settings = action.payload;
      break;
    case VouchersTypes.GET_VOUCHER_SETTINGS_FAILED:
      draft.loadingSettings = false;
      break;

    case VouchersTypes.UPDATE_VOUCHER_SETTINGS_REQUEST:
      draft.savingSettings = true;
      break;
    case VouchersTypes.UPDATE_VOUCHER_SETTINGS_SUCCESS:
      draft.savingSettings = false;
      draft.settings = action.payload;
      break;
    case VouchersTypes.UPDATE_VOUCHER_SETTINGS_FAILED:
      draft.savingSettings = false;
      break;

    case VouchersTypes.UPDATE_VOUCHER_STATUS_REQUEST:
      draft.saving = true;
      break;
    case VouchersTypes.UPDATE_VOUCHER_STATUS_SUCCESS:
      draft.saving = false;
      draft.data = draft.data.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
      break;
    case VouchersTypes.UPDATE_VOUCHER_STATUS_FAILED:
      draft.saving = false;
      break;

    case VouchersTypes.GET_GIFTBACK_PERIODS_REQUEST:
      draft.loadingPeriodsByWeekday = true;
      break;

    case VouchersTypes.GET_GIFTBACK_PERIODS_SUCCESS:
      draft.loadingPeriodsByWeekday = false;
      const grouped: Record<Weekday, WeekdayPeriod[]> = {
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
      };

      action.payload.periods.forEach((item: WeekdayPeriod) => {
        if (!grouped[item.day_of_week as Weekday]) {
          grouped[item.day_of_week as Weekday] = [];
        }

        grouped[item.day_of_week as Weekday].push(item);
      });

      draft.periodsByWeekday = Object.entries(grouped).map(([weekday, periods]) => ({
        weekday: weekday as Weekday,
        periods,
      }));
      break;

    case VouchersTypes.GET_GIFTBACK_PERIODS_FAILED:
      draft.loadingPeriodsByWeekday = false;
      break;

    case VouchersTypes.CREATE_GIFTBACK_PERIOD_REQUEST:
      draft.savingPeriods = true;
      break;

    case VouchersTypes.CREATE_GIFTBACK_PERIOD_SUCCESS:
      draft.savingPeriods = false;
      const updatedDayOfWeek = draft.periodsByWeekday.find(
        (item) => item.weekday === (action.payload.day_of_week as Weekday)
      );

      if (updatedDayOfWeek) {
        updatedDayOfWeek.periods.push(action.payload);

        updatedDayOfWeek.periods.sort((a, b) => {
          return dayjs(a.hour_start, 'HH:mm').isBefore(dayjs(b.hour_start, 'HH:mm')) ? -1 : 1;
        });
      }

      draft.isGiftbackPeriodModalCreateVisible = false;
      break;

    case VouchersTypes.CREATE_GIFTBACK_PERIOD_FAILED:
      draft.savingPeriods = false;
      break;

    case VouchersTypes.UPDATE_GIFTBACK_PERIOD_REQUEST:
      draft.savingPeriods = true;
      break;

    case VouchersTypes.UPDATE_GIFTBACK_PERIOD_SUCCESS:
      draft.savingPeriods = false;
      const updatedDayOfWeekEdit = draft.periodsByWeekday.find(
        (item) => item.weekday === (action.payload.day_of_week as Weekday)
      );

      if (updatedDayOfWeekEdit) {
        const index = updatedDayOfWeekEdit.periods.findIndex((item) => item.id === action.payload.id);

        if (index !== -1) {
          updatedDayOfWeekEdit.periods[index] = action.payload;
        }
      }

      draft.isGiftbackPeriodModalEditVisible = false;
      break;

    case VouchersTypes.UPDATE_GIFTBACK_PERIOD_FAILED:
      draft.savingPeriods = false;
      break;

    case VouchersTypes.DELETE_GIFTBACK_PERIOD_REQUEST:
      draft.savingPeriods = true;
      break;

    case VouchersTypes.DELETE_GIFTBACK_PERIOD_SUCCESS:
      draft.savingPeriods = false;
      const updatedDayOfWeekDelete = draft.periodsByWeekday.find(
        (item) => item.weekday === (action.payload.day_of_week as Weekday)
      );

      if (updatedDayOfWeekDelete) {
        updatedDayOfWeekDelete.periods = updatedDayOfWeekDelete.periods.filter((item) => item.id !== action.payload.id);
      }
      break;

    case VouchersTypes.DELETE_GIFTBACK_PERIOD_FAILED:
      draft.savingPeriods = false;
      break;

    case VouchersTypes.SET_GIFTBACK_PERIOD_MODAL_VISIBLE:
      if (action.payload.type === 'create') {
        draft.isGiftbackPeriodModalCreateVisible = action.payload.open;
      } else if (action.payload.type === 'edit') {
        draft.isGiftbackPeriodModalEditVisible = action.payload.open;
      }
      break;
  }
}, INITIAL_STATE);

export default voucher;
