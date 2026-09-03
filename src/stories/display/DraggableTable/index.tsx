import {
  createContext,
  CSSProperties,
  FunctionComponent,
  HTMLAttributes,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from 'antd';
import type { TableColumnsType } from 'antd';
import { GripVertical } from 'lucide-react';
import { Table, TableProps } from 'src/stories/display/Table';

type RowContextProps = {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
};

const RowContext = createContext<RowContextProps>({});

const DisabledKeysContext = createContext<Set<string>>(new Set());

const DragHandle: FunctionComponent = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);

  return (
    <Button
      className="cursor-move"
      type="text"
      size="small"
      icon={<GripVertical size={16} />}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

type RowProps = HTMLAttributes<HTMLTableRowElement> & {
  'data-row-key': string;
};

const Row: FunctionComponent<RowProps> = (props) => {
  const disabledKeys = useContext(DisabledKeysContext);
  const rowKey = props['data-row-key'];
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: rowKey,
    disabled: disabledKeys.has(rowKey),
  });

  const style: CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging && rowKey != null ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

type GenericDataType = {
  key: string;
};

export type OnDragEndProps<DataType extends any = any> = {
  to: number;
  toBasedOnPreviousState?: number;
  movedItem: DataType;
  updatedList: DataType[];
};

type DraggableTableProps<DataType extends GenericDataType = GenericDataType> = TableProps<DataType> & {
  data: DataType[];
  columns: TableColumnsType<DataType>;
  onDragEnd?: (props: OnDragEndProps) => void;
  isDraggable?: (item: DataType) => boolean;
};

export function DraggableTable<DataType extends GenericDataType = GenericDataType>(
  props: DraggableTableProps<DataType>,
) {
  const { data, columns, onDragEnd, isDraggable, ...rest } = props;
  const [dataSource, setDataSource] = useState<DataType[]>(data);

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  const disabledKeys = useMemo(
    () => new Set(isDraggable ? data.filter((item) => !isDraggable(item)).map((item) => item.key) : []),
    [data, isDraggable],
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex((record) => record.key === active?.id);
        let overIndex = prevState.findIndex((record) => record.key === over?.id);

        if (activeIndex === -1 || overIndex === -1) {
          return prevState;
        }

        if (isDraggable) {
          if (!isDraggable(prevState[activeIndex])) {
            return prevState;
          }

          let lastDraggableIndex = -1;
          prevState.forEach((item, index) => {
            if (isDraggable(item)) {
              lastDraggableIndex = index;
            }
          });

          if (overIndex > lastDraggableIndex) {
            overIndex = lastDraggableIndex;
          }
        }

        if (overIndex === activeIndex) {
          return prevState;
        }

        onDragEnd?.({
          to: overIndex,
          ...(((prevState[overIndex] as any).position ?? null) !== null && {
            toBasedOnPreviousState: (prevState[overIndex] as any).position,
          }),
          movedItem: prevState[activeIndex],
          updatedList: arrayMove(prevState, activeIndex, overIndex),
        });

        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
  };

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
      <SortableContext items={dataSource.map((i) => i.key)} strategy={verticalListSortingStrategy}>
        <DisabledKeysContext.Provider value={disabledKeys}>
          <Table<DataType>
            {...rest}
            rowKey="key"
            components={{ body: { row: Row } }}
            columns={[
              {
                key: 'sort',
                align: 'center',
                width: 80,
                render: (_: unknown, record: DataType) => (isDraggable && !isDraggable(record) ? null : <DragHandle />),
              },
              ...columns,
            ]}
            dataSource={dataSource}
          />
        </DisabledKeysContext.Provider>
      </SortableContext>
    </DndContext>
  );
}
