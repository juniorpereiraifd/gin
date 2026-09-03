import { FunctionComponent } from 'react';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { GaugeComponent } from 'react-gauge-component';
import { Inbox, LoaderCircle } from 'lucide-react';

export type NpsScoreChartProps = {
  value?: number;
  loading: boolean;
};

export const NpsScoreChart: FunctionComponent<NpsScoreChartProps> = (props) => {
  const { value, loading } = props;

  return (
    <div className="h-full">
      <BoxContrasted>
        <div className="h-full flex flex-col">
          <div className="w-full flex items-center justify-between">
            <span className="text-slate-700 font-bold text-base">
              Nota de NPS
            </span>
            {loading === true && (
              <div className="flex gap-2 justify-center items-center">
                <LoaderCircle
                  size={14}
                  className="animate-spin text-brand-600"
                />
                <span className="text-slate-500 text-sm">Buscando nota</span>
              </div>
            )}
          </div>
          {value === undefined ? (
            <div className="h-[230px] flex flex-col gap-4 items-center justify-center flex-1 text-slate-600">
              <Inbox size={24} />
              <span className="text-xs">
                Não há nota de NPS no período selecionado
              </span>
            </div>
          ) : (
            <GaugeComponent
              className="h-full flex items-center"
              value={value}
              minValue={-100}
              maxValue={100}
              type="semicircle"
              pointer={{ type: 'arrow', elastic: true }}
              arc={{
                padding: 0.01,
                width: 0.27,
                subArcs: [
                  {
                    limit: 0,
                    color: '#dc2626',
                    showTick: true,
                  },
                  {
                    limit: 50,
                    color: '#ca8a04',
                    showTick: true,
                  },
                  {
                    limit: 100,
                    color: '#16a34a',
                    showTick: true,
                  },
                ],
              }}
              labels={{
                valueLabel: {
                  formatTextValue: (value) => value + '%',
                  matchColorWithArc: true,
                  style: {
                    fontSize: '30px',
                    textShadow: 'none',
                    fontWeight: 'bold',
                  },
                },
                tickLabels: {
                  type: 'outer',
                  defaultTickValueConfig: {
                    formatTextValue: (value: any) => value + '%',
                    style: { fontSize: 10 },
                  },
                  ticks: [
                    { value: -100 },
                    { value: 0 },
                    { value: 50 },
                    { value: 100 },
                  ],
                },
              }}
            />
          )}
        </div>
      </BoxContrasted>
    </div>
  );
};
