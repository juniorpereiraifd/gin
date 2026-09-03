import { useState, useEffect, FunctionComponent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Divider, Drawer, notification, Tooltip } from 'antd';
import { Trash2 } from 'lucide-react';
import { Button } from 'src/stories/general/Button';
import Input from 'src/stories/entry/Input';
import { Creators as UnitCreators } from 'src/store/modules/unity/actions';
import { Creators as WidgetCreators } from 'src/store/modules/widget/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { UnityItemProps } from 'src/store/modules/unity/reducer';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { DebouncedSelect } from 'src/stories/entry/DebouncedSelect';

type CreateWidgetFormProps = {
  unitId: string;
};

export const CreateWidgetDrawer: FunctionComponent<CreateWidgetFormProps> = (props) => {
  const { unitId } = props;
  const [form] = useForm();
  const dispatch = useDispatch();
  const [selectedLinkedUnits, setSelectedLinkedUnits] = useState<UnityItemProps[]>([]);
  const [unitNameSearched, setUnitNameSearched] = useState<string | null>(null);
  const {
    unity: { loading, data: units, pagination },
    hall: { unity: activeUnity },
    widget: { saving, isCreateWidgetDrawerOpen },
  } = useSelector((state: RootType) => state);

  const onFinish = ({ name }: { name: string }) => {
    dispatch(
      WidgetCreators.createWidgetRequest({
        unity: unitId,
        data: {
          widget: {
            name,
            active: true,
          },
          widget_units: selectedLinkedUnits.map((unity) => ({
            unit_id: unity.id,
            active: true,
          })),
        },
      })
    );
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
        setSelectedLinkedUnits((prevUnits) => [...prevUnits, { ...selectedUnit }]);
      }
    }
  };

  const handleSearchUnit = (unitName: string) => {
    setUnitNameSearched(unitName);

    dispatch(
      UnitCreators.getUnitsRequest({
        page: 1,
        unitName: unitName,
      })
    );
  };

  const handleClearUnitSelect = () => {
    setUnitNameSearched(null);
    dispatch(UnitCreators.getUnitsRequest({ page: 1 }));
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
        })
      );
    }
  };

  const handleDeleteUnit = (id: string) => {
    setSelectedLinkedUnits((prevUnits) => prevUnits.filter((unit) => unit.id !== id));
  };

  useEffect(() => {
    if (isCreateWidgetDrawerOpen && activeUnity) {
      form.resetFields();
      setSelectedLinkedUnits([activeUnity]);
      dispatch(UnitCreators.getUnitsRequest({ page: 1 }));
    }
  }, [isCreateWidgetDrawerOpen, form, activeUnity]);

  const handleCloseDrawer = () => {
    dispatch(WidgetCreators.setCreateDrawerOpen({ open: false }));
    form.resetFields();
    setSelectedLinkedUnits([]);
    setUnitNameSearched(null);
  };

  return (
    <Drawer
      open={isCreateWidgetDrawerOpen}
      onClose={handleCloseDrawer}
      title="Criar widget de reserva"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button onClick={() => dispatch(WidgetCreators.closeModal())} variant="outlined">
            Cancelar
          </Button>
          <Button loading={saving} disabled={selectedLinkedUnits.length === 0} onClick={() => form.submit()}>
            Criar widget
          </Button>
        </div>
      }
      className="[&_.ant-drawer-body]:flex [&_.ant-drawer-body]:flex-col [&_.ant-drawer-body]:overflow-hidden"
    >
      <Form form={form} onFinish={onFinish} layout="vertical" className="flex flex-col flex-1 overflow-hidden">
        <FormItem
          name="name"
          label="Nome do widget"
          rules={[
            {
              required: true,
              message: 'É obrigatório dar um nome ao widget',
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          layout="vertical"
          label="Buscar unidades para vincular"
          help="Selecione uma unidade para vincular ao widget"
          tooltip="Você pode vincular várias unidades para este widget. Exemplo: Se você gerencia uma rede de pizzarias, pode
            vincular todas neste mesmo widget."
        >
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
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-0">
          {selectedLinkedUnits.map((unit) => (
            <UnitItemList key={unit.id} unit={unit} onDelete={handleDeleteUnit} />
          ))}
        </div>
      </Form>
    </Drawer>
  );
};

type UnitItemListProps = {
  unit: UnityItemProps;
  onDelete: (id: string) => void;
};

const UnitItemList: FunctionComponent<UnitItemListProps> = (props) => {
  const { unit, onDelete } = props;

  return (
    <div className="w-full flex items-center justify-between py-3 px-4 border border-gray-300 rounded-md">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <img src={unit.profile_image} className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 flex flex-col min-w-0">
          <span className="break-words text-sm text-slate-800">{unit.name}</span>
          <p className="text-xs text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">{unit.address}</p>
        </div>
      </div>
      <Tooltip title="Remover unidade" mouseEnterDelay={0.3}>
        <Button
          className="flex-shrink-0"
          icon={<Trash2 size={16} />}
          variant="text"
          color="danger"
          onClick={() => onDelete(unit.id)}
        />
      </Tooltip>
    </div>
  );
};
