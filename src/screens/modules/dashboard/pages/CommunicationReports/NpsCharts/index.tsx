import { FunctionComponent } from 'react';
import { Send } from 'lucide-react';
import { CommunicationDashboardProps } from 'src/store/modules/dashboard/reducer';
import { CommunicationCharts } from '../CommunicationCharts';

type NpsChartsProps = {
  npsCommunicationProps: CommunicationDashboardProps['nps'] | undefined;
  loading: boolean;
};

export const NpsCharts: FunctionComponent<NpsChartsProps> = (props) => {
  const { npsCommunicationProps, loading } = props;

  return (
    <CommunicationCharts
      bigNumbers={[
        {
          title: 'SMS enviados',
          value: npsCommunicationProps?.sms || 0,
          icon: <Send size={16} />,
        },
        {
          title: 'Emails enviados',
          value: npsCommunicationProps?.email || 0,
          icon: <Send size={16} />,
        },
        {
          title: 'Whatsapps enviados',
          value: npsCommunicationProps?.whatsapp || 0,
          icon: <Send size={16} />,
        },
      ]}
      loading={loading}
      data={npsCommunicationProps?.daily}
    />
  );
};
