import dayjs from 'dayjs';
import { FunctionComponent, ReactNode, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardDescription, CardHeader, CardTitle } from 'src/ui/Card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from 'src/ui/Chart';

export type FlowLineChartProps = {
  title: ReactNode;
  description?: string;
  config: ChartConfig;
  data: any[];
  legend?: boolean;
  axis: {
    fixed: string;
    dinamic: string | { group: string; label: string; items: string[] }[];
  };
};

export const FlowLineChart: FunctionComponent<FlowLineChartProps> = (props) => {
  const { title, description, config, data, axis, legend = false } = props;
  const [activeGroup, setActiveGroup] = useState<string | null>(
    axis.dinamic instanceof Array ? axis.dinamic[0].group : null
  );

  const total = useMemo(() => {
    if (axis.dinamic instanceof Array) {
      return axis.dinamic.map((group) => ({
        group: group.group,
        total: group.items
          .map((item) => ({
            value: data.reduce((acc, curr) => acc + curr[item], 0),
          }))
          .reduce((acc, curr) => acc + curr.value, 0),
      }));
    }

    return null;
  }, [axis, data]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row mb-8 overflow-hidden">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-base text-slate-700 font-semibold">{title}</CardTitle>
          {description !== undefined && (
            <CardDescription className="text-sm text-slate-500">{description}</CardDescription>
          )}
        </div>
        {axis.dinamic instanceof Array && (
          <div className="flex overflow-hidden">
            {axis.dinamic.map((key) => {
              const chart = key.group as keyof typeof config;

              return (
                <button
                  key={chart}
                  data-active={activeGroup === chart}
                  className="flex flex-1 flex-col justify-center gap-1 border-t border-l rounded-tr-md border-slate-200 border-solid px-6 py-4 text-left even:border-l data-[active=true]:bg-slate-50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 hover:bg-slate-50 transition"
                  onClick={() => setActiveGroup(chart)}
                >
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{key.label}</span>
                  {total !== null && (
                    <span className="text-lg text-slate-700 font-bold leading-none sm:text-2xl">
                      {total.filter((item) => item.group === chart)[0].total}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </CardHeader>
      <ChartContainer config={config} className="min-h-[200px] max-h-[400px] w-full p-0 px-6 pb-6">
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            left: -20,
            right: 12,
            top: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey={axis.fixed}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => dayjs(value).format('DD [de] MMM')}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            content={<ChartTooltipContent labelFormatter={(value) => dayjs(value).format('DD [de] MMM')} />}
          />
          {legend === true && <ChartLegend content={<ChartLegendContent />} />}
          {axis.dinamic instanceof Array && activeGroup !== null ? (
            axis.dinamic
              .filter((item) => item.group === activeGroup)[0]
              .items.map((item) => (
                <Line dataKey={item} type="monotoneX" stroke={`var(--color-${item})`} strokeWidth={2} dot={false} />
              ))
          ) : (
            <Line
              dataKey={axis.dinamic as string}
              type="monotoneX"
              stroke={`var(--color-${axis.dinamic})`}
              strokeWidth={2}
              dot={false}
            />
          )}
        </LineChart>
      </ChartContainer>
    </Card>
  );
};
