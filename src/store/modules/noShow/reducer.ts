import produce from 'immer';
import { Types as NoShowTypes } from './actions';

export type NoShowItemProps = {
  id: string;
  reservation: {
    id: string;
    name: string;
    date: string;
    time: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
};

export type NoShowProps = {
  loading: boolean;
  saving: boolean;
  data: Array<NoShowItemProps>;
  pagination: {
    is_last_page: boolean;
    current_page: number;
    total: number;
  };
};

export const INITIAL_STATE: NoShowProps = {
  loading: true,
  saving: false,
  data: [],
  pagination: {
    is_last_page: false,
    current_page: 1,
    total: 0,
  },
};

const NoShow = produce((draft: NoShowProps, action) => {
  switch (action.type) {
    case NoShowTypes.GET_NO_SHOW_REQUEST:
      draft.loading = true;
      break;
    case NoShowTypes.GET_NO_SHOW_SUCCESS:
      draft.loading = false;
      if (draft.pagination.current_page != 1) {
        draft.data = draft.data.concat(action.payload);
      } else {
        draft.data = action.payload;
      }
      break;
    case NoShowTypes.GET_NO_SHOW_FAILED:
      draft.loading = false;
      break;

    case NoShowTypes.SET_PAGINATION:
      draft.pagination = action.payload;
      break;

    case NoShowTypes.CHARGED_NO_SHOW_REQUEST:
      draft.loading = true;
      draft.data[
        draft.data.findIndex((noshow) => noshow.id === action.payload.id)
      ].status = 'sent-to-charging';
      break;
    case NoShowTypes.CHARGED_NO_SHOW_SUCCESS:
      draft.loading = false;
      break;
    case NoShowTypes.CHARGED_NO_SHOW_FAILED:
      draft.loading = false;
      draft.data[
        draft.data.findIndex((noshow) => noshow.id === action.payload.id)
      ].status = 'charged';
      break;
  }
}, INITIAL_STATE);

export default NoShow;
