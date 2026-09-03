import { FunctionComponent } from 'react';
import { Send } from 'lucide-react';
import { CommunicationDashboardProps } from 'src/store/modules/dashboard/reducer';
import { CommunicationCharts } from '../CommunicationCharts';

type ReservationChartsProps = {
  reservationCommunicationProps: CommunicationDashboardProps['reservation'] | undefined;
  loading: boolean;
};

export const ReservationCharts: FunctionComponent<ReservationChartsProps> = (props) => {
  const { reservationCommunicationProps, loading } = props;

  return (
    <CommunicationCharts
      bigNumbers={[
        {
          title: 'SMS enviados',
          value: reservationCommunicationProps?.sms || 0,
          icon: <Send size={16} />,
        },
        {
          title: 'Emails enviados',
          value: reservationCommunicationProps?.email || 0,
          icon: <Send size={16} />,
        },
        {
          title: 'Whatsapps enviados',
          value: reservationCommunicationProps?.whatsapp || 0,
          icon: <Send size={16} />,
        },
      ]}
      loading={loading}
      data={reservationCommunicationProps?.daily}
    />
  );
};
