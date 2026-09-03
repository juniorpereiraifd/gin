import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as VoucherCreators } from 'src/store/modules/voucher/actions';
import { Input } from 'src/ui/Input';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { Table } from 'src/stories/display/Table';
import { StatistcsBox } from './StatistcsBox';
import dayjs from 'dayjs';
import type { VoucherItemProps, VoucherStatus } from 'src/store/modules/voucher/reducer';
import { Check, Loader2 } from 'lucide-react';

export const VoucherPage = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const {
    voucher: { loading, data: vouchers, pagination, statistics, saving },
    hall: { unity },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (unity) {
      dispatch(
        VoucherCreators.getVouchersRequest({
          isSearch: false,
        })
      );

      dispatch(VoucherCreators.getVouchersStatisticsRequest());
    }
  }, [dispatch, unity]);

  const searchVoucher = useMemo(
    () =>
      debounce((voucherName: string) => {
        setSearch(voucherName);

        dispatch(
          VoucherCreators.getVouchersRequest({
            page: 1,
            search: voucherName,
            isSearch: true,
          })
        );
      }, 500),
    [dispatch]
  );

  const handleUpdateVoucherStatus = (voucherId: VoucherItemProps['id'], status: VoucherItemProps['status']) => {
    dispatch(VoucherCreators.updateVoucherStatusRequest({ id: voucherId, status }));
  };

  const getActionDetails = (status: VoucherItemProps['status']) => ({
    key: status,
    content: (item: VoucherItemProps) => getActionLabel(status, item.status),
    getDisabledState: (item: VoucherItemProps) => item.status === status,
    onClick: (item: VoucherItemProps) => handleUpdateVoucherStatus(item.id, status),
  });

  return (
    <PageContainer sideColumn>
      <PageTitle>Giftbacks</PageTitle>
      <Table<VoucherItemProps>
        bordered
        className="shadow-sm row-start-2 col-start-1"
        dataSource={vouchers}
        loading={loading}
        actions={{
          getDisabledState: (item: VoucherItemProps) => item.status === 'expired',
          tooltip: (item: VoucherItemProps) =>
            item.status === 'expired' ? 'Não é possível alterar o status de um giftback expirado.' : '',
          custom: (['available', 'used', 'expired', 'canceled'] as VoucherItemProps['status'][]).map((status) =>
            getActionDetails(status)
          ),
        }}
        title={() => (
          <div className="w-full flex items-center justify-between">
            <div className="w-64">
              <Input placeholder="Buscar giftback" onChange={(event) => searchVoucher(event.target.value)} />
            </div>
            {saving && (
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="animate-spin" size={14} />
                Salvando...
              </span>
            )}
          </div>
        )}
        pagination={{
          pageSize: pagination?.per_page,
          total: pagination?.total,
          current: pagination?.current_page,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50'],
          showTotal: (total) => `Total de ${total} giftbacks`,
          onChange: (page, pageSize) => {
            dispatch(
              VoucherCreators.getVouchersRequest({
                page,
                perPage: pageSize,
                search,
                isSearch: false,
              })
            );
          },
        }}
        columns={[
          { title: 'Código', dataIndex: 'code', key: 'code' },
          {
            title: 'Data de expiração',
            dataIndex: 'due_date',
            key: 'due_date',
            render: (value: string | Date) => dayjs(value).format('DD/MM/YYYY'),
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (value: VoucherStatus) => `${GiftackStatusLabel[value]}`,
          },
        ]}
      />

      <div className="col-start-2 row-start-2 h-fit">
        <StatistcsBox statistics={statistics} loading={loading} />
      </div>
    </PageContainer>
  );
};

const GiftackStatusLabel: Record<VoucherStatus, string> = {
  used: 'Utilizado',
  available: 'Disponível',
  canceled: 'Cancelado',
  expired: 'Expirado',
  // It's the same as 'available' because it's a giftback that is available to be used,
  // this is not a important information for the manager.
  'out-of-period': 'Disponível',
  pending: 'Pendente',
};

const getActionLabel = (type: VoucherItemProps['status'], status: VoucherItemProps['status']) => {
  switch (type) {
    case 'available':
      return <>{status === 'available' && <Check />} Definir como disponível</>;
    case 'used':
      return <>{status === 'used' && <Check />} Definir como usado</>;
    case 'expired':
      return <>{status === 'expired' && <Check />} Definir como expirado</>;
    case 'canceled':
      return <>{status === 'canceled' && <Check />} Definir como cancelado</>;
    default:
      return '';
  }
};
