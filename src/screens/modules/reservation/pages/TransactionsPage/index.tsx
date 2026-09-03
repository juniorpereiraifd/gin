import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { Col, DatePicker, Input, message, Row, Select, Tag } from 'antd';
import { Undo2 } from 'lucide-react';
import { PaymentCreators } from 'src/store/modules/payment/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { PageContainer } from 'src/components/PageContainer';
import { Table } from 'src/stories/display/Table';
import type { TransactionPaymentType, TransactionProps } from 'src/store/modules/payment/reducer';
import dayjs, { Dayjs } from 'dayjs';
import { RefundConfirmationModal } from './RefundConfirmationModal';

type FetchTransactionsFilteredProps = {
  page?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  transaction_id?: string;
  reservation_id?: string;
};

export const TransactionsPage = () => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedDateRange, setSelectedDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs().subtract(31, 'days'),
    dayjs().subtract(1, 'day'),
  ]);
  const [isRefundConfirmationModalOpen, setIsRefundConfirmationModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [transactionIdFilter, setTransactionIdFilter] = useState<string>('');
  const [reservationIdFilter, setReservationIdFilter] = useState<string>('');
  const {
    payment: { transactions, loadingTransactions, pagination, transactionsStatus, loadingTransactionsStatus },
    hall: { unity },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    dispatch(PaymentCreators.getTransactionsStatusRequest());

    if (unity !== null) {
      dispatch(
        PaymentCreators.getTransactionsRequest({
          page: 1,
          start_date: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
          end_date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        }),
      );
    }
  }, [unity]);

  const fetchTransactionsFiltered = (props: FetchTransactionsFilteredProps) => {
    const {
      page = 1,
      start_date = dayjs().subtract(31, 'days').format('YYYY-MM-DD'),
      end_date = dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      status,
      transaction_id,
      reservation_id,
    } = props;

    dispatch(
      PaymentCreators.getTransactionsRequest({
        page,
        start_date,
        end_date,
        status,
        transaction_id,
        reservation_id,
      }),
    );
  };

  const handleSetTransactionToRefund = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setIsRefundConfirmationModalOpen(true);
  };

  const handleRefundTransaction = () => {
    if (selectedTransactionId) {
      dispatch(PaymentCreators.refundTransactionRequest({ transactionId: selectedTransactionId }));

      setSelectedTransactionId(null);
      setIsRefundConfirmationModalOpen(false);
      return;
    }

    message.error('Nenhuma transação selecionada para estorno. Por favor, tente novamente mais tarde.');
  };

  const debouncedTransactionIdFilter = useMemo(
    () =>
      debounce((value: string) => {
        setTransactionIdFilter(value);
        fetchTransactionsFiltered({
          transaction_id: value,
          ...(selectedStatus ? { status: selectedStatus } : {}),
          ...(selectedDateRange
            ? {
                start_date: dayjs(selectedDateRange[0]).format('YYYY-MM-DD'),
                end_date: dayjs(selectedDateRange[1]).format('YYYY-MM-DD'),
              }
            : {}),
          ...(reservationIdFilter ? { reservation_id: reservationIdFilter } : {}),
        });
      }, 500),
    [selectedStatus, selectedDateRange, reservationIdFilter],
  );

  const debouncedReservationIdFilter = useMemo(
    () =>
      debounce((value: string) => {
        setReservationIdFilter(value);
        fetchTransactionsFiltered({
          reservation_id: value,
          ...(selectedStatus ? { status: selectedStatus } : {}),
          ...(selectedDateRange
            ? {
                start_date: dayjs(selectedDateRange[0]).format('YYYY-MM-DD'),
                end_date: dayjs(selectedDateRange[1]).format('YYYY-MM-DD'),
              }
            : {}),
          ...(transactionIdFilter ? { transaction_id: transactionIdFilter } : {}),
        });
      }, 500),
    [selectedStatus, selectedDateRange, transactionIdFilter],
  );

  const handleStatusChange = (status: string | undefined) => {
    setSelectedStatus(status);
    fetchTransactionsFiltered({
      status,
      ...(selectedDateRange
        ? {
            start_date: dayjs(selectedDateRange[0]).format('YYYY-MM-DD'),
            end_date: dayjs(selectedDateRange[1]).format('YYYY-MM-DD'),
          }
        : {}),
      ...(transactionIdFilter ? { transaction_id: transactionIdFilter } : {}),
      ...(reservationIdFilter ? { reservation_id: reservationIdFilter } : {}),
    });
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setSelectedDateRange(dates);

    fetchTransactionsFiltered({
      start_date: dates ? dayjs(dates[0]).format('YYYY-MM-DD') : undefined,
      end_date: dates ? dayjs(dates[1]).format('YYYY-MM-DD') : undefined,
      ...(selectedStatus ? { status: selectedStatus } : {}),
      ...(transactionIdFilter ? { transaction_id: transactionIdFilter } : {}),
      ...(reservationIdFilter ? { reservation_id: reservationIdFilter } : {}),
    });
  };

  const handleLoadMore = (page: number) => {
    if (pagination?.current_page !== undefined && page > pagination?.current_page && pagination?.is_last_page) {
      return;
    }

    fetchTransactionsFiltered({
      page,
      ...(selectedStatus ? { status: selectedStatus } : {}),
      ...(selectedDateRange
        ? {
            start_date: dayjs(selectedDateRange[0]).format('YYYY-MM-DD'),
            end_date: dayjs(selectedDateRange[1]).format('YYYY-MM-DD'),
          }
        : {}),
      ...(transactionIdFilter ? { transaction_id: transactionIdFilter } : {}),
      ...(reservationIdFilter ? { reservation_id: reservationIdFilter } : {}),
    });
  };

  return (
    <PageContainer>
      <PageTitle>Transações</PageTitle>
      <Table
        bordered
        className="shadow-sm row-start-2 col-start-1"
        dataSource={transactions}
        loading={loadingTransactions}
        title={() => (
          <div className="flex items-center justify-between gap-4">
            <Row gutter={16}>
              <Col span={6}>
                <DatePicker.RangePicker
                  className="w-full"
                  allowClear={false}
                  presets={[
                    { label: 'Última semana', value: [dayjs().add(-8, 'd'), dayjs().add(-1, 'd')] },
                    { label: 'Último mês', value: [dayjs().add(-1, 'month').add(-1, 'd'), dayjs().add(-1, 'd')] },
                    { label: 'Últimos 2 meses', value: [dayjs().add(-2, 'month').add(-1, 'd'), dayjs().add(-1, 'd')] },
                    { label: 'Últimos 3 meses', value: [dayjs().add(-3, 'month').add(-1, 'd'), dayjs().add(-1, 'd')] },
                  ]}
                  onChange={handleDateRangeChange}
                  value={selectedDateRange}
                />
              </Col>
              <Col span={6}>
                <Select
                  className="w-full"
                  placeholder="Filtrar por status"
                  allowClear
                  loading={loadingTransactionsStatus}
                  value={selectedStatus}
                  onChange={handleStatusChange}
                >
                  {transactionsStatus?.map((status) => (
                    <Select.Option key={status.key} value={status.key}>
                      {status.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <Input
                  allowClear
                  className="w-full"
                  placeholder="ID da transação"
                  onChange={(e) => debouncedTransactionIdFilter(e.target.value)}
                />
              </Col>
              <Col span={6}>
                <Input
                  allowClear
                  className="w-full"
                  placeholder="ID da reserva"
                  onChange={(e) => debouncedReservationIdFilter(e.target.value)}
                />
              </Col>
            </Row>
          </div>
        )}
        actions={{
          custom: [
            {
              key: 'reverse-payment',
              content: (
                <div className="flex items-center gap-2">
                  <Undo2 size={14} />
                  <span>Estornar</span>
                </div>
              ),
              onClick: (item: TransactionProps) => handleSetTransactionToRefund(item.id),
              getDisabledState: (item) => item.status !== 'completed',
            },
          ],
        }}
        pagination={{
          pageSize: pagination?.per_page,
          total: pagination?.total,
          current: pagination?.current_page,
          showTotal: (total) => `Total de ${total} ${total !== 1 ? 'transações' : 'transação'}`,
          onChange: handleLoadMore,
        }}
        columns={[
          {
            title: 'Data da transação',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (_: unknown, item: TransactionProps) => dayjs(item.created_at).format('DD/MM/YYYY HH:mm'),
          },
          {
            title: 'Nome do pagador',
            dataIndex: 'payer-name',
            key: 'payer-name',
            render: (_: unknown, item: TransactionProps) => item.payer.name,
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_: unknown, item: TransactionProps) => {
              const statusInfo = transactionsStatus.find((status) => status.key === item.status);
              return <span className="text-slate-600 text-sm">{statusInfo ? statusInfo.name : item.status}</span>;
            },
          },
          {
            title: 'Tipo de pagamento',
            dataIndex: 'type',
            key: 'type',
            render: (_: unknown, item: TransactionProps) =>
              (item.type || null) !== null ? (
                <Tag color={paymentWayInfo[item.type].color}>{paymentWayInfo[item.type].text}</Tag>
              ) : (
                'Indisponível'
              ),
          },
        ]}
      />
      <RefundConfirmationModal
        open={isRefundConfirmationModalOpen}
        onClose={() => {
          setIsRefundConfirmationModalOpen(false);
          setSelectedTransactionId(null);
        }}
        setOpen={setIsRefundConfirmationModalOpen}
        onRefund={handleRefundTransaction}
      />
    </PageContainer>
  );
};

export type PaymentWayInfoProps = Record<
  TransactionPaymentType,
  {
    color: string;
    text: string;
  }
>;

export const paymentWayInfo = {
  credit: {
    color: 'geekblue',
    text: 'Cartão de crédito',
  },
  pix: {
    color: 'green',
    text: 'PIX',
  },
};
