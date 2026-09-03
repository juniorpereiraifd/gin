import { ReactNode } from 'react';
import { TableColumnProps, TablePaginationConfig } from 'antd';
import { Table } from 'src/stories/display/Table';
import type { AnyObject } from 'antd/es/_util/type';

type CampaignListProps<T extends any = any> = {
  data: T[];
  loading: boolean;
  columns: TableColumnProps[];
  title?: ReactNode;
  onChange?: (pagination: any) => void;
  pagination?: TablePaginationConfig;
};

export const CampaignList = <T,>(props: CampaignListProps<T>) => {
  const { data, columns, loading, onChange, pagination, title } = props;

  return (
    <Table
      bordered
      dataSource={data as AnyObject[]}
      loading={loading}
      size="large"
      className="shadow-sm"
      title={() => title}
      onChange={onChange}
      pagination={pagination}
      columns={columns}
    />
  );
};
