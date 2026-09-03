import { FunctionComponent } from 'react';
import { NpsScoreChart, NpsScoreChartProps } from './NpsScoreChart';
import {
  AnswersDetailsChart,
  AnswersDetailsChartProps,
} from './AnswersDetailsChart';

type HeaderReportsProps = {
  npsScore: NpsScoreChartProps;
  answersData: AnswersDetailsChartProps;
};

export const HeaderReports: FunctionComponent<HeaderReportsProps> = (props) => {
  const { npsScore, answersData } = props;

  return (
    <div className="w-full grid grid-cols-3 gap-4">
      <NpsScoreChart {...npsScore} />
      <AnswersDetailsChart {...answersData} />
    </div>
  );
};
