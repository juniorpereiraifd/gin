import { FunctionComponent } from 'react';
import { Send } from 'lucide-react';
import { CommunicationDashboardProps } from 'src/store/modules/dashboard/reducer';
import { CommunicationCharts } from '../CommunicationCharts';

type MarketingChartsProps = {
  marketingCommunicationProps: CommunicationDashboardProps['marketing'] | undefined;
  loading: boolean;
};

export const MarketingCharts: FunctionComponent<MarketingChartsProps> = (props) => {
  const { marketingCommunicationProps, loading } = props;

  return (
    <CommunicationCharts
      bigNumbers={[
        {
          title: 'SMS enviados',
          value: marketingCommunicationProps?.sms || 0,
          icon: <Send size={16} />,
        },
        {
          title: 'Emails enviados',
          value: marketingCommunicationProps?.email || 0,
          icon: <Send size={16} />,
        },
        {
          title: 'Whatsapps enviados',
          value: marketingCommunicationProps?.whatsapp || 0,
          icon: <Send size={16} />,
        },
      ]}
      loading={loading}
      data={marketingCommunicationProps?.daily}
    />
  );
};
