import { ActionCreators, createActions } from 'reduxsauce';
import { type IntegratorStatusProps } from './reducer';

export enum Types {
  GET_INTEGRATOR_STATUS_REQUEST = '@integrations/GET_INTEGRATOR_STATUS_REQUEST',
  GET_INTEGRATOR_STATUS_SUCCESS = '@integrations/GET_INTEGRATOR_STATUS_SUCCESS',
  GET_INTEGRATOR_STATUS_FAILED = '@integrations/GET_INTEGRATOR_STATUS_FAILED',

  TOGGLE_INTEGRATOR_REQUEST = '@integrations/TOGGLE_INTEGRATOR_REQUEST',
  TOGGLE_INTEGRATOR_SUCCESS = '@integrations/TOGGLE_INTEGRATOR_SUCCESS',
  TOGGLE_INTEGRATOR_FAILED = '@integrations/TOGGLE_INTEGRATOR_FAILED',
}

interface Actions extends ActionCreators {
  getIntegratorStatusRequest: (payload: { integrator: string }) => {
    type: Types.GET_INTEGRATOR_STATUS_REQUEST;
    payload: { integrator: string };
  };
  getIntegratorStatusSuccess: (payload: { integrator: string; status: IntegratorStatusProps }) => {
    type: Types.GET_INTEGRATOR_STATUS_SUCCESS;
    payload: { integrator: string; status: IntegratorStatusProps };
  };
  getIntegratorStatusFailed: (payload: { integrator: string }) => {
    type: Types.GET_INTEGRATOR_STATUS_FAILED;
    payload: { integrator: string };
  };

  toggleIntegratorRequest: (payload: { integrator: string; onSuccess?: (enabled: boolean) => void }) => {
    type: Types.TOGGLE_INTEGRATOR_REQUEST;
    payload: { integrator: string; onSuccess?: (enabled: boolean) => void };
  };
  toggleIntegratorSuccess: (payload: { integrator: string; enabled: boolean }) => {
    type: Types.TOGGLE_INTEGRATOR_SUCCESS;
    payload: { integrator: string; enabled: boolean };
  };
  toggleIntegratorFailed: (payload: { integrator: string }) => {
    type: Types.TOGGLE_INTEGRATOR_FAILED;
    payload: { integrator: string };
  };
}

const CreatedActions = createActions(
  {
    getIntegratorStatusRequest: ['payload'],
    getIntegratorStatusSuccess: ['payload'],
    getIntegratorStatusFailed: ['payload'],

    toggleIntegratorRequest: ['payload'],
    toggleIntegratorSuccess: ['payload'],
    toggleIntegratorFailed: ['payload'],
  },
  {
    prefix: '@integrations/',
  },
);

export const IntegrationsCreators = CreatedActions.Creators as Actions;
