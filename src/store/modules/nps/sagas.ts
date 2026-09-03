import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { Types as NpsTypes, Creators as NpsCreators } from './actions';
import { AxiosError } from 'axios';
import api from 'src/services/api';
import { notification } from 'src/utils/helpers';
import * as Response from 'src/utils/response';
import { RootType } from '../rootReducer';
import type { SagaIterator } from 'redux-saga';
import type { Question } from './reducer';

export function* getScoreReport(action: ReturnType<typeof NpsCreators.getScoreReportRequest>) {
  try {
    const { payload } = action;
    const { status, data: response } = yield call(
      api.get,
      `/nps/v1/units/${payload.unitId}/report/score?start_date=${payload.startAt}&end_date=${payload.endAt}${
        payload.lastId ? `&last_id=${payload.lastId}` : ''
      }`
    );

    if (status === Response.HTTP_OK) {
      yield put(NpsCreators.getScoreReportSuccess(response.data));
    }
  } catch (error) {
    yield put(NpsCreators.getScoreReportFailed());
  }
}

export function* getScaleQuestion(action: ReturnType<typeof NpsCreators.getScaleQuestionRequest>) {
  try {
    const { payload } = action;
    const { status, data: response } = yield call(
      api.get,
      `/nps/v1/units/${payload.unitId}/report/scale?start_date=${payload.startAt}&end_date=${payload.endAt}${
        payload.lastId ? `&last_id=${payload.lastId}` : ''
      }`
    );

    if (status === Response.HTTP_OK) {
      yield put(NpsCreators.getScaleQuestionSuccess(response.data));
    }
  } catch (error) {
    yield put(NpsCreators.getScaleQuestionFailed());
  }
}

export function* getSingleChoiceQuestion(action: ReturnType<typeof NpsCreators.getSingleChoiceQuestionRequest>) {
  try {
    const { payload } = action;
    const { status, data: response } = yield call(
      api.get,
      `/nps/v1/units/${payload.unitId}/report/single-choice?start_date=${payload.startAt}&end_date=${payload.endAt}`
    );

    if (status === Response.HTTP_OK) {
      yield put(NpsCreators.getSingleChoiceQuestionSuccess(response.data));
    }
  } catch (error) {
    yield put(NpsCreators.getSingleChoiceQuestionFailed());
  }
}

export function* getAnswerReport(action: ReturnType<typeof NpsCreators.getAnswerReportRequest>) {
  try {
    const { payload } = action;
    const { status, data: response } = yield call(
      api.get,
      `/nps/v1/units/${payload.unitId}/report/answers?start_date=${payload.startAt}&end_date=${payload.endAt}&page=${
        payload.page
      }&per_page=${payload.perPage || '15'}&nps_type=${payload.npsType || 'all'}`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        NpsCreators.getAnswerReportSuccess({
          data: response.data,
          pagination: response.pagination,
        })
      );
    }
  } catch (error) {
    yield put(NpsCreators.getAnswerReportFailed());
  }
}

export function* getAnswerDetail(action: ReturnType<typeof NpsCreators.getAnswerDetailRequest>) {
  try {
    const { payload } = action;
    const { status, data: response } = yield call(
      api.get,
      `/nps/v1/units/${payload.unitId}/sessions/${payload.answerId}`
    );

    if (status === Response.HTTP_OK) {
      yield put(NpsCreators.getAnswerDetailSuccess(response.data));
    }
  } catch (error) {
    yield put(NpsCreators.getAnswerDetailFailed());
  }
}

export function* getNpsSettings() {
  try {
    const { unity } = yield select((state) => state.hall);

    const { status, data: response } = yield call(api.get, `/nps/v1/units/${unity.id}/settings`);

    if (status === Response.HTTP_OK) {
      yield put(NpsCreators.getNpsSettingsSuccess(response.data[0]));
    }
  } catch (error) {
    yield put(NpsCreators.getNpsSettingsFailed());
  }
}

export function* updateNpsSettings(action: ReturnType<typeof NpsCreators.updateNpsSettingsRequest>) {
  try {
    const {
      hall: { unity },
      nps: { settings },
    }: RootType = yield select((state) => state);

    const { status, data: response } = yield call(
      api.put,
      `/nps/v1/units/${unity?.id}/settings/${settings?.id}`,
      action.payload
    );

    if (status === Response.HTTP_OK) {
      yield put(NpsCreators.updateNpsSettingsSuccess(response.data));

      notification.success('Configurações de avaliações atualizadas com sucesso!', '');
    }
  } catch (error) {
    yield put(NpsCreators.updateNpsSettingsFailed());
  }
}

export function* getQuestions() {
  try {
    const {
      hall: { unity },
      nps: { selectedCategoryQuestion },
    }: RootType = yield select((state: RootType) => state);

    const { status, data: response } = yield call(
      api.get,
      `/nps/v1/units/${unity?.id}/questions?pagination=0&category=${selectedCategoryQuestion}`
    );

    if (status === Response.HTTP_OK) {
      yield put(
        NpsCreators.getQuestionsSuccess({
          questions: response.data,
        })
      );
    }
  } catch (error) {
    yield put(NpsCreators.getQuestionsFailed());
  }
}

export function* createQuestion(action: ReturnType<typeof NpsCreators.createQuestionRequest>) {
  try {
    const question = action.payload;
    const { unity } = yield select((state: RootType) => state.hall);

    const { status, data: response } = yield call(api.post, `/nps/v1/units/${unity.id}/questions`, question);

    if (status === Response.HTTP_CREATED) {
      yield put(NpsCreators.createQuestionSuccess(response.data));
      notification.success('Pergunta criada com sucesso', '');
    }
  } catch (err) {
    yield put(NpsCreators.createQuestionFailed());
    const error = err as AxiosError;

    notification.error(
      'Houve um erro ao criar a pergunta.',
      error.response?.data?.message || 'Tivemos um problema ao criar a pergunta, tente novamente mais tarde.'
    );
  }
}

export function* editQuestion(action: ReturnType<typeof NpsCreators.editQuestionRequest>) {
  try {
    const question = action.payload;
    const { unity } = yield select((state: RootType) => state.hall);

    const { status, data: response } = yield call(
      api.put,
      `/nps/v1/units/${unity.id}/questions/${question.id}`,
      question
    );

    if (status === Response.HTTP_OK) {
      yield put(NpsCreators.editQuestionSuccess(response.data));
      notification.success('Pergunta editada com sucesso', '');
    }
  } catch (err) {
    yield put(NpsCreators.editQuestionFailed());
    const error = err as AxiosError;

    notification.error(
      'Houve um erro ao editar a pergunta.',
      error.response?.data?.message || 'Tivemos um problema ao editar a pergunta, tente novamente mais tarde.'
    );
  }
}

export function* deleteQuestion(action: ReturnType<typeof NpsCreators.deleteQuestionRequest>) {
  try {
    const { unity } = yield select((state: RootType) => state.hall);

    const { status } = yield call(api.delete, `/nps/v1/units/${unity.id}/questions/${action.questionId}`);

    if (status === Response.NO_CONTENT) {
      yield put(NpsCreators.deleteQuestionSuccess(action.questionId));
      notification.success('Pergunta excluída com sucesso', '');
    }
  } catch (err) {
    yield put(NpsCreators.deleteQuestionFailed());
    const error = err as AxiosError;

    notification.error(
      'Houve um erro ao excluir a pergunta.',
      error.response?.data?.message || 'Tivemos um problema ao excluir a pergunta, tente novamente mais tarde.'
    );
  }
}

type CloneResult =
  | { ok: true; question: Question; questionsByUnit: Array<Record<string, Question>>; unitId: string }
  | { ok: false; question: Question; error: unknown };

function* cloneQuestion(unitId: string, unitIds: string[], question: Question): SagaIterator<CloneResult> {
  try {
    const { data: response } = yield call(api.post, `/nps/v1/units/${unitId}/questions/${question.id}/clone`, {
      units: unitIds.map((id) => ({ id: id })),
    });

    return {
      ok: true,
      question: question,
      questionsByUnit: response.data.units.map((item: Record<string, Question>) => ({
        [Object.keys(item)[0]]: Object.values(item)[0],
      })),
      unitId: unitId,
    };
  } catch (error) {
    yield put(NpsCreators.cloneQuestionsFailed());

    notification.error(
      'Erro ao tentar clonar a pergunta',
      `Ocorreu um erro ao tentar clonar a pergunta ${question.name}. Tente novamente mais tarde.`
    );

    return { ok: false, question: question, error };
  }
}

function* cloneQuestions(action: ReturnType<typeof NpsCreators.cloneQuestionsRequest>) {
  try {
    const { questions, unitIds, onSuccessCallback } = action.payload;
    const {
      hall: { unity },
    }: RootType = yield select((state: RootType) => state);

    if (unity === null) {
      yield put(NpsCreators.cloneQuestionsFailed());
      return;
    }

    const results: CloneResult[] = yield all(
      questions.map((question) => call(cloneQuestion, unity.id, unitIds, question))
    );

    const successes = results.filter((response) => response.ok);

    if (successes.length > 0) {
      const questionsClonedToCurrentUnit = successes
        .map((success) => {
          const questionForCurrentUnit = success.questionsByUnit.find(
            (item) => Object.keys(item)[0] === unity.id
          ) as Record<string, Question>;

          return questionForCurrentUnit !== undefined ? questionForCurrentUnit[unity.id] : null;
        })
        .filter((item) => item !== null);

      yield put(
        NpsCreators.cloneQuestionsSuccess(
          questionsClonedToCurrentUnit.length > 0 ? { questions: questionsClonedToCurrentUnit } : undefined
        )
      );

      notification.success('Perguntas clonadas com sucesso', 'Todas as perguntas foram clonadas com sucesso.');

      onSuccessCallback?.();
    }
  } catch (error) {
    yield put(NpsCreators.cloneQuestionsFailed());

    notification.error('Erro na clonagem', 'Falha inesperada ao processar as questões.');
  }
}

export default all([
  takeLatest(NpsTypes.GET_SCORE_REPORT_REQUEST, getScoreReport),
  takeLatest(NpsTypes.GET_SCALE_QUESTION_REQUEST, getScaleQuestion),
  takeLatest(NpsTypes.GET_SINGLE_CHOICE_QUESTION_REQUEST, getSingleChoiceQuestion),
  takeLatest(NpsTypes.GET_ANSWER_REPORT_REQUEST, getAnswerReport),
  takeLatest(NpsTypes.GET_ANSWER_DETAIL_REQUEST, getAnswerDetail),
  takeLatest(NpsTypes.GET_QUESTIONS_REQUEST, getQuestions),
  takeLatest(NpsTypes.CREATE_QUESTION_REQUEST, createQuestion),
  takeLatest(NpsTypes.EDIT_QUESTION_REQUEST, editQuestion),
  takeLatest(NpsTypes.DELETE_QUESTION_REQUEST, deleteQuestion),
  takeLatest(NpsTypes.GET_NPS_SETTINGS_REQUEST, getNpsSettings),
  takeLatest(NpsTypes.UPDATE_NPS_SETTINGS_REQUEST, updateNpsSettings),
  takeLatest(NpsTypes.CLONE_QUESTIONS_REQUEST, cloneQuestions),
]);
