import produce from 'immer';
import { ModalStateEnum, ModalProps } from 'src/types';
import { Types as ScheduleTypes } from './actions';

export const TabKeys = {
  SUNDAY: '7',
  MONDAY: '1',
  TUESDAY: '2',
  WEDNESDAY: '3',
  THURSDAY: '4',
  FRIDAY: '5',
  SATURDAY: '6',
};

function insertAndSortByTime(list: ScheduleItemProps[], newItem?: ScheduleItemProps): ScheduleItemProps[] {
  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const updatedList = [...list];

  if (newItem !== undefined) {
    updatedList.push(newItem);
  }

  return updatedList.sort((a, b) => parseTime(a.started_at) - parseTime(b.started_at));
}

type DayProps = {
  [key: number]: number;
};

const days: DayProps = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
  7: 1,
};

const handleToShowInGrade = (item: ScheduleItemProps) => {
  const started_at = item.started_at.split(':')[0];
  const ended_at = item.ended_at.split(':')[0];
  const dates = [];
  for (let i = parseInt(started_at); i <= parseInt(ended_at); i++) {
    const date = new Date(2020, 10, days[item.weekday]);
    date.setHours(i);
    dates.push(date);
  }

  return dates;
};

export const SCHEDULE_TYPE = {
  PAID_GRADE: 'paid_grade',
  NOSHOW: 'noshow',
} as const;

export type ScheduleTypeKey = keyof typeof SCHEDULE_TYPE;

export type ScheduleTypeValue = (typeof SCHEDULE_TYPE)[ScheduleTypeKey];

export const SCHEDULE_BILLING_TYPE = {
  FIXED: 'fixed',
  PER_PERSON: 'per_person',
} as const;

export type ScheduleBillingTypeKey = keyof typeof SCHEDULE_BILLING_TYPE;

export type ScheduleBillingTypeValue = (typeof SCHEDULE_BILLING_TYPE)[ScheduleBillingTypeKey];

export type ScheduleItemProps = {
  id?: number | string;
  sector_id: number | string;
  weekday: number;
  started_at: string;
  ended_at: string;
  minute_step: number;
  discount: number;
  diff?: string;
  minutes_in_advance: number;
  active: boolean;
  schedule_map?: Array<{
    number_of_tables: number | null;
    number_of_people: number;
  }>;
  schedule_product?: {
    description: string;
    price: number;
    refund_hours: number;
    type: ScheduleTypeValue;
    billing_type: ScheduleBillingTypeValue;
  };
  has_reservations?: boolean;
  reservation_count?: number;
  chair_count?: number;
  total_seats?: number;
};

export type ScheduleProps = {
  loading: boolean;
  saving: boolean;
  data: Array<ScheduleItemProps>;
  editable: ScheduleItemProps | null;
  selectedDay: string;
  selecteds: Array<Date>;
  isOpen: ModalProps;
  pagination: PaginateProps | null;
};

export type PaginateProps = {
  total: number;
  current_page: number;
  next_page: number;
  last_page: number;
  per_page: number;
  is_last_page: boolean;
};

export const INITIAL_STATE: ScheduleProps = {
  loading: true,
  saving: false,
  data: [],
  selecteds: [],
  editable: null,
  selectedDay: TabKeys.SUNDAY,
  isOpen: ModalStateEnum.CLOSED,
  pagination: null,
};

const schedule = produce((draft: ScheduleProps, action) => {
  switch (action.type) {
    case ScheduleTypes.GET_SCHEDULES_REQUEST:
      draft.loading = true;
      if (action.payload.page === 1) {
        draft.data = [];
      }

      break;
    case ScheduleTypes.GET_SCHEDULES_SUCCESS:
      draft.loading = false;
      if (action.payload.page === 1) {
        draft.data = action.payload.schedules;
      } else {
        draft.data = draft.data.concat(action.payload.schedules);
      }
      draft.selecteds = action.payload.selecteds.map(handleToShowInGrade).flat();
      draft.pagination = action.payload.pagination;

      break;
    case ScheduleTypes.GET_SCHEDULES_FAILED:
      draft.loading = false;
      break;
    case ScheduleTypes.CREATE_SCHEDULE_REQUEST:
      draft.saving = true;
      break;
    case ScheduleTypes.CREATE_SCHEDULE_SUCCESS:
      draft.saving = false;
      draft.isOpen = ModalStateEnum.CLOSED;

      if (action.payload.item !== undefined) {
        draft.data = insertAndSortByTime(draft.data, action.payload.item);
      }

      if (draft.pagination) {
        draft.pagination = {
          ...draft.pagination,
          total: draft.pagination.total + 1,
        };
      }
      break;

    case ScheduleTypes.CREATE_SCHEDULE_FAILED:
      draft.saving = false;
      break;
    case ScheduleTypes.EDIT_SCHEDULE_REQUEST:
      draft.saving = true;
      break;
    case ScheduleTypes.EDIT_SCHEDULE_SUCCESS:
      draft.saving = false;
      draft.isOpen = ModalStateEnum.CLOSED;
      draft.data = insertAndSortByTime(
        draft.data.map((item) => {
          if (item.id === action.payload.schedule.id) {
            return {
              ...item,
              ...action.payload.schedule,
            };
          }

          return item;
        }),
      );

      break;
    case ScheduleTypes.EDIT_SCHEDULE_FAILED:
      draft.saving = false;
      break;

    case ScheduleTypes.DELETE_SCHEDULE_SUCCESS:
      draft.isOpen = ModalStateEnum.CLOSED;
      draft.data = draft.data.filter((item) => item.id !== action.payload.id);
      if (draft.pagination) {
        draft.pagination = {
          ...draft.pagination,
          total: draft.pagination.total - 1,
        };
      }
      break;
    case ScheduleTypes.DELETE_SCHEDULE_FAILED:
      draft.saving = false;
      break;

    case ScheduleTypes.SHOW_MODAL:
      draft.editable = null;
      draft.isOpen = ModalStateEnum.OPENED;
      break;
    case ScheduleTypes.HIDE_MODAL:
      draft.isOpen = ModalStateEnum.CLOSED;
      draft.editable = null;
      break;
    case ScheduleTypes.SET_SCHEDULES:
      draft.selecteds = action.payload;
      break;
    case ScheduleTypes.SET_EDITABLE_ITEM:
      draft.editable = draft.data.find((item) => item.id === action.payload.id) || null;
      draft.isOpen = ModalStateEnum.OPENED;

      break;
    case ScheduleTypes.SET_SELECTED_DAY:
      draft.selectedDay = action.payload.day;

      break;
  }
}, INITIAL_STATE);

export default schedule;
