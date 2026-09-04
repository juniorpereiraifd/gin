import { FunctionComponent, useEffect, useState } from 'react';
import { Button, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Creators as LayoutCreators } from 'src/store/modules/layout/actions';
import { Copy } from '@styled-icons/fluentui-system-regular/Copy';
import { CalendarToday } from '@styled-icons/material-outlined';
import ProfileCard from 'src/stories/general/ProfileCard';
import { RootType } from 'src/store/modules/rootReducer';
import { SideMenu as BaseSideMenu } from 'src/stories/navigation/SideMenu';
import { Module } from 'src/store/modules/unity/reducer';
import { SideMenu } from 'src/screens/components/SideMenu';
import * as S from './styles';

type SideMenuUnitContentProps = {
  unitId: string;
};

export const SideMenuUnitContent: FunctionComponent<SideMenuUnitContentProps> = (props) => {
  const { unitId } = props;
  const dispatch = useDispatch();
  const {
    hall: { loading, unity },
    layout: { isSideMenuOpen, isSideMenuCollapsed },
    unity: { unitModules },
  } = useSelector((state: RootType) => state);
  const [hiddenOptionsSideBar, setHiddenOptionsSideBar] = useState<Array<keyof Module>>([]);
  const hasAllSettingsModules = Object.values(unitModules).every((module) => module !== null);

  useEffect(() => {
    return () => setHiddenOptionsSideBar([]);
  }, []);

  useEffect(() => {
    if (hasAllSettingsModules === true) {
      setHiddenOptionsSideBar(
        Object.keys(unitModules).filter((module) => unitModules[module as keyof Module] === false) as Array<
          keyof Module
        >,
      );
    }
  }, [unitModules, hasAllSettingsModules]);

  const handleOpenSideMenu = () => {
    dispatch(LayoutCreators.setSideMenuOpen(!isSideMenuOpen));
  };

  const handleClickCopyUnitId = () => {
    navigator.clipboard.writeText(unitId);
    notification.success({
      message: 'Código copiado com sucesso!',
      description: `O código (${unitId}) do seu estabelecimento foi copiado.`,
      placement: 'bottomRight',
    });
  };

  return (
    <SideMenu isSideMenuOpen={isSideMenuOpen} handleOpenSideMenu={handleOpenSideMenu}>
      <S.MenuWrapper>
        <ProfileCard
          loading={loading}
          name={isSideMenuCollapsed ? '' : unity?.name}
          logoSize={isSideMenuCollapsed ? 50 : 90}
          cover={loading ? 'Carregando...' : unity?.cover_image ? unity?.cover_image : ''}
          logo={loading ? 'Carregando...' : unity?.profile_image || ''}
        />
        <BaseSideMenu
          baseUrl={`/units/${unitId}/`}
          loading={hasAllSettingsModules === false}
          hiddenOptions={hiddenOptionsSideBar}
          items={items}
        />
        <S.CopyAction isSiderCollapsed={isSideMenuCollapsed}>
          {isSideMenuCollapsed === false && <span className="code">{unitId}</span>}
          <Button icon={<Copy size={14} />} onClick={handleClickCopyUnitId}>
            {isSideMenuCollapsed === false ? 'Copiar código' : 'ID'}
          </Button>
        </S.CopyAction>
      </S.MenuWrapper>
    </SideMenu>
  );
};

// Protótipo: o menu lateral de unidade exibe apenas "Reservas" (item único, sem
// submenu), levando ao board de reservas. Demais módulos ficam ocultos.
const items = [
  {
    key: 'reservation/board',
    label: 'Reservas',
    icon: <CalendarToday size={14} />,
  },
];
