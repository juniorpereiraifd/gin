import { Dropdown } from 'antd';
import { EllipsisVertical } from 'lucide-react';
import { Fragment, useState, type FunctionComponent } from 'react';
import Delete from 'src/components/Delete';
import { Button } from 'src/stories/general/Button';

type TableMapOptionsDropdownProps = {
  onDeleteMap: VoidFunction;
};

export const TableMapOptionsDropdown: FunctionComponent<TableMapOptionsDropdownProps> = (props) => {
  const { onDeleteMap } = props;
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  return (
    <Fragment>
      <Dropdown
        menu={{
          items: [
            {
              label: 'Excluir mapa',
              key: 'delete',
              onClick: () => setIsDeleteModalVisible(true),
            },
          ],
        }}
        trigger={['click']}
      >
        <Button variant="outlined" className="w-7 h-7 p-1">
          <EllipsisVertical size={16} className="text-slate-600" />
        </Button>
      </Dropdown>
      <Delete open={isDeleteModalVisible} setOpen={setIsDeleteModalVisible} onDelete={onDeleteMap} />
    </Fragment>
  );
};
