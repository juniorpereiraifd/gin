import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from 'antd';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { Creators as ReservationCreators } from 'src/store/modules/reservation/actions';
import { Creators as ScheduleCreators } from 'src/store/modules/schedule/actions';
import { TabKeys } from 'src/store/modules/schedule/reducer';
import { Tabs } from 'src/stories/display/Tabs';
import HallCard from 'src/stories/general/HallCard';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { PageContainer } from 'src/components/PageContainer';
import { EmptyChairBox } from './EmptyChairBox';
import { ActionsHallBox } from './ActionsHallBox';
import { SchedulesTable } from './SchedulesTable';
import { TableMapBox } from './TableMapBox';

export const HallEditPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { hallId } = useParams<'reservation.hallEdit'>();

  const {
    hall: { unity, hall },
    schedule: { loading, selectedDay },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (unity && hallId) {
      dispatch(HallCreators.getHallRequest(hallId));
      dispatch(ReservationCreators.getReservationSettingsRequest());
    }
  }, [dispatch, unity, hallId]);

  useEffect(() => {
    if (hall) {
      form.setFieldsValue({ title: hall.name });
    }
  }, [dispatch, form, hall]);

  const handleChangeSelectedDay = (activeKey: string) => {
    dispatch(ScheduleCreators.setSelectedDay({ day: activeKey }));
  };

  return (
    <PageContainer sideColumn>
      <PageTitle>Grade horária</PageTitle>
      <Tabs
        className="row-start-2 col-start-1"
        activeKey={selectedDay}
        onChange={handleChangeSelectedDay}
        destroyInactiveTabPane={true}
        items={[
          {
            key: TabKeys.SUNDAY,
            label: 'Domingo',
            disabled: loading,
            children: <SchedulesTable hallId={hallId} day={TabKeys.SUNDAY} />,
          },
          {
            key: TabKeys.MONDAY,
            label: 'Segunda',
            disabled: loading,
            children: <SchedulesTable hallId={hallId} day={TabKeys.MONDAY} />,
          },
          {
            key: TabKeys.TUESDAY,
            label: 'Terça',
            disabled: loading,
            children: <SchedulesTable hallId={hallId} day={TabKeys.TUESDAY} />,
          },
          {
            key: TabKeys.WEDNESDAY,
            label: 'Quarta',
            disabled: loading,
            children: <SchedulesTable hallId={hallId} day={TabKeys.WEDNESDAY} />,
          },
          {
            key: TabKeys.THURSDAY,
            label: 'Quinta',
            disabled: loading,
            children: <SchedulesTable hallId={hallId} day={TabKeys.THURSDAY} />,
          },
          {
            key: TabKeys.FRIDAY,
            label: 'Sexta',
            disabled: loading,
            children: <SchedulesTable hallId={hallId} day={TabKeys.FRIDAY} />,
          },
          {
            key: TabKeys.SATURDAY,
            label: 'Sábado',
            disabled: loading,
            children: <SchedulesTable hallId={hallId} day={TabKeys.SATURDAY} />,
          },
        ]}
      />
      <div className="flex flex-col gap-4 col-start-2 row-start-2 h-fit">
        {hall && (
          <>
            <ActionsHallBox hallId={hallId} />
            <div>
              <HallCard key={hall.id} schedule={hall.schedules} hideButton={true} statusValue={hall.active} />
            </div>
            <TableMapBox />
            <EmptyChairBox hallId={hallId} />
          </>
        )}
      </div>
    </PageContainer>
  );
};
