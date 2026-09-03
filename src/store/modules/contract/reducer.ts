import produce from 'immer';
import { Types as ConstractTypes } from './actions';

export type ContractItemProps = {
  id: string;
  name: string;
  file: string;
  restrictions: Array<{
    id: string;
    unit_id: string;
  }>;
  signatures: [];
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
};

export type ContractProps = {
  loading: boolean;
  showOptin: boolean;
  data: Array<ContractItemProps>;
  pagination: {
    is_last_page: boolean;
    current_page: number;
  };
};

export const INITIAL_STATE: ContractProps = {
  loading: true,
  showOptin: false,
  data: [],
  pagination: {
    is_last_page: false,
    current_page: 1,
  },
};

const contract = produce((draft: ContractProps, action) => {
  switch (action.type) {
    case ConstractTypes.GET_UNITY_CONTRACT_REQUEST:
      draft.loading = true;
      break;
    case ConstractTypes.GET_UNITY_CONTRACT_SUCCESS:
      draft.loading = false;
      draft.showOptin = false;
      draft.data = action.payload.data;
      draft.pagination.current_page = action.payload.pagination.current_page;
      draft.pagination.is_last_page = action.payload.pagination.is_last_page;

      if (action.payload.pagination.total > 0) {
        draft.showOptin = true;
      }
      break;
    case ConstractTypes.GET_UNITY_CONTRACT_FAILED:
      draft.loading = false;
      break;
    case ConstractTypes.ACCEPT_UNITY_CONTRACT_REQUEST:
      draft.loading = true;
      break;
    case ConstractTypes.ACCEPT_UNITY_CONTRACT_SUCCESS:
      draft.loading = false;
      draft.showOptin = false;
      draft.data = [];
      draft.pagination = {
        is_last_page: false,
        current_page: 1,
      };
      break;
    case ConstractTypes.ACCEPT_UNITY_CONTRACT_FAILED:
      draft.loading = false;
      break;
    case ConstractTypes.RESET_CONTRACT_STATE:
      draft.loading = true;
      draft.showOptin = false;
      draft.data = [];
      draft.pagination = {
        is_last_page: false,
        current_page: 1,
      };
      break;
  }
}, INITIAL_STATE);

export default contract;
