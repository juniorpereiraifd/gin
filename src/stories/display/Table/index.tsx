import { Fragment, useMemo, useState } from 'react';
import { Table as AntdTable, TableProps as AntdTableProps, TableColumnsType } from 'antd';
import type { ColumnType } from 'antd/lib/table';
import { cn } from 'src/lib/utils';
import { Reveal } from '../Reveal';
import { ActionsDropdown, type ActionsConfig } from './ActionsDropdown';

export type TableProps<T extends object = Record<string, any>> = Omit<AntdTableProps<T>, 'columns' | 'rowSelection'> & {
  columns: TableColumnsType<T>;
  selectable?: boolean;
  rowSelection?: AntdTableProps<T>['rowSelection'];
  rowSelectionActions?: ActionsConfig<T[]>;
  actions?: ActionsConfig<T>;
};

export const Table = <T extends object = Record<string, any>>(props: TableProps<T>) => {
  const {
    actions,
    columns = [],
    selectable = false,
    rowSelection: externalRowSelection,
    rowSelectionActions,
    children,
    title,
    dataSource,
    ...rest
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const internalRowSelection: AntdTableProps<T>['rowSelection'] = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const rowSelection = externalRowSelection ?? internalRowSelection;

  const actionsColumn = useMemo<ColumnType<T> | undefined>(() => {
    if (!actions) {
      return undefined;
    }

    return {
      key: 'actions',
      dataIndex: 'actions',
      align: 'center',
      width: 80,
      render: (_: unknown, data: T) => {
        const disabled = actions.getDisabledState?.(data);
        const tooltip = actions.tooltip?.(data);
        const isVisible = actions.isVisible?.(data) ?? true;

        return isVisible ? (
          <div className="w-full flex items-center justify-center">
            <ActionsDropdown data={data} actions={actions} disabled={disabled} tooltip={tooltip} />
          </div>
        ) : undefined;
      },
      ...(actions.columnProps ?? {}),
    } satisfies ColumnType<T>;
  }, [actions]);

  return (
    <AntdTable<T>
      {...rest}
      className={cn('[&_.ant-table-title]:p-0', rest.className)}
      dataSource={dataSource}
      columns={[...columns, ...(actionsColumn ? [actionsColumn] : [])]}
      rowSelection={selectable ? rowSelection : undefined}
      title={
        title !== undefined || selectedRowKeys.length > 0
          ? () => (
              <Fragment>
                {title !== undefined && (
                  <div className="p-4">{dataSource !== undefined ? title?.(dataSource) : null}</div>
                )}
                <Reveal>
                  {selectedRowKeys.length > 0 && (
                    <div className="p-4 border-t border-b border-t-brand-100 border-b-brand-100 bg-brand-50 flex items-center justify-between">
                      <span>
                        {selectedRowKeys.length} ite{selectedRowKeys.length === 1 ? 'm' : 'ns'} selecionado
                        {selectedRowKeys.length === 1 ? '' : 's'}
                      </span>
                      {rowSelectionActions && (
                        <Fragment>
                          {(() => {
                            const disabled = rowSelectionActions?.getDisabledState?.(
                              getItemListByKeys(dataSource, selectedRowKeys)
                            );
                            const tooltip = rowSelectionActions?.tooltip?.(
                              getItemListByKeys(dataSource, selectedRowKeys)
                            );

                            return (
                              <ActionsDropdown
                                data={getItemListByKeys(dataSource, selectedRowKeys)}
                                actions={rowSelectionActions}
                                disabled={disabled}
                                tooltip={tooltip}
                              />
                            );
                          })()}
                        </Fragment>
                      )}
                    </div>
                  )}
                </Reveal>
              </Fragment>
            )
          : undefined
      }
    />
  );
};

function getItemListByKeys<T>(data: readonly T[] | undefined, keys: React.Key[]) {
  if (!data) {
    return [];
  }

  return data.filter((item: any) => keys.includes(item.id));
}
