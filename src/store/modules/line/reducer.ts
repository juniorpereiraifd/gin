import produce from 'immer';
import { Types as LineTypes } from './actions';

export type LineSettings = {
  enabled: boolean;
  estimated_wait_time_enabled: boolean;
  id: string;
  max_code: number;
  max_table_people: number;
  min_code: number;
  nps_enabled: boolean;
  paused: boolean;
  pricing: number;
  qr_code_enabled: boolean;
  qr_code_priority_modal_enabled: boolean;
  remote_enabled: boolean;
  table_people: number[];
  tables_in_line: number;
  tolerance: number;
};

export type LineProps = {
  saving: boolean;
  loading: boolean;
  settings: LineSettings | null;
  errors: Array<{
    name: string;
    errors: Array<string>;
  }>;
};

export const INITIAL_STATE: LineProps = {
  saving: false,
  loading: true,
  errors: [],
  settings: null,
};

const line = produce((draft: LineProps, action) => {
  switch (action.type) {
    case LineTypes.GET_LINE_SETTINGS_REQUEST:
      draft.loading = true;
      draft.errors = [];
      break;
    case LineTypes.GET_LINE_SETTINGS_SUCCESS:
      draft.loading = false;
      draft.settings = action.payload;
      break;
    case LineTypes.GET_LINE_SETTINGS_FAILED:
      draft.loading = false;
      break;

    case LineTypes.UPDATE_LINE_SETTINGS_REQUEST:
      draft.saving = true;
      draft.errors = [];
      break;
    case LineTypes.UPDATE_LINE_SETTINGS_SUCCESS:
      draft.saving = false;
      draft.settings = action.payload;
      break;
    case LineTypes.UPDATE_LINE_SETTINGS_FAILED:
      draft.saving = false;
      draft.errors = action.payload;
      break;
  }
}, INITIAL_STATE);

export default line;
