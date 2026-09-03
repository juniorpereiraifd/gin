import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Tag } from 'antd';
import { File, List, Plus, ScanText } from 'lucide-react';
import { Creators as CustomFieldCreators } from 'src/store/modules/customField/actions';
import { CustomFieldItemProps } from 'src/store/modules/customField/reducer';
import { RootType } from 'src/store/modules/rootReducer';
import { Button } from 'src/stories/general/Button';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { Table } from 'src/stories/display/Table';
import { CustomFieldMutationDrawer } from './CustomFieldMutationDrawer';

export const CustomReservationPage = () => {
  const dispatch = useDispatch();
  const { unitId } = useParams<'reservation.custom'>();

  const {
    customField: { data, loading, pagination },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (unitId) {
      dispatch(CustomFieldCreators.getCustomFieldsRequest({ unitId: unitId, page: 1 }));
    }
  }, [unitId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditItem = (item: CustomFieldItemProps) => {
    dispatch(CustomFieldCreators.setEditableItem(item));
    dispatch(CustomFieldCreators.showModal());
  };

  const handleAddItem = () => dispatch(CustomFieldCreators.showModal());

  const handleLoadMore = (props: { page: number; perPage: number }) => {
    if (pagination?.is_last_page) {
      return;
    }

    dispatch(
      CustomFieldCreators.getCustomFieldsRequest({
        unitId: unitId,
        page: props.page,
      })
    );
  };

  const handleDeleteItem = (id: string) =>
    dispatch(
      CustomFieldCreators.deleteCustomFieldRequest({
        customFieldId: id,
        unitId: unitId,
      })
    );

  return (
    <PageContainer>
      <PageTitle>Personalizar formulário de reserva</PageTitle>
      <Table
        bordered
        className="shadow-sm row-start-2 col-start-1 [&_.ant-pagination]:px-4"
        dataSource={data}
        loading={loading}
        columns={[
          {
            title: 'Título',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: 'Tipo de campo',
            dataIndex: 'type',
            key: 'type',
            render: (_: any, data: CustomFieldItemProps) => (
              <Tag className="flex items-center gap-2 w-fit">
                {typeField[data.type].icon}
                <span>{typeField[data.type].name}</span>
              </Tag>
            ),
          },
          {
            title: 'Preenchimento',
            dataIndex: 'required',
            key: 'required',
            render: (required: boolean) =>
              required ? <Tag color="volcano">Obrigatório</Tag> : <Tag color="blue">Opcional</Tag>,
          },
        ]}
        actions={{
          edit: {
            onClick: handleEditItem,
          },
          delete: {
            onClick: (item) => handleDeleteItem(item.id || ''),
          },
        }}
        title={() => (
          <div className="w-full flex items-center justify-end">
            <div>
              <Button onClick={handleAddItem}>
                <Plus size={14} />
                Adicionar campo personalizado
              </Button>
            </div>
          </div>
        )}
        pagination={{
          pageSize: pagination?.per_page,
          total: pagination?.total,
          current: pagination?.current_page,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50'],
          showTotal: (total) => `Total de ${total} campos customizados`,
        }}
        onChange={(pagination) =>
          handleLoadMore({
            page: pagination.current ?? 1,
            perPage: pagination.pageSize ?? 15,
          })
        }
      />
      <CustomFieldMutationDrawer unit_id={unitId} />
    </PageContainer>
  );
};

const typeField = {
  text: {
    name: 'Texto',
    icon: <ScanText size={14} />,
  },
  select: {
    name: 'Opções',
    icon: <List size={14} />,
  },
  upload: {
    name: 'Arquivo',
    icon: <File size={14} />,
  },
};
