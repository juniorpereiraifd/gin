import produce from 'immer';
import { Types as BookingExperiencesTypes } from 'src/store/modules/bookingExperiences/actions';
import { Pagination } from 'src/types';

export type ExperienceCategory = {
  id: string;
  name: string;
  slug: string;
};

export type PromoCodePayload = {
  code: string;
  discount: number;
  quantity?: number;
  starting_at?: string;
  ending_at?: string;
};

export type ExperiencePagination = {
  is_last_page: boolean;
  current_page: number;
  next_page: number;
};

export type PromoCode = PromoCodePayload & {
  id: string;
};

export type SectorsProps = {
  active: boolean;
  allow_delete: boolean;
  created_at: string;
  flexible: boolean;
  id: string;
  name: string;
};

export type ImageDataProps = {
  id: string;
  image: string;
  is_cover?: boolean;
};

export type BookingExperienceProps = {
  id: string;
  title: string;
  description: string;
  image?: string;
  images?: ImageDataProps[];
  rules: string;
  sectors: SectorsProps[];
  refund_hours: number;
  ending_at: string;
  starting_at: string;
  price: number;
  is_required: boolean;
  promo_codes: PromoCode[];
  limit?: number;
  active?: boolean;
  categories?: ExperienceCategory[];
};

export type BookingExperienceWithoutSectorProps = Omit<BookingExperienceProps, 'sectors'>;

export interface Experience extends BookingExperienceWithoutSectorProps {
  sectors: string[];
}

export type MutableExperience = Omit<Experience, 'image' | 'categories'> & {
  images?: ImageDataProps[];
  categories?: string[];
};

export type ExperiencesListFilters = {
  status: Array<'active' | 'inactive'>;
};

export interface ExperiencesProps {
  loading: boolean;
  loadingSelectedExperience: boolean;
  saving: boolean;
  loadingPromoCodes: boolean;
  loadingExperienceCategories: boolean;
  editable: boolean | null;
  isMutationDrawerOpen: boolean;
  onDeleting: boolean;
  data: BookingExperienceProps[];
  experiencesListFilters: ExperiencesListFilters | null;
  editableExperience: BookingExperienceProps | null;
  editablePromoCode: PromoCode | null;
  selectedExperience: BookingExperienceProps | null;
  pagination: Pagination | null;
  experienceCategories: ExperienceCategory[];
}

export const INITIAL_STATE: ExperiencesProps = {
  loading: false,
  loadingSelectedExperience: false,
  saving: false,
  loadingPromoCodes: false,
  loadingExperienceCategories: false,
  editable: null,
  isMutationDrawerOpen: false,
  onDeleting: false,
  data: [],
  experiencesListFilters: {
    status: ['active'],
  },
  selectedExperience: null,
  editableExperience: null,
  editablePromoCode: null,
  pagination: null,
  experienceCategories: [],
};

const bookingExperiences = produce((draft: ExperiencesProps, action) => {
  switch (action.type) {
    case BookingExperiencesTypes.CREATE_EXPERIENCE_REQUEST:
      draft.saving = true;
      break;
    case BookingExperiencesTypes.CREATE_EXPERIENCE_SUCCESS:
      draft.saving = false;
      break;
    case BookingExperiencesTypes.CREATE_EXPERIENCE_FAILURE:
      draft.saving = false;
      break;

    case BookingExperiencesTypes.GET_EXPERIENCES_REQUEST:
      if (action.payload.page && action.payload.page === 1) draft.data = [];
      draft.loading = true;
      break;
    case BookingExperiencesTypes.GET_EXPERIENCES_SUCCESS:
      draft.loading = false;
      draft.pagination = action.payload.pagination;

      if (action.payload.isSearch === true || action.payload.pagination.current_page === 1) {
        draft.data = action.payload.experiences;
      } else {
        draft.data = draft.data.concat(action.payload.experiences);
      }
      break;
    case BookingExperiencesTypes.GET_EXPERIENCES_FAILURE:
      draft.loading = false;
      break;

    case BookingExperiencesTypes.GET_EXPERIENCE_CATEGORIES_REQUEST:
      draft.loadingExperienceCategories = true;
      break;
    case BookingExperiencesTypes.GET_EXPERIENCE_CATEGORIES_SUCCESS:
      draft.loadingExperienceCategories = false;
      draft.experienceCategories = action.payload;
      break;
    case BookingExperiencesTypes.GET_EXPERIENCE_CATEGORIES_FAILURE:
      draft.loadingExperienceCategories = false;
      break;

    case BookingExperiencesTypes.GET_EXPERIENCE_REQUEST:
      draft.loadingSelectedExperience = true;
      break;
    case BookingExperiencesTypes.GET_EXPERIENCE_SUCCESS:
      draft.loadingSelectedExperience = false;
      draft.selectedExperience = action.payload;
      break;
    case BookingExperiencesTypes.GET_EXPERIENCE_FAILURE:
      draft.loadingSelectedExperience = false;
      break;

    case BookingExperiencesTypes.EDIT_EXPERIENCE_REQUEST:
      draft.saving = true;
      draft.editable = true;
      break;
    case BookingExperiencesTypes.EDIT_EXPERIENCE_SUCCESS:
      draft.saving = false;
      draft.data[draft.data.findIndex((product) => product.id === action.payload.id)] = action.payload;
      draft.editableExperience = null;
      break;
    case BookingExperiencesTypes.EDIT_EXPERIENCE_FAILURE:
      draft.saving = false;
      draft.editable = null;
      draft.editableExperience = null;
      break;

    case BookingExperiencesTypes.DELETE_EXPERIENCE_REQUEST:
      draft.onDeleting = true;
      break;
    case BookingExperiencesTypes.DELETE_EXPERIENCE_SUCCESS:
      draft.onDeleting = false;
      draft.loading = false;
      draft.data = draft.data.filter((product) => product.id !== action.payload);
      break;
    case BookingExperiencesTypes.DELETE_EXPERIENCE_FAILURE:
      draft.onDeleting = false;
      draft.loading = false;
      break;

    case BookingExperiencesTypes.SET_EDITABLE_PROMO_CODE:
      draft.editablePromoCode = action.payload;
      break;

    case BookingExperiencesTypes.SET_SELECTED_EXPERIENCE:
      draft.selectedExperience = action.payload;
      break;

    case BookingExperiencesTypes.CHANGE_STATUS_EXPERIENCE_REQUEST:
      draft.data[draft.data.findIndex((product) => product.id === action.payload.id)].active = action.payload.active;
      break;
    case BookingExperiencesTypes.CHANGE_STATUS_EXPERIENCE_RESULT:
      draft.data[draft.data.findIndex((product) => product.id === action.payload.id)].active = action.payload.active;
      break;

    case BookingExperiencesTypes.SET_MUTATION_DRAWER_OPEN:
      draft.isMutationDrawerOpen = action.payload.open;
      break;

    case BookingExperiencesTypes.SET_EXPERIENCES_LIST_FILTER:
      draft.experiencesListFilters = action.filters;
      break;
  }
}, INITIAL_STATE);

export default bookingExperiences;
