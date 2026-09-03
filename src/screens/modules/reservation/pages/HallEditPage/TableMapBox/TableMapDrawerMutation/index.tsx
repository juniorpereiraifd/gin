import { useMemo, useState, type FunctionComponent } from 'react';
import { Drawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronUp, CirclePlus, Pencil } from 'lucide-react';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import type { MutableTableMap } from 'src/store/modules/hall/reducer';
import { Button } from 'src/stories/general/Button';
import { Reveal } from 'src/stories/display/Reveal';
import { TableGroup } from './TableGroup';
import { TableMutationForm } from './TableMutationForm';
import { CloseConfirmationModal } from 'src/screens/components/CloseConfirmationModal';
import { Heading } from 'src/ui/Typograph';
import { TableMapOptionsDropdown } from '../TableMapOptionsDropdown';

type TableMapDrawerMutationProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const TableMapDrawerMutation: FunctionComponent<TableMapDrawerMutationProps> = (props) => {
  const { open, setOpen } = props;
  const dispatch = useDispatch();
  const {
    hall: { hall, selectedTableMap, selectedTable, savingCreateTable },
  } = useSelector((state: RootType) => state);
  const [isMutationTableFormIsVisible, setIsMutationTableFormIsVisible] = useState(false);
  const [closeConfirmationModalIsVisible, setCloseConfirmationModalIsVisible] = useState(false);
  const hasSomeDraft = selectedTableMap?.some((item) => item.draft === true);
  const groupedTableMap = useMemo(() => {
    if (selectedTableMap === null) {
      return null;
    }

    return selectedTableMap.reduce<Record<string, MutableTableMap[]>>((acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }

      acc[item.group].push(item);

      return acc;
    }, {});
  }, [selectedTableMap]);

  const handleClose = () => {
    setIsMutationTableFormIsVisible(false);
    setOpen(false);
    dispatch(HallCreators.setEditableTable(null));
    dispatch(HallCreators.setTableMap(null));
  };

  const onClose = () => {
    if (hasSomeDraft) {
      setCloseConfirmationModalIsVisible(true);

      return;
    }

    handleClose();
  };

  const handleClickTable = () => {
    setIsMutationTableFormIsVisible(true);
  };

  const handleCreateTableMap = () => {
    dispatch(HallCreators.createTableMapRequest());
  };

  const handleDeleteTableMap = () => {
    dispatch(HallCreators.deleteTableMapRequest());
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-4">
          <Heading level="5">Mapa de mesas</Heading>
          {hall !== null && hall?.map.length > 0 && <TableMapOptionsDropdown onDeleteMap={handleDeleteTableMap} />}
        </div>
      }
      placement="right"
      size="large"
      className="[&_.ant-drawer-footer]:p-0 [&_.ant-drawer-footer]:border-slate-200"
      closable={false}
      onClose={onClose}
      open={open}
      extra={
        <Reveal>
          {hasSomeDraft ? (
            <div className="flex items-center gap-4">
              <Button variant="outlined" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTableMap} loading={savingCreateTable}>
                Salvar
              </Button>
            </div>
          ) : null}
        </Reveal>
      }
      footer={
        <div className="flex flex-col">
          <div className="w-full p-6 border-b border-slate-200">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedTable !== null ? <Pencil size={16} /> : <CirclePlus size={16} />}
                <span className="font-medium">{selectedTable !== null ? 'Editar' : 'Adicionar'} mesa</span>
              </div>
              <Button
                icon={isMutationTableFormIsVisible ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                variant="outlined"
                onClick={() => setIsMutationTableFormIsVisible((prev) => !prev)}
              />
            </div>
            <Reveal>
              {isMutationTableFormIsVisible === true && (
                <TableMutationForm setIsMutationTableFormIsVisible={setIsMutationTableFormIsVisible} />
              )}
            </Reveal>
          </div>
        </div>
      }
    >
      <div className="w-full flex flex-col gap-6">
        {groupedTableMap !== null &&
          Object.entries(groupedTableMap).map(([group, tables]) => (
            <TableGroup key={group} size={`${group} pessoas`} tables={tables} onClickTable={handleClickTable} />
          ))}
      </div>
      <CloseConfirmationModal
        open={closeConfirmationModalIsVisible}
        onBack={() => setCloseConfirmationModalIsVisible(false)}
        onDiscard={() => {
          handleClose();
          setCloseConfirmationModalIsVisible(false);
        }}
      />
    </Drawer>
  );
};
