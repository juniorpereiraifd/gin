import produce from 'immer';
import { Types as InformationTypes } from './actions';
import { Occasion } from '../unity/reducer';

export type InformationsFormProps = {
  name: string;
  company_name: string;
  about: string;
  telephone: string;
  zipcode: string;
  address: string;
  number: string;
  taxpayer_identification: string | null;
  website: string | null;
  average_ticket?: number;
  complement?: string | null;
  city_id?: string;
  neighborhood?: string;
  state_id?: string;
  financial_email?: string | null;
  cuisines?: string[];
  occasions?: Occasion[];
  is_forced_coordinates?: boolean;
  coordinates?: {
    lat: string;
    lng: string;
  };
};

export type InformationProps = {
  saving: boolean;
};

export const INITIAL_STATE: InformationProps = {
  saving: false,
};

const information = produce((draft: InformationProps, action) => {
  switch (action.type) {
    case InformationTypes.SAVE_INFORMATION_REQUEST:
      draft.saving = true;
      break;
    case InformationTypes.SAVE_INFORMATION_SUCCESS:
      draft.saving = false;
      break;
    case InformationTypes.SAVE_INFORMATION_FAILED:
      draft.saving = false;
      break;
  }
}, INITIAL_STATE);

export default information;
