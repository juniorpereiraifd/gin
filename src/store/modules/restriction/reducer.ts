import produce from 'immer';
import { Types as RestrictionTypes } from './actions';
import { ModalStateEnum, ModalProps } from 'src/types';

export type RestrictionItemProps = {
  id?: string;
  weekday: number;
  starts_at: string;
  ends_at: string;
};

export type RestrictionProps = {
  saving: boolean;
  data: Array<RestrictionItemProps>;
  loading: boolean;
  isOpen: ModalProps;
};

export const INITIAL_STATE: RestrictionProps = {
  saving: false,
  loading: false,
  isOpen: ModalStateEnum.CLOSED,

  data: [],
};

const restriction = produce((draft: RestrictionProps, action) => {
  switch (action.type) {
    case RestrictionTypes.GET_RESTRICTIONS_REQUEST:
      draft.loading = true;
      break;
    case RestrictionTypes.GET_RESTRICTIONS_SUCCESS:
      draft.loading = false;
      draft.data = action.payload;
      break;
    case RestrictionTypes.GET_RESTRICTIONS_FAILED:
      draft.loading = false;
      break;

    case RestrictionTypes.CREATE_RESTRICTION_REQUEST:
      draft.saving = true;
      break;
    case RestrictionTypes.CREATE_RESTRICTION_SUCCESS:
      draft.saving = false;
      draft.data = action.payload;
      draft.isOpen = ModalStateEnum.CLOSED;

      break;
    case RestrictionTypes.CREATE_RESTRICTION_FAILED:
      draft.saving = false;
      break;

    case RestrictionTypes.DELETE_RESTRICTION_SUCCESS:
      draft.data = draft.data.filter(
        (restriction) => restriction.id !== action.payload.id
      );
      break;

    case RestrictionTypes.SHOW_MODAL:
      draft.isOpen = ModalStateEnum.OPENED;
      break;
    case RestrictionTypes.HIDE_MODAL:
      draft.isOpen = ModalStateEnum.CLOSED;
      break;
  }
}, INITIAL_STATE);

export default restriction;
