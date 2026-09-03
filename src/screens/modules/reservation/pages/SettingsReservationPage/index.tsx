import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Creators as SettingCreators } from 'src/store/modules/setting/actions';
import { Tabs } from 'src/stories/display/Tabs';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { PaymentForm } from './PaymentForm';
import { GeneralInformationForm } from './GeneralInformationForm';
import { NotificationsForm } from './NotificationsForm';
import { IntegrationsForm } from './IntegrationsForm';
import { ScheduleForm } from './ScheduleForm';
import type { RootType } from 'src/store/modules/rootReducer';

export const SettingsReservationPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    auth: { user },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    dispatch(SettingCreators.getSettingRequest());
  }, []);

  const items = [
    {
      key: 'general',
      label: 'Informações gerais',
      children: <GeneralInformationForm />,
    },
    {
      key: 'schedule',
      label: 'Grade horária',
      children: <ScheduleForm />,
    },
    ...(user?.master
      ? [
          {
            key: 'notifications',
            label: 'Notificações',
            children: <NotificationsForm />,
          },
          {
            key: 'integrations',
            label: 'Integrações',
            children: <IntegrationsForm />,
          },
        ]
      : []),
    {
      key: 'payment',
      label: 'Pagamentos',
      children: <PaymentForm />,
    },
  ];

  const tabParam = searchParams.get('tab');
  const activeTab = items.some((item) => item.key === tabParam) ? (tabParam as string) : 'general';

  const handleChangeTab = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', key);

    setSearchParams(params, { replace: true });
  };

  return (
    <PageContainer>
      <PageTitle>Configurações de reserva</PageTitle>
      <Tabs
        activeKey={activeTab}
        onChange={handleChangeTab}
        destroyInactiveTabPane
        items={items}
        className="[&_.ant-tabs-nav]:mb-8"
      />
    </PageContainer>
  );
};
