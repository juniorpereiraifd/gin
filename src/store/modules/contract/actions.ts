import { ActionCreators, createActions } from 'reduxsauce';
import { ContractItemProps } from './reducer';

export enum Types {
  GET_UNITY_CONTRACT_REQUEST = '@contract/GET_UNITY_CONTRACT_REQUEST',
  GET_UNITY_CONTRACT_SUCCESS = '@contract/GET_UNITY_CONTRACT_SUCCESS',
  GET_UNITY_CONTRACT_FAILED = '@contract/GET_UNITY_FAILED',

  ACCEPT_UNITY_CONTRACT_REQUEST = '@contract/ACCEPT_UNITY_CONTRACT_REQUEST',
  ACCEPT_UNITY_CONTRACT_SUCCESS = '@contract/ACCEPT_UNITY_CONTRACT_SUCCESS',
  ACCEPT_UNITY_CONTRACT_FAILED = '@contract/ACCEPT_UNITY_FAILED',

  RESET_CONTRACT_STATE = '@contract/RESET_CONTRACT_STATE',
}

interface Actions extends ActionCreators {
  getUnityContractRequest: (payload: {
    id: string;
  }) => {
    type: Types.GET_UNITY_CONTRACT_REQUEST;
    payload: {
      id: string;
    };
  };
  getUnityContractSuccess: (
    payload: ContractItemProps
  ) => {
    type: Types.GET_UNITY_CONTRACT_SUCCESS;
  };
  getUnityContractFailed: () => {
    type: Types.GET_UNITY_CONTRACT_FAILED;
  };

  acceptUnityContractRequest: (payload: {
    contractId: string;
  }) => {
    type: Types.ACCEPT_UNITY_CONTRACT_REQUEST;
    payload: {
      contractId: string;
    };
  };
  acceptUnityContractSuccess: (
    contractId: string
  ) => {
    type: Types.ACCEPT_UNITY_CONTRACT_SUCCESS;
  };
  acceptUnityContractFailed: () => {
    type: Types.ACCEPT_UNITY_CONTRACT_FAILED;
  };

  resetContractState: () => {
    type: Types.RESET_CONTRACT_STATE;
  };
}

const CreatedActions = createActions(
  {
    getUnityContractRequest: ['payload'],
    getUnityContractSuccess: ['payload'],
    getUnityContractFailed: [],

    acceptUnityContractRequest: ['payload'],
    acceptUnityContractSuccess: ['payload'],
    acceptUnityContractFailed: [],

    resetContractState: [],
  },
  {
    prefix: '@contract/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
