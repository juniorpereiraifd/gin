import produce from 'immer';
import { Types as NpsTypes } from './actions';

export type NpsTypeAnswer = 'all' | 'promoter' | 'passive' | 'detractor';

export type CategoryQuestion = 'feedback' | 'profile';

export type OptionProps = {
  id?: string;
  name: string;
  position: number;
};

export type Question = {
  id: string;
  name: string;
  description: string;
  category: 'profile' | 'feedback';
  type: 'short-answer' | 'long-answer' | 'scale' | 'single-choice';
  required: boolean;
  active: boolean;
  position: number;
  options: OptionProps[];
};

export type NpsSettings = {
  id: string;
  enabled: boolean;
  link: string;
};

export type ScoreDataItem = {
  score: number;
  promoter_count: number;
  promoter_percentage: number;
  passive_count: number;
  passive_percentage: number;
  detractor_count: number;
  detractor_percentage: number;
  date_range: string[];
  totalResponse: number;
};

export type QuestionDailyAverage = {
  answer_date: string;
  average: string;
};

export type ScaleQuestionDataItem = {
  question_id: string;
  question_name: string;
  count: number;
  average: string;
  comparison_average: string | null;
  comparison_result: number | null;
  date_range: string[];
  daily_average: QuestionDailyAverage[];
};

export type SingleChoiceQuestionOption = {
  option_name: string;
  count: number;
};

export type SingleChoiceQuestionData = {
  count: number;
  question_id: string;
  question_name: string;
  question_type: string;
  options: SingleChoiceQuestionOption[];
};

export type AnswerDataItem = Record<string, string>;

export type PaginationProps = {
  total: number;
  current_page: number;
  next_page: number;
  last_page: number;
  per_page: number;
  is_last_page: boolean;
};

export type AnswerDetailDataItem = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  feedback: string;
  unit_id: string;
  reservation_id: string;
  line_id: string;
  created_at: string;
  answers: {
    id: string;
    unit_id: string;
    session_id: string;
    question_name: string;
    question_type: 'short-answer' | 'nps' | 'scale' | 'single-choice';
    question_category: 'profile' | 'feedback' | 'nps';
    value: string;
  }[];
};

export type NpsProps = {
  saving: boolean;
  loadingScoreReport: boolean;
  loadingScaleQuestion: boolean;
  loadingSingleChoice: boolean;
  loadingAnswerReport: boolean;
  loadingAnswerDetail: boolean;
  loadingQuestions: boolean;
  savingQuestion: boolean;
  loadingSettings: boolean;
  savingSettings: boolean;
  cloningQuestions: boolean;
  errors: Array<{
    name: string;
    errors: Array<string>;
  }>;
  scoreData: ScoreDataItem | null;
  scaleQuestionData: ScaleQuestionDataItem[];
  singleChoiceQuestionData: SingleChoiceQuestionData[];
  answerData: AnswerDataItem[];
  paginationAnswer: PaginationProps | null;
  selectedAnswer: AnswerDetailDataItem | null;
  answerModalDetailIsOpen: boolean;
  questions: Question[];
  questionModalIsOpen: boolean;
  questionEditable: Question | null;
  selectedCategoryQuestion: CategoryQuestion;
  settings: NpsSettings | null;
};

export const INITIAL_STATE: NpsProps = {
  saving: false,
  loadingScoreReport: false,
  loadingScaleQuestion: false,
  loadingSingleChoice: false,
  loadingAnswerReport: false,
  loadingAnswerDetail: false,
  loadingQuestions: false,
  savingQuestion: false,
  loadingSettings: false,
  savingSettings: false,
  cloningQuestions: false,
  errors: [],
  scoreData: null,
  scaleQuestionData: [],
  singleChoiceQuestionData: [],
  answerData: [],
  paginationAnswer: null,
  selectedAnswer: null,
  answerModalDetailIsOpen: false,
  questions: [],
  questionModalIsOpen: false,
  questionEditable: null,
  selectedCategoryQuestion: 'feedback',
  settings: null,
};

const nps = produce((draft: NpsProps, action) => {
  switch (action.type) {
    case NpsTypes.GET_SCORE_REPORT_REQUEST:
      draft.loadingScoreReport = true;
      break;
    case NpsTypes.GET_SCORE_REPORT_SUCCESS:
      draft.loadingScoreReport = false;
      draft.scoreData = {
        ...action.payload,
        totalResponse: action.payload.promoter_count + action.payload.detractor_count + action.payload.passive_count,
      };
      break;
    case NpsTypes.GET_SCORE_REPORT_FAILED:
      draft.loadingScoreReport = false;
      break;

    case NpsTypes.GET_SCALE_QUESTION_REQUEST:
      draft.loadingScaleQuestion = true;
      break;
    case NpsTypes.GET_SCALE_QUESTION_SUCCESS:
      draft.loadingScaleQuestion = false;
      draft.scaleQuestionData = action.payload;
      break;
    case NpsTypes.GET_SCALE_QUESTION_FAILED:
      draft.loadingScaleQuestion = false;
      break;

    case NpsTypes.GET_SINGLE_CHOICE_QUESTION_REQUEST:
      draft.loadingSingleChoice = true;
      break;
    case NpsTypes.GET_SINGLE_CHOICE_QUESTION_SUCCESS:
      draft.loadingSingleChoice = false;
      draft.singleChoiceQuestionData = action.payload;
      break;
    case NpsTypes.GET_SINGLE_CHOICE_QUESTION_FAILED:
      draft.loadingSingleChoice = false;
      break;

    case NpsTypes.GET_ANSWER_REPORT_REQUEST:
      draft.loadingAnswerReport = true;
      if (action.payload.clear) {
        draft.answerData = [];
        draft.paginationAnswer = null;
      }
      break;
    case NpsTypes.GET_ANSWER_REPORT_SUCCESS:
      draft.answerData = action.payload.data;
      draft.paginationAnswer = action.payload.pagination;
      draft.loadingAnswerReport = false;
      break;
    case NpsTypes.GET_ANSWER_REPORT_FAILED:
      draft.loadingAnswerReport = false;
      break;

    case NpsTypes.GET_ANSWER_DETAIL_REQUEST:
      draft.loadingAnswerDetail = true;
      draft.answerModalDetailIsOpen = true;
      break;
    case NpsTypes.GET_ANSWER_DETAIL_SUCCESS:
      draft.loadingAnswerDetail = false;
      draft.selectedAnswer = action.payload;
      break;
    case NpsTypes.GET_ANSWER_DETAIL_FAILED:
      draft.loadingAnswerDetail = false;
      draft.answerModalDetailIsOpen = false;
      draft.selectedAnswer = null;
      break;

    case NpsTypes.GET_NPS_SETTINGS_REQUEST:
      draft.loadingSettings = true;
      break;
    case NpsTypes.GET_NPS_SETTINGS_SUCCESS:
      draft.loadingSettings = false;
      draft.settings = action.payload;
      break;
    case NpsTypes.GET_NPS_SETTINGS_FAILED:
      draft.loadingSettings = false;
      break;

    case NpsTypes.UPDATE_NPS_SETTINGS_REQUEST:
      draft.savingSettings = true;
      break;
    case NpsTypes.UPDATE_NPS_SETTINGS_SUCCESS:
      draft.savingSettings = false;
      draft.settings = action.payload;
      break;
    case NpsTypes.UPDATE_NPS_SETTINGS_FAILED:
      draft.savingSettings = false;
      break;

    case NpsTypes.CLEAR_ANSWER_SELECTED:
      draft.answerModalDetailIsOpen = false;
      draft.selectedAnswer = null;
      break;

    case NpsTypes.SET_QUESTION_EDITABLE:
      draft.questionModalIsOpen = true;
      draft.questionEditable = action.payload;
      break;

    case NpsTypes.SET_QUESTION_MODAL_VISIBILITY:
      draft.questionModalIsOpen = action.visible;

      if (action.visible === false) {
        draft.questionEditable = null;
      }
      break;

    case NpsTypes.GET_QUESTIONS_REQUEST:
      draft.loadingQuestions = true;
      break;
    case NpsTypes.GET_QUESTIONS_SUCCESS:
      draft.loadingQuestions = false;
      draft.questions = action.payload.questions;
      break;
    case NpsTypes.GET_QUESTIONS_FAILED:
      draft.loadingQuestions = false;
      break;

    case NpsTypes.EDIT_QUESTION_REQUEST:
      draft.savingQuestion = true;
      draft.questions = draft.questions.map((question) =>
        question.id === action.payload.id ? { ...question, ...action.payload } : question
      );
      break;
    case NpsTypes.EDIT_QUESTION_SUCCESS:
      draft.savingQuestion = false;
      draft.questions = draft.questions.map((question) =>
        question.id === action.payload.id ? { ...question, ...action.payload } : question
      );
      draft.questionModalIsOpen = false;
      break;
    case NpsTypes.EDIT_QUESTION_FAILED:
      draft.savingQuestion = false;
      break;

    case NpsTypes.CREATE_QUESTION_REQUEST:
      draft.savingQuestion = true;
      break;
    case NpsTypes.CREATE_QUESTION_SUCCESS:
      draft.savingQuestion = false;
      draft.questions.push(action.payload);
      draft.questionModalIsOpen = false;
      break;
    case NpsTypes.CREATE_QUESTION_FAILED:
      draft.savingQuestion = false;
      break;

    case NpsTypes.DELETE_QUESTION_REQUEST:
      draft.savingQuestion = true;
      break;
    case NpsTypes.DELETE_QUESTION_SUCCESS:
      draft.savingQuestion = false;
      draft.questions = draft.questions.filter((question) => question.id !== action.questionId);
      break;
    case NpsTypes.DELETE_QUESTION_FAILED:
      draft.savingQuestion = false;
      break;

    case NpsTypes.REORDER_QUESTIONS:
      draft.questions = action.questions;
      break;

    case NpsTypes.SET_QUESTION_CATEGORY:
      draft.selectedCategoryQuestion = action.category;
      break;

    case NpsTypes.CLONE_QUESTIONS_REQUEST:
      draft.cloningQuestions = true;
      break;
    case NpsTypes.CLONE_QUESTIONS_SUCCESS:
      draft.cloningQuestions = false;

      if (
        action.payload !== undefined &&
        Array.isArray(action.payload.questions) &&
        action.payload.questions.length > 0
      ) {
        draft.questions = [...draft.questions, ...action.payload.questions];
      }
      break;
    case NpsTypes.CLONE_QUESTIONS_FAILED:
      draft.cloningQuestions = false;
      break;
  }
}, INITIAL_STATE);

export default nps;
