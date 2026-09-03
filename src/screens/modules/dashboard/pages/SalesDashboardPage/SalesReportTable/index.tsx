import { FunctionComponent, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Tooltip } from 'antd';
import { Download } from '@styled-icons/boxicons-regular/Download';
import dayjs from 'dayjs';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as DashboardCreators } from 'src/store/modules/dashboard/actions';
import { SalesDetails } from 'src/store/modules/dashboard/reducer';
import { getCurrencyBrl } from 'src/utils/helpers';
import * as S from './styles';
import { paymentWayInfo } from '../../../utils/constants';

const { Column } = Table;

type PaymentWay = SalesDetails['payment_type'];

type SalesReportTableProps = {
  hasReservationModule: boolean;
};

export const SalesReportTable: FunctionComponent<SalesReportTableProps> = (props) => {
  const { hasReservationModule } = props;
  const dispatch = useDispatch();
  const {
    hall: { unity },
    dashboard: { salesFilter, salesDetails, salesCsv, loadingSalesDetails, loadingSalesCsv, salesDetailsPagination },
  } = useSelector((state: RootType) => state);
  const downloadSalesCsv = useRef<HTMLAnchorElement | null>(null);

  const dateRangeDiff = useMemo(() => {
    const startDate = dayjs(salesFilter.startDate);
    const endDate = dayjs(salesFilter.endDate);

    return endDate.diff(startDate, 'days');
  }, [salesFilter.startDate, salesFilter.endDate]);

  useEffect(() => {
    if (unity !== null && hasReservationModule === true) {
      dispatch(DashboardCreators.getDashboardSalesDetailsRequest({ page: 1 }));
    }
  }, [unity]);

  useEffect(() => {
    if ((salesCsv || null) === null) {
      return;
    }

    downloadSalesCsv.current?.click();
  }, [salesCsv]);

  const handleTablePageChange = (props: { page: number; perPage: number }) => {
    dispatch(
      DashboardCreators.getDashboardSalesDetailsRequest({
        page: props.page,
        perPage: props.perPage,
      })
    );
  };

  const handleDownloadSalesCsv = () => {
    dispatch(
      DashboardCreators.getDashboardSalesDetailsRequest({
        exportReport: true,
      })
    );
  };

  return (
    <S.TableSection>
      <S.Table
        bordered
        title={() => (
          <S.SectionHeader>
            <Tooltip
              placement="top"
              title={
                dateRangeDiff > 31
                  ? 'Só é possível exportar o relatório detalhado com um intervalo de no máximo 31 dias.'
                  : ''
              }
            >
              <S.ExportButton
                icon={<Download size={18} />}
                type="default"
                size="middle"
                disabled={dateRangeDiff > 31 || hasReservationModule === false}
                loading={loadingSalesCsv}
                onClick={handleDownloadSalesCsv}
              >
                Exportar relatório (CSV)
              </S.ExportButton>
              {salesCsv !== null && (
                <a
                  hidden
                  ref={downloadSalesCsv}
                  href={window.URL.createObjectURL(new Blob([salesCsv], { type: 'text/csv;charset=utf-8' }))}
                  target="_blank"
                  rel="noreferrer"
                  download={`relatorio-de-vendas-${dayjs(salesFilter.startDate).format('DD-MM-YYYY')}-${dayjs(
                    salesFilter.endDate
                  ).format('DD-MM-YYYY')}.csv`}
                />
              )}
            </Tooltip>
          </S.SectionHeader>
        )}
        dataSource={hasReservationModule === false ? mockedData : salesDetails ?? []}
        loading={loadingSalesDetails && hasReservationModule === true}
        onChange={(pagination) =>
          handleTablePageChange({
            page: pagination.current ?? 1,
            perPage: pagination.pageSize ?? 15,
          })
        }
        pagination={{
          current: salesDetailsPagination?.current_page,
          pageSize: salesDetailsPagination?.per_page,
          total: salesDetailsPagination?.total,
          showSizeChanger: false,
          showTotal: (total) => `Total de ${total} vendas`,
        }}
      >
        <Column title="Cliente" dataIndex="name" key="name" />
        <Column title="Valor pago" dataIndex="amount" key="amount" render={(value) => getCurrencyBrl(value / 100)} />
        <Column
          title="Data da transação"
          dataIndex="transaction_date"
          key="transaction_date"
          render={(value) => dayjs(value).format('DD/MM/YYYY')}
        />
        <Column
          title="Data da reserva"
          dataIndex="date"
          key="date"
          render={(value) => dayjs(value).format('DD/MM/YYYY')}
        />
        <Column
          title="Hora da reserva"
          dataIndex="time"
          key="time"
          render={(value) => dayjs(value, 'HH:mm:ss').format('HH:mm')}
        />
        <Column
          title="Pagamento"
          dataIndex="payment_type"
          key="payment_type"
          render={(value) => (
            <Tag color={paymentWayInfo[value as PaymentWay].color}>{paymentWayInfo[value as PaymentWay].text}</Tag>
          )}
        />
      </S.Table>
    </S.TableSection>
  );
};

const mockedData: SalesDetails[] = [
  {
    name: 'Bruno Ferreira',
    amount: 53000,
    transaction_date: '2021-09-01T00:00:00',
    date: '2021-09-01T00:00:00',
    time: '2021-09-01T00:00:00',
    payment_type: 'credit',
  },
  {
    name: 'Fernanda Silva',
    amount: 24000,
    transaction_date: '2021-09-01T00:00:00',
    date: '2021-09-01T00:00:00',
    time: '2021-09-01T00:00:00',
    payment_type: 'pix',
  },
  {
    name: 'Carlos de Souza',
    amount: 12000,
    transaction_date: '2021-09-01T00:00:00',
    date: '2021-09-01T00:00:00',
    time: '2021-09-01T00:00:00',
    payment_type: 'credit',
  },
  {
    name: 'Antônio Cardoso',
    amount: 32000,
    transaction_date: '2021-09-01T00:00:00',
    date: '2021-09-01T00:00:00',
    time: '2021-09-01T00:00:00',
    payment_type: 'pix',
  },
  {
    name: 'Guilherme de Oliveira',
    amount: 43000,
    transaction_date: '2021-09-01T00:00:00',
    date: '2021-09-01T00:00:00',
    time: '2021-09-01T00:00:00',
    payment_type: 'credit',
  },
];
