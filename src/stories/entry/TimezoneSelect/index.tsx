import { FunctionComponent } from 'react';
import type { SelectProps } from 'antd';
import { Select } from 'src/stories/entry';
import { BaseOptionType } from 'antd/lib/select';
import timezones from 'src/utils/timezones.json';

type TimezoneSelectProps = SelectProps<unknown, BaseOptionType>;

export const TimezoneSelect: FunctionComponent<TimezoneSelectProps> = (
  props
) => {
  return (
    <Select
      {...props}
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={timezones.map((timezone) => ({
        label: timezone.country,
        options: timezone.timezones.map((subtimezone) => ({
          label: subtimezone.name,
          value: subtimezone.id,
        })),
      }))}
    />
  );
};
