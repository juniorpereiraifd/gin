import * as Response from 'src/utils/response';
import { all, put, takeLatest, call, select } from 'redux-saga/effects';
import { Types as PhotoTypes, Creators as PhotoCreators } from './actions';
import { RootType } from 'src/store/modules/rootReducer';

import api from 'src/services/api';

export function* getPhotos() {
  try {
    const { unity } = yield select((state: RootType) => state.hall);
    if (unity) {
      const { status, data: response } = yield call(
        api.get,
        `restaurant/v1/units/${unity.id}/photos`
      );
      if (status === Response.HTTP_OK) {
        yield put(PhotoCreators.getPhotosSuccess(response.data));
      }
    }
  } catch (error) {
    yield put(PhotoCreators.getPhotoFailed());
  }
}

export function* createPhoto(
  action: ReturnType<typeof PhotoCreators.createPhotoRequest>
) {
  try {
    const { unity } = yield select((state: RootType) => state.hall);
    if (unity) {
      const { status, data: response } = yield call(
        api.post,
        `restaurant/v1/units/${unity.id}/photos`,
        {
          image: action.payload,
        }
      );
      if (status === Response.HTTP_CREATED) {
        yield put(PhotoCreators.createPhotoSuccess(response.data));
      }
    }
  } catch (error) {
    yield put(PhotoCreators.createPhotoFailed());
  }
}

export function* deletePhoto(
  action: ReturnType<typeof PhotoCreators.deletePhotoRequest>
) {
  try {
    const { unity } = yield select((state: RootType) => state.hall);
    if (unity) {
      const { status } = yield call(
        api.delete,
        `restaurant/v1/units/${unity.id}/photos/${action.payload.id}`
      );
      if (status === Response.NO_CONTENT) {
        yield put(PhotoCreators.deletePhotoSuccess(action.payload));
      }
    }
  } catch (error) {
    yield put(PhotoCreators.deletePhotoFailed());
  }
}

export default all([
  takeLatest(PhotoTypes.GET_PHOTOS_REQUEST, getPhotos),
  takeLatest(PhotoTypes.CREATE_PHOTO_REQUEST, createPhoto),
  takeLatest(PhotoTypes.DELETE_PHOTO_REQUEST, deletePhoto),
]);
