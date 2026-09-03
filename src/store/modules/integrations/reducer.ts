import produce from 'immer';
import { Types as IntegrationsTypes } from './actions';

export type IntegratorStatusProps = {
  integrator: string;
  enabled: boolean;
};

export type IntegrationsProps = {
  loadingStatusByIntegrator: Record<string, boolean>;
  togglingByIntegrator: Record<string, boolean>;
  statusByIntegrator: Record<string, IntegratorStatusProps>;
};

export const INITIAL_STATE: IntegrationsProps = {
  loadingStatusByIntegrator: {},
  togglingByIntegrator: {},
  statusByIntegrator: {},
};

const integrations = produce((draft: IntegrationsProps, action) => {
  switch (action.type) {
    case IntegrationsTypes.GET_INTEGRATOR_STATUS_REQUEST:
      draft.loadingStatusByIntegrator[action.payload.integrator] = true;
      break;
    case IntegrationsTypes.GET_INTEGRATOR_STATUS_SUCCESS:
      draft.loadingStatusByIntegrator[action.payload.integrator] = false;
      draft.statusByIntegrator[action.payload.integrator] = action.payload.status;
      break;
    case IntegrationsTypes.GET_INTEGRATOR_STATUS_FAILED:
      draft.loadingStatusByIntegrator[action.payload.integrator] = false;
      break;

    case IntegrationsTypes.TOGGLE_INTEGRATOR_REQUEST:
      draft.togglingByIntegrator[action.payload.integrator] = true;
      break;
    case IntegrationsTypes.TOGGLE_INTEGRATOR_SUCCESS:
      draft.togglingByIntegrator[action.payload.integrator] = false;
      draft.statusByIntegrator[action.payload.integrator] = {
        integrator: action.payload.integrator,
        enabled: action.payload.enabled,
      };
      break;
    case IntegrationsTypes.TOGGLE_INTEGRATOR_FAILED:
      draft.togglingByIntegrator[action.payload.integrator] = false;
      break;
  }
}, INITIAL_STATE);

export default integrations;
