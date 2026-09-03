import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Creators as BlockadeCreators } from 'src/store/modules/blockade/actions';
import { RootType } from 'src/store/modules/rootReducer';
import BlockadeForm from './BlockadeForm';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { Plus } from 'lucide-react';
import { BlockadeItemProps } from 'src/store/modules/blockade/reducer';
import { Button } from 'src/stories/general/Button';
import { Table } from 'src/stories/display/Table';

const { RangePicker } = DatePicker;

export const BlockadesPage = () => {
  const dispatch = useDispatch();
  const { unitId } = useParams<'reservation.blocks'>();
  const [startAt, setStartAt] = useState<string | null>(null);
  const [endAt, setEndAt] = useState<string | null>(null);

  const { data, loading, pagination } = useSelector((state: RootType) => state.blockade);

  const handleLoadMore = (props: { page: number; perPage: number }) => {
    dispatch(
      BlockadeCreators.getBlockadesRequest({
        unity_id: unitId,
        page: props.page,
        start_at: startAt!,
        end_at: endAt!,
      }),
    );
  };

  useEffect(() => {
    dispatch(
      BlockadeCreators.getBlockadesRequest({
        unity_id: unitId,
        page: 1,
        with_filter: true,
      }),
    );
  }, [dispatch, unitId]);

  const handleChangeRangePicker = (dates: string) => {
    if (dates && dates?.length >= 2) {
      setStartAt(dayjs(dates[0]).format('DD/MM/YYYY'));
      setEndAt(dayjs(dates[1]).format('DD/MM/YYYY'));

      dispatch(
        BlockadeCreators.getBlockadesRequest({
          unity_id: unitId,
          page: 1,
          start_at: dayjs(dates[0]).format('DD/MM/YYYY'),
          end_at: dayjs(dates[1]).format('DD/MM/YYYY'),
          with_filter: true,
        }),
      );
    }

    if (!dates) {
      setStartAt(null);
      setEndAt(null);
      dispatch(
        BlockadeCreators.getBlockadesRequest({
          unity_id: unitId,
          page: 1,
          with_filter: true,
        }),
      );
    }
  };

  const handleDeleteItem = (item: BlockadeItemProps) => {
    dispatch(BlockadeCreators.deleteBlockadeRequest(item.id));
  };

  const handleEditItem = (item: BlockadeItemProps) => {
    dispatch(BlockadeCreators.setEditableItem(item));
  };

  const handleAddItem = () => {
    dispatch(BlockadeCreators.showModal());
  };

  return (
    <PageContainer>
      <BlockadeForm />
      <PageTitle>Bloqueios</PageTitle>
      <Table<BlockadeItemProps>
        className="shadow-sm"
        bordered
        title={() => (
          <div className="flex items-center justify-between gap-8">
            <RangePicker format="DD/MM/YYYY" onChange={(dates: any) => handleChangeRangePicker(dates)} />
            <Button onClick={handleAddItem} icon={<Plus size={14} />}>
              Novo bloqueio
            </Button>
          </div>
        )}
        columns={[
          {
            title: 'Data do bloqueio',
            dataIndex: 'date',
            key: 'date',
            render: (value: string | Date) => dayjs(value).format('DD/MM/YYYY'),
          },
          { title: 'Título', dataIndex: 'title', key: 'title' },
          { title: 'Horário de início', dataIndex: 'starts_at', key: 'starts_at' },
          { title: 'Horário de término', dataIndex: 'ends_at', key: 'ends_at' },
        ]}
        dataSource={data}
        loading={loading}
        onChange={(pagination) =>
          handleLoadMore({
            page: pagination.current ?? 1,
            perPage: pagination.pageSize ?? 15,
          })
        }
        actions={{
          edit: {
            onClick: handleEditItem,
          },
          delete: {
            onClick: handleDeleteItem,
          },
        }}
        pagination={{
          current: pagination?.current_page,
          pageSize: pagination?.per_page,
          total: pagination?.total,
          showSizeChanger: false,
          showTotal: (total) => `Total de ${total} bloqueios`,
        }}
      />
    </PageContainer>
  );
};
