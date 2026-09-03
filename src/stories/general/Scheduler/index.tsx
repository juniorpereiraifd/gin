import React from 'react';
import * as S from './styles';

export type SchedulerProps = {
  /**
   * List of dates that should be filled in on the grid (reflect the start time of each cell).
   */
  selections?: Array<Date>;
  /**
   * The number of days to show, starting from today
   */
  numDays: number;
  /**
   * The minimum hour to show (0-23)
   */
  minTime: number;
  /**
   * The margin between grid cells (in pixels)
   */
  margin: number;
  /**
   * How many chunks to divide each hour into (e.g. 2 divides the hour into half-hour steps, 4 into 15-minute steps)
   */
  hourlyChunks: number;
  /**
   * The maximum hour to show (0-23)
   */
  maxTime: number;
  /**
   * The date format to be used for the column headers
   */
  dateFormat: string;
  /**
   * The time format to be used for the row labels
   */
  timeFormat: string;
  /**
   * The date on which the grid should start (time portion is ignored, specify start time via minTime)
   */
  startDate?: Date;
  /**
   * A render prop function that accepts the time this cell is representing and whether the cell is selected or not and should return a React element. It is your responsibility to apply the refSetter as a ref to the component you render -- neglecting to do so will cause the component to not work properly for touch devices. If you choose to use this custom render function, the color props above have no effect.
   */
  renderDateCell?: (
    time: Date,
    selected: boolean,
    refSetter: HTMLElement | null
  ) => React.ReactNode;
  onChange?: (dates: Array<Date>) => void;
};

/**
 * A mobile-friendly when2meet-style grid-based schedule selector
 */
const Scheduler = ({
  selections = [],
  numDays,
  minTime,
  margin,
  hourlyChunks,
  maxTime,
  dateFormat,
  timeFormat,
  startDate,
  renderDateCell,
  onChange,
}: SchedulerProps) => {
  return (
    <S.Wrapper
      selection={selections}
      numDays={numDays}
      minTime={minTime}
      margin={margin}
      hourlyChunks={hourlyChunks}
      maxTime={maxTime}
      dateFormat={dateFormat}
      timeFormat={timeFormat}
      startDate={startDate}
      renderDateCell={renderDateCell}
      onChange={onChange}
    />
  );
};

export default Scheduler;
