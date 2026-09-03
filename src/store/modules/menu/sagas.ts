import { AxiosResponse } from 'axios';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import api from 'src/services/api';
import { notification } from 'src/utils/helpers';
import * as Response from 'src/utils/response';
import { MenuCreators, MenuTypes } from './actions';
import type { MenuItemProps } from './reducer';
import { RootType } from '../rootReducer';

type CreateMenuActionProps = {
  type: MenuTypes.CREATE_MENU_REQUEST;
  payload: {
    menu: {
      active: boolean;
      title: {
        'pt-br': string;
      };
    };
  };
};

type DeleteMenuParams = {
  type: MenuTypes.DELETE_MENU_REQUEST;
  payload: number;
};

type EditMenuType = {
  type: MenuTypes.EDIT_MENU_REQUEST;
  payload: {
    menu: MenuItemProps;
  };
};

export function* getMenu(action: ReturnType<typeof MenuCreators.getMenuRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(api.get, `menu/v1/units/${unity.id}/menus/${action.payload.menu_id}`);

    if (status === Response.HTTP_OK) {
      yield put(MenuCreators.getMenuSuccess(response.data));
    }
  } catch (error) {
    yield put(MenuCreators.getMenuFailed());
  }
}

export function* getMenus() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(api.get, `menu/v1/units/${unity.id}/menus?pagination=0`);

    if (status === Response.HTTP_OK) {
      yield put(MenuCreators.getMenusSuccess(response.data));
    }
  } catch (error) {
    yield put(MenuCreators.getMenusFailed());
  }
}

export function* getFilteredMenuItems(action: ReturnType<typeof MenuCreators.getFilteredMenuItemsRequest>) {
  const { unity } = yield select((state) => state.hall);
  const { menuItem } = action.payload;

  try {
    const { status, data: response }: AxiosResponse<{ data: MenuItemProps[] }> = yield call(
      api.get,
      `menu/v1/units/${unity.id}/items?pagination=0`,
      {
        params: { titles: menuItem },
      },
    );

    if (status === Response.HTTP_OK) {
      yield put(MenuCreators.getFilteredMenuItemsSuccess(response.data));
    }
  } catch (error) {
    yield put(MenuCreators.getFilteredMenuItemsFailed());
  }
}

export function* createMenu(action: CreateMenuActionProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    action.payload.menu.active = true;

    const { status, data: response } = yield call(api.post, `menu/v1/units/${unity.id}/menus`, {
      ...action.payload.menu,
      active: action.payload.menu.active,
    });

    if (status === Response.HTTP_CREATED) {
      yield all([put(MenuCreators.createMenuSuccess(response.data))]);
    }
  } catch (error) {
    yield put(MenuCreators.createMenuFailed());
  }
}

export function* editMenu(action: ReturnType<typeof MenuCreators.editMenuRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);
    const { menu } = action.payload;

    const { status, data: response } = yield call(
      api.put,
      `/menu/v1/units/${unity.id}/menus/${action.payload.menu.id}`,
      { ...menu },
    );

    if (status === Response.HTTP_OK) {
      notification.success('O cardápio foi alterado!', `O cardápio foi alterado com sucesso.`);

      yield put(MenuCreators.editMenuSuccess(response.data));
    }
  } catch (error) {
    yield put(MenuCreators.editMenuFailed());
  }
}

export function* reorderMenu(action: ReturnType<typeof MenuCreators.reorderMenuRequest>) {
  const { old_position, new_position, id: menu_id } = action.payload;

  const { unity } = yield select((state) => state.hall);

  const positions = {
    old_position,
    new_position,
  };

  const { status } = yield call(api.put, `menu/v1/units/${unity.id}/menus/${menu_id}/reordering`, positions);

  if (status === Response.HTTP_OK) {
    notification.success('Sucesso', 'A posição do cardápio foi atualizada com sucesso!');
    return;
  }
}

export function* deleteMenu(action: DeleteMenuParams) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status } = yield call(api.delete, `menu/v1/units/${unity.id}/menus/${action.payload}`);

    if (status === Response.NO_CONTENT) {
      yield put(MenuCreators.deleteMenuSuccess(action.payload));
      notification.success('O cardápio foi removido com sucesso!', '');
    }
  } catch (error) {
    yield put(MenuCreators.deleteMenuFailed());
  }
}

export function* linkMenuUnits(action: ReturnType<typeof MenuCreators.linkMenuUnitsRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);
    const { menuId, units } = action.payload;

    const { status } = yield call(api.put, `/menu/v1/units/${unity.id}/menus/${menuId}`, {
      units: units.map((unit) => ({ id: unit.id })),
    });

    if (status === Response.HTTP_OK) {
      notification.success('Unidades vinculadas!', 'As unidades foram vinculadas ao cardápio com sucesso.');
      yield put(MenuCreators.linkMenuUnitsSuccess({ menuId, units }));
    }
  } catch (error) {
    notification.error('Erro ao vincular unidades!', '');
    yield put(MenuCreators.linkMenuUnitsFailed());
  }
}

export function* unlinkMenuUnit(action: ReturnType<typeof MenuCreators.unlinkMenuUnitRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);
    const menus: MenuItemProps[] = yield select((state) => state.menu.data);
    const { menuId } = action.payload;

    const menu = menus.find((item) => item.id === menuId);

    if (!menu) {
      yield put(MenuCreators.unlinkMenuUnitFailed());
      return;
    }

    const remainingUnits = (menu.units ?? []).filter((unit) => unit.id !== unity.id);

    const { status } = yield call(api.put, `/menu/v1/units/${menu.unit_id}/menus/${menuId}`, {
      units: remainingUnits.map((unit) => ({ id: unit.id })),
    });

    if (status === Response.HTTP_OK) {
      notification.success('Cardápio desvinculado!', 'O cardápio foi desvinculado desta unidade com sucesso.');
      yield put(MenuCreators.unlinkMenuUnitSuccess({ menuId }));
    }
  } catch (error) {
    notification.error('Erro ao desvincular cardápio!', '');
    yield put(MenuCreators.unlinkMenuUnitFailed());
  }
}

export function* getMenuBanners(action: ReturnType<typeof MenuCreators.getMenuBannersRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);
    const { type } = action.payload;

    const { status, data: response } = yield call(api.get, `menu/v1/units/${unity.id}/highlights?type=${type}`);

    if (status === Response.HTTP_OK) {
      yield put(MenuCreators.getMenuBannersSuccess({ data: response.data, type: type }));
    }
  } catch (error) {
    yield put(MenuCreators.getMenuBannersFailed());
  }
}

export function* createMenuBanner(action: ReturnType<typeof MenuCreators.createMenuBannerRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);
    const banner = action.payload;

    notification.warning('Criando banner...', '');

    const { status, data: response } = yield call(api.post, `menu/v1/units/${unity.id}/highlights`, { ...banner });

    if (status === Response.HTTP_CREATED) {
      notification.success('Banner criado com sucesso!', '');
      yield put(MenuCreators.createMenuBannerSuccess(response.data));
    }
  } catch (error) {
    yield put(MenuCreators.createMenuBannerFailed());
  }
}

export function* editMenuBanner(action: ReturnType<typeof MenuCreators.editMenuBannerRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);
    const banner = action.payload;

    notification.warning('Editando banner...', '');

    const { status, data: response } = yield call(api.put, `menu/v1/units/${unity.id}/highlights/${banner.id}`, {
      ...banner,
    });

    if (status === Response.HTTP_OK) {
      notification.success('Banner editado com sucesso!', '');
      yield put(MenuCreators.editMenuBannerSuccess(response.data));
    }
  } catch (error) {
    yield put(MenuCreators.editMenuBannerFailed());
  }
}

export function* deleteMenuBanner(action: ReturnType<typeof MenuCreators.deleteMenuBannerRequest>) {
  try {
    const { unity } = yield select((state) => state.hall);

    notification.warning('Removendo banner...', '');

    const { status } = yield call(api.delete, `menu/v1/units/${unity.id}/highlights/${action.payload.id}`);

    if (status === Response.NO_CONTENT) {
      notification.success('Banner removido com sucesso!', '');
      yield put(MenuCreators.deleteMenuBannerSuccess(action.payload));
    }
  } catch (error) {
    notification.error('Erro ao remover banner', '');
    yield put(MenuCreators.deleteMenuBannerFailed());
  }
}

export function* getMenusTags() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(api.get, `menu/v1/units/${unity.id}/tags?pagination=0`);

    if (status === Response.HTTP_OK) {
      yield put(MenuCreators.getMenusTagsSuccess(response.data));
    }
  } catch (error) {
    yield put(MenuCreators.getMenusTagsFailed());
  }
}

export function* getMenuSettings() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(api.get, `/menu/v1/units/${unity.id}/settings`);

    if (status === Response.HTTP_OK) {
      yield put(MenuCreators.getMenuSettingsSuccess(response.data[0]));
    }
  } catch (error) {
    yield put(MenuCreators.getMenuSettingsFailed());
  }
}

export function* updateMenuSettings(action: ReturnType<typeof MenuCreators.updateMenuSettingsRequest>) {
  try {
    const {
      hall: { unity },
      menu: { settings },
    }: RootType = yield select((state) => state);

    const { status, data: response } = yield call(
      api.put,
      `/menu/v1/units/${unity?.id}/settings/${settings?.id}`,
      action.payload,
    );

    if (status === Response.HTTP_OK) {
      notification.success('Configurações de cardápio atualizadas com sucesso!', '');

      yield put(MenuCreators.updateMenuSettingsSuccess(response.data));
    }
  } catch (error) {
    yield put(MenuCreators.updateMenuSettingsFailed());
  }
}

export function* getGoogleMenuIntegrationStatus() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(api.get, `menu/v1/units/${unity.id}/google-menu/merchant/status`);

    if (status === Response.HTTP_OK) {
      yield put(MenuCreators.getGoogleMenuStatusSuccess(response.data));
    }
  } catch (error) {
    yield put(MenuCreators.getGoogleMenuStatusFailed());
  }
}

export default all([
  takeLatest(MenuTypes.GET_MENU_REQUEST, getMenu),
  takeLatest(MenuTypes.GET_MENUS_REQUEST, getMenus),
  takeLatest(MenuTypes.GET_MENUS_TAGS_REQUEST, getMenusTags),
  takeLatest(MenuTypes.GET_FILTERED_MENU_ITEMS_REQUEST, getFilteredMenuItems),
  takeLatest(MenuTypes.CREATE_MENU_REQUEST, createMenu),
  takeLatest(MenuTypes.DELETE_MENU_REQUEST, deleteMenu),
  takeLatest(MenuTypes.LINK_MENU_UNITS_REQUEST, linkMenuUnits),
  takeLatest(MenuTypes.UNLINK_MENU_UNIT_REQUEST, unlinkMenuUnit),
  takeLatest(MenuTypes.REORDER_MENU_REQUEST, reorderMenu),
  takeLatest(MenuTypes.EDIT_MENU_REQUEST, editMenu),
  takeLatest(MenuTypes.GET_MENU_BANNERS_REQUEST, getMenuBanners),
  takeLatest(MenuTypes.CREATE_MENU_BANNER_REQUEST, createMenuBanner),
  takeLatest(MenuTypes.EDIT_MENU_BANNER_REQUEST, editMenuBanner),
  takeLatest(MenuTypes.DELETE_MENU_BANNER_REQUEST, deleteMenuBanner),
  takeLatest(MenuTypes.GET_MENU_SETTINGS_REQUEST, getMenuSettings),
  takeLatest(MenuTypes.UPDATE_MENU_SETTINGS_REQUEST, updateMenuSettings),
  takeLatest(MenuTypes.GET_GOOGLE_MENU_STATUS_REQUEST, getGoogleMenuIntegrationStatus),
]);
