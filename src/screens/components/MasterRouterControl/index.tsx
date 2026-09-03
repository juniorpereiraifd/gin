import { Fragment, FunctionComponent, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';

type MasterRouterControlProps = {
  yes?: ReactNode;
  no?: ReactNode;
};

export const MasterRouterControl: FunctionComponent<MasterRouterControlProps> = (props) => {
  const { yes, no } = props;
  const {
    auth: { user },
  } = useSelector((state: RootType) => state);

  return <Fragment>{user?.master === true ? yes : no}</Fragment>;
};
