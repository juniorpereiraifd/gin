import { useState, useEffect } from 'react';
import { Title } from 'src/stories/typography';
import { Input } from 'src/stories/entry';
import Table from 'src/assets/images/table.svg';
import { DashCircleFill } from '@styled-icons/bootstrap/DashCircleFill';
import { PlusCircleFill } from '@styled-icons/bootstrap/PlusCircleFill';
import { notification } from 'src/utils/helpers';
import * as S from './styles';
import { CreateListNumberOfPeople, extractExists } from './functions';
import { REGEX_ALL_EXCEPT_NUMBER, REGEX_ALL_EXCEPT_NUMBER_AND_SIMBOL } from 'src/utils/constants';
import { ScheduleType, CustomizeTableBoxProps } from './types';

export const CustomizeTableBox = ({
  hallType,
  scheduleList,
  setScheduleList,
  size = 'small',
}: CustomizeTableBoxProps) => {
  const [schedule, setSchedule] = useState<ScheduleType>({
    numberOfTable: null,
    numberOfPeople: null,
  });

  useEffect(() => {
    if (hallType === 'total-seats') {
      const scheduleUpdated = scheduleList.map((item) => {
        return {
          numberOfTable: null,
          numberOfPeople: item.numberOfPeople,
        };
      });

      setSchedule({ ...schedule, numberOfTable: null, numberOfPeople: null });
      setScheduleList([...scheduleUpdated]);
    }
  }, [hallType]); //eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeSchedule = (value: string, type: 'table' | 'people') => {
    if (type === 'people' && hallType === 'total-seats') {
      const valueEdited = value.replace(REGEX_ALL_EXCEPT_NUMBER_AND_SIMBOL, '');

      return setSchedule({ ...schedule, numberOfPeople: valueEdited });
    }

    const valueEdited = value.replace(REGEX_ALL_EXCEPT_NUMBER, '');

    return type === 'table'
      ? setSchedule({ ...schedule, numberOfTable: parseInt(valueEdited) })
      : setSchedule({ ...schedule, numberOfPeople: parseInt(valueEdited) });
  };

  const handleChangeItemScheduleMap = (value: string, type: 'table' | 'people', index: number) => {
    const listSchedule = scheduleList;

    listSchedule[index] = {
      ...listSchedule[index],
      numberOfTable: type === 'table' ? parseInt(value) : listSchedule[index].numberOfTable,
      numberOfPeople: type === 'people' ? parseInt(value) : listSchedule[index].numberOfPeople,
    };

    return setScheduleList([...listSchedule]);
  };

  const handleAddSchedule = () => {
    if (hallType === 'total-seats') {
      if (!schedule.numberOfPeople) {
        return notification.error(
          'Erro ao adicionar mesa',
          `Certifique-se de informar um valor válido para o número de pessoas`
        );
      }

      const listNumberOfPeople = CreateListNumberOfPeople(schedule.numberOfPeople.toString());

      const mapFiltered = extractExists(scheduleList, listNumberOfPeople);
      const scheduleNumberOfPeople: ScheduleType[] = [];

      mapFiltered.forEach((item) => {
        return scheduleNumberOfPeople.push({
          numberOfTable: null,
          numberOfPeople: item,
        });
      });

      setScheduleList([...scheduleList, ...scheduleNumberOfPeople]);
    } else {
      if (!schedule.numberOfPeople || !schedule.numberOfTable) {
        return notification.error(
          'Erro ao adicionar mesa',
          `Certifique-se de informar um valor válido para o número de pessoas e mesa`
        );
      }
      const mapFiltered = extractExists(scheduleList, [schedule.numberOfPeople as number]);
      const mapTableUpdated: ScheduleType[] = [];

      mapFiltered.forEach((item) => {
        return mapTableUpdated.push({
          numberOfTable: schedule.numberOfTable,
          numberOfPeople: item,
        });
      });

      setScheduleList([...scheduleList, ...mapTableUpdated]);
    }

    return setSchedule({ numberOfTable: null, numberOfPeople: null });
  };

  const handleRemoveItemSchedule = (index: number) => {
    const listSchedule = scheduleList;
    listSchedule.splice(index, 1);

    return setScheduleList([...listSchedule]);
  };

  return (
    <S.Container size={size}>
      <S.Header>
        <S.ContentTitleHeader>
          <Title level={4}>Mesas do salão</Title>
        </S.ContentTitleHeader>
      </S.Header>
      <S.WrapperList>
        <S.StyledList
          size="large"
          dataSource={scheduleList}
          renderItem={(item: ScheduleType | unknown, index) => (
            <S.ItemList>
              <S.BodyForm>
                <S.ContainerItemForm>
                  {hallType === 'table-map' && (
                    <Input
                      value={(item as ScheduleType).numberOfTable as number}
                      onChange={(event) => handleChangeItemScheduleMap(event.target.value, 'table', index)}
                      style={{ maxWidth: '4rem' }}
                      type="number"
                    />
                  )}
                  mesas de
                  <Input
                    value={(item as ScheduleType).numberOfPeople as number}
                    onChange={(event) => handleChangeItemScheduleMap(event.target.value, 'people', index)}
                    style={{
                      maxWidth: hallType === 'total-seats' ? '5rem' : '4rem',
                    }}
                    type="number"
                  />
                  lugares
                </S.ContainerItemForm>
                <S.ButtonCircle
                  shape="circle"
                  onClick={() => handleRemoveItemSchedule(index)}
                  icon={
                    <S.ContentImageButton type="secondary">
                      <DashCircleFill size={35} />
                    </S.ContentImageButton>
                  }
                />
              </S.BodyForm>
            </S.ItemList>
          )}
        />
      </S.WrapperList>
      <S.Footer>
        <Title level={4}>Adicionar mesas</Title>
        <S.WrapperFooter>
          <S.ContentInputFooter>
            <S.ContentInfoFooter>
              <S.ContainerItemForm>
                {hallType === 'table-map' && (
                  <Input
                    value={schedule.numberOfTable as number}
                    onChange={(event) => handleChangeSchedule(event.target.value, 'table')}
                    style={{ maxWidth: '4rem' }}
                    type="number"
                    className="table-field"
                  />
                )}
                mesas de
                {hallType === 'total-seats' ? (
                  <Input
                    value={schedule.numberOfPeople as string}
                    onChange={(event) => handleChangeSchedule(event.target.value, 'people')}
                    style={{ width: '16rem' }}
                    placeholder="Exemplo 1-5, 8, 11-13"
                    className="people-field"
                  />
                ) : (
                  <Input
                    value={schedule.numberOfPeople as number}
                    onChange={(event) => handleChangeSchedule(event.target.value, 'people')}
                    style={{ width: '4rem' }}
                    type="number"
                    className="people-field-by-table"
                  />
                )}
                lugares
              </S.ContainerItemForm>
            </S.ContentInfoFooter>
            <S.ButtonCircle
              shape="circle"
              onClick={handleAddSchedule}
              icon={
                <S.ContentImageButton type="primary">
                  <PlusCircleFill size={35} />
                </S.ContentImageButton>
              }
            />
          </S.ContentInputFooter>
          {hallType === 'total-seats' && (
            <S.HelperFooter>
              Você pode adicionar mesas por um intervalo numérico (exemplo 1-10 lugares) ou utilizando apenas um numeral
              (10 lugares).{' '}
            </S.HelperFooter>
          )}
        </S.WrapperFooter>
      </S.Footer>
    </S.Container>
  );
};
