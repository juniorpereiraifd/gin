import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, type TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import type { AccountingReport, AccountingTransaction } from 'src/store/modules/dashboard/reducer';
import { Creators as DashboardCreators } from 'src/store/modules/dashboard/actions';
import type { RootType } from 'src/store/modules/rootReducer';
import { Button } from 'src/stories/general/Button';
import { moneyFormatter } from 'src/utils/helpers';
import { paymentWayInfo, type PaymentWay } from '../../../utils/constants';
import { Download } from 'lucide-react';

type LoadMoreProps = {
  page: number;
  perPage: number;
};

const columns: TableColumnsType<AccountingReport> = [
  { title: 'ID da transferência', dataIndex: 'code', key: 'code' },
  { title: 'Data do pagamento', dataIndex: 'date', key: 'date', render: (value) => dayjs(value).format('DD/MM/YYYY') },
  { title: 'Valor transferido', dataIndex: 'amount', key: 'amount', render: (value) => moneyFormatter(value / 100) },
];

export const AccountingReportTable = () => {
  const dispatch = useDispatch();
  const {
    dashboard: {
      accountingReportData,
      accountingReportDataPagination,
      loadingAccountingReportData,
      loadingExportAccountingReport,
    },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    dispatch(DashboardCreators.getDashboardAccountingRequest());
  }, []);

  const handleLoadMore = ({ page, perPage }: LoadMoreProps) => {
    dispatch(
      DashboardCreators.getDashboardAccountingRequest({
        page: page,
        perPage: perPage,
      })
    );
  };

  const handleExportReport = () => {
    dispatch(DashboardCreators.exportAccountReportRequest());
  };

  return (
    <Table<AccountingReport>
      bordered
      loading={loadingAccountingReportData}
      className="w-full drop-shadow-sm"
      scroll={{ x: 'max-content' }}
      title={() => (
        <div className="flex items-center justify-end">
          <Button
            variant="outlined"
            icon={<Download size={18} />}
            onClick={handleExportReport}
            loading={loadingExportAccountingReport}
          >
            Exportar relatório
          </Button>
        </div>
      )}
      pagination={{
        current: accountingReportDataPagination?.current_page,
        pageSize: accountingReportDataPagination?.per_page,
        total: accountingReportDataPagination?.total,
        showSizeChanger: true,
        pageSizeOptions: ['15', '30', '50'],
        showTotal: (total) => `Total de ${total} transferências`,
      }}
      onChange={(pagination) =>
        handleLoadMore({
          page: pagination.current ?? 1,
          perPage: pagination.pageSize ?? 15,
        })
      }
      columns={columns}
      expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
      dataSource={(accountingReportData ?? []).map((item) => ({ ...item, key: item.code }))}
    />
  );
};

const expandColumns: TableColumnsType<AccountingTransaction> = [
  { title: 'ID da transação', dataIndex: 'code', key: 'code' },
  { title: 'Data da venda', dataIndex: 'date', key: 'date', render: (value) => dayjs(value).format('DD/MM/YYYY') },
  {
    title: 'Valor do restaurante',
    dataIndex: 'received_amount',
    key: 'received_amount',
    render: (value) => moneyFormatter(value / 100),
  },
  { title: 'Cliente', dataIndex: ['reserve', 'name'], key: 'reserve-name' },
  { title: 'Valor pago', dataIndex: 'amount', key: 'amount', render: (value) => moneyFormatter(value / 100) },
  { title: 'Data da transação', dataIndex: 'date', key: 'date', render: (value) => dayjs(value).format('DD/MM/YYYY') },
  {
    title: 'Data da reserva',
    dataIndex: ['reserve', 'date'],
    key: 'reserve.date',
    render: (value) => dayjs(value).format('DD/MM/YYYY'),
  },
  { title: 'Hora da reserva', dataIndex: ['reserve', 'time'], key: 'reserve.time' },
  {
    title: 'Tipo de pagamento',
    dataIndex: ['payment_method', 'type'],
    key: 'payment_method.type',
    render: (value) => (
      <Tag color={paymentWayInfo[value as PaymentWay].color}>{paymentWayInfo[value as PaymentWay].text}</Tag>
    ),
  },
];

const expandedRowRender = (data: AccountingReport) => (
  <Table<AccountingTransaction> columns={expandColumns} dataSource={data.transaction} pagination={false} />
);
