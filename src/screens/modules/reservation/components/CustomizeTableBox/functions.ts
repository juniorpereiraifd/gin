import { ScheduleType } from './types';

export const extractExists = (
  list: ScheduleType[],
  listNumbExists: number[]
) => {
  const mapTableExists: number[] = [];
  const exceptionsTable: number[] = [];

  list.forEach((item) => mapTableExists.push(item.numberOfPeople as number));

  listNumbExists.forEach(
    (numb) => !mapTableExists.includes(numb) && exceptionsTable.push(numb)
  );

  return exceptionsTable;
};

const extractRange = (value: string, list: number[]) => {
  if (value.indexOf('-') >= 0) {
    const rangeEdited = value.split('-');
    for (let i = parseInt(rangeEdited[0]); i <= parseInt(rangeEdited[1]); i++) {
      list.push(i);
    }
  } else {
    list.push(parseInt(value));
  }
};

export const CreateListNumberOfPeople = (numberOfPeople: string) => {
  const listNumberOfPeople: number[] = [];

  if (numberOfPeople.indexOf(',') >= 0) {
    const valueSplited = numberOfPeople.split(',');

    valueSplited.map((value) => extractRange(value, listNumberOfPeople));
  } else {
    extractRange(numberOfPeople, listNumberOfPeople);
  }

  return listNumberOfPeople;
};
