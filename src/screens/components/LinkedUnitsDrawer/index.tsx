import { useEffect, useState, type Dispatch, type FunctionComponent, type SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Drawer, notification, Tooltip } from 'antd';
import { Trash2 } from 'lucide-react';
import lodash from 'lodash';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as UnitCreators } from 'src/store/modules/unity/actions';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Button } from 'src/stories/general/Button';
import { DebouncedSelect } from 'src/stories/entry/DebouncedSelect';
import { CloseConfirmationModal } from 'src/screens/components/CloseConfirmationModal';

export type LinkedUnit = {
  id: string;
  name: string;
};

type LinkedUnitsDrawerProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSave: (linkedUnits: LinkedUnit[]) => void;
  linkedUnits: LinkedUnit[];
  title?: string;
  searchLabel?: string;
  searchHelp?: string;
  saveLabel?: string;
  removeTooltip?: string;
};

export const LinkedUnitsDrawer: FunctionComponent<LinkedUnitsDrawerProps> = (props) => {
  const {
    open,
    setOpen,
    onSave,
    linkedUnits,
    title = 'Unidades vinculadas',
    searchLabel = 'Buscar unidades',
    searchHelp = 'Selecione uma unidade',
    saveLabel = 'Vincular unidades',
    removeTooltip = 'Remover unidade',
  } = props;
  const dispatch = useDispatch();
  const {
    unity: { loading, data: units, pagination },
  } = useSelector((state: RootType) => state);
  const [unitNameSearched, setUnitNameSearched] = useState<string | null>(null);
  const [isCloseConfirmationModalIsVisible, setIsCloseConfirmationModalIsVisible] = useState(false);
  const [selectedLinkedUnits, setSelectedLinkedUnits] = useState<LinkedUnit[]>([]);
  const isLinkedUnitsDirty = getIsArrayEqual(linkedUnits, selectedLinkedUnits) === false;

  useEffect(() => {
    if (open === true && linkedUnits.length > 0) {
      setSelectedLinkedUnits(linkedUnits);
    }
  }, [open, linkedUnits]);

  useEffect(() => {
    if (open) {
      dispatch(UnitCreators.getUnitsRequest({ page: 1 }));
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setIsCloseConfirmationModalIsVisible(false);
    setUnitNameSearched(null);
    setSelectedLinkedUnits([]);
  };

  const handleConfirmClose = () => {
    if (isLinkedUnitsDirty) {
      setIsCloseConfirmationModalIsVisible(true);

      return;
    }

    handleClose();
  };

  const handleSearchUnit = (unitName: string) => {
    setUnitNameSearched(unitName);

    dispatch(
      UnitCreators.getUnitsRequest({
        page: 1,
        unitName: unitName,
      }),
    );
  };

  const onScrollUnitSelect = async (event: any) => {
    const target = event.target;

    if (!loading && pagination !== null && target.scrollTop + target.offsetHeight === target.scrollHeight) {
      target.scrollTo(0, target.scrollHeight);

      dispatch(
        UnitCreators.getUnitsRequest({
          page: pagination.current_page === 0 ? 1 : pagination.current_page + 1,
          isCumulative: true,
          ...(unitNameSearched !== null && { unitName: unitNameSearched }),
        }),
      );
    }
  };

  const handleSelectUnit = (target: any) => {
    if ((target || null) !== null && 'value' in target) {
      const selectedUnit = units.find((unit) => unit.id === target.value);

      if (selectedLinkedUnits.some((unit) => unit.id === selectedUnit?.id)) {
        notification.warning({
          message: 'Unidade já vinculada',
          description: `A unidade ${selectedUnit?.name} já está vinculada.`,
          placement: 'bottomRight',
        });

        return;
      }

      if (selectedUnit) {
        setSelectedLinkedUnits((prevUnits) => [...prevUnits, { id: selectedUnit.id, name: selectedUnit.name }]);
      }
    }
  };

  const handleClearUnitSelect = () => {
    setUnitNameSearched(null);
    dispatch(UnitCreators.getUnitsRequest({ page: 1 }));
  };

  const handleDeleteUnit = (id: string) => {
    setSelectedLinkedUnits((prevUnits) => prevUnits.filter((unit) => unit.id !== id));
  };

  const handleSave = () => {
    onSave(selectedLinkedUnits);
    setOpen(false);
  };

  return (
    <Drawer
      title={title}
      closable={false}
      onClose={handleConfirmClose}
      open={open}
      className="[&_.ant-drawer-body]:p-0"
      footer={
        <div className="flex items-center justify-end gap-4 p-2">
          <Button variant="outlined" onClick={handleConfirmClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isLinkedUnitsDirty}>
            {saveLabel}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col w-full h-full p-6">
        <FormItem layout="vertical" label={searchLabel} help={searchHelp}>
          <DebouncedSelect
            allowClear
            loading={loading}
            onChange={handleSelectUnit}
            handleLoadMore={handleSearchUnit}
            onClear={handleClearUnitSelect}
            onPopupScroll={pagination?.is_last_page === false ? onScrollUnitSelect : () => null}
            data={units.map((unit) => ({
              label: unit.name,
              value: unit.id,
            }))}
          />
        </FormItem>
        <Divider />
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {selectedLinkedUnits.map((unit) => (
            <UnitItemList
              key={unit.id}
              id={unit.id}
              name={unit.name}
              onDelete={handleDeleteUnit}
              removeTooltip={removeTooltip}
            />
          ))}
        </div>
      </div>
      <CloseConfirmationModal
        open={isCloseConfirmationModalIsVisible}
        onBack={() => setIsCloseConfirmationModalIsVisible(false)}
        onDiscard={handleClose}
      />
    </Drawer>
  );
};

export const getIsArrayEqual = (firstArray: LinkedUnit[], secondArray: LinkedUnit[]) => {
  const sortLinkedUnits = (arr: LinkedUnit[]) => [...arr].sort((a, b) => a.id.localeCompare(b.id));

  return lodash.isEqual(sortLinkedUnits(firstArray), sortLinkedUnits(secondArray));
};

type UnitItemListProps = LinkedUnit & {
  onDelete: (id: string) => void;
  removeTooltip: string;
};

const UnitItemList: FunctionComponent<UnitItemListProps> = (props) => {
  const { id, name, onDelete, removeTooltip } = props;

  return (
    <div className="w-full flex items-center justify-between py-3 px-4 border border-gray-300 rounded-md">
      <span className="break-words min-w-0">{name}</span>
      <Tooltip title={removeTooltip} mouseEnterDelay={0.3}>
        <Button
          className="flex-shrink-0"
          icon={<Trash2 size={16} />}
          variant="text"
          color="danger"
          onClick={() => onDelete(id)}
        />
      </Tooltip>
    </div>
  );
};
