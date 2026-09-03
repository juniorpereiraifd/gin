import { FunctionComponent, useMemo, useState } from 'react';
import { List } from 'antd';
import { ScaleQuestionDataItem, SingleChoiceQuestionData } from 'src/store/modules/nps/reducer';
import { Heading } from 'src/ui/Typograph';
import { Skeleton } from 'src/ui/Skeleton';
import { QuestionDetailSheet, QuestionType } from './QuestionDetailSheet';
import { QuestionCard } from './QuestionCard';
import { Separator } from 'src/ui/Separator';

type QuestionsSectionProps = {
  scaleQuestions: ScaleQuestionDataItem[];
  singleChoiceQuestions: SingleChoiceQuestionData[];
  loadingScaleQuestions: boolean;
  loadingSingleChoiceQuestions: boolean;
};

export const QuestionsSection: FunctionComponent<QuestionsSectionProps> = (props) => {
  const { scaleQuestions, singleChoiceQuestions, loadingScaleQuestions, loadingSingleChoiceQuestions } = props;
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [openDetailsSheet, setOpenDetailsSheet] = useState<boolean>(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);
  const selectedQuestion = useMemo(() => {
    if (selectedQuestionType === 'scale') {
      return scaleQuestions.filter((item) => item.question_id === selectedQuestionId)[0];
    }
    if (selectedQuestionType === 'single-choice') {
      return singleChoiceQuestions.filter((item) => item.question_id === selectedQuestionId)[0];
    }

    return null;
  }, [selectedQuestionId, singleChoiceQuestions, scaleQuestions]);

  const getQuestionSheet = () => {
    if (selectedQuestion === null || selectedQuestionId === null || selectedQuestionType === null) {
      return null;
    }

    switch (selectedQuestionType) {
      case 'scale':
        return (
          <QuestionDetailSheet
            open={openDetailsSheet}
            onOpenChange={setOpenDetailsSheet}
            title={selectedQuestion.question_name}
            description={`
            Veja as informações detalhadas da pergunta ${selectedQuestion.question_name}`}
            type={selectedQuestionType}
            answersCount={selectedQuestion.count}
            scale={(selectedQuestion as ScaleQuestionDataItem).daily_average ?? []}
          />
        );
      case 'single-choice':
        return (
          <QuestionDetailSheet
            open={openDetailsSheet}
            onOpenChange={setOpenDetailsSheet}
            title={selectedQuestion.question_name}
            description={`
            Veja as informações detalhadas da pergunta ${selectedQuestion.question_name}`}
            type={selectedQuestionType}
            answersCount={selectedQuestion.count}
            options={(selectedQuestion as SingleChoiceQuestionData).options}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <QuestionList
        title="Perguntas de escala"
        type="scale"
        questions={scaleQuestions}
        loading={loadingScaleQuestions}
        onClickShowDetails={(id) => {
          setSelectedQuestionId(id);
          setOpenDetailsSheet(true);
          setSelectedQuestionType('scale');
        }}
      />
      <Separator className="my-4" />
      <QuestionList
        title="Perguntas de escolha única"
        type="single-choice"
        questions={singleChoiceQuestions}
        loading={loadingSingleChoiceQuestions}
        onClickShowDetails={(id) => {
          setSelectedQuestionId(id);
          setOpenDetailsSheet(true);
          setSelectedQuestionType('single-choice');
        }}
      />
      {selectedQuestion !== null && selectedQuestionId !== null && selectedQuestionType !== null && getQuestionSheet()}
    </div>
  );
};

type ScaleQuestionList = {
  questions: ScaleQuestionDataItem[];
};

type SingleChoiceQuestionList = {
  questions: SingleChoiceQuestionData[];
};

type QuestionListMap = {
  scale: ScaleQuestionList;
  'single-choice': SingleChoiceQuestionList;
};

export type QuestionListType = keyof QuestionListMap;

type QuestionListProps<K extends QuestionListType = QuestionListType> = {
  [T in K]: QuestionListMap[T] & {
    type: T;
    title: string;
    loading: boolean;
    onClickShowDetails: (id: string) => void;
  };
}[K];

const QuestionList: FunctionComponent<QuestionListProps> = (props) => {
  const { title, questions, loading, onClickShowDetails, type } = props;

  return (
    <div>
      <Heading level="5" className="text-slate-600 mb-4">
        {title}
      </Heading>
      {loading ? (
        <div className="grid grid-cols-4 grid-rows-3 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 bg-slate-200" />
          ))}
        </div>
      ) : (
        <List<ScaleQuestionDataItem | SingleChoiceQuestionData>
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          pagination={{
            pageSize: 12,
          }}
          dataSource={questions}
          renderItem={(question) => (
            <List.Item>
              {loading ? (
                <Skeleton className="h-24 bg-slate-200" />
              ) : (
                <QuestionCard
                  key={question.question_id}
                  onClickShowDetails={onClickShowDetails}
                  id={question.question_id}
                  title={question.question_name}
                  count={question.count}
                  {...(type === 'scale' &&
                    'average' in question && {
                      score: parseFloat(question.average),
                      trend: question.comparison_result,
                    })}
                />
              )}
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
