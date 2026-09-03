import { useEffect, useState, type Dispatch, type FunctionComponent, type SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse, Divider, Drawer, notification, Skeleton, Tooltip } from 'antd';
import { Loader2, RefreshCcw, Trash2, TriangleAlert } from 'lucide-react';
import lodash from 'lodash';
import type { RootType } from 'src/store/modules/rootReducer';
import type { LinkedUnit } from 'src/store/modules/user/reducer';
import { Creators as UnitCreators } from 'src/store/modules/unity/actions';
import { Creators as UserCreators } from 'src/store/modules/user/actions';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Button } from 'src/stories/general/Button';
import { DebouncedSelect } from 'src/stories/entry/DebouncedSelect';
import { Switch } from 'src/stories/entry/Switch';
import { Form, useForm } from 'src/stories/entry/Form';
import { MODULES, MODULES_LABELS, type ModulesValues } from 'src/utils/constants';
import { Reveal } from 'src/stories/display/Reveal';

type LinkedUnitsDrawerProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const LinkedUnitsDrawer: FunctionComponent<LinkedUnitsDrawerProps> = (props) => {
  const { open, setOpen } = props;
  const dispatch = useDispatch();
  const [form] = useForm();
  const {
    unity: { loading, data: units, pagination },
    user: {
      editable,
      userModuleRestrictions,
      loadingModuleRestrictions,
      savingModuleRestrictions,
      saving,
      loadingEditable,
    },
  } = useSelector((state: RootType) => state);
  const [unitNameSearched, setUnitNameSearched] = useState<string | null>(null);
  const [selectedLinkedUnits, setSelectedLinkedUnits] = useState<LinkedUnit[]>([]);

  useEffect(() => {
    if (open === true && editable !== null && editable.units) {
      setSelectedLinkedUnits(editable.units);
    }
  }, [open, editable]);

  useEffect(() => {
    if (open) {
      dispatch(UnitCreators.getUnitsRequest({ page: 1 }));
    }
  }, [open]);

  useEffect(() => {
    if (userModuleRestrictions !== null && form) {
      const moduleSettings = userModuleRestrictions.units
        .map((unit) => {
          return Object.entries(unit.modules).reduce((acc, [moduleName, moduleData]) => {
            acc[`${moduleName as ModulesValues}_${unit.id}`] =
              moduleData.enabledByUnit === false ? moduleData.enabledByUnit : moduleData.enabledByUser || false;

            return acc;
          }, {} as Record<string, boolean>);
        })
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});

      form.setFieldsValue(moduleSettings);
    } else {
      form.resetFields();
    }
  }, [userModuleRestrictions]);

  const handleClose = () => {
    setOpen(false);
    setUnitNameSearched(null);
    setSelectedLinkedUnits([]);
  };

  const handleConfirmClose = () => {
    handleClose();
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
        const updatedLinkedUnits = [...selectedLinkedUnits, { id: selectedUnit.id, name: selectedUnit.name }];

        setSelectedLinkedUnits(updatedLinkedUnits);
        handleSave(updatedLinkedUnits);
      }
    }
  };

  const handleClearUnitSelect = () => {
    setUnitNameSearched(null);
    dispatch(UnitCreators.getUnitsRequest({ page: 1 }));
  };

  const handleDeleteUnit = (id: string) => {
    const updatedLinkedUnits = selectedLinkedUnits.filter((unit) => unit.id !== id);
    setSelectedLinkedUnits(updatedLinkedUnits);
    handleSave(updatedLinkedUnits);
  };

  const handleSave = (list: LinkedUnit[]) => {
    dispatch(
      UserCreators.updateUserRequest(
        {
          id: editable?.id,
          units: list,
        },
        () => {
          setOpen(false);
        }
      )
    );
  };

  const handleGetUnitModulesSettings = (unitIds: string[]) => {
    const unitId = unitIds[unitIds.length - 1];

    if (unitId === undefined) {
      return;
    }

    dispatch(
      UserCreators.getUserModuleRestrictionsRequest({
        userId: String(editable?.id) || '',
        unitId,
        modules: [MODULES.RESERVATION, MODULES.LINE, MODULES.MENU, MODULES.MARKETING, MODULES.NPS, MODULES.VOUCHER],
      })
    );
  };

  const handleChangeModuleControl = (enable: boolean, unitId: string, module: ModulesValues) => {
    dispatch(
      UserCreators.updateUserModuleRestrictionRequest({
        userId: String(editable?.id) || '',
        unitId,
        module,
        enable,
      })
    );
  };

  return (
    <Drawer
      destroyOnClose
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Gerenciar unidades vinculadas</span>
          {saving === true && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-normal text-sm">Atualizando</span>
              <Loader2 size={14} className="animate-spin text-slate-400" />
            </div>
          )}
        </div>
      }
      size="large"
      closable={false}
      onClose={handleConfirmClose}
      open={open}
      className="[&_.ant-drawer-body]:p-0"
      footer={null}
    >
      <div className="flex flex-col w-full h-full p-6">
        <FormItem layout="vertical" label="Buscar unidades" help="Selecione uma unidade para vincular ao gerente">
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
        {loadingEditable ? (
          <div className="flex items-center justify-between py-3 px-4 border border-stone-300 rounded-md bg-stone-50">
            <Skeleton.Input active />
            <div className="flex items-center justify-center w-8 h-8">
              <Loader2 size={16} className="animate-spin text-slate-500" />
            </div>
          </div>
        ) : (
          <Collapse
            className="[&_.ant-collapse-header]:!items-center [&_.ant-collapse-content-box]:!p-0"
            expandIconPosition="start"
            onChange={handleGetUnitModulesSettings}
            items={selectedLinkedUnits.map((unit) => ({
              key: unit.id,
              label: unit.name,
              children: (() => {
                const userModuleRestrictionsForUnit = userModuleRestrictions?.units.find((u) => u.id === unit.id);

                return (
                  <div>
                    <Reveal>
                      {Object.values(userModuleRestrictionsForUnit?.modules || {}).some(
                        (item) => item.error === true
                      ) && (
                        <div className="border-b border-b-gray-300 p-3 flex items-center justify-end gap-4">
                          <Tooltip
                            title="Houve algum erro na busca das informações dos módulos, clique aqui para atualizar todos os dados."
                            mouseEnterDelay={0.3}
                          >
                            <Button
                              variant="outlined"
                              className="flex-shrink-0"
                              icon={<RefreshCcw size={14} />}
                              loading={
                                loadingModuleRestrictions?.unit_id === unit.id &&
                                loadingModuleRestrictions.loading === true
                              }
                              onClick={() => handleGetUnitModulesSettings([unit.id])}
                            >
                              Atualizar dados
                            </Button>
                          </Tooltip>
                        </div>
                      )}
                    </Reveal>
                    <Form form={form} className="[&_.ant-form-item]:m-0 p-4">
                      <div className="grid grid-cols-3 gap-6 py-2">
                        {Object.values(MODULES).map((module) => (
                          <Tooltip
                            title={
                              userModuleRestrictionsForUnit?.modules[module]?.enabledByUnit === false
                                ? `Não é possível gerenciar este módulo, pois a unidade não tem o módulo de ${MODULES_LABELS[module]} habilitado.`
                                : ''
                            }
                            key={module}
                          >
                            <FormItem name={`${module}_${unit.id}`}>
                              <Switch
                                onChange={(checked) => handleChangeModuleControl(checked, unit.id, module)}
                                disabled={
                                  (loadingModuleRestrictions?.unit_id === unit.id &&
                                    loadingModuleRestrictions.loading === true) ||
                                  userModuleRestrictionsForUnit?.modules[module]?.enabledByUnit === false ||
                                  userModuleRestrictionsForUnit?.modules[module]?.error === true
                                }
                                label={
                                  <div className="flex items-center gap-2">
                                    {MODULES_LABELS[module]}
                                    {userModuleRestrictionsForUnit?.modules[module]?.error === true && (
                                      <Tooltip title="Houve um erro na busca dessa informação, atualize os dados de módulos dessa unidade no botão acima.">
                                        <TriangleAlert size={14} className="text-amber-500" />
                                      </Tooltip>
                                    )}
                                  </div>
                                }
                              />
                            </FormItem>
                          </Tooltip>
                        ))}
                      </div>
                    </Form>
                  </div>
                );
              })(),
              extra: (
                <Tooltip title="Remover unidade" mouseEnterDelay={0.3}>
                  <Button
                    className="flex-shrink-0"
                    disabled={
                      (loadingModuleRestrictions?.unit_id === unit.id && loadingModuleRestrictions.loading === true) ||
                      (savingModuleRestrictions?.unit_id === unit.id && savingModuleRestrictions.saving === true)
                    }
                    icon={
                      (loadingModuleRestrictions?.unit_id === unit.id && loadingModuleRestrictions.loading === true) ||
                      (savingModuleRestrictions?.unit_id === unit.id && savingModuleRestrictions.saving === true) ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )
                    }
                    variant="text"
                    color="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUnit(unit.id);
                    }}
                  />
                </Tooltip>
              ),
            }))}
          />
        )}
      </div>
    </Drawer>
  );
};

export const getIsArrayEqual = (firstArray: LinkedUnit[], secondArray: LinkedUnit[]) => {
  const sortLinkedUnits = (arr: LinkedUnit[]) => [...arr].sort((a, b) => a.id.localeCompare(b.id));

  return lodash.isEqual(sortLinkedUnits(firstArray), sortLinkedUnits(secondArray));
};
