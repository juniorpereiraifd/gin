import { FunctionComponent, PropsWithChildren, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { DateRange } from 'react-day-picker';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as DashboardCreators } from 'src/store/modules/dashboard/actions';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { Tabs, TabsProps } from 'src/stories/display/Tabs';
import { DatePicker } from 'src/ui/DatePicker';
import { SummaryCharts } from './SummaryCharts';
import { ReservationCharts } from './ReservationCharts';
import { LineCharts } from './LineCharts';
import { MarketingCharts } from './MarketingCharts';
import { NpsCharts } from './NpsCharts';
import { GiftbackCharts } from './GiftbackCharts';
import { moduleInactiveCopy, ModuleKeyWithoutMenu } from '../../utils/moduleInactiveCopy';
import { ModuleInactiveAlert } from '../../components/Alert/ModuleInactiveAlert';
import { MaintenanceAlert } from '../../components/Alert/MaintenanceAlert';

export const CommunicationReports: FunctionComponent = () => {
  const { unitId } = useParams<'dashboard.communication'>();
  const dispatch = useDispatch();
  const {
    unity: { unitModules },
    dashboard: { communication, loadingCommunication },
    hall: { unity },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    dispatch(
      DashboardCreators.getDashboardComunicationDataRequest({
        unity_id: unitId,
        startAt: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
        endAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        dateFilter: {
          startAt: dayjs().subtract(31, 'day').toDate(),
          endAt: dayjs().subtract(1, 'day').toDate(),
        },
      })
    );
  }, []);

  const items: TabsProps['items'] = useMemo(() => {
    return [
      {
        key: 'general',
        label: 'Visão geral',
        children: (
          <TabContainer unitId={unitId}>
            <SummaryCharts
              communicationReports={communication}
              loading={loadingCommunication}
              unitModules={unitModules}
            />
          </TabContainer>
        ),
      },
      {
        key: 'reservation',
        label: 'Reserva',
        children: (
          <TabContainer unitId={unitId} disabled={unitModules?.reservation === false} moduleCommunication="reservation">
            <ReservationCharts
              reservationCommunicationProps={communication?.reservation}
              loading={loadingCommunication}
            />
          </TabContainer>
        ),
      },
      {
        key: 'line',
        label: 'Fila',
        children: (
          <TabContainer unitId={unitId} disabled={unitModules?.line === false} moduleCommunication="line">
            <LineCharts lineCommunicationProps={communication?.line} loading={loadingCommunication} />
          </TabContainer>
        ),
      },
      {
        key: 'crm',
        label: 'Marketing',
        children: (
          <TabContainer unitId={unitId} disabled={unitModules?.marketing === false} moduleCommunication="marketing">
            <MarketingCharts marketingCommunicationProps={communication?.marketing} loading={loadingCommunication} />
          </TabContainer>
        ),
      },
      {
        key: 'nps',
        label: 'Avaliação',
        children: (
          <TabContainer unitId={unitId} disabled={unitModules?.nps === false} moduleCommunication="nps">
            <NpsCharts npsCommunicationProps={communication?.nps} loading={loadingCommunication} />
          </TabContainer>
        ),
      },
      {
        key: 'voucher',
        label: 'Giftback',
        children: (
          <TabContainer unitId={unitId} disabled={unitModules?.voucher === false} moduleCommunication="voucher">
            <GiftbackCharts giftbackCommunicationProps={communication?.giftback} loading={loadingCommunication} />
          </TabContainer>
        ),
      },
    ];
  }, [communication, unitModules]);

  return (
    <PageContainer>
      <PageTitle>Comunicação</PageTitle>
      <div className="w-full h-full relative">
        <div
          data-blurred={unity?.settings?.communication_reports_status === 'maintenance'}
          className="flex flex-col gap-8 w-full h-full data-[blurred=true]:relative data-[blurred=true]:blur-sm data-[blurred=true]:translate-z-[1px] data-[blurred=true]:pointer-events-[none]"
        >
          <Tabs defaultActiveKey="general" destroyInactiveTabPane items={items} className="[&_.ant-tabs-nav]:mb-8" />
        </div>
        {unity?.settings?.communication_reports_status === 'maintenance' && <MaintenanceAlert />}
      </div>
    </PageContainer>
  );
};

type TabContainerProps = PropsWithChildren<{
  unitId: string;
  disabled?: boolean;
  moduleCommunication?: ModuleKeyWithoutMenu;
}>;

const TabContainer: FunctionComponent<TabContainerProps> = (props) => {
  const { children, unitId, disabled = false, moduleCommunication } = props;
  const dispatch = useDispatch();
  const {
    dashboard: { dateFilterCommunication },
  } = useSelector((state: RootType) => state);

  const handleChangeDate = (range: DateRange) => {
    if (range.from && range.to) {
      dispatch(
        DashboardCreators.getDashboardComunicationDataRequest({
          unity_id: unitId,
          startAt: parseDate(range.from),
          endAt: parseDate(range.to),
          dateFilter: {
            startAt: range.from,
            endAt: range.to,
          },
        })
      );
    }
  };

  return (
    <div className="w-full h-full relative">
      <div
        data-blurred={disabled === true}
        className="flex flex-col gap-8 w-full h-full data-[blurred=true]:relative data-[blurred=true]:blur-sm data-[blurred=true]:translate-z-[1px] data-[blurred=true]:pointer-events-[none]"
      >
        <DatePicker
          onRangeChange={handleChangeDate}
          defaultDate={
            dateFilterCommunication && {
              from: dateFilterCommunication.startAt,
              to: dateFilterCommunication.endAt,
            }
          }
        />
        {children}
      </div>
      {disabled === true && moduleCommunication !== undefined && (
        <ModuleInactiveAlert
          title={moduleInactiveCopy.communication[moduleCommunication].title}
          description={moduleInactiveCopy.communication[moduleCommunication].description}
        />
      )}
    </div>
  );
};

export const parseDate = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD');
};
