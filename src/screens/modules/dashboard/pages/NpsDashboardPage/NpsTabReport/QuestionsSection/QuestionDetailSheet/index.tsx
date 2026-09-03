import { ArrowUpDown } from 'lucide-react';
import { FunctionComponent, ReactNode, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  QuestionDailyAverage,
  SingleChoiceQuestionOption,
} from 'src/store/modules/nps/reducer';
import { Button } from 'src/ui/Button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from 'src/ui/Chart';
import { Separator } from 'src/ui/Separator';
import {
  Sheet,
  SheetProps,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetHeader,
} from 'src/ui/Sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/ui/Table';
import { Heading } from 'src/ui/Typograph';

type ScaleProps = QuestionDailyAverage;

type SingleChoiceProps = SingleChoiceQuestionOption;

type ScaleSheetProps = {
  scale: ScaleProps[];
};

type SingleChoiceSheetProps = {
  options: SingleChoiceProps[];
};

type QuestionMap = {
  scale: ScaleSheetProps;
  'single-choice': SingleChoiceSheetProps;
};

export type QuestionType = keyof QuestionMap;

type QuestionDetailSheetProps<K extends QuestionType = QuestionType> = {
  [T in K]: QuestionMap[T] &
    Pick<SheetProps, 'open' | 'onOpenChange'> & {
      type: T;
      title: string;
      description?: string;
      answersCount?: number;
    };
}[K];

export const QuestionDetailSheet: FunctionComponent<
  QuestionDetailSheetProps
> = (props) => {
  const {
    title,
    description,
    open,
    onOpenChange,
    type,
    answersCount,
    ...rest
  } = props;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col dark:border-l p-0 sm:max-w-sm md:w-[600px] md:max-w-[600px]">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>{title}</SheetTitle>
          {description !== undefined && (
            <SheetDescription>{description}</SheetDescription>
          )}
        </SheetHeader>
        <Separator />
        <div className="flex p-6">{getQuestionSheetContent(type, rest)}</div>
        {answersCount !== undefined && (
          <div className="flex justify-end p-6 pt-0">
            <span className="text-slate-700 font-medium">
              Total de {answersCount} resposta{answersCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

const getQuestionSheetContent = (type: QuestionType, props: any): ReactNode => {
  switch (type) {
    case 'scale':
      return <QuestionDetailSheetScaleContent {...props} />;
    case 'single-choice':
      return <QuestionDetailSheetOptionContent {...props} />;
  }
};

const chartConfig = {
  average: {
    label: 'Nota média',
    color: '#2dd4bf',
  },
} satisfies ChartConfig;

const QuestionDetailSheetScaleContent: FunctionComponent<ScaleSheetProps> = (
  props
) => {
  const { scale } = props;

  return (
    <div className="w-full">
      <Heading level="6" className="mb-10 text-slate-700">
        Nota média
      </Heading>
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={scale}
          margin={{
            left: -40,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} horizontal={true} />
          <XAxis
            dataKey="answer_date"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
            }}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="average"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                }}
              />
            }
          />
          <defs>
            <linearGradient id="fillAverage" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-average)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-average)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="average"
            type="natural"
            fill="url(#fillAverage)"
            fillOpacity={0.4}
            stroke="var(--color-average)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

const QuestionDetailSheetOptionContent: FunctionComponent<
  SingleChoiceSheetProps
> = (props) => {
  const { options } = props;
  const [listOptions, setListOptions] = useState<SingleChoiceProps[]>(options);
  const [sorted, setSorted] = useState(false);
  const optionWithMostResponse = options.reduce((max, obj) =>
    obj.count > max.count ? obj : max
  );

  const handleSortOptions = () => {
    if (sorted === false) {
      const sortedOptions = [...listOptions].sort((a, b) =>
        a.count > b.count ? -1 : 1
      );

      setListOptions(sortedOptions);
      setSorted(true);
    } else {
      setListOptions(options);
      setSorted(false);
    }
  };

  return (
    <div className="w-full">
      <Heading level="6" className="mb-4 text-slate-700">
        Quantidade de respostas por opção
      </Heading>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Opção</TableHead>
            <TableHead colSpan={2}>
              <Button
                variant="ghost"
                className="ml-[-16px]"
                onClick={handleSortOptions}
              >
                Respostas <ArrowUpDown size={16} />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listOptions.map((option) => {
            return (
              <TableRow key={option.option_name} className="border-0">
                <TableCell className="font-medium">
                  {option.option_name}
                </TableCell>
                <TableCell className="w-[0%] pr-0">
                  <div className="w-fit whitespace-nowrap">{option.count}</div>
                </TableCell>
                <TableCell>
                  <div
                    className="h-3 bg-red-400 rounded-[4px]"
                    style={{
                      width: `${Math.round(
                        (option.count * 100) / optionWithMostResponse.count
                      )}%`,
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
