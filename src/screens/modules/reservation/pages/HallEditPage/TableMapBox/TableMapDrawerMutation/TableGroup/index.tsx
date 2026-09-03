import { Tooltip } from 'antd';
import type { FunctionComponent, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import type { MutableTableMap } from 'src/store/modules/hall/reducer';
import { Button } from 'src/stories/general/Button';

type TableGroupProps = {
  size: ReactNode;
  tables: Array<MutableTableMap>;
  onClickTable: VoidFunction;
};

export const TableGroup: FunctionComponent<TableGroupProps> = (props) => {
  const { size, tables, onClickTable } = props;
  const dispatch = useDispatch();

  const handleClickTable = (table: MutableTableMap) => {
    dispatch(
      HallCreators.setEditableTable({
        number: table.number,
        min_people: table.min_people,
        max_people: table.max_people,
      })
    );

    onClickTable();
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="text-slate-700">{size}</span>
      <div className="grid grid-cols-10 gap-3">
        {tables.map((item) => (
          <Tooltip title="Editar mesa">
            <Button key={item.id} className="relative font-semibold" onClick={() => handleClickTable(item)}>
              {item.draft === true && (
                <div className="absolute top-[-4px] right-[-4px] w-2 h-2 rounded-full bg-amber-400 border border-amber-600" />
              )}
              {item.number}
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
