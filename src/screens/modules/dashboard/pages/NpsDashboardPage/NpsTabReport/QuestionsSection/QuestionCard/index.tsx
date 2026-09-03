import { FunctionComponent } from 'react';
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { Card } from 'src/ui/Card';
import { cn } from 'src/lib/utils';
import { Button } from 'src/ui/Button';

export type QuestionCardProps = {
  id: string;
  title: string;
  count: number;
  score?: number;
  trend?: number | null;
  onClickShowDetails: (id: string) => void;
};

export const QuestionCard: FunctionComponent<QuestionCardProps> = (props) => {
  const { id, title, score, trend, count, onClickShowDetails } = props;

  const handleClickShowDetails = () => {
    onClickShowDetails(id);
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-full flex items-stretch justify-between">
        <div className="flex flex-col gap-2 p-4 pl-6">
          <div>
            <span className="text-slate-600">{title}</span>
            {score !== undefined && (
              <div className="flex gap-4 items-end">
                <span
                  className={cn(
                    performanceVariants({ variant: getScoreVariant(score) }),
                    'text-3xl font-semibold'
                  )}
                >
                  {score}
                </span>
                {(trend || null) !== null && (
                  <span
                    className={cn(
                      performanceVariants({
                        variant: trend! < 0 ? 'negative' : 'positive',
                      }),
                      'flex items-center gap-2 font-semibold'
                    )}
                  >
                    {trend! < 0 ? (
                      <TrendingDown size={16} strokeWidth={2.5} />
                    ) : (
                      <TrendingUp size={16} strokeWidth={2.5} />
                    )}{' '}
                    {trend} %
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-xs text-slate-400">{count} respostas</span>
        </div>
        <div className="flex items-center p-4 bg-slate-100">
          <Button
            variant="outline"
            className="text-brand-600 p-2 h-fit"
            onClick={handleClickShowDetails}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const getScoreVariant = (score: number) => {
  if (score >= 4.5) {
    return 'positive';
  }

  if (score >= 3.5) {
    return 'neutral';
  }

  return 'negative';
};

export const performanceVariants = cva('', {
  variants: {
    variant: {
      positive: 'text-green-600',
      neutral: 'text-yellow-600',
      negative: 'text-red-600',
    },
  },
  defaultVariants: {
    variant: 'positive',
  },
});
