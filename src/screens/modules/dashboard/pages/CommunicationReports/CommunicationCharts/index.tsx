import { Fragment, FunctionComponent, ReactNode } from 'react';
import { BigNumberCard } from '../../../components/BigNumberCard';
import { FlowLineChart } from '../../../components/FlowLineChart';
import { ChartConfig } from 'src/ui/Chart';
import { AmountComunication } from 'src/store/modules/dashboard/reducer';
import { Loader2 } from 'lucide-react';
// import { DataByBarChart } from '../../../components/DataByBarChart';

type CommucationChartsProps = {
  bigNumbers: {
    title: string;
    value: ReactNode;
    icon: ReactNode;
  }[];
  data: AmountComunication['daily'] | undefined;
  loading: boolean;
};

export const CommunicationCharts: FunctionComponent<CommucationChartsProps> = (props) => {
  const { bigNumbers, data, loading } = props;

  return (
    <Fragment>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {bigNumbers.map((bigNumber) => (
          <BigNumberCard key={bigNumber.title} {...bigNumber} />
        ))}
      </div>
      <FlowLineChart
        title={
          <div className="flex items-center gap-2">
            <span>Envios</span>
            {loading === true && <Loader2 className="animate-spin" size={14} />}
          </div>
        }
        config={communicationChartConfig}
        data={data ?? []}
        axis={{
          fixed: 'date',
          dinamic: [
            {
              group: 'sms',
              label: 'Sms',
              items: ['sms_total'],
            },
            {
              group: 'email',
              label: 'Emails',
              items: ['email_total'],
            },
            {
              group: 'whatsapp',
              label: 'Whatsapp',
              items: ['whatsapp_total'],
            },
          ],
        }}
      />
      {/* <div className="grid gap-4 grid-cols-2">
        <DataByBarChart />
      </div> */}
    </Fragment>
  );
};

const communicationChartConfig = {
  email_total: {
    label: 'Quantidade de emails',
    color: '#199E90',
  },
  sms_total: {
    label: 'Quantidade de sms',
    color: '#244945',
  },
  whatsapp_total: {
    label: 'Quantidade de whatsapp',
    color: '#25D366',
  },
} satisfies ChartConfig;
