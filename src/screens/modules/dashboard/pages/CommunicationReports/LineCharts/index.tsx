import { FunctionComponent } from 'react';
import { Send } from 'lucide-react';
import { CommunicationDashboardProps } from 'src/store/modules/dashboard/reducer';
import { CommunicationCharts } from '../CommunicationCharts';

type LineChartsProps = {
  lineCommunicationProps: CommunicationDashboardProps['line'] | undefined;
  loading: boolean;
};

export const LineCharts: FunctionComponent<LineChartsProps> = (props) => {
  const { lineCommunicationProps, loading } = props;

  return (
    <CommunicationCharts
      bigNumbers={[
        {
          title: 'SMS enviados',
          value: lineCommunicationProps?.sms || 0,
          icon: <Send size={16} />,
        },
        {
          title: 'Emails enviados',
          value: lineCommunicationProps?.email || 0,
          icon: <Send size={16} />,
        },
        {
          title: 'Whatsapps enviados',
          value: lineCommunicationProps?.whatsapp || 0,
          icon: <Send size={16} />,
        },
      ]}
      loading={loading}
      data={lineCommunicationProps?.daily}
    />
  );
};
