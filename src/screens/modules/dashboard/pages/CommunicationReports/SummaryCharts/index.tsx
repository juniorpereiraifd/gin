import { FunctionComponent, useMemo } from 'react';
import { CommunicationCharts } from '../CommunicationCharts';
import { Send } from 'lucide-react';
import { CommunicationDashboardProps } from 'src/store/modules/dashboard/reducer';
import { Module } from 'src/store/modules/unity/reducer';
import { isReportDataValid } from '../../../utils/isReportDataValid';

type DailyTotal = {
  date: string;
  email_total: number;
  sms_total: number;
  whatsapp_total: number;
};

type SummaryChartsProps = {
  communicationReports: CommunicationDashboardProps | null;
  loading: boolean;
  unitModules: Module;
};

export const SummaryCharts: FunctionComponent<SummaryChartsProps> = (props) => {
  const { communicationReports, unitModules, loading } = props;
  const comunicationData = useMemo(() => {
    const totalsMap: Record<string, DailyTotal> = {};
    const totalShipments = {
      email: 0,
      sms: 0,
      whatsapp: 0,
    };

    if (isReportDataValid(communicationReports) === true) {
      const filteredModuleDisabledReports = Object.entries(communicationReports).filter(([key, value]) => {
        return unitModules[key as keyof Module] === true && value;
      });

      Object.values(filteredModuleDisabledReports).forEach(([_, category]) => {
        if (!category) return;

        category.daily.forEach(({ date, email_total, sms_total, whatsapp_total }) => {
          if (!totalsMap[date]) {
            totalsMap[date] = { date, email_total: 0, sms_total: 0, whatsapp_total: 0 };
          }

          totalsMap[date].email_total += email_total;
          totalsMap[date].sms_total += sms_total;
          totalsMap[date].whatsapp_total += whatsapp_total;
        });
      });

      Object.values(filteredModuleDisabledReports).forEach(([_, category]) => {
        totalShipments.email += category.email;
        totalShipments.sms += category.sms;
        totalShipments.whatsapp += category.whatsapp;
      });
    }

    return { totalsMap: Object.values(totalsMap), totalShipments };
  }, [communicationReports, unitModules]);

  return (
    <CommunicationCharts
      bigNumbers={[
        {
          title: 'SMS enviados',
          value: comunicationData.totalShipments?.sms || 0,
          icon: <Send size={16} />,
        },
        {
          title: 'Emails enviados',
          value: comunicationData.totalShipments?.email || 0,
          icon: <Send size={16} />,
        },
        {
          title: 'Whatsapps enviados',
          value: comunicationData.totalShipments?.whatsapp || 0,
          icon: <Send size={16} />,
        },
      ]}
      loading={loading}
      data={communicationReports === null ? undefined : comunicationData.totalsMap}
    />
  );
};
