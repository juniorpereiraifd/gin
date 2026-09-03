import { FunctionComponent, useMemo } from 'react';
import { FlowCharts } from '../FlowCharts';
import { Armchair, DollarSign, Users, UserX, Ratio } from 'lucide-react';
import { ChartConfig } from 'src/ui/Chart';
import { XAxis, YAxis } from 'recharts';
import {
  LineDashboardProps,
  ReservationDashboardProps,
  TableSize,
  WalkinDashboardProps,
} from 'src/store/modules/dashboard/reducer';
import { Module } from 'src/store/modules/unity/reducer';
import { formatNumericParity, getCurrencyBrl, getWeekday } from 'src/utils/helpers';
import { isReportDataValid } from '../../../utils/isReportDataValid';

type DailyData = {
  date: string;
  tableAmount: number;
  peopleAmount: number;
};

type FlowByWeekdayData = {
  weekday: string;
  lineAmount: number;
  reservationAmount: number;
  walkinAmount: number;
  peopleLineAmount: number;
  peopleReservationAmount: number;
  peopleWalkinAmount: number;
};

type SummaryChartsProps = {
  reservationDashboardProps: ReservationDashboardProps | null;
  lineDashboardProps: LineDashboardProps | null;
  walkinDashboardProps: WalkinDashboardProps | null;
  unitModules: Module;
};

export const SummaryCharts: FunctionComponent<SummaryChartsProps> = (props) => {
  const { reservationDashboardProps, lineDashboardProps, walkinDashboardProps, unitModules } = props;

  const flowData = useMemo(() => {
    const flowData: Record<string, DailyData> = {};
    const flowByWeekDay: Record<string, FlowByWeekdayData> = {};
    let bigNumbers = {
      total: 0,
      totalPeople: 0,
      non_attendance: 0,
      peopleTotal: 0,
      billing: 0,
    };

    if (isReportDataValid(reservationDashboardProps) === true && unitModules.reservation === true) {
      reservationDashboardProps.daily_reservation_total.forEach(({ date, seated_people_total, seated_reservation_total }) => {
        if (!flowData[date]) {
          flowData[date] = { date, peopleAmount: 0, tableAmount: 0 };
        }

        flowData[date].peopleAmount += parseInt(seated_people_total);
        flowData[date].tableAmount += seated_reservation_total;
      });

      reservationDashboardProps.reservation_average_by_weekday.forEach(
        ({ weekday, seated_reservation_total, seated_people_total }) => {
          if (!flowByWeekDay[weekday]) {
            flowByWeekDay[weekday] = {
              weekday: getWeekday({ weekday: weekday }),
              reservationAmount: 0,
              lineAmount: 0,
              walkinAmount: 0,
              peopleLineAmount: 0,
              peopleReservationAmount: 0,
              peopleWalkinAmount: 0,
            };
          }

          flowByWeekDay[weekday].reservationAmount += parseInt(seated_reservation_total);
          flowByWeekDay[weekday].peopleReservationAmount += parseInt(seated_people_total);
        }
      );

      bigNumbers.total += reservationDashboardProps.reservation_total;
      bigNumbers.totalPeople += reservationDashboardProps.people_total;
      bigNumbers.peopleTotal += reservationDashboardProps.people_total;
      bigNumbers.non_attendance += reservationDashboardProps.non_attendance_total;
      bigNumbers.billing += reservationDashboardProps.billing;
    }

    if (isReportDataValid(lineDashboardProps) === true && unitModules.line === true) {
      lineDashboardProps.daily_line_total.forEach(({ date, seated_people_total, seated_total }) => {
        if (!flowData[date]) {
          flowData[date] = { date, peopleAmount: 0, tableAmount: 0 };
        }

        flowData[date].peopleAmount += parseInt(seated_people_total);
        flowData[date].tableAmount += seated_total;
      });

      lineDashboardProps.line_total_by_weekday.forEach(({ weekday, seated_total, seated_people_total }) => {
        if (!flowByWeekDay[weekday]) {
          flowByWeekDay[weekday] = {
            weekday: getWeekday({ weekday: weekday }),
            reservationAmount: 0,
            lineAmount: 0,
            walkinAmount: 0,
            peopleLineAmount: 0,
            peopleReservationAmount: 0,
            peopleWalkinAmount: 0,
          };
        }

        flowByWeekDay[weekday].lineAmount += parseInt(seated_total);
        flowByWeekDay[weekday].peopleLineAmount += parseInt(seated_people_total);
      });

      bigNumbers.total += lineDashboardProps.line_total;
      bigNumbers.totalPeople += lineDashboardProps.people_total;
      bigNumbers.non_attendance += lineDashboardProps.non_attendance_total;
      bigNumbers.peopleTotal += lineDashboardProps.daily_line_total.reduce(
        (acc, { seated_people_total }) => acc + parseInt(seated_people_total),
        0
      );
      bigNumbers.billing += lineDashboardProps.billing;
    }

    if (isReportDataValid(walkinDashboardProps) === true) {
      walkinDashboardProps.daily.forEach(({ date, seated_people_total, seated_walkin_total }) => {
        if (!flowData[date]) {
          flowData[date] = { date, peopleAmount: 0, tableAmount: 0 };
        }

        flowData[date].peopleAmount += parseInt(seated_people_total);
        flowData[date].tableAmount += seated_walkin_total;
      });

      walkinDashboardProps.average_by_weekday.forEach(({ weekday, seated_walkin_total, seated_people_total }) => {
        if (!flowByWeekDay[weekday]) {
          flowByWeekDay[weekday] = {
            weekday: getWeekday({ weekday: weekday }),
            reservationAmount: 0,
            lineAmount: 0,
            walkinAmount: 0,
            peopleLineAmount: 0,
            peopleReservationAmount: 0,
            peopleWalkinAmount: 0,
          };
        }

        flowByWeekDay[weekday].walkinAmount += parseInt(seated_walkin_total);
        flowByWeekDay[weekday].peopleWalkinAmount += parseInt(seated_people_total);
      });

      bigNumbers.total += walkinDashboardProps.seated_walkin_total;
      bigNumbers.totalPeople += walkinDashboardProps.seated_people_total;
    }

    return {
      flowData: Object.values(flowData),
      flowByWeekDay: Object.values(flowByWeekDay),
      bigNumbers,
      nonAttendance: (bigNumbers.non_attendance * 100) / bigNumbers.total || 0,
    };
  }, [reservationDashboardProps, lineDashboardProps, walkinDashboardProps, unitModules]);

  const averageSizeTableChartData = useMemo(() => {
    if (
      isReportDataValid(reservationDashboardProps) === false ||
      isReportDataValid(lineDashboardProps) === false ||
      isReportDataValid(walkinDashboardProps) === false
    ) {
      return [];
    }

    return aggregateTableSizesByService(
      reservationDashboardProps.table_size,
      lineDashboardProps.table_size,
      walkinDashboardProps.table_size
    );
  }, [reservationDashboardProps, lineDashboardProps, walkinDashboardProps]);

  return (
    <FlowCharts
      bigNumbers={[
        {
          title: 'Total de mesas',
          value: flowData.bigNumbers.total,
          icon: <Ratio size={16} />,
        },
        {
          title: 'Total de pessoas',
          value: flowData.bigNumbers.totalPeople,
          icon: <Users size={16} />,
        },
        {
          title: 'Taxa de não comparecimento',
          value: `${formatNumericParity(flowData.nonAttendance)} %`,
          icon: <UserX size={16} />,
        },
        {
          title: 'Receita gerada via Get In',
          value: getCurrencyBrl(flowData.bigNumbers.billing / 100, true),
          icon: <DollarSign size={16} />,
        },
      ]}
      flowLineChartProps={{
        title: 'Fluxo geral',
        config: flowChartConfig,
        data: flowData.flowData,
        axis: {
          fixed: 'date',
          dinamic: [
            {
              group: 'service',
              label: 'Mesas sentadas',
              items: ['tableAmount'],
            },
            {
              group: 'people',
              label: 'Pessoas sentadas',
              items: ['peopleAmount'],
            },
          ],
        },
      }}
      tableSizeChartProps={{
        legend: true,
        stacked: true,
        title: 'Tamanho médio de mesa',
        layout: 'vertical',
        data: averageSizeTableChartData,
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
              items: ['lineAmount', 'reservationAmount', 'walkinAmount'],
            },
          ],
        },
      }}
      lineByWeekdayChartProps={{
        legend: true,
        stacked: true,
        controls: true,
        showControlsBigNumbers: false,
        title: 'Fluxo por dia da semana',
        data: flowData.flowByWeekDay,
        config: chartConfig,
        tooltipConfig: {
          hasTotal: true,
          labelFormatter: () => null,
        },
        marginChart: {
          left: -20,
          right: 12,
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
              label: 'Mesas',
              items: ['reservationAmount', 'lineAmount', 'walkinAmount'],
            },
            {
              group: 'people',
              label: 'Pessoas',
              items: ['peopleLineAmount', 'peopleReservationAmount', 'peopleWalkinAmount'],
            },
          ],
        },
      }}
    />
  );
};

const aggregateTableSizesByService = (dataReservation: TableSize[], dataLine: TableSize[], dataWalkin: TableSize[]) => {
  const tableSizeMap: Record<
    string,
    {
      reservationAmount: number;
      lineAmount: number;
      walkinAmount: number;
      size: string;
    }
  > = {};

  dataReservation.forEach((item) => {
    if (!tableSizeMap[item.size]) {
      tableSizeMap[item.size] = {
        reservationAmount: 0,
        lineAmount: 0,
        walkinAmount: 0,
        size: item.size,
      };
    }

    tableSizeMap[item.size].reservationAmount += item.total_seated;
  });

  dataLine.forEach((item) => {
    if (!tableSizeMap[item.size]) {
      tableSizeMap[item.size] = {
        reservationAmount: 0,
        lineAmount: 0,
        walkinAmount: 0,
        size: item.size,
      };
    }

    tableSizeMap[item.size].lineAmount += item.total_seated;
  });

  dataWalkin.forEach((item) => {
    if (!tableSizeMap[item.size]) {
      tableSizeMap[item.size] = {
        reservationAmount: 0,
        lineAmount: 0,
        walkinAmount: 0,
        size: item.size,
      };
    }

    tableSizeMap[item.size].walkinAmount += item.total_seated;
  });

  return Object.values(tableSizeMap);
};

const flowChartConfig = {
  tableAmount: {
    label: 'Quantidade de mesas',
    color: '#234093',
  },
  peopleAmount: {
    label: 'Quantidade de pessoas',
    color: '#947423',
  },
} satisfies ChartConfig;

const chartConfigTableSize = {
  lineAmount: {
    label: 'Fila',
    color: '#EB6D53',
  },
  reservationAmount: {
    label: 'Reserva',
    color: '#199E90',
  },
  walkinAmount: {
    label: 'Passante',
    color: '#244854',
  },
} satisfies ChartConfig;

const chartConfig = {
  lineAmount: {
    label: 'Filas',
    color: '#EB6D53',
  },
  reservationAmount: {
    label: 'Reservas',
    color: '#199E90',
  },
  walkinAmount: {
    label: 'Passantes',
    color: '#244854',
  },
  peopleLineAmount: {
    label: 'Filas (pessoas)',
    color: '#EB6D53',
  },
  peopleReservationAmount: {
    label: 'Reservas (pessoas)',
    color: '#199E90',
  },
  peopleWalkinAmount: {
    label: 'Passantes (pessoas)',
    color: '#244854',
  },
} satisfies ChartConfig;
