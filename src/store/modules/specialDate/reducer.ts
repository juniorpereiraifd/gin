import produce from 'immer';
import { ModalStateEnum, ModalProps, Pagination } from 'src/types';
import { Types as SpecialDateTypes } from './actions';
import type { ScheduleBillingTypeValue, ScheduleTypeValue } from 'src/store/modules/schedule/reducer';

export type ScheduleProps = {
  id: string;
  date: string;
  discount: number;
  ended_at: string;
  minute_step: number;
  name: string;
  started_at: string;
  total_seats: number | null;
};

type ScheduleMapItemProps = {
  number_of_tables: number | null;
  number_of_people: number;
};

type ScheduleProductProps = {
  description: string;
  price: number;
  refund_hours: number;
  type: ScheduleTypeValue;
  billing_type: ScheduleBillingTypeValue;
};

export type SpecialDateItemProps = {
  schedule: Pick<ScheduleProps, 'name' | 'started_at' | 'ended_at' | 'minute_step' | 'total_seats'> & {
    id?: string;
    sector_name?: string;
    start_date?: string;
    end_date?: string;
    date?: string;
    discount?: number;
    minutes_in_advance?: number;
  };
  schedule_map: ScheduleMapItemProps[];
  schedule_product?: ScheduleProductProps;
};

export type SpecialDataItemPropsReceive = ScheduleProps & {
  schedule_map: ScheduleMapItemProps[];
  schedule_product?: ScheduleProductProps;
};

export type SpecialDateProps = {
  saving: boolean;
  loading: boolean;
  loadingOne: boolean;
  errors: Array<{
    name: string;
    errors: Array<string>;
  }>;
  editable: SpecialDateItemProps | null;
  data: Array<SpecialDataItemPropsReceive>;
  isOpen: ModalProps;
  pagination: Pagination | null;
};

export const INITIAL_STATE: SpecialDateProps = {
  saving: false,
  loading: true,
  loadingOne: false,
  errors: [],
  data: [],
  editable: null,
  isOpen: ModalStateEnum.CLOSED,
  pagination: null,
};

const specialDate = produce((draft: SpecialDateProps, action) => {
  switch (action.type) {
    case SpecialDateTypes.GET_SPECIAL_DATE_REQUEST:
      draft.loadingOne = true;
      break;
    case SpecialDateTypes.GET_SPECIAL_DATE_SUCCESS:
      draft.loadingOne = false;
      draft.editable = action.payload;
      break;
    case SpecialDateTypes.GET_SPECIAL_DATE_FAILED:
      draft.loadingOne = false;
      break;

    case SpecialDateTypes.GET_SPECIAL_DATES_REQUEST:
      draft.loading = true;
      draft.errors = [];
      if (action.payload.with_filter) draft.data = [];
      break;
    case SpecialDateTypes.GET_SPECIAL_DATES_SUCCESS:
      draft.loading = false;
      draft.data = draft.data.concat(action.payload.data);
      draft.pagination = action.payload.pagination;
      break;
    case SpecialDateTypes.GET_SPECIAL_DATES_FAILED:
      draft.loading = false;
      break;

    case SpecialDateTypes.CREATE_SPECIAL_DATE_REQUEST:
      draft.saving = true;
      draft.errors = [];
      break;
    case SpecialDateTypes.CREATE_SPECIAL_DATE_SUCCESS:
      draft.saving = false;
      draft.isOpen = ModalStateEnum.CLOSED;
      draft.data = draft.data.concat(action.payload);
      break;
    case SpecialDateTypes.CREATE_SPECIAL_DATE_FAILED:
      draft.saving = false;
      draft.errors = action.payload;
      break;

    case SpecialDateTypes.SET_EDITABLE_ITEM:
      draft.isOpen = ModalStateEnum.OPENED;
      draft.editable = action.payload;

      break;
    case SpecialDateTypes.EDIT_SPECIAL_DATE_REQUEST:
      draft.saving = true;
      break;
    case SpecialDateTypes.EDIT_SPECIAL_DATE_SUCCESS:
      draft.saving = false;
      draft.isOpen = ModalStateEnum.CLOSED;
      draft.editable = null;
      draft.data[draft.data.findIndex((data) => data.id === action.payload.id)] = action.payload;
      break;
    case SpecialDateTypes.EDIT_SPECIAL_DATE_FAILED:
      draft.saving = false;
      break;

    case SpecialDateTypes.DELETE_SPECIAL_DATE_SUCCESS:
      draft.data = draft.data.filter((data) => data.id !== action.payload);
      break;

    case SpecialDateTypes.SHOW_MODAL:
      draft.editable = null;
      draft.isOpen = ModalStateEnum.OPENED;
      break;
    case SpecialDateTypes.HIDE_MODAL:
      draft.isOpen = ModalStateEnum.CLOSED;
      draft.editable = null;
      break;
  }
}, INITIAL_STATE);

export default specialDate;
