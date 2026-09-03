import { FunctionComponent, useMemo } from 'react';
import { WalkinDashboardProps } from 'src/store/modules/dashboard/reducer';
import { FlowCharts } from '../FlowCharts';
import { Users, Ratio } from 'lucide-react';
import { ChartConfig } from 'src/ui/Chart';
import { XAxis, YAxis } from 'recharts';
import { getWeekday } from 'src/utils/helpers';
import { isReportDataValid } from '../../../utils/isReportDataValid';

type WalkinChartsProps = {
  walkinDashboardProps: WalkinDashboardProps | null;
};

export const WalkinCharts: FunctionComponent<WalkinChartsProps> = (props) => {
  const { walkinDashboardProps } = props;

  const flowByWeekdayData = useMemo(() => {
    if (
      isReportDataValid(walkinDashboardProps) === false ||
      isReportDataValid(walkinDashboardProps.average_by_weekday) === null
    ) {
      return [];
    }

    return walkinDashboardProps.average_by_weekday.map((walkin) => ({
      weekday: getWeekday({ weekday: walkin?.weekday }),
      seated_walkin_total: walkin.seated_walkin_total,
      seated_people_total: walkin.seated_people_total,
    }));
  }, [walkinDashboardProps]);

  return (
    <FlowCharts
      bigNumbers={[
        {
          title: 'Total de mesas',
          value: walkinDashboardProps?.seated_walkin_total || 0,
          icon: <Ratio size={16} />,
        },
        {
          title: 'Total de pessoas',
          value: walkinDashboardProps?.seated_people_total || 0,
          icon: <Users size={16} />,
        },
        {
          title: 'Média de pessoas por mesa',
          value: Number((walkinDashboardProps?.people_average || 0).toFixed(2)),
          icon: <Users size={16} />,
        },
      ]}
      flowLineChartProps={{
        title: 'Fluxo de Consumidores',
        config: flowChartConfig,
        data: walkinDashboardProps?.daily || [],
        axis: {
          fixed: 'date',
          dinamic: [
            {
              group: 'service',
              label: 'Mesas Sentadas',
              items: ['seated_walkin_total'],
            },
            {
              group: 'people',
              label: 'Pessoas Sentadas',
              items: ['seated_people_total'],
            },
          ],
        },
      }}
      tableSizeChartProps={{
        legend: true,
        stacked: false,
        title: 'Tamanho médio de mesa',
        layout: 'vertical',
        data: walkinDashboardProps?.table_size || [],
        config: chartConfigTableSize,
        tooltipConfig: {
          hasTotal: true,
        },
        marginChart: {
          left: -15,
        },
        grid: {
          vertical: false,
          horizontal: false,
        },
        axis: (
          <>
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis dataKey="size" type="category" tickLine={false} axisLine={false} />
          </>
        ),
        axisConfig: {
          fixed: 'size',
          dinamic: [
            {
              group: 'service',
              label: 'Mesas',
              items: ['total_seated'],
            },
          ],
        },
      }}
      lineByWeekdayChartProps={{
        legend: true,
        controls: true,
        showControlsBigNumbers: false,
        title: 'Fluxo por dia da semana',
        data: flowByWeekdayData,
        config: chartConfig,
        marginChart: {
          left: -20,
          right: 12,
        },
        tooltipConfig: {
          hasTotal: false,
          labelFormatter: () => null,
        },
        axis: (
          <>
            <XAxis dataKey="weekday" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} />
          </>
        ),
        axisConfig: {
          fixed: 'weekDay',
          dinamic: [
            {
              group: 'service',
              label: 'Passantes',
              items: ['seated_walkin_total'],
            },
            {
              group: 'people',
              label: 'Pessoas',
              items: ['seated_people_total'],
            },
          ],
        },
      }}
    />
  );
};

const flowChartConfig = {
  seated_walkin_total: {
    label: 'Quantidade de mesas',
    color: '#EB6D53',
  },
  seated_people_total: {
    label: 'Quantidade de pessoas',
    color: '#4C727F',
  },
} satisfies ChartConfig;

const chartConfigTableSize = {
  total_seated: {
    label: 'Passante',
    color: '#244854',
  },
} satisfies ChartConfig;

const chartConfig = {
  seated_walkin_total: {
    label: 'Passantes',
    color: '#4C727F',
  },
  seated_people_total: {
    label: 'Passantes (pessoas)',
    color: '#4C727F',
  },
} satisfies ChartConfig;
