import produce from 'immer';
import { ModalStateEnum, ModalProps, type Pagination } from 'src/types';

import { Types as CustomFieldTypes } from './actions';

export type CustomFieldItemProps = {
  id?: string;
  title: string;
  type: 'text' | 'select';
  required: boolean;
  metadata?: {
    options: string[];
  } | null;
};

export type CustomFieldProps = {
  saving: boolean;
  loading: boolean;
  errors: Array<{
    name: string;
    errors: Array<string>;
  }>;
  editable: CustomFieldItemProps | null;
  data: Array<CustomFieldItemProps>;
  isOpen: ModalProps;
  pagination: Pagination | null;
};

export const INITIAL_STATE: CustomFieldProps = {
  saving: false,
  loading: true,
  errors: [],
  data: [],
  editable: null,
  isOpen: ModalStateEnum.CLOSED,
  pagination: null,
};

const customField = produce((draft: CustomFieldProps, action) => {
  switch (action.type) {
    case CustomFieldTypes.GET_CUSTOM_FIELDS_REQUEST:
      draft.loading = true;
      draft.errors = [];
      break;
    case CustomFieldTypes.GET_CUSTOM_FIELDS_SUCCESS:
      draft.loading = false;
      draft.data = action.payload.data;
      draft.pagination = action.payload.pagination;
      break;
    case CustomFieldTypes.GET_CUSTOM_FIELDS_FAILED:
      break;

    case CustomFieldTypes.CREATE_CUSTOM_FIELD_REQUEST:
      draft.saving = true;
      draft.errors = [];
      break;
    case CustomFieldTypes.CREATE_CUSTOM_FIELD_SUCCESS:
      draft.saving = false;
      draft.data = draft.data.concat(action.payload);
      break;
    case CustomFieldTypes.CREATE_CUSTOM_FIELD_FAILED:
      draft.saving = false;
      draft.errors = action.payload;
      break;

    case CustomFieldTypes.EDIT_CUSTOM_FIELD_REQUEST:
      draft.saving = true;
      break;
    case CustomFieldTypes.EDIT_CUSTOM_FIELD_SUCCESS:
      draft.saving = false;
      draft.editable = null;
      draft.data[draft.data.findIndex((data) => data.id === action.payload.id)] = action.payload;
      break;
    case CustomFieldTypes.EDIT_CUSTOM_FIELD_FAILED:
      draft.saving = false;
      break;

    case CustomFieldTypes.DELETE_CUSTOM_FIELD_REQUEST:
      draft.saving = true;
      break;
    case CustomFieldTypes.DELETE_CUSTOM_FIELD_SUCCESS:
      draft.saving = false;
      draft.data = draft.data.filter((data) => data.id !== action.payload);
      break;
    case CustomFieldTypes.DELETE_CUSTOM_FIELD_FAILED:
      draft.saving = false;
      break;

    case CustomFieldTypes.SET_EDITABLE_ITEM:
      draft.editable = action.payload;
      break;

    case CustomFieldTypes.SHOW_MODAL:
      draft.isOpen = ModalStateEnum.OPENED;
      break;
    case CustomFieldTypes.HIDE_MODAL:
      draft.isOpen = ModalStateEnum.CLOSED;
      break;
  }
}, INITIAL_STATE);

export default customField;
