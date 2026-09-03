import { FunctionComponent, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWindowSize } from 'react-use';
import { Creators as LayoutCreators } from 'src/store/modules/layout/actions.ts';
import { RootType } from 'src/store/modules/rootReducer.ts';
import * as S from './styles.ts';

type SideMenuProps = {
  handleOpenSideMenu: () => void;
  isSideMenuOpen: boolean;
  children: ReactNode;
};

export const SideMenu: FunctionComponent<SideMenuProps> = (props) => {
  const { handleOpenSideMenu, isSideMenuOpen, children } = props;
  const {
    layout: { isSideMenuCollapsed },
  } = useSelector((state: RootType) => state);
  const dispatch = useDispatch();
  const { width } = useWindowSize();

  const handleCollapseSideMenu = (collapsed: boolean) => {
    dispatch(LayoutCreators.setSideMenuCollapsed(collapsed));
  };

  return width > 1200 ? (
    <S.Sider width={255} collapsible collapsed={isSideMenuCollapsed} onCollapse={handleCollapseSideMenu}>
      {children}
    </S.Sider>
  ) : (
    <S.SiderDrawer width={255} placement="left" onClose={handleOpenSideMenu} open={isSideMenuOpen}>
      {children}
    </S.SiderDrawer>
  );
};
