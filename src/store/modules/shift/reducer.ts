import produce from 'immer';
import { ModalStateEnum, ModalProps } from 'src/types';
import { Types as ShiftTypes } from './actions';

export type ShiftItemProps = {
  id: string;
  weekday: number[];
  name: string;
  starts_at: string;
  ends_at: string;
};

export type ShiftProps = {
  saving: boolean;
  loading: boolean;
  editable: null | ShiftItemProps;
  data: ShiftItemProps[];
  isOpen: ModalProps;
};

export const INITIAL_STATE: ShiftProps = {
  loading: false,
  saving: false,
  data: [],
  editable: null,
  isOpen: ModalStateEnum.CLOSED,
};

const shift = produce((draft: ShiftProps, action) => {
  switch (action.type) {
    case ShiftTypes.GET_SHIFTS_REQUEST:
      draft.loading = true;
      break;

    case ShiftTypes.GET_SHIFTS_SUCCESS:
      draft.loading = false;
      draft.data = action.payload;
      break;

    case ShiftTypes.GET_SHIFTS_FAILED:
      draft.saving = false;
      break;

    case ShiftTypes.CREATE_SHIFT_REQUEST:
      draft.saving = true;
      break;

    case ShiftTypes.CREATE_SHIFT_SUCCESS:
      draft.saving = false;

      draft.data.push(action.payload);
      draft.isOpen = ModalStateEnum.CLOSED;
      break;

    case ShiftTypes.CREATE_SHIFT_FAILED:
      draft.saving = false;
      break;

    case ShiftTypes.SET_EDITABLE_ITEM:
      draft.editable = action.payload;
      draft.isOpen = ModalStateEnum.OPENED;
      break;

    case ShiftTypes.EDIT_SHIFT_REQUEST:
      draft.saving = true;
      break;

    case ShiftTypes.EDIT_SHIFT_SUCCESS:
      draft.saving = false;

      draft.data = draft.data.map((shift) => {
        if (shift.id === action.payload.id) {
          return action.payload;
        }

        return shift;
      });
      draft.isOpen = ModalStateEnum.CLOSED;
      break;

    case ShiftTypes.DELETE_SHIFT_REQUEST:
      break;
    case ShiftTypes.DELETE_SHIFT_SUCCESS:
      draft.data = draft.data.filter((shift) => shift.id !== action.payload);
      draft.isOpen = ModalStateEnum.CLOSED;

      break;
    case ShiftTypes.DELETE_SHIFT_FAILED:
      draft.saving = false;
      break;

    case ShiftTypes.OPEN_MODAL:
      draft.isOpen = ModalStateEnum.OPENED;
      break;
    case ShiftTypes.CLOSE_MODAL:
      draft.isOpen = ModalStateEnum.CLOSED;
      draft.editable = null;
      break;
  }
}, INITIAL_STATE);

export default shift;
