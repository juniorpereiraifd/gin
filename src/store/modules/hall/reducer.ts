import produce from 'immer';
import { Types as HallTypes } from './actions';
import { UnityItemProps } from 'src/store/modules/unity/reducer';

export type Schedule = { from: number; to: number; date: string | null };

export type Table = {
  number: number;
  min_people: number;
  max_people: number;
};

export type TableMap = Table & {
  id?: string;
  group: string;
};

export type MutableTableMap = TableMap & {
  draft: boolean;
};

export type HallItemProps = {
  id: string;
  name: string;
  active: boolean;
  flexible: boolean;
  allow_delete: boolean;
  schedules?: Array<Array<Schedule>>;
  type: string;
  map: Array<TableMap>;
};

export type HallProps = {
  loading: boolean;
  loadingHall: boolean;
  saving: boolean;
  unity: UnityItemProps | null;
  hall: HallItemProps | null;
  data: Array<HallItemProps>;
  selectedTableMap: Array<MutableTableMap> | null;
  selectedTable: Table | null;
  savingCreateTable: boolean;
  savingUpdateTable: boolean;
  savingDeleteTable: boolean;
  savingDeleteTableMap: boolean;
  pagination: {
    is_last_page: boolean;
    current_page: number;
  };
};

export const INITIAL_STATE: HallProps = {
  loading: true,
  loadingHall: true,
  saving: false,
  unity: null,
  hall: null,
  data: [],
  selectedTableMap: null,
  selectedTable: null,
  savingCreateTable: false,
  savingUpdateTable: false,
  savingDeleteTable: false,
  savingDeleteTableMap: false,
  pagination: {
    is_last_page: false,
    current_page: 1,
  },
};

const hall = produce((draft: HallProps, action) => {
  switch (action.type) {
    case HallTypes.GET_UNITY_REQUEST:
      draft.loading = true;
      break;
    case HallTypes.GET_UNITY_SUCCESS:
      draft.loading = false;
      draft.unity = action.payload;
      break;
    case HallTypes.GET_UNITY_FAILED:
      draft.loading = false;
      break;
    case HallTypes.GET_HALLS_REQUEST:
      draft.loadingHall = true;

      if (action.payload.reset) draft.data = [];

      break;
    case HallTypes.GET_HALLS_SUCCESS:
      draft.loadingHall = false;

      draft.data = draft.data.concat(action.payload.data);

      draft.pagination = action.payload.pagination;
      break;
    case HallTypes.GET_HALLS_FAILED:
      draft.loadingHall = false;
      break;
    case HallTypes.GET_HALL_REQUEST:
      draft.loadingHall = true;
      break;
    case HallTypes.GET_HALL_SUCCESS:
      draft.loadingHall = false;
      draft.hall = action.payload;
      break;
    case HallTypes.GET_HALL_FAILED:
      draft.loadingHall = false;
      break;
    case HallTypes.CREATE_HALL_REQUEST:
      draft.saving = true;
      break;
    case HallTypes.CREATE_HALL_SUCCESS:
      draft.saving = false;
      draft.data.push(action.payload);

      break;
    case HallTypes.CREATE_HALL_FAILED:
      draft.saving = false;
      break;
    case HallTypes.CHANGE_STATUS_HALL_REQUEST:
      draft.loading = false;
      break;
    case HallTypes.CHANGE_STATUS_HALL_SUCCESS:
      draft.loading = false;
      draft.hall = action.payload.data;
      break;
    case HallTypes.CHANGE_STATUS_HALL_FAILED:
      draft.loading = false;
      break;

    case HallTypes.CHANGE_FLEXIBLE_HALL_REQUEST:
      draft.loading = false;
      break;
    case HallTypes.CHANGE_FLEXIBLE_HALL_SUCCESS:
      draft.loading = false;
      draft.hall = action.payload.data;
      break;
    case HallTypes.CHANGE_FLEXIBLE_HALL_FAILED:
      draft.loading = false;
      break;

    case HallTypes.UPDATE_HALL_REQUEST:
      draft.saving = true;
      break;
    case HallTypes.UPDATE_HALL_SUCCESS:
      draft.saving = false;
      draft.hall = action.payload;
      break;
    case HallTypes.UPDATE_HALL_FAILED:
      draft.saving = false;
      break;

    case HallTypes.SET_TABLE_MAP:
      if (action.tableMap === null || draft.selectedTableMap === null) {
        draft.selectedTableMap = action.tableMap;

        break;
      }

      draft.selectedTableMap = [...draft.selectedTableMap, ...action.tableMap];
      break;

    case HallTypes.CREATE_TABLE_MAP_REQUEST:
      draft.savingCreateTable = true;

      break;

    case HallTypes.CREATE_TABLE_MAP_SUCCESS:
      draft.savingCreateTable = false;

      if (draft.selectedTableMap !== null) {
        draft.selectedTableMap = draft.selectedTableMap.map((item) => {
          const tableSaved = (action.payload.tableCreated as Array<TableMap>).find(
            (table) => table.number === item.number
          );

          if (tableSaved !== undefined) {
            return {
              ...tableSaved,
              draft: false,
            };
          }

          return item;
        });
      } else {
        draft.selectedTableMap = action.payload.tableCreated.map((item: TableMap) => ({ ...item, draft: false }));
      }

      if (draft.hall !== null) {
        draft.hall = {
          ...draft.hall,
          map: [...draft.hall.map, ...action.payload.tableCreated],
        };
      }

      break;

    case HallTypes.CREATE_TABLE_MAP_FAILED:
      draft.savingCreateTable = false;

      break;

    case HallTypes.UPDATE_TABLE_REQUEST:
      if (action.payload.registeredTable) {
        draft.savingUpdateTable = true;

        break;
      }

      if (draft.selectedTableMap !== null) {
        draft.selectedTableMap = draft.selectedTableMap.map((item) => {
          if (item.number === action.payload.selectedTable.number) {
            return {
              ...item,
              number: action.payload.table.number,
              group:
                action.payload.table.min_people <= action.payload.table.max_people
                  ? `${action.payload.table.min_people} - ${action.payload.table.max_people}`
                  : `${action.payload.table.max_people} - ${action.payload.table.min_people}`,
              min_people: action.payload.table.min_people,
              max_people: action.payload.table.max_people,
            };
          }

          return item;
        });
      }

      break;
    case HallTypes.UPDATE_TABLE_SUCCESS:
      draft.savingUpdateTable = false;

      if (draft.selectedTableMap !== null) {
        draft.selectedTableMap = draft.selectedTableMap.map((item) => {
          if (item.number === action.payload.selectedTable.number) {
            return {
              ...item,
              number: action.payload.table.number,
              group:
                action.payload.table.min_people <= action.payload.table.max_people
                  ? `${action.payload.table.min_people} - ${action.payload.table.max_people}`
                  : `${action.payload.table.max_people} - ${action.payload.table.min_people}`,
              min_people: action.payload.table.min_people,
              max_people: action.payload.table.max_people,
            };
          }

          return item;
        });
      }

      break;
    case HallTypes.UPDATE_TABLE_FAILED:
      draft.savingUpdateTable = false;

      break;

    case HallTypes.DELETE_TABLE_REQUEST:
      if (action.payload.registeredTable) {
        draft.savingDeleteTable = true;

        break;
      }

      if (draft.selectedTableMap !== null) {
        draft.selectedTableMap = draft.selectedTableMap.filter((item) => item.number !== action.payload.table.number);
      }

      break;
    case HallTypes.DELETE_TABLE_SUCCESS:
      draft.savingDeleteTable = false;

      if (draft.selectedTableMap !== null) {
        draft.selectedTableMap = draft.selectedTableMap.filter((item) => item.number !== action.payload.table.number);
      }

      break;
    case HallTypes.DELETE_TABLE_FAILED:
      draft.savingDeleteTable = false;

      break;

    case HallTypes.DELETE_TABLE_MAP_REQUEST:
      draft.savingDeleteTableMap = true;

      break;
    case HallTypes.DELETE_TABLE_MAP_SUCCESS:
      draft.savingDeleteTableMap = false;

      if (draft.selectedTableMap) {
        draft.selectedTableMap = draft.selectedTableMap.filter(
          (item) => (action.payload.tables as Array<string>).includes(item.id || '') === false
        );
      }

      if (draft.hall) {
        draft.hall = {
          ...draft.hall,
          map: draft.hall.map.filter(
            (item) => (action.payload.tables as Array<string>).includes(item.id || '') === false
          ),
        };
      }

      break;
    case HallTypes.DELETE_TABLE_MAP_FAILED:
      draft.savingDeleteTableMap = false;

      break;

    case HallTypes.SET_EDITABLE_TABLE:
      draft.selectedTable = action.table;
      break;

    case HallTypes.RESET_HALL:
      draft.loading = true;
      draft.loadingHall = true;
      draft.saving = false;
      draft.unity = null;
      draft.hall = null;
      draft.data = [];
      draft.pagination = {
        is_last_page: false,
        current_page: 1,
      };
      break;
  }
}, INITIAL_STATE);

export default hall;
