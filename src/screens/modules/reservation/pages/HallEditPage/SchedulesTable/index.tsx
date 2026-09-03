import { Fragment, useEffect, useState, type FunctionComponent, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as ScheduleCreators } from 'src/store/modules/schedule/actions';
import { Table } from 'src/stories/display/Table';
import { Button } from 'src/stories/general/Button';
import { HALLS_TYPE } from 'src/utils/constants';
import { renderFriendlyMinuteValue } from 'src/utils/helpers';
import { MutationScheduleDrawer } from './MutationScheduleDrawer';
import type { ScheduleItemProps } from 'src/store/modules/schedule/reducer';
import { UsedScheduleModal } from './UsedScheduleModal';
import { notification, Tag } from 'antd';

type UsedScheduleModalStateProps = {
  open: boolean;
  actionType: 'edit' | 'delete' | null;
  scheduleId: string;
};

type SchedulesTableProps = {
  day: string;
  hallId: string;
};

export const SchedulesTable: FunctionComponent<SchedulesTableProps> = (props) => {
  const { day, hallId } = props;
  const dispatch = useDispatch();
  const {
    hall: { unity, hall },
    schedule: { data: schedules, loading, pagination },
  } = useSelector((state: RootType) => state);
  const [usedScheduleModal, setUsedScheduleModal] = useState<UsedScheduleModalStateProps>({
    open: false,
    actionType: null,
    scheduleId: '',
  });

  useEffect(() => {
    if (unity) {
      dispatch(
        ScheduleCreators.getSchedulesRequest({
          sector_id: hallId,
          day: day,
          page: 1,
        }),
      );
    }
  }, [unity]);

  const handleLoadMore = (page: number) => {
    if (pagination?.is_last_page) {
      return;
    }

    dispatch(
      ScheduleCreators.getSchedulesRequest({
        sector_id: hallId,
        day: day,
        page: page,
      }),
    );
  };

  const handleAddSchedule = () => {
    dispatch(ScheduleCreators.showModal());
  };

  const handleSetEditableSchedule = (item: ScheduleItemProps) => {
    if (item && item.id !== undefined) {
      if (item.has_reservations === true) {
        setUsedScheduleModal({
          open: true,
          actionType: 'edit',
          scheduleId: item.id.toString(),
        });

        return;
      }

      dispatch(ScheduleCreators.setEditableItem({ id: item.id.toString() }));
    }
  };

  const handleDeleteSchedule = (item: ScheduleItemProps) => {
    if (item && item.id !== undefined) {
      if (item.has_reservations === true) {
        setUsedScheduleModal({
          open: true,
          actionType: 'delete',
          scheduleId: item.id.toString(),
        });

        return;
      }

      dispatch(
        ScheduleCreators.deleteScheduleRequest({
          id: item.id,
          sector_id: hallId,
          day: day,
        }),
      );
    }
  };

  const handleConfirmUsedScheduleAction = () => {
    if (!usedScheduleModal.actionType || usedScheduleModal.scheduleId === '') {
      notification.error({
        message: 'Erro',
        description: 'Ação inválida ou horário não selecionado.',
      });

      return;
    }

    if (usedScheduleModal.actionType === 'edit') {
      dispatch(ScheduleCreators.setEditableItem({ id: usedScheduleModal.scheduleId }));
    } else if (usedScheduleModal.actionType === 'delete') {
      dispatch(
        ScheduleCreators.deleteScheduleRequest({
          id: usedScheduleModal.scheduleId,
          sector_id: hallId,
          day: day,
        }),
      );
    }

    setUsedScheduleModal({ open: false, actionType: null, scheduleId: '' });
  };

  return (
    <Fragment>
      <Table
        bordered
        className="shadow-sm row-start-2 col-start-1"
        dataSource={schedules}
        loading={loading}
        actions={{
          edit: {
            onClick: handleSetEditableSchedule,
          },
          delete: {
            onClick: handleDeleteSchedule,
            skipConfirmation: (item: ScheduleItemProps) => item.has_reservations === true,
          },
        }}
        title={() => (
          <div className="w-full flex items-center justify-end">
            <Button icon={<Plus size={14} />} onClick={handleAddSchedule}>
              Novo horário
            </Button>
          </div>
        )}
        pagination={{
          pageSize: pagination?.per_page,
          total: pagination?.total,
          current: pagination?.current_page,
          showTotal: (total) => `Total de ${total} horário${total !== 1 ? 's' : ''}`,
          onChange: handleLoadMore,
        }}
        columns={[
          {
            title: 'Horário',
            dataIndex: 'time',
            key: 'time',
            render: (_: unknown, data: ScheduleItemProps) => `${data.started_at} - ${data.ended_at}`,
          },
          {
            title: 'Escala',
            dataIndex: 'minute_step',
            key: 'minute_step',
            render: (value: number) => `${value} min`,
          },
          {
            title: 'Antecedência',
            dataIndex: 'minutes_in_advance',
            key: 'minutes_in_advance',
            render: (value: number) => renderFriendlyMinuteValue(value),
          },
          {
            title: 'Desconto',
            dataIndex: 'discount',
            key: 'discount',
            render: (value: number) => `${value} %`,
          },
          ...(hall?.type === HALLS_TYPE.TOTAL_SEATS
            ? [
                {
                  title: 'Pessoas',
                  dataIndex: 'total_seats',
                  key: 'total_seats',
                } as const,
              ]
            : []),
          {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            render: (_: unknown, data: ScheduleItemProps) => {
              if (data.schedule_product?.type === 'paid_grade') {
                return ScheduleTypeTag.paid_grade;
              }

              if (data.schedule_product?.type === 'noshow') {
                return ScheduleTypeTag.noshow;
              }

              return ScheduleTypeTag.normal;
            },
          },
        ]}
      />
      <MutationScheduleDrawer day={day} hallId={hallId} />
      <UsedScheduleModal
        open={usedScheduleModal.open}
        setOpen={(open) => setUsedScheduleModal((prev) => ({ ...prev, open: open }))}
        action={{ type: usedScheduleModal.actionType!, onConfirm: handleConfirmUsedScheduleAction }}
      />
    </Fragment>
  );
};

type ScheduleTypeBadgeType = 'normal' | 'paid_grade' | 'noshow';

const ScheduleTypeTag: Record<ScheduleTypeBadgeType, ReactNode> = {
  normal: <Tag color="default">Comum</Tag>,
  paid_grade: <Tag color="green">Grade paga</Tag>,
  noshow: <Tag color="blue">No-Show</Tag>,
};
