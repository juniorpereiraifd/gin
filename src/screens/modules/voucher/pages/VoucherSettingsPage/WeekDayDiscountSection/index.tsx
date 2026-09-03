import { FunctionComponent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse, Button, notification } from 'antd';
import { Loader2, Plus } from 'lucide-react';
import dayjs from 'dayjs';
import { Creators as VouchersCreators } from 'src/store/modules/voucher/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { Period } from 'src/store/modules/voucher/reducer';
import { Heading } from 'src/ui/Typograph';
import { getWeekday } from 'src/utils/helpers';
import { WeekDayItemDetail } from './WeekDayItemDetail';
import { WeekDayPeriodModalMutation } from './WeekDayPeriodModalMutation';

export const WeekDayDiscountSection: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {
    voucher: { periodsByWeekday, isGiftbackPeriodModalCreateVisible, loadingPeriodsByWeekday, savingPeriods },
  } = useSelector((state: RootType) => state);
  const [selectedWeekday, setSelectedWeekday] = useState<string | null>(null);

  const handleClickAddPeriod = (weekday: string) => {
    dispatch(VouchersCreators.setGiftbackPeriodModalVisible({ open: true, type: 'create' }));
    setSelectedWeekday(weekday);
  };

  const handleCloseModal = () => {
    dispatch(VouchersCreators.setGiftbackPeriodModalVisible({ open: false, type: 'create' }));
  };

  const handleCreatePeriod = (values: Period) => {
    const { hour_start, hour_end, ...rest } = values;

    if (selectedWeekday === null) {
      return notification.error({ message: 'Não foi possível criar o turno, por favor, tente novamente mais tarde.' });
    }

    return dispatch(
      VouchersCreators.createGiftbackPeriodRequest({
        day_of_week: selectedWeekday,
        hour_start: dayjs(hour_start).format('HH:mm'),
        hour_end: dayjs(hour_end).format('HH:mm'),
        ...rest,
      })
    );
  };

  return (
    <section>
      <Heading level="5">Desconto por dia da semana</Heading>
      <div className="mt-6">
        <Collapse
          className={
            '[&_.ant-collapse-content-box]:!p-0 [&_.ant-collapse-header]:!items-center' +
            ' [&_.ant-collapse-header-text]:!font-semibold [&_.ant-collapse-header-text]:!text-gray-700'
          }
          collapsible={loadingPeriodsByWeekday ? 'disabled' : 'header'}
          items={periodsByWeekday.map((item) => ({
            key: item.weekday,
            label: getWeekday({ weekday: parseInt(item.weekday), format: 'dddd' }),
            children: <WeekDayItemDetail periods={item.periods} />,
            extra: loadingPeriodsByWeekday ? (
              <div className="flex items-center justify-center w-8 h-8">
                <Loader2 className="text-gray-500 animate-spin" size={16} />
              </div>
            ) : (
              <AddButtonIcon handleClick={() => handleClickAddPeriod(item.weekday)} />
            ),
          }))}
        />
      </div>
      <WeekDayPeriodModalMutation
        open={isGiftbackPeriodModalCreateVisible === true}
        saving={savingPeriods}
        onCancel={handleCloseModal}
        onClose={handleCloseModal}
        onSubmit={handleCreatePeriod}
      />
    </section>
  );
};

type AddButtonIconProps = {
  handleClick: () => void;
};

const AddButtonIcon: FunctionComponent<AddButtonIconProps> = (props) => {
  return (
    <Button
      icon={<Plus size={14} />}
      className="text-gray-700"
      onClick={(event) => {
        event.stopPropagation();
        props.handleClick();
      }}
    />
  );
};
