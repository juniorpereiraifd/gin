export type ScheduleType = {
  numberOfTable: number | null;
  numberOfPeople: number | string | null;
};

export type CustomizeTableBoxProps = {
  hallType: 'total-seats' | 'table-map' | string;
  scheduleList: ScheduleType[];
  setScheduleList: (scheduleList: ScheduleType[]) => void;
  size?: 'large' | 'medium' | 'small';
};
