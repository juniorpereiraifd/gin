import { FunctionComponent, PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Download, ExternalLink } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as DashboardCreators } from 'src/store/modules/dashboard/actions';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { Tabs, TabsProps } from 'src/stories/display/Tabs';
import { DatePicker } from 'src/ui/DatePicker';
import { Button } from 'src/stories/general/Button';
import { SummaryCharts } from './SummaryCharts';
import { ReservationCharts } from './ReservationCharts';
import { LineCharts } from './LineCharts';
import { WalkinCharts } from './WalkinCharts';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';
import { COMING_FROM_SCREEN, URL_POWER_BI } from 'src/utils/constants';
import { Event, getDeviceType } from 'src/utils/helpers';
import { ModuleInactiveAlert } from '../../components/Alert/ModuleInactiveAlert';
import { moduleInactiveCopy, ModuleKeyCustomerFlow } from '../../utils/moduleInactiveCopy';
import { MaintenanceAlert } from '../../components/Alert/MaintenanceAlert';

export const CustomerFlowReports: FunctionComponent = () => {
  const { unitId } = useParams<'dashboard.flow'>();
  const dispatch = useDispatch();
  const {
    unity: { unitModules },
    dashboard: { line, reservation, walkin },
    marketing: { csv, isLoading },
    hall: { unity },
  } = useSelector((state: RootType) => state);
  const downloadCsvRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    dispatch(
      DashboardCreators.getDashboardDataRequest({
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

  const handleDownloadCsv = () => {
    Event.push('admin_crm_customer_csv_click', {
      unit_id: unitId,
      device_type: getDeviceType(),
      comingFromScreen: COMING_FROM_SCREEN.allCustomers,
    });

    dispatch(MarketingCreators.getCsvCustomersRequest({ segmentation: 'all' }));
  };

  useEffect(() => {
    if (!csv?.all) {
      return;
    }

    downloadCsvRef.current?.click();

    dispatch(MarketingCreators.resetCsvCustomers());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csv?.all]);

  const items: TabsProps['items'] = useMemo(() => {
    return [
      {
        key: 'general',
        label: 'Visão geral',
        children: (
          <TabContainer unitId={unitId}>
            <SummaryCharts
              reservationDashboardProps={reservation}
              lineDashboardProps={line}
              walkinDashboardProps={walkin}
              unitModules={unitModules}
            />
          </TabContainer>
        ),
      },
      {
        key: 'reservation',
        label: 'Reserva',
        children: (
          <TabContainer unitId={unitId} disabled={unitModules.reservation === false} moduleCustomerFlow="reservation">
            <ReservationCharts reservationDashboardProps={reservation} />
          </TabContainer>
        ),
      },
      {
        key: 'line',
        label: 'Fila',
        children: (
          <TabContainer unitId={unitId} disabled={unitModules.line === false} moduleCustomerFlow="line">
            <LineCharts lineDashboardProps={line} />
          </TabContainer>
        ),
      },
      {
        key: 'walkin',
        label: 'Passante',
        children: (
          <TabContainer unitId={unitId}>
            <WalkinCharts walkinDashboardProps={walkin} />
          </TabContainer>
        ),
      },
    ];
  }, [line, reservation, unitModules]);

  return (
    <PageContainer>
      <PageTitle>Fluxo de Clientes</PageTitle>
      <div className="w-full h-full relative">
        <div
          data-blurred={unity?.settings?.flow_reports_status === 'maintenance'}
          className="flex flex-col gap-8 w-full h-full data-[blurred=true]:relative data-[blurred=true]:blur-sm data-[blurred=true]:translate-z-[1px] data-[blurred=true]:pointer-events-[none]"
        >
          <Tabs
            defaultActiveKey="general"
            destroyInactiveTabPane
            items={items}
            className="[&_.ant-tabs-nav]:mb-8 [&_.ant-tabs-tab-btn]:flex [&_.ant-tabs-tab-btn]:items-center"
            tabBarExtraContent={
              <div className="flex items-center gap-4">
                <Button
                  icon={<Download size={16} />}
                  variant="outlined"
                  onClick={handleDownloadCsv}
                  loading={isLoading}
                >
                  Exportar base de clientes
                </Button>
                {csv.all && (
                  <a
                    ref={downloadCsvRef}
                    href={window.URL.createObjectURL(csv.all)}
                    target="_blank"
                    rel="noreferrer"
                    download={`lista-de-clientes-${dayjs().format('DD.MM.YYYY')}.csv`}
                    hidden
                  />
                )}
                <Button
                  icon={<ExternalLink size={16} />}
                  onClick={() => {
                    window.open(URL_POWER_BI, '_blank');
                  }}
                >
                  Relatórios avançados
                </Button>
              </div>
            }
          />
        </div>
        {unity?.settings?.flow_reports_status === 'maintenance' && <MaintenanceAlert />}
      </div>
    </PageContainer>
  );
};

type TabContainerProps = PropsWithChildren<{
  unitId: string;
  disabled?: boolean;
  moduleCustomerFlow?: ModuleKeyCustomerFlow;
}>;

const TabContainer: FunctionComponent<TabContainerProps> = (props) => {
  const { children, unitId, disabled = false, moduleCustomerFlow } = props;
  const dispatch = useDispatch();
  const {
    dashboard: { dateFilterCustomerFlow },
  } = useSelector((state: RootType) => state);

  const handleChangeDate = (range: DateRange) => {
    if (range.from && range.to) {
      dispatch(
        DashboardCreators.getDashboardDataRequest({
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
            dateFilterCustomerFlow && {
              from: dateFilterCustomerFlow.startAt,
              to: dateFilterCustomerFlow.endAt,
            }
          }
        />
        {children}
      </div>
      {disabled === true && moduleCustomerFlow !== undefined && (
        <ModuleInactiveAlert
          title={moduleInactiveCopy.flow[moduleCustomerFlow].title}
          description={moduleInactiveCopy.flow[moduleCustomerFlow].description}
        />
      )}
    </div>
  );
};

export const parseDate = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD');
};
