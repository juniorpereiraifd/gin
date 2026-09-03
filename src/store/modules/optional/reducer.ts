import produce from 'immer';
import { Types as OptionalTypes } from './action';
import { ModalStateEnum, ModalProps } from 'src/types';

export type OptionItemProps = {
  id?: string | number;
  title: {
    'pt-br': string;
  };
  active: boolean;
  price: number;
};

export type OptionalItemProps = {
  id: number;
  title: {
    'pt-br': string;
  };
  description: {
    'pt-br': string;
  };
  type: string;
  active?: boolean;
  max_selectable: number;
  min_selectable: number;
  options?: Array<OptionItemProps>;
  items?: Array<{ id: string; item_id: string }>;
};

export type OptionalProps = {
  loading: boolean;
  saving: boolean;
  data: Array<OptionalItemProps>;
  editable: OptionalItemProps | null;
  isOpen: ModalProps;
};

export type OptionalReorderItemProps = {
  id: string | number;
  old_position?: number;
  new_position?: number;
};

export const INITIAL_STATE: OptionalProps = {
  loading: false,
  saving: false,
  data: [],
  editable: null,
  isOpen: ModalStateEnum.CLOSED,
};

const optional = produce((draft: OptionalProps, action) => {
  switch (action.type) {
    case OptionalTypes.GET_OPTIONALS_REQUEST:
      draft.loading = true;
      break;
    case OptionalTypes.GET_OPTIONALS_SUCCESS:
      draft.loading = false;
      draft.data = action.payload;
      break;
    case OptionalTypes.GET_OPTIONALS_FAILED:
      draft.loading = false;
      break;
    case OptionalTypes.RESET_OPTIONALS_FROM_MENU:
      draft.data = [];
      break;
    case OptionalTypes.GET_OPTIONAL_REQUEST:
      draft.loading = true;
      break;
    case OptionalTypes.LOAD_EDIT_INFO:
      draft.isOpen = ModalStateEnum.OPENED;
      break;
    case OptionalTypes.RESET_EDITABLE_FIELD:
      draft.editable = null;
      break;
    case OptionalTypes.GET_OPTIONAL_SUCCESS:
      draft.editable = action.payload;
      draft.loading = false;
      break;
    case OptionalTypes.GET_OPTIONAL_FAILED:
      draft.editable = null;
      break;
    case OptionalTypes.CREATE_OPTIONAL_REQUEST:
      draft.saving = true;
      break;
    case OptionalTypes.CREATE_OPTIONAL_SUCCESS:
      draft.saving = false;
      draft.data.push(action.payload);
      draft.isOpen = ModalStateEnum.CLOSED;

      break;
    case OptionalTypes.CREATE_OPTIONAL_FAILED:
      draft.saving = false;
      break;
    case OptionalTypes.EDIT_OPTIONAL_REQUEST:
      draft.saving = true;
      break;
    case OptionalTypes.EDIT_OPTIONAL_SUCCESS:
      draft.saving = false;
      draft.isOpen = ModalStateEnum.CLOSED;
      draft.data = draft.data.map((optional) => {
        if (optional.id === action.payload.id) {
          return action.payload;
        }

        return optional;
      });
      break;
    case OptionalTypes.EDIT_OPTIONAL_FAILED:
      draft.saving = false;
      break;
    case OptionalTypes.DELETE_OPTIONAL_SUCCESS:
      draft.data = draft.data.filter(
        (optional) => optional.id !== action.payload
      );
      break;
    case OptionalTypes.SHOW_MODAL:
      draft.isOpen = ModalStateEnum.OPENED;
      break;
    case OptionalTypes.HIDE_MODAL:
      draft.isOpen = ModalStateEnum.CLOSED;
      break;
  }
}, INITIAL_STATE);

export default optional;
