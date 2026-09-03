import { Fragment, FunctionComponent, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { Module } from 'src/store/modules/unity/reducer';
import Loading from 'src/stories/feedback/Loading';
import * as S from './styles';

type ModuleRouterControlProps = {
  module: keyof Module;
  allowed: ReactNode;
  notAllowed: ReactNode;
};

export const ModuleRouterControl: FunctionComponent<ModuleRouterControlProps> = (props) => {
  const { module, allowed, notAllowed } = props;
  const {
    unity: { unitModules },
  } = useSelector((state: RootType) => state);

  if (unitModules[module] === null) {
    return (
      <S.Loading>
        <Loading /> Carregando
      </S.Loading>
    );
  }

  return <Fragment>{unitModules[module] === true ? allowed : notAllowed}</Fragment>;
};
