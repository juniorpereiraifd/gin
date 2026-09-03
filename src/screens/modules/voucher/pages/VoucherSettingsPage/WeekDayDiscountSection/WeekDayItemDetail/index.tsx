import { Fragment, FunctionComponent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as VouchersCreators } from 'src/store/modules/voucher/actions';
import { WeekDayPeriodModalMutation } from '../WeekDayPeriodModalMutation';
import { Period, WeekdayPeriod } from 'src/store/modules/voucher/reducer';
import { Table } from 'src/stories/display/Table';

type WeekDayItemDetailProps = {
  periods: WeekdayPeriod[];
};

export const WeekDayItemDetail: FunctionComponent<WeekDayItemDetailProps> = (props) => {
  const { periods } = props;
  const dispatch = useDispatch();
  const {
    voucher: { isGiftbackPeriodModalEditVisible, savingPeriods },
  } = useSelector((state: RootType) => state);
  const [selectedPeriod, setSelectedPeriod] = useState<WeekdayPeriod | null>(null);

  const handleClickEditPeriod = (item: WeekdayPeriod) => {
    dispatch(VouchersCreators.setGiftbackPeriodModalVisible({ open: true, type: 'edit' }));
    setSelectedPeriod(item);
  };

  const handleCloseModal = () => {
    dispatch(VouchersCreators.setGiftbackPeriodModalVisible({ open: false, type: 'edit' }));
    setSelectedPeriod(null);
  };

  const handleEditPeriod = (values: Period) => {
    if (selectedPeriod !== null) {
      const { hour_start, hour_end, ...rest } = values;

      return dispatch(
        VouchersCreators.updateGiftbackPeriodRequest({
          id: selectedPeriod.id,
          day_of_week: selectedPeriod.day_of_week,
          hour_start: dayjs(hour_start).format('HH:mm'),
          hour_end: dayjs(hour_end).format('HH:mm'),
          ...rest,
        })
      );
    }
  };

  const handleDeletePeriod = (item: WeekdayPeriod) => {
    dispatch(VouchersCreators.deleteGiftbackPeriodRequest(item));
  };

  return (
    <Fragment>
      <Table
        className="[&_.ant-table-cell]:!border-0 [&_.ant-table-cell]:!text-gray-700 [&_.ant-table-cell]:!font-medium"
        dataSource={periods}
        pagination={false}
        actions={{
          edit: { onClick: handleClickEditPeriod },
          delete: { onClick: (item) => handleDeletePeriod(item) },
        }}
        columns={[
          { title: 'Turno', dataIndex: 'name', key: 'name' },
          {
            title: 'Desconto',
            dataIndex: 'discount_percentage',
            key: 'discount_percentage',
            render: (discount: number) => `${discount}%`,
          },
          {
            title: 'Hora inicial',
            dataIndex: 'hour_start',
            key: 'hour_start',
            render: (hour: string) => dayjs(hour, 'HH:mm').format('HH:mm'),
          },
          {
            title: 'Hora final',
            dataIndex: 'hour_end',
            key: 'hour_end',
            render: (hour: string) => dayjs(hour, 'HH:mm').format('HH:mm'),
          },
        ]}
      />
      <WeekDayPeriodModalMutation
        open={isGiftbackPeriodModalEditVisible === true && selectedPeriod !== null}
        saving={savingPeriods}
        selectedPeriod={selectedPeriod ?? undefined}
        onCancel={handleCloseModal}
        onClose={handleCloseModal}
        onSubmit={handleEditPeriod}
      />
    </Fragment>
  );
};
