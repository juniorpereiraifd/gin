import { FunctionComponent, useMemo } from 'react';
import { XAxis, YAxis } from 'recharts';
import { Ratio, DollarSign, Users, UserX } from 'lucide-react';
import { ReservationDashboardProps } from 'src/store/modules/dashboard/reducer';
import { ChartConfig } from 'src/ui/Chart';
import { FlowCharts } from '../FlowCharts';
import { formatNumericParity, getCurrencyBrl, getWeekday } from 'src/utils/helpers';
import { isReportDataValid } from '../../../utils/isReportDataValid';

type ReservationChartsProps = {
  reservationDashboardProps: ReservationDashboardProps | null;
};

export const ReservationCharts: FunctionComponent<ReservationChartsProps> = (props) => {
  const { reservationDashboardProps } = props;

  const flowByWeekdayData = useMemo(() => {
    if (
      isReportDataValid(reservationDashboardProps) === false ||
      isReportDataValid(reservationDashboardProps.reservation_average_by_weekday) === false
    ) {
      return [];
    }

    return reservationDashboardProps.reservation_average_by_weekday.map((reservation) => ({
      weekday: getWeekday({ weekday: reservation?.weekday }),
      seated_reservation_total: reservation.seated_reservation_total,
      seated_people_total: reservation.seated_people_total,
    }));
  }, [reservationDashboardProps]);

  return (
    <FlowCharts
      bigNumbers={[
        {
          title: 'Total de mesas',
          value: reservationDashboardProps?.reservation_total || 0,
          icon: <Ratio size={16} />,
        },
        {
          title: 'Total de pessoas',
          value: reservationDashboardProps?.people_total || 0,
          icon: <Users size={16} />,
        },
        {
          title: 'Média de pessoas por mesa',
          value: Number((reservationDashboardProps?.people_average || 0).toFixed(2)),
          icon: <Users size={16} />,
        },
        {
          title: 'Taxa de cancelamento',
          value: `${formatNumericParity(
            ((reservationDashboardProps?.canceled_total || 0) * 100) /
              (reservationDashboardProps?.reservation_total || 0)
          )} %`,
          icon: <UserX size={16} />,
        },
        {
          title: 'Taxa de não comparecimento',
          value: `${formatNumericParity(
            ((reservationDashboardProps?.non_attendance_total || 0) * 100) /
              (reservationDashboardProps?.reservation_total || 0)
          )} %`,
          icon: <UserX size={16} />,
        },
        {
          title: 'Pessoas sentadas via Get In',
          value: reservationDashboardProps?.seated_people_getin || 0,
          icon: <Users size={16} />,
        },
        {
          title: 'Receita gerada via Get In',
          value: getCurrencyBrl((reservationDashboardProps?.billing || 0) / 100, true),
          icon: <DollarSign size={16} />,
        },
      ]}
      flowLineChartProps={{
        title: 'Fluxo de Consumidores',
        config: flowChartConfig,
        data: reservationDashboardProps?.daily_reservation_total || [],
        axis: {
          fixed: 'date',
          dinamic: [
            {
              group: 'service',
              label: 'Mesas Sentadas',
              items: ['seated_reservation_total'],
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
        data: reservationDashboardProps?.table_size || [],
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
              label: 'Reservas',
              items: ['seated_reservation_total'],
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
  seated_reservation_total: {
    label: 'Quantidade de mesas',
    color: '#199E90',
  },
  seated_people_total: {
    label: 'Quantidade de pessoas',
    color: '#244945',
  },
} satisfies ChartConfig;

const chartConfigTableSize = {
  total_seated: {
    label: 'Reserva',
    color: '#199E90',
  },
} satisfies ChartConfig;

const chartConfig = {
  seated_reservation_total: {
    label: 'Reservas',
    color: '#199E90',
  },
  seated_people_total: {
    label: 'Reservas (pessoas)',
    color: '#244945',
  },
} satisfies ChartConfig;
