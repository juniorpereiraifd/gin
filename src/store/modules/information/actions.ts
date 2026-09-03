import { ActionCreators, createActions } from 'reduxsauce';
import { UnityItemProps } from 'src/store/modules/unity/reducer';
import { InformationsFormProps } from './reducer';

export enum Types {
  SAVE_INFORMATION_REQUEST = '@information/SAVE_INFORMATION_REQUEST',
  SAVE_INFORMATION_SUCCESS = '@information/SAVE_INFORMATION_SUCCESS',
  SAVE_INFORMATION_FAILED = '@information/SAVE_INFORMATION_FAILED',
}

interface Actions extends ActionCreators {
  saveInformationRequest: (information: Omit<InformationsFormProps, 'coordinates'> & { coordinates?: string }) => {
    type: Types.SAVE_INFORMATION_REQUEST;
  };
  saveInformationSuccess: (unity: UnityItemProps) => {
    type: Types.SAVE_INFORMATION_SUCCESS;
  };
  saveInformationFailed: () => {
    type: Types.SAVE_INFORMATION_FAILED;
  };
}

const CreatedActions = createActions(
  {
    saveInformationRequest: ['payload'],
    saveInformationSuccess: ['payload'],
    saveInformationFailed: [],
  },
  {
    prefix: '@information/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
