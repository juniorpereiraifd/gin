import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import * as Response from 'src/utils/response';

import { Types as UserTypes, Creators as UserCreators } from './actions';
import { UserItemProps, type ModuleRestrictionByUnit, type UnitModule } from './reducer';
import api from 'src/services/api';
import { notification } from 'src/utils/helpers';
import type { SagaIterator } from 'redux-saga';
import type { RootType } from '../rootReducer';
import { MODULES_LABELS, type ModulesValues } from 'src/utils/constants';
import type { AxiosError } from 'axios';

type CreateUserActionProps = {
  type: UserTypes.CREATE_USER_REQUEST;
  payload: {
    email: string;
    master: boolean;
    units: Array<string | number>;
  };
};

type DeleteUserActionProps = {
  type: UserTypes.DELETE_USER_REQUEST;
  payload: UserItemProps;
};

type SendEmailUserActionProps = {
  type: UserTypes.SEND_EMAIL_USER_REQUEST;
  payload: {
    user_id: number;
    email: string;
  };
};

export function* getUser(action: { type: UserTypes.GET_USER_REQUEST; payload: string }) {
  try {
    const { unity } = yield select((state) => state.hall);
    const { status, data: response } = yield call(api.get, `auth/v1/units/${unity.id}/admins/${action.payload}`);

    if (status === Response.HTTP_OK) {
      yield put(
        UserCreators.getUserSuccess({
          ...response.data,
        }),
      );
    }
  } catch (error) {
    yield put(UserCreators.getUserFailed());
  }
}

export function* getUsers(action: ReturnType<typeof UserCreators.getUsersRequest>) {
  try {
    const { page, perPage } = action.payload;
    const { unity } = yield select((state) => state.hall);

    if (unity) {
      const { status, data: response } = yield call(
        api.get,
        `auth/v1/units/${unity.id}/admins?page=${page}${perPage ? `&per_page=${perPage}` : ''}`,
      );

      if (status === Response.HTTP_OK) {
        yield put(UserCreators.getUsersSuccess({ users: response.data, pagination: response.pagination }));
      }
    }
  } catch (error) {
    yield put(UserCreators.getUsersFailed());
  }
}

export function* createUser(action: CreateUserActionProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(api.post, `auth/v1/units/${unity.id}/admins`, action.payload);

    if (status === Response.HTTP_CREATED) {
      notification.success(
        'Gerente convidado!',
        `O gerente receberá as instruções para o seu acesso no e-mail: ${action.payload.email}`,
      );
      yield put(UserCreators.createUserSuccess(response.data));
    }
  } catch (error) {
    yield put(UserCreators.createUserFailed());
  }
}

export function* updateUser(action: ReturnType<typeof UserCreators.updateUserRequest>) {
  try {
    const { user, onSuccessCallback } = action;

    const { status, data: response } = yield call(api.put, `auth/v1/admins/${user.id}`, user);

    if (status === Response.HTTP_OK) {
      notification.success('Gerente atualizado com sucesso!', '');
      yield put(UserCreators.updateUserSuccess(response.data));
      onSuccessCallback?.();
    }
  } catch (error) {
    yield put(UserCreators.updateUserFailed());
  }
}

export function* deleteUser(action: DeleteUserActionProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status } = yield call(api.delete, `auth/v1/units/${unity.id}/admins/${action.payload.id}/detach`);

    if (status === Response.NO_CONTENT) {
      yield put(UserCreators.deleteUserSuccess(action.payload.id));
    }
  } catch (error) {
    yield put(UserCreators.getUsersFailed());
  }
}

export function* sendEmailUser(action: SendEmailUserActionProps) {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status } = yield call(api.put, `auth/v1/units/${unity.id}/admins/${action.payload.user_id}/send-email`);

    if (status === Response.HTTP_OK) {
      notification.success(
        'E-mail reenviado!',
        `O gerente receberá uma nova senha provisória no e-mail: ${action.payload.email}`,
      );
      yield put(UserCreators.sendEmailUserSuccess());
    }
  } catch (error) {
    yield put(UserCreators.sendEmailUserFailed());
  }
}

export function* generateTemporaryPassword(action: ReturnType<typeof UserCreators.generateTemporaryPasswordRequest>) {
  try {
    const { managerId } = action.payload;

    const { status, data: response } = yield call(api.post, `auth/v1/admins/${managerId}/generate-password`);

    if (status === Response.HTTP_OK) {
      yield put(UserCreators.generateTemporaryPasswordSuccess({ temporaryPassword: response.data }));
    }
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    notification.error(
      error.response?.data?.message || 'Erro ao gerar senha temporária.',
      'Houve um erro ao gerar a senha temporária, tente novamente mais tarde.',
    );
    yield put(UserCreators.generateTemporaryPasswordFailed());
  }
}

type SingleModuleRestrictionResult = {
  module: ModulesValues;
  data: {
    enabledByUser: boolean;
    enabledByUnit: boolean;
  } | null;
  success: boolean;
};

function* getSingleModuleRestriction(
  module: ModulesValues,
  unitId: string,
  userId: string,
): SagaIterator<SingleModuleRestrictionResult> {
  try {
    const [userRestrictionResponse, unitSettingsResponse] = yield all([
      call(api.get, `${module}/v1/units/${unitId}/module-restriction/admins/${userId}`),
      call(api.get, `${module}/v1/units/${unitId}/settings`),
    ]);

    const { status: userStatus, data: userResponse } = userRestrictionResponse;
    const { status: unitStatus, data: unitResponse } = unitSettingsResponse;

    if (userStatus === Response.HTTP_OK && unitStatus === Response.HTTP_OK) {
      const enabledByUser = userResponse.data.length === 0;
      const enabledByUnit = (unitResponse.data || [])[0].enabled ?? false;

      return {
        module,
        data: {
          enabledByUser,
          enabledByUnit,
        },
        success: true,
      };
    }
    return { module, data: null, success: false };
  } catch (error) {
    return { module, data: null, success: false };
  }
}

export function* getUserModuleRestrictions(action: ReturnType<typeof UserCreators.getUserModuleRestrictionsRequest>) {
  try {
    const { userId, unitId, modules } = action.payload;
    const { user }: RootType = yield select((state) => state);

    const results: SingleModuleRestrictionResult[] = yield all(
      modules.map((module) => call(getSingleModuleRestriction, module, unitId, userId)),
    );

    const modulesRestrictions: UnitModule = {} as UnitModule;

    results.forEach((result) => {
      if (result.data) {
        modulesRestrictions[result.module] = {
          enabledByUser: result.data.enabledByUser ?? false,
          enabledByUnit: result.data.enabledByUnit ?? false,
        };
      } else {
        modulesRestrictions[result.module] = { error: true };
      }
    });

    const payload: ModuleRestrictionByUnit = {
      admin_id: userId,
      units: [
        ...(user.userModuleRestrictions !== null && user.userModuleRestrictions.admin_id === userId
          ? user.userModuleRestrictions.units.filter((u) => u.id !== unitId)
          : []),
        {
          id: unitId,
          modules: modulesRestrictions,
        },
      ],
    };

    yield put(UserCreators.getUserModuleRestrictionsSuccess(payload));
  } catch (error) {
    yield put(UserCreators.getUserModuleRestrictionsFailed());
  }
}

type HandleUserModuleRestrictionProps = {
  unitId: string;
  userId: string;
  module: ModulesValues;
  enable: boolean;
};

type HandleUserModuleRestrictionReturn = {
  module: ModulesValues;
  enabled?: boolean;
  error?: boolean;
};

function* handleUserModuleRestriction(
  props: HandleUserModuleRestrictionProps,
): SagaIterator<HandleUserModuleRestrictionReturn> {
  const { userId, unitId, module, enable } = props;

  try {
    /*
      When the restriction is created, the user doesn't have access to the module. That's why enable
      calls DELETE to remove the restriction and POST to create it.
      However, on the front end, the module's enabled status means the module is accessible to the user.
    */
    if (enable) {
      const { status } = yield call(api.delete, `${module}/v1/units/${unitId}/module-restriction/admins/${userId}`);

      if (status === Response.NO_CONTENT || status === Response.HTTP_OK) {
        return { module, enabled: true };
      }

      return { module, error: true };
    } else {
      const { status } = yield call(api.post, `${module}/v1/units/${unitId}/module-restriction/admins/${userId}`);

      if (status === Response.HTTP_CREATED || status === Response.HTTP_OK) {
        return { module, enabled: false };
      }

      return { module, error: true };
    }
  } catch {
    return { module, error: true };
  }
}

function* updateUserModuleRestriction(action: ReturnType<typeof UserCreators.updateUserModuleRestrictionRequest>) {
  const { user }: RootType = yield select((state) => state);
  const { userId, unitId, module, enable } = action.payload;

  try {
    if (!user.userModuleRestrictions || user.userModuleRestrictions.admin_id !== userId || unitId === undefined) {
      notification.error('Ocorreu um erro na atualização do controle de módulo', 'Tente novamente mais tarde.');
      yield put(UserCreators.updateUserModuleRestrictionFailed(user.userModuleRestrictions));
      return;
    }

    const result: HandleUserModuleRestrictionReturn = yield call(handleUserModuleRestriction, {
      userId,
      unitId,
      module,
      enable,
    });

    const unitSelectedModules = user.userModuleRestrictions.units.find((u) => u.id === unitId);

    if (!unitSelectedModules) {
      notification.error('Ocorreu um erro na atualização do controle de módulo', 'Tente novamente mais tarde.');
      yield put(UserCreators.updateUserModuleRestrictionFailed(user.userModuleRestrictions));
      return;
    }

    const updatedModulesRestrictions = {
      ...unitSelectedModules.modules,
      [module]: result.error
        ? { error: true }
        : { ...unitSelectedModules.modules[module], enabledByUser: result.enabled ?? false },
    };

    const payload: ModuleRestrictionByUnit = {
      admin_id: userId,
      units: [
        ...(user.userModuleRestrictions !== null && user.userModuleRestrictions.admin_id === userId
          ? user.userModuleRestrictions.units.filter((u) => u.id !== unitId)
          : []),
        {
          id: unitId,
          modules: updatedModulesRestrictions,
        },
      ],
    };

    if (result.error) {
      notification.error('Ocorreu um erro na atualização do controle de módulo', 'Tente novamente mais tarde.');
    } else {
      notification.success(`Restrição do módulo de ${MODULES_LABELS[module]} atualizada!`, '');
    }

    yield put(UserCreators.updateUserModuleRestrictionSuccess(payload));
  } catch (error) {
    notification.error('Ocorreu um erro na atualização do controle de módulo', 'Tente novamente mais tarde.');
    yield put(UserCreators.updateUserModuleRestrictionFailed(user.userModuleRestrictions));
  }
}

export default all([
  takeLatest(UserTypes.GET_USER_REQUEST, getUser),
  takeLatest(UserTypes.GET_USERS_REQUEST, getUsers),
  takeLatest(UserTypes.CREATE_USER_REQUEST, createUser),
  takeLatest(UserTypes.UPDATE_USER_REQUEST, updateUser),
  takeLatest(UserTypes.DELETE_USER_REQUEST, deleteUser),
  takeLatest(UserTypes.SEND_EMAIL_USER_REQUEST, sendEmailUser),
  takeLatest(UserTypes.GET_USER_MODULE_RESTRICTIONS_REQUEST, getUserModuleRestrictions),
  takeLatest(UserTypes.UPDATE_USER_MODULE_RESTRICTION_REQUEST, updateUserModuleRestriction),
  takeLatest(UserTypes.GENERATE_TEMPORARY_PASSWORD_REQUEST, generateTemporaryPassword),
]);
