import React from 'react';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';

const MasterCanSee = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement | null => {
  const { user } = useSelector((state: RootType) => state.auth);

  return user?.master ? children : null;
};

export default MasterCanSee;
