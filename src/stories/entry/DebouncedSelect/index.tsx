import React, { useMemo } from 'react';
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash/debounce';

const { Option } = Select;

export type DebouncedSelectProps<ValueType = any> = Omit<
  SelectProps<ValueType | ValueType[]>,
  'options' | 'children'
> & {
  handleLoadMore: (value: string) => void;
  data: ValueType[];
  dataRender?: (data: ValueType) => React.ReactNode;
  debounceTimeout?: number;
  loading?: boolean;
  loadingMore?: boolean;
};

export function DebouncedSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any,
>({
  debounceTimeout = 800,
  loading = false,
  loadingMore = false,
  handleLoadMore,
  data,
  dataRender,
  ...props
}: DebouncedSelectProps<ValueType>) {
  const debounceFetcher = useMemo(() => debounce(handleLoadMore, debounceTimeout), [handleLoadMore, debounceTimeout]);

  return (
    <Select
      labelInValue
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      loading={loading}
      notFoundContent={loadingMore ? <Spin size="small" /> : null}
      {...props}
    >
      {data.map((option) => {
        const { key, label, value } = option;

        return (
          <Option key={key || value} value={value}>
            {dataRender ? dataRender(option) : label}
          </Option>
        );
      })}
      {loadingMore && (
        <Option value="loading">
          <Spin size="small" />
        </Option>
      )}
    </Select>
  );
}
