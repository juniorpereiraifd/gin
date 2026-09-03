import { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Creators as NpsCreators } from 'src/store/modules/nps/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { DatePicker } from 'src/ui/DatePicker';
import { HeaderReports } from './HeaderReports';
import { QuestionsSection } from './QuestionsSection';
import { parseDate } from '..';

type NpsTabReportProps = {
  unitId: string;
  hasNpsModule: boolean;
};

export const NpsTabReport: FunctionComponent<NpsTabReportProps> = (props) => {
  const { unitId, hasNpsModule } = props;
  const dispatch = useDispatch();
  const {
    nps: {
      scoreData,
      loadingScoreReport,
      scaleQuestionData,
      loadingScaleQuestion,
      singleChoiceQuestionData,
      loadingSingleChoice,
    },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (hasNpsModule === false) {
      return;
    }

    handleChangeDate({
      from: subDays(new Date(), 30),
      to: new Date(),
    });
  }, [hasNpsModule]);

  const handleChangeDate = (range: DateRange) => {
    if (range.from && range.to) {
      dispatch(
        NpsCreators.getScoreReportRequest({
          unitId: unitId,
          startAt: parseDate(range.from),
          endAt: parseDate(range.to),
        })
      );
      dispatch(
        NpsCreators.getScaleQuestionRequest({
          unitId: unitId,
          startAt: parseDate(range.from),
          endAt: parseDate(range.to),
        })
      );
      dispatch(
        NpsCreators.getSingleChoiceQuestionRequest({
          unitId: unitId,
          startAt: parseDate(range.from),
          endAt: parseDate(range.to),
        })
      );
    }
  };

  return (
    <div className="flex flex-col gap-8 mt-4">
      <DatePicker onRangeChange={handleChangeDate} />
      <HeaderReports
        npsScore={{ value: hasNpsModule === false ? mockData.npsScore : scoreData?.score, loading: loadingScoreReport }}
        answersData={{
          loading: loadingScoreReport,
          answersData:
            hasNpsModule === false
              ? mockData.answersData
              : {
                  promoters: {
                    value: scoreData?.promoter_count,
                    percent: scoreData?.promoter_percentage,
                  },
                  neutrals: {
                    value: scoreData?.passive_count,
                    percent: scoreData?.passive_percentage,
                  },
                  detractors: {
                    value: scoreData?.detractor_count,
                    percent: scoreData?.detractor_percentage,
                  },
                },
        }}
      />
      <QuestionsSection
        scaleQuestions={scaleQuestionData}
        singleChoiceQuestions={singleChoiceQuestionData}
        loadingScaleQuestions={loadingScaleQuestion}
        loadingSingleChoiceQuestions={loadingSingleChoice}
      />
    </div>
  );
};

const mockData = {
  npsScore: 95,
  answersData: {
    promoters: {
      value: 500,
      percent: 89.2,
    },
    neutrals: {
      value: 50,
      percent: 8.9,
    },
    detractors: {
      value: 10,
      percent: 1.9,
    },
  },
};
