import { ActionCreators, createActions } from 'reduxsauce';
import {
  ScoreDataItem,
  ScaleQuestionDataItem,
  AnswerDataItem,
  AnswerDetailDataItem,
  PaginationProps,
  Question,
  CategoryQuestion,
  NpsSettings,
  NpsTypeAnswer,
} from './reducer';

export enum Types {
  GET_SCORE_REPORT_REQUEST = '@nps/GET_SCORE_REPORT_REQUEST',
  GET_SCORE_REPORT_SUCCESS = '@nps/GET_SCORE_REPORT_SUCCESS',
  GET_SCORE_REPORT_FAILED = '@nps/GET_SCORE_REPORT_FAILED',

  GET_SCALE_QUESTION_REQUEST = '@nps/GET_SCALE_QUESTION_REQUEST',
  GET_SCALE_QUESTION_SUCCESS = '@nps/GET_SCALE_QUESTION_SUCCESS',
  GET_SCALE_QUESTION_FAILED = '@nps/GET_SCALE_QUESTION_FAILED',

  GET_SINGLE_CHOICE_QUESTION_REQUEST = '@nps/GET_SINGLE_CHOICE_QUESTION_REQUEST',
  GET_SINGLE_CHOICE_QUESTION_SUCCESS = '@nps/GET_SINGLE_CHOICE_QUESTION_SUCCESS',
  GET_SINGLE_CHOICE_QUESTION_FAILED = '@nps/GET_SINGLE_CHOICE_QUESTION_FAILED',

  GET_ANSWER_REPORT_REQUEST = '@nps/GET_ANSWER_REPORT_REQUEST',
  GET_ANSWER_REPORT_SUCCESS = '@nps/GET_ANSWER_REPORT_SUCCESS',
  GET_ANSWER_REPORT_FAILED = '@nps/GET_ANSWER_REPORT_FAILED',

  GET_ANSWER_DETAIL_REQUEST = '@nps/GET_ANSWER_DETAIL_REQUEST',
  GET_ANSWER_DETAIL_SUCCESS = '@nps/GET_ANSWER_DETAIL_SUCCESS',
  GET_ANSWER_DETAIL_FAILED = '@nps/GET_ANSWER_DETAIL_FAILED',

  GET_QUESTIONS_REQUEST = '@nps/GET_QUESTIONS_REQUEST',
  GET_QUESTIONS_SUCCESS = '@nps/GET_QUESTIONS_SUCCESS',
  GET_QUESTIONS_FAILED = '@nps/GET_QUESTIONS_FAILED',

  EDIT_QUESTION_REQUEST = '@nps/EDIT_QUESTION_REQUEST',
  EDIT_QUESTION_SUCCESS = '@nps/EDIT_QUESTION_SUCCESS',
  EDIT_QUESTION_FAILED = '@nps/EDIT_QUESTION_FAILED',

  CREATE_QUESTION_REQUEST = '@nps/CREATE_QUESTION_REQUEST',
  CREATE_QUESTION_SUCCESS = '@nps/CREATE_QUESTION_SUCCESS',
  CREATE_QUESTION_FAILED = '@nps/CREATE_QUESTION_FAILED',

  DELETE_QUESTION_REQUEST = '@nps/DELETE_QUESTION_REQUEST',
  DELETE_QUESTION_SUCCESS = '@nps/DELETE_QUESTION_SUCCESS',
  DELETE_QUESTION_FAILED = '@nps/DELETE_QUESTION_FAILED',

  REORDER_QUESTIONS = '@nps/REORDER_QUESTIONS',
  SET_QUESTION_CATEGORY = '@nps/SET_QUESTION_CATEGORY',

  CLEAR_ANSWER_SELECTED = '@nps/CLEAR_ANSWER_SELECTED',

  SET_QUESTION_EDITABLE = '@nps/SET_QUESTION_EDITABLE',
  SET_QUESTION_MODAL_VISIBILITY = '@nps/SET_QUESTION_MODAL_VISIBILITY',

  GET_NPS_SETTINGS_REQUEST = '@nps/GET_NPS_SETTINGS_REQUEST',
  GET_NPS_SETTINGS_SUCCESS = '@nps/GET_NPS_SETTINGS_SUCCESS',
  GET_NPS_SETTINGS_FAILED = '@nps/GET_NPS_SETTINGS_FAILED',

  UPDATE_NPS_SETTINGS_REQUEST = '@nps/UPDATE_NPS_SETTINGS_REQUEST',
  UPDATE_NPS_SETTINGS_SUCCESS = '@nps/UPDATE_NPS_SETTINGS_SUCCESS',
  UPDATE_NPS_SETTINGS_FAILED = '@nps/UPDATE_NPS_SETTINGS_FAILED',

  CLONE_QUESTIONS_REQUEST = '@nps/CLONE_QUESTIONS_REQUEST',
  CLONE_QUESTIONS_SUCCESS = '@nps/CLONE_QUESTIONS_SUCCESS',
  CLONE_QUESTIONS_FAILED = '@nps/CLONE_QUESTIONS_FAILED',
}

interface Actions extends ActionCreators {
  getScoreReportRequest: (payload: { unitId: string; lastId?: string; startAt: string; endAt: string }) => {
    type: Types.GET_SCORE_REPORT_REQUEST;
    payload: {
      unitId: string;
      lastId?: string;
      startAt: string;
      endAt: string;
    };
  };
  getScoreReportSuccess: (payload: ScoreDataItem) => {
    type: Types.GET_SCORE_REPORT_SUCCESS;
    payload: ScoreDataItem;
  };
  getScoreReportFailed: () => {
    type: Types.GET_SCORE_REPORT_FAILED;
  };

  getScaleQuestionRequest: (payload: { unitId: string; lastId?: string; startAt: string; endAt: string }) => {
    type: Types.GET_SCALE_QUESTION_REQUEST;
    payload: {
      unitId: string;
      lastId?: string;
      startAt: string;
      endAt: string;
    };
  };
  getScaleQuestionSuccess: (payload: ScaleQuestionDataItem) => {
    type: Types.GET_SCALE_QUESTION_SUCCESS;
    payload: ScaleQuestionDataItem;
  };
  getScaleQuestionFailed: () => {
    type: Types.GET_SCALE_QUESTION_FAILED;
  };

  getSingleChoiceQuestionRequest: (payload: { unitId: string; startAt: string; endAt: string }) => {
    type: Types.GET_SINGLE_CHOICE_QUESTION_REQUEST;
    payload: {
      unitId: string;
      startAt: string;
      endAt: string;
    };
  };
  // @todo: replace with correct type
  getSingleChoiceQuestionSuccess: (payload: any) => {
    type: Types.GET_SINGLE_CHOICE_QUESTION_SUCCESS;
    payload: any;
  };
  getSingleChoiceQuestionFailed: () => {
    type: Types.GET_SINGLE_CHOICE_QUESTION_FAILED;
  };

  getAnswerReportRequest: (payload: {
    unitId: string;
    startAt: string;
    endAt: string;
    type?: string;
    page: number;
    perPage?: number;
    clear?: boolean;
    npsType?: NpsTypeAnswer;
  }) => {
    type: Types.GET_ANSWER_REPORT_REQUEST;
    payload: {
      unitId: string;
      startAt: string;
      endAt: string;
      type?: string;
      page: number;
      perPage?: number;
      clear?: boolean;
      npsType?: NpsTypeAnswer;
    };
  };
  getAnswerReportSuccess: (payload: { data: AnswerDataItem; pagination: PaginationProps }) => {
    type: Types.GET_ANSWER_REPORT_SUCCESS;
    payload: { data: AnswerDataItem; pagination: PaginationProps };
  };
  getAnswerReportFailed: () => {
    type: Types.GET_ANSWER_REPORT_FAILED;
  };

  getAnswerDetailRequest: (payload: { unitId: string; answerId: string }) => {
    type: Types.GET_ANSWER_DETAIL_REQUEST;
    payload: {
      unitId: string;
      answerId: string;
    };
  };
  getAnswerDetailSuccess: (payload: AnswerDetailDataItem) => {
    type: Types.GET_ANSWER_DETAIL_SUCCESS;
    payload: AnswerDetailDataItem;
  };
  getAnswerDetailFailed: () => {
    type: Types.GET_ANSWER_DETAIL_FAILED;
  };

  getQuestionsRequest: () => {
    type: Types.GET_QUESTIONS_REQUEST;
  };
  getQuestionsSuccess: (payload: { questions: Question[] }) => {
    type: Types.GET_QUESTIONS_SUCCESS;
    payload: {
      questions: Question[];
    };
  };
  getQuestionsFailed: () => {
    type: Types.GET_QUESTIONS_FAILED;
  };

  createQuestionRequest: (payload: Omit<Question, 'id'>) => {
    type: Types.CREATE_QUESTION_REQUEST;
    payload: Omit<Question, 'id'>;
  };
  createQuestionSuccess: (payload: Question) => {
    type: Types.CREATE_QUESTION_SUCCESS;
    payload: Question;
  };
  createQuestionFailed: () => {
    type: Types.CREATE_QUESTION_FAILED;
  };

  editQuestionRequest: (payload: Question) => {
    type: Types.EDIT_QUESTION_REQUEST;
    payload: Question;
  };
  editQuestionSuccess: (payload: Question) => {
    type: Types.EDIT_QUESTION_SUCCESS;
    payload: Question;
  };
  editQuestionFailed: () => {
    type: Types.EDIT_QUESTION_FAILED;
  };

  deleteQuestionRequest: (questionId: string) => {
    type: Types.DELETE_QUESTION_REQUEST;
    questionId: string;
  };
  deleteQuestionSuccess: (questionId: string) => {
    type: Types.DELETE_QUESTION_SUCCESS;
    questionId: string;
  };
  deleteQuestionFailed: () => {
    type: Types.DELETE_QUESTION_FAILED;
  };

  reorderQuestions: (questions: Question[]) => { type: Types.REORDER_QUESTIONS; questions: Question[] };

  setQuestionCategory: (category: CategoryQuestion) => {
    type: Types.SET_QUESTION_CATEGORY;
    category: CategoryQuestion;
  };

  clearAnswerSelected: () => {
    type: Types.CLEAR_ANSWER_SELECTED;
  };

  setQuestionEditable: (payload: Question) => {
    type: Types.SET_QUESTION_EDITABLE;
    payload: Question;
  };

  setQuestionModalVisibility: (visible: boolean) => {
    type: Types.SET_QUESTION_MODAL_VISIBILITY;
    visible: boolean;
  };

  getNpsSettingsRequest: () => {
    type: Types.GET_NPS_SETTINGS_REQUEST;
  };
  getNpsSettingsSuccess: (payload: NpsSettings) => {
    type: Types.GET_NPS_SETTINGS_SUCCESS;
    payload: NpsSettings;
  };
  getNpsSettingsFailed: () => {
    type: Types.GET_NPS_SETTINGS_FAILED;
  };

  updateNpsSettingsRequest: (payload: Partial<NpsSettings>) => {
    type: Types.UPDATE_NPS_SETTINGS_REQUEST;
    payload: Partial<NpsSettings>;
  };
  updateNpsSettingsSuccess: (payload: NpsSettings) => {
    type: Types.UPDATE_NPS_SETTINGS_SUCCESS;
    payload: NpsSettings;
  };
  updateNpsSettingsFailed: () => {
    type: Types.UPDATE_NPS_SETTINGS_FAILED;
  };

  cloneQuestionsRequest: (payload: { questions: Question[]; unitIds: string[]; onSuccessCallback?: VoidFunction }) => {
    type: Types.CLONE_QUESTIONS_REQUEST;
    payload: { questions: Question[]; unitIds: string[]; onSuccessCallback?: VoidFunction };
  };
  cloneQuestionsSuccess: (payload?: { questions: Question[] }) => {
    type: Types.CLONE_QUESTIONS_SUCCESS;
    payload?: { questions: Question[] };
  };
  cloneQuestionsFailed: () => {
    type: Types.CLONE_QUESTIONS_FAILED;
  };
}

const CreatedActions = createActions(
  {
    getScoreReportRequest: ['payload'],
    getScoreReportSuccess: ['payload'],
    getScoreReportFailed: [],

    getScaleQuestionRequest: ['payload'],
    getScaleQuestionSuccess: ['payload'],
    getScaleQuestionFailed: [],

    getSingleChoiceQuestionRequest: ['payload'],
    getSingleChoiceQuestionSuccess: ['payload'],
    getSingleChoiceQuestionFailed: [],

    getAnswerReportRequest: ['payload'],
    getAnswerReportSuccess: ['payload'],
    getAnswerReportFailed: [],

    getAnswerDetailRequest: ['payload'],
    getAnswerDetailSuccess: ['payload'],
    getAnswerDetailFailed: [],

    getQuestionsRequest: [],
    getQuestionsSuccess: ['payload'],
    getQuestionsFailed: [],

    createQuestionRequest: ['payload'],
    createQuestionSuccess: ['payload'],
    createQuestionFailed: [],

    editQuestionRequest: ['payload'],
    editQuestionSuccess: ['payload'],
    editQuestionFailed: [],

    deleteQuestionRequest: ['questionId'],
    deleteQuestionSuccess: ['questionId'],
    deleteQuestionFailed: [],

    reorderQuestions: ['questions'],
    setQuestionCategory: ['category'],

    clearAnswerSelected: [],

    setQuestionEditable: ['payload'],
    setQuestionModalVisibility: ['visible'],

    getNpsSettingsRequest: [],
    getNpsSettingsSuccess: ['payload'],
    getNpsSettingsFailed: [],

    updateNpsSettingsRequest: ['payload'],
    updateNpsSettingsSuccess: ['payload'],
    updateNpsSettingsFailed: [],

    cloneQuestionsRequest: ['payload'],
    cloneQuestionsSuccess: ['payload'],
    cloneQuestionsFailed: [],
  },
  {
    prefix: '@nps/',
  }
);

export const Creators = CreatedActions.Creators as Actions;
