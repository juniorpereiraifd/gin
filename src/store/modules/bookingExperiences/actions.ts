import { ActionCreators, createActions } from 'reduxsauce';
import {
  Experience,
  BookingExperienceProps,
  PromoCode,
  ExperiencePagination,
  type MutableExperience,
  type ExperiencesListFilters,
  type ExperienceCategory,
} from './reducer';

export enum Types {
  GET_EXPERIENCES_REQUEST = '@bookingExperiences/GET_EXPERIENCES_REQUEST',
  GET_EXPERIENCES_SUCCESS = '@bookingExperiences/GET_EXPERIENCES_SUCCESS',
  GET_EXPERIENCES_FAILURE = '@bookingExperiences/GET_EXPERIENCES_FAILURE',

  GET_EXPERIENCE_REQUEST = '@bookingExperiences/GET_EXPERIENCE_REQUEST',
  GET_EXPERIENCE_SUCCESS = '@bookingExperiences/GET_EXPERIENCE_SUCCESS',
  GET_EXPERIENCE_FAILURE = '@bookingExperiences/GET_EXPERIENCE_FAILURE',

  GET_EXPERIENCE_CATEGORIES_REQUEST = '@bookingExperiences/GET_EXPERIENCE_CATEGORIES_REQUEST',
  GET_EXPERIENCE_CATEGORIES_SUCCESS = '@bookingExperiences/GET_EXPERIENCE_CATEGORIES_SUCCESS',
  GET_EXPERIENCE_CATEGORIES_FAILURE = '@bookingExperiences/GET_EXPERIENCE_CATEGORIES_FAILURE',

  CREATE_EXPERIENCE_REQUEST = '@bookingExperiences/CREATE_EXPERIENCE_REQUEST',
  CREATE_EXPERIENCE_SUCCESS = '@bookingExperiences/CREATE_EXPERIENCE_SUCCESS',
  CREATE_EXPERIENCE_FAILURE = '@bookingExperiences/CREATE_EXPERIENCE_FAILURE',

  EDIT_EXPERIENCE_REQUEST = '@bookingExperiences/EDIT_EXPERIENCE_REQUEST',
  EDIT_EXPERIENCE_SUCCESS = '@bookingExperiences/EDIT_EXPERIENCE_SUCCESS',
  EDIT_EXPERIENCE_FAILURE = '@bookingExperiences/EDIT_EXPERIENCE_FAILURE',

  DELETE_EXPERIENCE_REQUEST = '@bookingExperiences/DELETE_EXPERIENCE_REQUEST',
  DELETE_EXPERIENCE_SUCCESS = '@bookingExperiences/DELETE_EXPERIENCE_SUCCESS',
  DELETE_EXPERIENCE_FAILURE = '@bookingExperiences/DELETE_EXPERIENCE_FAILURE',

  SET_EDITABLE_PROMO_CODE = '@bookingExperiences/SET_EDITABLE_PROMO_CODE',

  SET_SELECTED_EXPERIENCE = '@bookingExperiences/SET_SELECTED_EXPERIENCE',

  CHANGE_STATUS_EXPERIENCE_REQUEST = '@bookingExperiences/CHANGE_STATUS_EXPERIENCE_REQUEST',
  CHANGE_STATUS_EXPERIENCE_RESULT = '@bookingExperiences/CHANGE_STATUS_EXPERIENCE_RESULT',

  SET_MUTATION_DRAWER_OPEN = '@bookingExperiences/SET_MUTATION_DRAWER_OPEN',

  SET_EXPERIENCES_LIST_FILTER = '@bookingExperiences/SET_EXPERIENCES_LIST_FILTER',
}

interface Actions extends ActionCreators {
  getExperiencesRequest: (payload: { unit_id: string; page?: number; title?: string }) => {
    type: Types.GET_EXPERIENCES_REQUEST;
    payload: { unit_id: string; page?: number; title?: string };
  };
  getExperiencesSuccess: (payload: {
    experiences: BookingExperienceProps[];
    isSearch: boolean;
    pagination: ExperiencePagination;
  }) => {
    type: Types.GET_EXPERIENCES_SUCCESS;
    payload: {
      experiences: BookingExperienceProps[];
      isSearch: boolean;
      pagination: ExperiencePagination;
    };
  };
  getExperiencesFailure: () => {
    type: Types.GET_EXPERIENCES_FAILURE;
  };

  getExperienceRequest: (payload: { experienceId: string }) => {
    type: Types.GET_EXPERIENCE_REQUEST;
    payload: { experienceId: string };
  };
  getExperienceSuccess: (payload: BookingExperienceProps) => {
    type: Types.GET_EXPERIENCE_SUCCESS;
    payload: BookingExperienceProps;
  };
  getExperienceFailure: () => {
    type: Types.GET_EXPERIENCE_FAILURE;
  };

  getExperienceCategoriesRequest: () => {
    type: Types.GET_EXPERIENCE_CATEGORIES_REQUEST;
  };
  getExperienceCategoriesSuccess: (payload: ExperienceCategory[]) => {
    type: Types.GET_EXPERIENCE_CATEGORIES_SUCCESS;
    payload: ExperienceCategory[];
  };
  getExperienceCategoriesFailure: () => {
    type: Types.GET_EXPERIENCE_CATEGORIES_FAILURE;
  };

  createExperienceRequest: (payload: MutableExperience) => {
    type: Types.CREATE_EXPERIENCE_REQUEST;
    payload: Experience;
  };
  createExperienceSuccess: () => {
    type: Types.CREATE_EXPERIENCE_SUCCESS;
  };
  createExperienceFailure: () => {
    type: Types.CREATE_EXPERIENCE_FAILURE;
  };

  editExperienceSuccess: (payload: Experience) => {
    type: Types.EDIT_EXPERIENCE_SUCCESS;
    payload: Experience;
  };
  editExperienceRequest: (payload: MutableExperience) => {
    type: Types.EDIT_EXPERIENCE_REQUEST;
  };
  editExperienceFailure: () => {
    type: Types.EDIT_EXPERIENCE_FAILURE;
  };

  deleteExperienceRequest: (productId: string) => {
    type: Types.DELETE_EXPERIENCE_REQUEST;
  };
  deleteExperienceSuccess: (productId: string) => {
    type: Types.DELETE_EXPERIENCE_SUCCESS;
  };
  deleteExperienceFailure: () => {
    type: Types.DELETE_EXPERIENCE_FAILURE;
  };

  setEditablePromoCode: (payload: PromoCode | null) => {
    type: Types.SET_EDITABLE_PROMO_CODE;
    payload: PromoCode | null;
  };

  setSelectedExperience: (payload: BookingExperienceProps | null) => {
    type: Types.SET_SELECTED_EXPERIENCE;
    payload: BookingExperienceProps | null;
  };

  changeStatusExperienceRequest: (payload: { id: string; active: boolean }) => {
    type: Types.CHANGE_STATUS_EXPERIENCE_REQUEST;
    payload: {
      id: string;
      active: boolean;
    };
  };
  changeStatusExperienceResult: (payload: { id: string; active: boolean }) => {
    type: Types.CHANGE_STATUS_EXPERIENCE_RESULT;
    payload: {
      id: string;
      active: boolean;
    };
  };

  setMutationDrawerOpen: (payload: { open: boolean }) => {
    type: Types.SET_MUTATION_DRAWER_OPEN;
    payload: { open: boolean };
  };

  setExperiencesListFilter: (filters: ExperiencesListFilters) => {
    type: Types.SET_EXPERIENCES_LIST_FILTER;
    filters: ExperiencesListFilters;
  };
}

const CreatedActions = createActions(
  {
    getExperiencesRequest: ['payload'],
    getExperiencesSuccess: ['payload'],
    getExperiencesFailure: [],

    getExperienceRequest: ['payload'],
    getExperienceSuccess: ['payload'],
    getExperienceFailure: [],

    getExperienceCategoriesRequest: [],
    getExperienceCategoriesSuccess: ['payload'],
    getExperienceCategoriesFailure: [],

    createExperienceRequest: ['payload'],
    createExperienceSuccess: [],
    createExperienceFailure: [],

    editExperienceRequest: ['payload'],
    editExperienceSuccess: ['payload'],
    editExperienceFailure: [],

    deleteExperienceRequest: ['payload'],
    deleteExperienceSuccess: ['payload'],
    deleteExperienceFailure: [],

    setEditablePromoCode: ['payload'],

    setSelectedExperience: ['payload'],

    changeStatusExperienceRequest: ['payload'],
    changeStatusExperienceResult: ['payload'],

    setMutationDrawerOpen: ['payload'],

    setExperiencesListFilter: ['filters'],
  },
  {
    prefix: '@bookingExperiences/',
  },
);

export const Creators = CreatedActions.Creators as Actions;
