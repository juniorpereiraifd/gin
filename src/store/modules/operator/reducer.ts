import produce from 'immer';
import { Types as OperatorTypes } from './actions';
import type { Pagination } from 'src/types';

export type OperatorMutationProps = {
  name: string;
  username: string;
  password: string;
  password_confirmation: string;
  enabled_2fa: boolean;
  units?: LinkedUnit[];
};

export type LinkedUnit = {
  id: string;
  name: string;
};

export type OperatorItemProps = {
  id: string;
  name: string;
  username: string;
  units?: LinkedUnit[];
};

export type OperatorProps = {
  loading: boolean;
  loadingOperator: boolean;
  saving: boolean;
  data: Array<OperatorItemProps>;
  pagination: Pagination | null;
  isMutationDrawerOpen: boolean;
  editable: OperatorItemProps | null;
  selectedOperator: OperatorItemProps | null;
};

export const INITIAL_STATE: OperatorProps = {
  loading: true,
  loadingOperator: false,
  saving: false,
  data: [],
  pagination: null,
  isMutationDrawerOpen: false,
  editable: null,
  selectedOperator: null,
};

const operator = produce((draft: OperatorProps, action) => {
  switch (action.type) {
    case OperatorTypes.GET_OPERATORS_REQUEST:
      draft.loading = true;
      if (action.payload.page == 1) {
        draft.data = [];
      }
      break;
    case OperatorTypes.GET_OPERATORS_SUCCESS:
      draft.loading = false;
      draft.data = action.payload.operators;
      draft.pagination = action.payload.pagination;
      break;
    case OperatorTypes.GET_OPERATORS_FAILED:
      draft.loading = false;
      break;

    case OperatorTypes.GET_OPERATOR_REQUEST:
      draft.loadingOperator = true;
      draft.selectedOperator = null;
      break;
    case OperatorTypes.GET_OPERATOR_SUCCESS:
      draft.loadingOperator = false;
      draft.selectedOperator = action.payload.operator;
      break;
    case OperatorTypes.GET_OPERATOR_FAILED:
      draft.loadingOperator = false;
      draft.selectedOperator = null;
      break;

    case OperatorTypes.CREATE_OPERATOR_REQUEST:
      draft.saving = true;
      break;
    case OperatorTypes.CREATE_OPERATOR_SUCCESS:
      draft.saving = false;
      draft.data.push(action.payload.operator);
      draft.isMutationDrawerOpen = false;
      break;

    case OperatorTypes.CREATE_OPERATOR_FAILED:
      draft.saving = false;
      break;
    case OperatorTypes.EDIT_OPERATOR_REQUEST:
      draft.saving = true;
      break;
    case OperatorTypes.EDIT_OPERATOR_SUCCESS:
      draft.saving = false;
      draft.isMutationDrawerOpen = false;
      draft.editable = null;
      draft.data = draft.data.map((operator) =>
        operator.id === action.payload.operator.id ? action.payload.operator : operator,
      );
      break;
    case OperatorTypes.EDIT_OPERATOR_FAILED:
      draft.saving = false;
      break;

    case OperatorTypes.SET_MUTATION_DRAWER_OPEN:
      draft.isMutationDrawerOpen = action.payload.open;
      break;

    case OperatorTypes.SET_OPERATOR_EDITABLE:
      draft.editable = action.payload.operator;
      break;

    case OperatorTypes.DELETE_OPERATOR_SUCCESS:
      draft.data = draft.data.filter((operator) => operator.id !== action.payload.operatorId);
      break;
  }
}, INITIAL_STATE);

export default operator;
