import { type ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { DatePicker, Tag } from 'antd';
import { Plus } from 'lucide-react';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as SpecialDatesCreators } from 'src/store/modules/specialDate/actions';
import { SpecialDataItemPropsReceive } from 'src/store/modules/specialDate/reducer';
import { SpecialDatesMutationDrawer } from './SpecialDatesMutationDrawer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { PageContainer } from 'src/components/PageContainer';
import { Table } from 'src/stories/display/Table';
import { Button } from 'src/stories/general/Button';

const { RangePicker } = DatePicker;

type SpecialDateTypeBadge = 'normal' | 'paid_grade' | 'noshow';

const SpecialDateTypeTag: Record<SpecialDateTypeBadge, ReactNode> = {
  normal: <Tag color="default">Comum</Tag>,
  paid_grade: <Tag color="green">Grade paga</Tag>,
  noshow: <Tag color="blue">No-Show</Tag>,
};

export type ParamProps = {
  unity: string;
  hall: string;
};

export const SpecialDatesPage = () => {
  const dispatch = useDispatch();
  const { unitId } = useParams<'reservation.specialDates'>();
  const { data, pagination, loading } = useSelector((state: RootType) => state.specialDate);

  const [startAt, setStartAt] = useState<string | null>(null);
  const [endAt, setEndAt] = useState<string | null>(null);

  useEffect(() => {
    dispatch(
      SpecialDatesCreators.getSpecialDatesRequest({
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
        SpecialDatesCreators.getSpecialDatesRequest({
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
        SpecialDatesCreators.getSpecialDatesRequest({
          unity_id: unitId,
          page: 1,
          with_filter: true,
        }),
      );
    }
  };

  const handleLoadMore = (page: number) => {
    dispatch(
      SpecialDatesCreators.getSpecialDatesRequest({
        unity_id: unitId,
        page,
        start_at: startAt!,
        end_at: endAt!,
      }),
    );
  };

  const handleEditItem = (item: SpecialDataItemPropsReceive) => {
    dispatch(SpecialDatesCreators.showModal());
    dispatch(SpecialDatesCreators.getSpecialDateRequest({ schedule_id: item.id }));
  };

  const handleDeleteItem = (item: SpecialDataItemPropsReceive) => {
    dispatch(SpecialDatesCreators.deleteSpecialDateRequest(item.id));
  };

  const handleAddItem = () => dispatch(SpecialDatesCreators.showModal());

  return (
    <PageContainer>
      <SpecialDatesMutationDrawer />
      <PageTitle>Datas especiais</PageTitle>
      <Table
        className="shadow-sm"
        bordered
        dataSource={data}
        loading={loading}
        actions={{
          edit: { onClick: handleEditItem },
          delete: { onClick: handleDeleteItem },
        }}
        title={() => (
          <div className="flex items-center justify-between">
            <RangePicker format="DD/MM/YYYY" onChange={(dates: any) => handleChangeRangePicker(dates)} />
            <Button icon={<Plus size={14} />} onClick={handleAddItem}>
              Nova data
            </Button>
          </div>
        )}
        pagination={{
          current: pagination?.current_page,
          pageSize: pagination?.per_page,
          total: pagination?.total,
          showSizeChanger: false,
          showTotal: (total) => `Total de ${total} datas especiais`,
          onChange: handleLoadMore,
        }}
        columns={[
          {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
          },
          {
            title: 'Título',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Horário de início',
            dataIndex: 'started_at',
            key: 'started_at',
          },
          {
            title: 'Horário de término',
            dataIndex: 'ended_at',
            key: 'ended_at',
          },
          {
            title: 'Salão',
            dataIndex: 'sector_name',
            key: 'sector_name',
          },
          {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            render: (_: unknown, item: SpecialDataItemPropsReceive) => {
              if (item.schedule_product?.type === 'paid_grade') return SpecialDateTypeTag.paid_grade;
              if (item.schedule_product?.type === 'noshow') return SpecialDateTypeTag.noshow;
              return SpecialDateTypeTag.normal;
            },
          },
        ]}
      />
    </PageContainer>
  );
};
