import { FunctionComponent } from 'react';
import { Send } from 'lucide-react';
import { CommunicationDashboardProps } from 'src/store/modules/dashboard/reducer';
import { CommunicationCharts } from '../CommunicationCharts';

type GiftbackChartsProps = {
  giftbackCommunicationProps: CommunicationDashboardProps['giftback'] | undefined;
  loading: boolean;
};

export const GiftbackCharts: FunctionComponent<GiftbackChartsProps> = (props) => {
  const { giftbackCommunicationProps, loading } = props;

  return (
    <CommunicationCharts
      bigNumbers={[
        {
          title: 'SMS enviados',
          value: giftbackCommunicationProps?.sms || 0,
          icon: <Send size={16} />,
        },
        {
          title: 'Emails enviados',
          value: giftbackCommunicationProps?.email || 0,
          icon: <Send size={16} />,
        },
        {
          title: 'Whatsapps enviados',
          value: giftbackCommunicationProps?.whatsapp || 0,
          icon: <Send size={16} />,
        },
      ]}
      loading={loading}
      data={giftbackCommunicationProps?.daily}
    />
  );
};
