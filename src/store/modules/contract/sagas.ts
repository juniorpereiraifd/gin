import * as Response from 'src/utils/response';
import { all, put, takeLatest, call, select } from 'redux-saga/effects';
import {
  Types as ContractTypes,
  Creators as ContractCreators,
} from './actions';
import { RootType } from 'src/store/modules/rootReducer';

import api from 'src/services/api';

type GetUnityActionProps = {
  type: ContractTypes.GET_UNITY_CONTRACT_REQUEST;
  payload: {
    id: string;
  };
};

type AcceptUnityActionProps = {
  type: ContractTypes.ACCEPT_UNITY_CONTRACT_REQUEST;
  payload: {
    contractId: string;
  };
};

export function* getUnityContract(action: GetUnityActionProps) {
  const { id } = action.payload;
  try {
    const { status, data: response } = yield call(
      api.get,
      `/document/v1/units/${id}/contracts`
    );
    if (status === Response.HTTP_OK) {
      yield put(ContractCreators.getUnityContractSuccess(response));
    }
  } catch (error) {
    yield put(ContractCreators.getUnityContractFailed());
  }
}

export function* acceptUnityContract(action: AcceptUnityActionProps) {
  const { contractId } = action.payload;
  try {
    const { unity } = yield select((state: RootType) => state.hall);
    if (unity) {
      const { status } = yield call(
        api.post,
        `document/v1/units/${unity.id}/contracts/${contractId}/sign`
      );
      if (status === Response.HTTP_CREATED) {
        yield put(ContractCreators.acceptUnityContractSuccess(contractId));
      }
    }
  } catch (error) {
    yield put(ContractCreators.acceptUnityContractFailed());
  }
}

export default all([
  takeLatest(ContractTypes.GET_UNITY_CONTRACT_REQUEST, getUnityContract),
  takeLatest(ContractTypes.ACCEPT_UNITY_CONTRACT_REQUEST, acceptUnityContract),
]);
