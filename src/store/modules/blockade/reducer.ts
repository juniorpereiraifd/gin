import produce from 'immer';
import { ModalStateEnum, ModalProps, Pagination } from 'src/types';

import { Types as BlockadeTypes } from './actions';

export type BlockadeItemProps = {
  id: string;
  title: string;
  date: string;
  date_range: string;
  start_date: string;
  end_date: string;
  starts_at: string;
  ends_at: string;
  active: boolean;
};

export type BlockadeProps = {
  loading: boolean;
  saving: boolean;
  editable: BlockadeItemProps | null;
  data: Array<BlockadeItemProps>;
  isOpen: ModalProps;
  errors: Array<{
    name: string;
    errors: Array<string>;
  }>;
  pagination: Pagination | null;
};

export const INITIAL_STATE: BlockadeProps = {
  loading: true,
  saving: false,
  editable: null,
  data: [],
  isOpen: ModalStateEnum.CLOSED,
  errors: [],
  pagination: null,
};

const blockade = produce((draft: BlockadeProps, action) => {
  switch (action.type) {
    case BlockadeTypes.GET_BLOCKADES_REQUEST:
      draft.loading = true;
      draft.errors = [];
      if (action.payload?.with_filter) draft.data = [];
      break;
    case BlockadeTypes.GET_BLOCKADES_SUCCESS:
      draft.loading = false;
      draft.data = draft.data.concat(action.payload.data);
      draft.pagination = action.payload.pagination;
      break;
    case BlockadeTypes.GET_BLOCKADES_FAILED:
      draft.loading = false;
      break;
    case BlockadeTypes.CREATE_BLOCKADE_REQUEST:
      draft.saving = true;
      draft.errors = [];
      break;
    case BlockadeTypes.CREATE_BLOCKADE_SUCCESS:
      draft.saving = false;
      draft.isOpen = ModalStateEnum.CLOSED;
      draft.data = draft.data.concat(action.payload);
      break;
    case BlockadeTypes.CREATE_BLOCKADE_FAILED:
      draft.saving = false;
      draft.errors = action.payload;
      break;
    case BlockadeTypes.SET_EDITABLE_ITEM:
      draft.isOpen = ModalStateEnum.OPENED;
      draft.editable = action.payload;

      break;
    case BlockadeTypes.EDIT_BLOCKADE_REQUEST:
      draft.saving = true;
      break;
    case BlockadeTypes.EDIT_BLOCKADE_SUCCESS:
      draft.saving = false;
      draft.isOpen = ModalStateEnum.CLOSED;
      draft.editable = null;
      draft.data[
        draft.data.findIndex((blockade) => blockade?.id === action?.payload?.id)
      ] = action.payload;
      break;
    case BlockadeTypes.EDIT_BLOCKADE_FAILED:
      draft.saving = false;
      break;
    case BlockadeTypes.DELETE_BLOCKADE_SUCCESS:
      draft.data = draft.data.filter(
        (blockade) => blockade.id !== action.payload
      );
      break;
    case BlockadeTypes.SHOW_MODAL:
      draft.editable = null;
      draft.isOpen = ModalStateEnum.OPENED;
      break;
    case BlockadeTypes.HIDE_MODAL:
      draft.isOpen = ModalStateEnum.CLOSED;
      break;
  }
}, INITIAL_STATE);

export default blockade;
