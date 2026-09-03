import { useState, useEffect, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { Skeleton, Switch } from 'antd';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { HallItemProps, Schedule } from 'src/store/modules/hall/reducer';
import { Button } from 'src/stories/general/Button';
import * as S from './styles';
import { BoxContrasted } from 'src/components/BoxContrasted';

export type HallCardProps = {
  name?: string;
  loading?: boolean;
  schedule?: HallItemProps['schedules'];
  hideButton?: boolean;
  showStatus?: boolean;
  statusValue?: boolean;
  hallId?: string;
  onClick?: () => void;
};

const HallCard: FunctionComponent<HallCardProps> = (props) => {
  const {
    name,
    loading = false,
    onClick,
    schedule = [],
    hideButton = false,
    showStatus = false,
    statusValue = false,
    hallId = '',
  } = props;
  const dispatch = useDispatch();
  const [activeState, setActiveState] = useState(statusValue);

  useEffect(() => {
    setActiveState(statusValue);
  }, [statusValue]);

  const handleSwitchActiveHall = (checked: boolean, hallId: string) => {
    dispatch(
      HallCreators.changeStatusHallRequest({
        hall_id: hallId,
        active: checked,
      })
    );
  };

  return (
    <BoxContrasted>
      {loading ? (
        <S.Loading>
          <Skeleton paragraph={{ rows: 6 }} active />
          <Skeleton.Button active />
        </S.Loading>
      ) : (
        <S.Body>
          {!showStatus && hallId == '' && name && <S.Name>{name}</S.Name>}
          {showStatus && hallId != '' && (
            <S.BoxShowStatus>
              {name && <S.Name>{name}</S.Name>}
              <Switch
                defaultChecked={activeState}
                onChange={(value) => {
                  handleSwitchActiveHall(value, hallId);
                  setActiveState(value);
                }}
              />
            </S.BoxShowStatus>
          )}
          <S.Content>
            <S.Table>
              <thead>
                <tr>
                  {Days.map((day, index) => (
                    <th key={index}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => (
                  <tr key={hour}>
                    {Days.map((day, indexDay) => (
                      <S.TableCell
                        key={indexDay}
                        active={checkIfIsActive({ hour, indexDay, schedule })}
                        statusHall={activeState}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </S.Table>
            {!hideButton && (
              <Button variant="outlined" onClick={onClick}>
                Ver salão
              </Button>
            )}
          </S.Content>
        </S.Body>
      )}
    </BoxContrasted>
  );
};

const Days = ['D', 'S', 'T', 'Q', 'Q', 'S ', 'S'];
const hours = Array.from({ length: 24 }, (_, i) => i);

const closest = (goal: number) =>
  hours.reduce(function (prev: number, curr: number) {
    return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
  });

type MappedDaysProps = {
  [key: number]: Array<Schedule>;
};

type CheckIfIsActiveProps = {
  hour: number;
  indexDay: number;
  schedule: Required<HallCardProps>['schedule'];
};

const checkIfIsActive = (props: CheckIfIsActiveProps) => {
  const { hour, indexDay, schedule } = props;
  const mappedDays: MappedDaysProps = {
    0: schedule[7],
    1: schedule[1],
    2: schedule[2],
    3: schedule[3],
    4: schedule[4],
    5: schedule[5],
    6: schedule[6],
  };

  const selectedDay = mappedDays[indexDay];

  if (selectedDay) {
    const hoursOfHall = selectedDay.filter((item) => item.date === null);

    const approximately = hoursOfHall.find((times) => closest(times.from) === hour || closest(times.to) === hour);

    const between = hoursOfHall.find((times) => hour >= closest(times.from) && hour <= closest(times.to));

    if (approximately || between) {
      return true;
    }
  }

  return false;
};

export default HallCard;
