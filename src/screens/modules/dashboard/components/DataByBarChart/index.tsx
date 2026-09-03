import { FunctionComponent, ReactNode, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid } from 'recharts';
import { Margin } from 'recharts/types/util/types';
import { Card, CardDescription, CardHeader, CardTitle } from 'src/ui/Card';
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from 'src/ui/Chart';

export type DataByBarChartProps = {
  title: string;
  config: ChartConfig;
  data: any[];
  axis: ReactNode;
  controls?: boolean;
  showControlsBigNumbers?: boolean;
  legend?: boolean;
  layout?: 'horizontal' | 'vertical';
  stacked?: boolean;
  description?: string;
  marginChart?: Margin;
  grid?: {
    vertical: boolean;
    horizontal: boolean;
  };
  tooltipConfig?: {
    hasTotal: boolean;
    labelFormatter?: (label: any, payload: any[]) => ReactNode;
  };
  axisConfig?: {
    fixed: string;
    dinamic: { group: string; label: string; items: string[] }[];
  };
};

export const DataByBarChart: FunctionComponent<DataByBarChartProps> = (props) => {
  const {
    title,
    description,
    data,
    config,
    controls = 'false',
    showControlsBigNumbers = true,
    legend = false,
    layout = 'horizontal',
    stacked = false,
    axis,
    axisConfig,
    tooltipConfig,
    marginChart,
    grid = { vertical: false, horizontal: true },
  } = props;
  const [activeGroup, setActiveGroup] = useState<string | null>(
    axisConfig?.dinamic instanceof Array ? axisConfig.dinamic[0].group : null
  );
  const activeGroupData = axisConfig?.dinamic.filter((item) => item.group === activeGroup)[0];

  const total = useMemo(() => {
    if (axisConfig?.dinamic instanceof Array && controls === true && showControlsBigNumbers === true) {
      return axisConfig.dinamic.map((group) => {
        const average = Number(
          group.items
            .map((item) => ({
              value: data.reduce((acc, curr) => acc + parseFloat(curr[item]), 0),
            }))
            .reduce((acc, curr) => acc + curr.value, 0) / 7
        );

        return {
          group: group.group,
          total: average.toFixed(2),
        };
      });
    }

    return null;
  }, [axisConfig, data, controls, showControlsBigNumbers]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch justify-between space-y-0 border-b p-0 sm:flex-row mb-8 h-20">
        <div className="flex flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-base text-slate-700 font-semibold">{title}</CardTitle>
          {description !== undefined && (
            <CardDescription className="text-sm text-slate-500">{description}</CardDescription>
          )}
        </div>
        {axisConfig?.dinamic instanceof Array && controls === true && (
          <div className="flex">
            {axisConfig.dinamic.map((key) => {
              const chart = key.group as keyof typeof config;

              return (
                <button
                  key={chart}
                  data-active={activeGroup === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-l border-slate-200 border-solid px-6 py-2 text-left even:border-l data-[active=true]:bg-slate-50 sm:border-l sm:border-t-0 sm:px-8 sm:py-4 hover:bg-slate-50 transition"
                  onClick={() => setActiveGroup(chart)}
                >
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{key.label}</span>
                  {total !== null && showControlsBigNumbers === true && (
                    <span className="text-lg text-slate-700 font-bold leading-none sm:text-xl">
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
        <BarChart accessibilityLayer layout={layout} data={data} margin={marginChart}>
          <CartesianGrid vertical={grid?.vertical} horizontal={grid?.horizontal} />
          <ChartTooltip
            labelFormatter={tooltipConfig?.labelFormatter}
            content={
              <ChartTooltipContent
                formatter={(value, name, item, index) => (
                  <>
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                      style={
                        {
                          '--color-bg': `var(--color-${name})`,
                        } as React.CSSProperties
                      }
                    />
                    {config[name as keyof typeof config]?.label || name}
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {value}
                    </div>
                    {index + 1 === activeGroupData?.items.length && tooltipConfig?.hasTotal === true && (
                      <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                        Total
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {getData(item.payload, activeGroupData?.items)}
                        </div>
                      </div>
                    )}
                  </>
                )}
              />
            }
          />
          {legend === true && <ChartLegend content={<ChartLegendContent />} />}
          {axis}
          {axisConfig?.dinamic !== undefined &&
            activeGroup !== null &&
            activeGroupData?.items.map((item, index, arr) => (
              <Bar
                dataKey={item}
                stackId={stacked === true ? 'a' : undefined}
                fill={`var(--color-${item})`}
                radius={getBarRadius({ index, arr, isVertical: layout === 'vertical', isStacked: stacked })}
              />
            ))}
        </BarChart>
      </ChartContainer>
    </Card>
  );
};

type GetBarRadiusProps = {
  index: number;
  arr: string[];
  isVertical: boolean;
  isStacked: boolean;
};

const getBarRadius = ({
  index,
  arr,
  isVertical,
  isStacked,
}: GetBarRadiusProps): 0 | [number, number, number, number] => {
  if (isVertical === true) {
    if (isStacked === false) {
      return [4, 4, 4, 4];
    }

    if (index === 0) {
      return [4, 0, 0, 4];
    }

    return index + 1 === arr.length ? [0, 4, 4, 0] : 0;
  }

  if (isStacked === false) {
    return [4, 4, 4, 4];
  }

  if (index === 0) {
    return [0, 0, 4, 4];
  }

  return index + 1 === arr.length ? [4, 4, 0, 0] : 0;
};

const getData = (payload: any, items: string[]) => {
  let total = 0;

  for (const key of items) {
    total += parseFloat(payload[key]);
  }

  return total;
};
