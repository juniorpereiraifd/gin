import { Plus } from 'lucide-react';
import { useEffect, type FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from 'src/components/PageContainer';
import { PaymentCreators } from 'src/store/modules/payment/actions';
import type { RootType } from 'src/store/modules/rootReducer';
import { Table } from 'src/stories/display/Table';
import { Button } from 'src/stories/general/Button';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { phoneMask } from 'src/utils/helpers';
import { SellerStatusTag, SellerTypeTag } from '../../utils/constants';

export const SellersPage: FunctionComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    payment: { sellers, loading, sellersPagination },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    dispatch(PaymentCreators.getSellersRequest({ page: 1 }));
  }, []);

  const handleLoadMore = ({ page }: { page: number }) => {
    dispatch(PaymentCreators.getSellersRequest({ page }));
  };

  const handleDeleteSeller = (sellerId: string) => {
    dispatch(PaymentCreators.deleteSellerRequest({ sellerId }));
  };

  return (
    <PageContainer className="pb-8">
      <PageTitle>Vendedores Zoop</PageTitle>
      <Table
        bordered
        className="shadow-sm"
        dataSource={sellers}
        loading={loading}
        title={() => (
          <div className="flex items-center justify-end">
            <Button icon={<Plus size={14} />} onClick={() => navigate('/financial/sellers/zoop/create')}>
              Novo vendedor
            </Button>
          </div>
        )}
        columns={[
          {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            render: (_, item) =>
              item.seller_type === 'business'
                ? item.metadata.business_name
                : `${item.metadata.first_name} ${item.metadata.last_name}`,
          },
          {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
            render: (_, item) => (item.seller_type === 'business' ? item.metadata.business_email : item.metadata.email),
          },
          {
            title: 'Telefone',
            dataIndex: 'phone',
            key: 'phone',
            render: (_, item) =>
              item.seller_type === 'business'
                ? phoneMask(item.metadata.business_phone || '')
                : phoneMask(item.metadata.phone_number || ''),
          },
          {
            title: 'Tipo',
            dataIndex: 'seller_type',
            key: 'seller_type',
            render: (_, item) => (item.seller_type === 'business' ? SellerTypeTag.business : SellerTypeTag.individual),
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, item) => SellerStatusTag[item.status] || null,
          },
        ]}
        actions={{
          edit: {
            onClick: (item) => navigate(`/financial/sellers/zoop/edit/${item.id}`),
          },
          delete: {
            onClick: (item) => handleDeleteSeller(item.id),
            isVisible: (item) => item.status !== 'approved',
          },
        }}
        onChange={(pagination) =>
          handleLoadMore({
            page: pagination.current ?? 1,
          })
        }
        pagination={{
          current: sellersPagination?.current_page,
          pageSize: sellersPagination?.per_page,
          total: sellersPagination?.total,
          showSizeChanger: false,
          showTotal: (total) => `Total de ${total} vendedores`,
        }}
      />
    </PageContainer>
  );
};
