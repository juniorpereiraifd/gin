import { FunctionComponent, useMemo } from 'react';
import { Label, Pie, PieChart } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from 'src/ui/Chart';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Separator } from 'src/ui/Separator';
import { Skeleton } from 'src/ui/Skeleton';
import { Inbox, LoaderCircle } from 'lucide-react';

const chartConfig = {
  promoters: {
    label: 'Promotores',
  },
  neutrals: {
    label: 'Neutros',
  },
  detractors: {
    label: 'Detratores',
  },
} satisfies ChartConfig;

export type AnswersDetailsChartProps = {
  loading: boolean;
  answersData: {
    promoters: {
      value?: number;
      percent?: number;
    };
    neutrals: {
      value?: number;
      percent?: number;
    };
    detractors: {
      value?: number;
      percent?: number;
    };
  };
};

export const AnswersDetailsChart: FunctionComponent<
  AnswersDetailsChartProps
> = (props) => {
  const { answersData, loading } = props;
  const chartData = [
    {
      type: 'promoters',
      answers: answersData.promoters.value,
      fill: '#16a34a',
    },
    { type: 'neutrals', answers: answersData.neutrals.value, fill: '#ca8a04' },
    {
      type: 'detractors',
      answers: answersData.detractors.value,
      fill: '#dc2626',
    },
  ];

  const totalAnswers = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + (curr.answers || 0), 0);
  }, [chartData]);

  return (
    <div className="col-span-2">
      <BoxContrasted>
        <div className="w-full h-full flex flex-col">
          <span className="text-slate-700 font-bold text-base">Respostas</span>
          <div className="w-full h-full flex flex-1">
            {loading === true ? (
              <div className="h-[230px] flex-1 flex gap-2 justify-center items-center">
                <LoaderCircle
                  size={14}
                  className="animate-spin text-brand-600"
                />
                <span className="text-slate-500 text-sm">
                  Buscando respostas
                </span>
              </div>
            ) : totalAnswers === 0 ? (
              <div className="w-full h-[230px] flex flex-col gap-4 items-center justify-center flex-1 text-slate-600">
                <Inbox size={24} />
                <span className="text-xs">
                  Não houve resposta no período selecionado
                </span>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[230px] flex-1">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="answers"
                    nameKey="type"
                    innerRadius={60}
                    strokeWidth={4}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {totalAnswers.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Respostas
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
            {loading === true ? (
              <div className="flex-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <>
                    <Skeleton key={index} className="h-6 w-full mb-4" />
                    <Separator className="mb-4" />
                  </>
                ))}
              </div>
            ) : (
              <>
                {chartData.every((item) => item.answers !== undefined) ===
                  true && (
                  <div className="flex-1">
                    {chartData.map(
                      (item) =>
                        item.answers !== undefined && (
                          <>
                            <div className="flex items-center justify-between mb-4">
                              <span className="font-medium">
                                {
                                  chartConfig[
                                    item.type as keyof typeof chartConfig
                                  ].label
                                }
                              </span>
                              <span>{`${item.answers} (${
                                answersData[
                                  item.type as keyof typeof answersData
                                ].percent
                              } %)`}</span>
                            </div>
                            <Separator className="mb-4" />
                          </>
                        )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </BoxContrasted>
    </div>
  );
};
