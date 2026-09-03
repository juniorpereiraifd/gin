import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as UnitCreators } from 'src/store/modules/unity/actions';
import { Module } from 'src/store/modules/unity/reducer';
import { Title } from 'src/stories/typography';
import { Switch } from 'src/stories/entry/Switch';
import Loading from 'src/stories/feedback/Loading';
import * as S from './styles';
import { BoxContrasted } from 'src/components/BoxContrasted';

export const ModuleControl = () => {
  const dispatch = useDispatch();
  const {
    unity: { savingModuleControl, unitModules },
  } = useSelector((state: RootType) => state);
  const [moduleValues, setModuleValues] = useState<Module>(unitModules);

  useEffect(() => {
    setModuleValues(unitModules);
  }, [unitModules]);

  const handleUpdateModule = (value: boolean, module: keyof Module) => {
    setModuleValues((prev) => ({ ...prev, [module]: value }));

    dispatch(
      UnitCreators.updateUnitModuleRequest({
        module: module,
        enabled: value,
      })
    );
  };

  return (
    <BoxContrasted>
      <S.TitleWrapper>
        <Title level={3}>Controle de módulos</Title>
        {savingModuleControl === true && (
          <S.LoadingWrapper>
            <Loading size={16} /> Salvando informações...
          </S.LoadingWrapper>
        )}
      </S.TitleWrapper>
      <S.FieldsWrapper>
        <Switch
          label="Reservas"
          checked={moduleValues.reservation ?? false}
          onChange={(checked) => handleUpdateModule(checked, 'reservation')}
        />
        <Switch
          label="Fila de espera"
          checked={moduleValues.line ?? false}
          onChange={(checked) => handleUpdateModule(checked, 'line')}
        />
        <Switch
          label="Cardápios"
          checked={moduleValues.menu ?? false}
          onChange={(checked) => handleUpdateModule(checked, 'menu')}
        />
        <Switch
          label="Marketing"
          checked={moduleValues.marketing ?? false}
          onChange={(checked) => handleUpdateModule(checked, 'marketing')}
        />
        <Switch
          label="Avaliações"
          checked={moduleValues.nps ?? false}
          onChange={(checked) => handleUpdateModule(checked, 'nps')}
        />
        <Switch
          label="Giftback"
          checked={moduleValues.voucher ?? false}
          onChange={(checked) => handleUpdateModule(checked, 'voucher')}
        />
      </S.FieldsWrapper>
    </BoxContrasted>
  );
};
