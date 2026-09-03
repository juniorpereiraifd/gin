import { Fragment, FunctionComponent, ReactNode } from 'react';
import { BigNumberCard } from '../../../components/BigNumberCard';
import { FlowLineChart, FlowLineChartProps } from '../../../components/FlowLineChart';
import { DataByBarChart, DataByBarChartProps } from '../../../components/DataByBarChart';

type FlowChartsProps = {
  bigNumbers: {
    title: string;
    value: ReactNode;
    icon: ReactNode;
  }[];
  flowLineChartProps: FlowLineChartProps;
  tableSizeChartProps?: DataByBarChartProps;
  lineByWeekdayChartProps: DataByBarChartProps;
};

export const FlowCharts: FunctionComponent<FlowChartsProps> = (props) => {
  const { bigNumbers, flowLineChartProps, tableSizeChartProps, lineByWeekdayChartProps } = props;

  return (
    <Fragment>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {bigNumbers.map((bigNumber) => (
          <BigNumberCard key={bigNumber.title} {...bigNumber} />
        ))}
      </div>
      <FlowLineChart {...flowLineChartProps} />
      <div className="grid gap-4 grid-cols-2">
        {tableSizeChartProps !== undefined && <DataByBarChart {...tableSizeChartProps} />}
        <DataByBarChart {...lineByWeekdayChartProps} />
      </div>
    </Fragment>
  );
};
