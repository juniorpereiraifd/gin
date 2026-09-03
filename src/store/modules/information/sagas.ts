import * as Response from 'src/utils/response';
import { all, put, select, takeLatest, call } from 'redux-saga/effects';
import { Types as InformationTypes, Creators as InformationCreators } from './actions';
import { notification } from 'src/utils/helpers';
import { InformationsFormProps } from './reducer';
import api from 'src/services/api';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';

type SaveInformationActionProps = {
  type: InformationTypes.SAVE_INFORMATION_REQUEST;
  payload: InformationsFormProps;
};

export function* saveInformations(action: SaveInformationActionProps) {
  notification.warning(
    'Alterando as informações',
    'Estamos processando a sua solicitação para alterar as informações desta unidade'
  );
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(api.put, `restaurant/v1/units/${unity.id}`, action.payload);

    if (status === Response.HTTP_OK) {
      notification.success('Informações alteradas com sucesso!', 'As informações desta unidade foram atualizadas.');
      yield put(HallCreators.getUnityRequest({ id: unity.id, forceUpdate: true }));
      yield put(InformationCreators.saveInformationSuccess(response.data));
    }
  } catch (error) {
    yield put(InformationCreators.saveInformationFailed());
  }
}

export default all([takeLatest(InformationTypes.SAVE_INFORMATION_REQUEST, saveInformations)]);
