import produce from 'immer';

import { Types as PhotoTypes } from './actions';

export type PhotoItemProps = {
  id: number | string;
  image: string;
};

export type PhotoProps = {
  loading: boolean;
  data: Array<PhotoItemProps>;
};

export const INITIAL_STATE: PhotoProps = {
  loading: true,
  data: [],
};

const photo = produce((draft: PhotoProps, action) => {
  switch (action.type) {
    case PhotoTypes.GET_PHOTOS_REQUEST:
      draft.loading = true;
      break;
    case PhotoTypes.GET_PHOTOS_SUCCESS:
      draft.loading = false;
      draft.data = action.payload;
      break;
    case PhotoTypes.GET_PHOTOS_FAILED:
      draft.loading = false;
      break;

    case PhotoTypes.CREATE_PHOTO_REQUEST:
      draft.loading = true;
      break;
    case PhotoTypes.CREATE_PHOTO_SUCCESS:
      draft.loading = false;
      draft.data.push(action.payload);
      break;
    case PhotoTypes.CREATE_PHOTO_FAILED:
      draft.loading = false;
      break;

    case PhotoTypes.DELETE_PHOTO_REQUEST:
      draft.loading = true;
      break;
    case PhotoTypes.DELETE_PHOTO_SUCCESS:
      draft.loading = false;
      draft.data = draft.data.filter((photo) => photo.id !== action.payload.id);
      break;
    case PhotoTypes.DELETE_PHOTO_FAILED:
      draft.loading = false;
      break;
  }
}, INITIAL_STATE);

export default photo;
