import * as Response from 'src/utils/response';
import { all, put, takeLatest, call, select, getContext } from 'redux-saga/effects';
import { Types as UnityTypes, Creators as UnityCreators } from './actions';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { Creators as LineCreators } from 'src/store/modules/line/actions';
import { Creators as VoucherCreators } from 'src/store/modules/voucher/actions';
import { MenuCreators } from 'src/store/modules/menu/actions';
import { Creators as ReservationCreators } from 'src/store/modules/reservation/actions';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import { Creators as NpsCreators } from 'src/store/modules/nps/actions';
import { notification, updateToken } from 'src/utils/helpers';
import api from 'src/services/api';
import { RootType } from '../rootReducer';

type activeUnitySupportARestaurantProps = {
  type: UnityTypes.ACTIVE_UNITY_SUPPORT_RESTAURANT_REQUEST;
  payload: {
    unitId: string;
    active: boolean;
  };
};

type AddListAmenitiesProps = {
  type: UnityTypes.ADD_LIST_AMENITIES_REQUEST;
  payload: { amenities: string[] };
};

export function* getUnits(action: ReturnType<typeof UnityCreators.getUnitsRequest>) {
  (async function () {
    const response = await updateToken(() => api.post('/auth/v1/refresh-legacy', {}));

    if (response && response.data.data.access_token) {
      localStorage.setItem('access_token', response.data.data.access_token);
    }
  })();
  try {
    const { page, per_page, unitName, unitId, isCumulative } = action.payload;

    const { status, data: response } = yield call(
      api.get,
      `/restaurant/v1/units?page=${page}&per_page=${per_page || 12}${unitName ? `&query=${unitName}` : ''}${
        unitId ? `&query_master=${unitId}` : ''
      }`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        UnityCreators.getUnitsSuccess({
          units: response.data,
          pagination: response.pagination,
          isCumulative: isCumulative,
        })
      );
    }
  } catch (error) {
    yield put(UnityCreators.getUnitsFailed());
  }
}

export function* createUnity(action: ReturnType<typeof UnityCreators.createUnityRequest>) {
  try {
    const { status, data: response } = yield call(api.post, `/restaurant/v1/units`, {
      ...action.payload,
      profile_image: action.payload.logo,
      cover_image: action.payload.cover,
    });

    if (status === Response.HTTP_CREATED) {
      yield put(UnityCreators.createUnitySuccess(response.data));
    }
  } catch (error) {
    yield put(UnityCreators.createUnityFailed());
  }
}

export function* editUnity(action: ReturnType<typeof UnityCreators.editUnityRequest>) {
  try {
    const { navigate } = yield getContext('router');
    const { status, data: response } = yield call(api.put, `/restaurant/v1/units/${action.payload.id}`, action.payload);

    if (status === Response.HTTP_OK) {
      yield put(UnityCreators.editUnitySuccess(response.data));
      yield navigate(`/units/${response.data.id}/dashboard/flow`);
    }
  } catch (error) {
    yield put(UnityCreators.editUnityFailed());
  }
}

export function* editUnityLogo(action: ReturnType<typeof UnityCreators.editUnityLogoRequest>) {
  try {
    const { status, data: response } = yield call(api.put, `/restaurant/v1/units/${action.payload.id}`, action.payload);

    if (status === Response.HTTP_OK) {
      yield put(HallCreators.getUnitySuccess(response.data));
    }
  } catch (error) {
    yield put(UnityCreators.editUnityFailed());
  }
}

export function* activeUnitySupportARestaurant(action: activeUnitySupportARestaurantProps) {
  try {
    const { status, data: response } = yield call(api.put, `/restaurant/v1/units/${action.payload.unitId}`, {
      metadata: {
        apoie_um_restaurante: action.payload.active,
      },
    });

    if (status === Response.HTTP_OK) {
      yield put(UnityCreators.activeUnitySupportRestaurantSuccess(response.data));

      yield put(HallCreators.getUnitySuccess(response.data));
    }
  } catch (error) {
    yield put(UnityCreators.activeUnitySupportRestaurantFailed());
  }
}

export function* getAmenities() {
  try {
    const { status, data: response } = yield call(api.get, `/restaurant/v1/amenities`);

    if (status === Response.HTTP_OK) {
      yield put(UnityCreators.getListAmenitiesSuccess(response.data));
    }
  } catch (error) {
    yield put(UnityCreators.getListAmenitiesFailed());
  }
}

export function* addListAmenities(action: AddListAmenitiesProps) {
  try {
    notification.warning('Processando solicitação', 'Aguarde enquanto os itens informados são processados');
    const { unity } = yield select((state) => state.hall);

    const { status } = yield call(api.put, `/restaurant/v1/units/${unity.id}/amenities`, action.payload);

    if (status === Response.NO_CONTENT) {
      notification.success(
        'Facilidades configuradas com sucesso',
        'Os itens de facilidades foram configurados com sucesso!'
      );
      yield put(UnityCreators.addListAmenitiesSuccess());
    }
  } catch (error) {
    yield put(UnityCreators.addListAmenitiesFailed());
  }
}

export function* getUnitModulesSettings() {
  try {
    const { unity } = yield select((state) => state.hall);

    if (unity && unity.id) {
      yield all([
        put(LineCreators.getLineSettingsRequest()),
        put(VoucherCreators.getVoucherSettingsRequest()),
        put(MenuCreators.getMenuSettingsRequest()),
        put(ReservationCreators.getReservationSettingsRequest()),
        put(MarketingCreators.getMarketingSettingsRequest()),
        put(NpsCreators.getNpsSettingsRequest()),
      ]);

      yield put(UnityCreators.getUnitModulesSettingsSuccess());
    }
  } catch (error) {
    yield put(UnityCreators.getUnitModulesSettingsFailed());
  }
}

export function* updateUnitModule(action: ReturnType<typeof UnityCreators.updateUnitModuleRequest>) {
  try {
    const { module, enabled } = action.payload;
    const {
      reservation: { settings: ReservationSettings },
      line: { settings: LineSettings },
      menu: { settings: MenuSettings },
      marketing: { settings: MarketingSettings },
      nps: { settings: NpsSettings },
      voucher: { settings: VoucherSettings },
    }: RootType = yield select((state) => state);

    switch (module) {
      case 'reservation':
        if (ReservationSettings !== null) {
          yield put(
            ReservationCreators.updateReservationSettingsRequest({
              enabled,
            })
          );
        }
        break;

      case 'line':
        if (LineSettings !== null) {
          yield put(
            LineCreators.updateLineSettingsRequest({
              enabled,
            })
          );
        }
        break;

      case 'menu':
        if (MenuSettings !== null) {
          yield put(
            MenuCreators.updateMenuSettingsRequest({
              enabled,
            })
          );
        }
        break;

      case 'marketing':
        if (MarketingSettings !== null) {
          yield put(
            MarketingCreators.updateMarketingSettingsRequest({
              enabled,
            })
          );
        }
        break;

      case 'nps':
        if (NpsSettings !== null) {
          yield put(
            NpsCreators.updateNpsSettingsRequest({
              enabled,
            })
          );
        }
        break;

      case 'voucher':
        if (VoucherSettings !== null) {
          yield put(
            VoucherCreators.updateVoucherSettingsRequest({
              enabled,
            })
          );
        }
        break;

      default:
        break;
    }
  } catch (error) {
    yield put(UnityCreators.updateUnitModuleFailed());
  }
}

export default all([
  takeLatest(UnityTypes.GET_UNITS_REQUEST, getUnits),
  takeLatest(UnityTypes.CREATE_UNITY_REQUEST, createUnity),
  takeLatest(UnityTypes.EDIT_UNITY_REQUEST, editUnity),
  takeLatest(UnityTypes.EDIT_UNITY_LOGO_REQUEST, editUnityLogo),
  takeLatest(
    UnityTypes.ACTIVE_UNITY_SUPPORT_RESTAURANT_REQUEST,
    activeUnitySupportARestaurant
  ),
  takeLatest(UnityTypes.GET_LIST_AMENITIES_REQUEST, getAmenities),
  takeLatest(UnityTypes.ADD_LIST_AMENITIES_REQUEST, addListAmenities),
  takeLatest(UnityTypes.GET_UNIT_MODULES_SETTINGS_REQUEST, getUnitModulesSettings),
  takeLatest(UnityTypes.UPDATE_UNIT_MODULE_REQUEST, updateUnitModule),
]);
