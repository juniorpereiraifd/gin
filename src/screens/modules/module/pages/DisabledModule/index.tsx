import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { RootType } from 'src/store/modules/rootReducer';
import { Module, MODULES_KEYS } from 'src/store/modules/unity/reducer';
import Loading from 'src/stories/feedback/Loading';
import { DisabledModuleInformation } from '../../components/DisabledModuleInformation';
import * as S from './styles';

export const DisabledModule: FunctionComponent = () => {
  const { module } = useParams<'module'>();
  const {
    unity: { unitModules },
  } = useSelector((state: RootType) => state);

  if (unitModules[module as keyof Module] === null) {
    return (
      <S.Loading>
        <Loading /> Carregando
      </S.Loading>
    );
  }

  const moduleIsDisabled = getIsModuleDisabled({
    module: module,
    unitModules: unitModules,
  });

  return moduleIsDisabled ? (
    <DisabledModuleInformation module={module as keyof Module} />
  ) : (
    <Navigate to="/units" />
  );
};

type CanSeeThatPageProps = {
  module?: string;
  unitModules: Module;
};

const getIsModuleDisabled = (props: CanSeeThatPageProps): boolean => {
  const { module, unitModules } = props;

  if (
    module !== undefined &&
    MODULES_KEYS.includes(module as any) &&
    unitModules[module as keyof Module] === false
  ) {
    return true;
  }

  return false;
};
