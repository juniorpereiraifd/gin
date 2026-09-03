import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as UnitCreators } from 'src/store/modules/unity/actions';
import { Creators as AuthCreators } from 'src/store/modules/auth/actions';
import { DebouncedSelect } from 'src/stories/entry/DebouncedSelect';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { BoxContrasted } from 'src/components/BoxContrasted';

export const PreferencesForm = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const {
    auth: { user },
    unity: { loading, data: units, pagination },
  } = useSelector((state: RootType) => state);
  const [firstLoad, setFirstLoad] = useState(false);

  useEffect(() => {
    setFirstLoad(true);

    if (user !== null && (user.favorite_unit || null) !== null) {
      dispatch(UnitCreators.getUnitsRequest({ page: 1, unitName: user.favorite_unit, isCumulative: true }));
    } else {
      dispatch(UnitCreators.getUnitsRequest({ page: 1, isCumulative: true }));
    }
  }, [user]);

  useEffect(() => {
    if (firstLoad === true && units.length > 0) {
      setFirstLoad(false);

      if (user?.favorite_unit) {
        form.setFieldsValue({ favorite_unit: user.favorite_unit || null });
      }
    }
  }, [units]);

  const handleChangeFavoriteUnit = (target: any) => {
    if ((target || null) !== null && 'value' in target) {
      dispatch(AuthCreators.updateFavoriteUnitRequest({ favorite_unit: target.value }));

      return form.setFieldsValue({ favorite_unit: target.value });
    }

    dispatch(AuthCreators.updateFavoriteUnitRequest({ favorite_unit: null }));
    dispatch(UnitCreators.getUnitsRequest({ page: 1, isCumulative: true }));

    return form.setFieldsValue({ favorite_unit: null });
  };

  const handleSearchUnit = (unitName: string) => {
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
        }),
      );
    }
  };

  return (
    <BoxContrasted>
      <Form layout="vertical" form={form}>
        <div className="grid grid-cols-6 gap-4 mt-6">
          <FormItem
            label="Unidade padrão"
            name="favorite_unit"
            tooltip="A unidade padrão é aquela que será selecionada automaticamente ao acessar o painel operacional. Você pode alterá-la sempre que necessário."
            className="col-span-3"
          >
            <DebouncedSelect
              allowClear
              size="middle"
              className="h-fit [&_.ant-select-selector]:!h-fit"
              loading={firstLoad}
              loadingMore={loading}
              onChange={handleChangeFavoriteUnit}
              placeholder="Selecione uma unidade"
              handleLoadMore={handleSearchUnit}
              onPopupScroll={pagination?.is_last_page === false ? onScrollUnitSelect : () => null}
              data={units.map((unit) => ({
                label: unit.name,
                value: unit.id,
                ...unit,
              }))}
              dataRender={(unit) => (
                <div className="flex items-center gap-3 py-2">
                  {(unit.profile_image || null) !== null ? (
                    <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                      <img className="w-full h-full object-cover" src={unit.profile_image} alt={unit.name} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0" />
                  )}
                  <span className="text-sm text-slate-700">{unit.label}</span>
                </div>
              )}
            />
          </FormItem>
        </div>
      </Form>
    </BoxContrasted>
  );
};
