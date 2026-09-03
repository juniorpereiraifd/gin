import { FunctionComponent, useMemo } from 'react';
import { XAxis, YAxis } from 'recharts';
import { Ratio, Clock4, DollarSign, Users, UserX } from 'lucide-react';
import { LineDashboardProps } from 'src/store/modules/dashboard/reducer';
import { FlowCharts } from '../FlowCharts';
import { ChartConfig } from 'src/ui/Chart';
import { formatNumericParity, getCurrencyBrl, getWeekday } from 'src/utils/helpers';
import { isReportDataValid } from '../../../utils/isReportDataValid';

type LineChartsProps = {
  lineDashboardProps: LineDashboardProps | null;
};

export const LineCharts: FunctionComponent<LineChartsProps> = (props) => {
  const { lineDashboardProps } = props;

  const flowByWeekdayData = useMemo(() => {
    if (
      isReportDataValid(lineDashboardProps) === false ||
      isReportDataValid(lineDashboardProps.line_total_by_weekday) === false
    ) {
      return [];
    }

    return lineDashboardProps.line_total_by_weekday.map((line) => ({
      weekday: getWeekday({ weekday: line?.weekday }),
      seated_total: line.seated_total,
      seated_people_total: line.seated_people_total,
    }));
  }, [lineDashboardProps]);

  return (
    <FlowCharts
      bigNumbers={[
        {
          title: 'Total de mesas',
          value: lineDashboardProps?.line_total || 0,
          icon: <Ratio size={16} />,
        },
        {
          title: 'Total de pessoas',
          value: lineDashboardProps?.people_total || 0,
          icon: <Users size={16} />,
        },
        {
          title: 'Tempo médio de espera',
          value: lineDashboardProps?.waiting_time_average || 0,
          icon: <Clock4 size={16} />,
        },
        {
          title: 'Média de pessoas por mesa',
          value: Number((lineDashboardProps?.people_average || 0).toFixed(2)),
          icon: <Users size={16} />,
        },
        {
          title: 'Taxa de não comparecimento',
          value: `${formatNumericParity(
            ((lineDashboardProps?.non_attendance_total || 0) * 100) / (lineDashboardProps?.line_total || 0)
          )} %`,
          icon: <UserX size={16} />,
        },
        {
          title: 'Receita gerada via Get In',
          value: getCurrencyBrl((lineDashboardProps?.billing || 0) / 100, true),
          icon: <DollarSign size={16} />,
        },
      ]}
      flowLineChartProps={{
        title: 'Fluxo de Consumidores',
        config: flowChartConfig,
        data: lineDashboardProps?.daily_line_total || [],
        axis: {
          fixed: 'date',
          dinamic: [
            {
              group: 'service',
              label: 'Mesas Sentadas',
              items: ['seated_total'],
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
        data: lineDashboardProps?.table_size || [],
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
          fixed: 'weekday',
          dinamic: [
            {
              group: 'service',
              label: 'Filas',
              items: ['seated_total'],
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
  seated_total: {
    label: 'Quantidade de mesas',
    color: '#EB6D53',
  },
  seated_people_total: {
    label: 'Quantidade de pessoas',
    color: '#7C392B',
  },
} satisfies ChartConfig;

const chartConfigTableSize = {
  total_seated: {
    label: 'Fila',
    color: '#EB6D53',
  },
} satisfies ChartConfig;

const chartConfig = {
  seated_total: {
    label: 'Filas',
    color: '#EB6D53',
  },
  seated_people_total: {
    label: 'Filas (pessoas)',
    color: '#7C392B',
  },
} satisfies ChartConfig;
