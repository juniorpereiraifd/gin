import { FunctionComponent, useEffect, useState } from 'react';
import { Button, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Creators as LayoutCreators } from 'src/store/modules/layout/actions';
import { Copy } from '@styled-icons/fluentui-system-regular/Copy';
import { BarChartFill } from '@styled-icons/bootstrap/BarChartFill';
import { CalendarToday } from '@styled-icons/material-outlined';
import { PeopleOutline } from '@styled-icons/material-outlined/PeopleOutline';
import { BookOpen } from '@styled-icons/boxicons-regular/BookOpen';
import { Campaign } from '@styled-icons/material-outlined/Campaign';
import { EmojiLaughing } from '@styled-icons/bootstrap/EmojiLaughing';
import { Gift } from '@styled-icons/boxicons-regular/Gift';
import { Store } from '@styled-icons/boxicons-regular/Store';
import { UserCircle } from '@styled-icons/boxicons-regular/UserCircle';
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

const items = [
  {
    key: 'dashboard',
    label: 'Relatórios',
    icon: <BarChartFill size={14} />,
    children: [
      {
        key: 'dashboard/flow',
        label: 'Fluxo de clientes',
      },
      {
        key: 'dashboard/sales',
        label: 'Vendas',
      },
      {
        key: 'dashboard/communication',
        label: 'Comunicação',
      },
      {
        key: 'dashboard/nps',
        label: 'Avaliações',
      },
    ],
  },
  {
    key: 'reservation',
    label: 'Reservas',
    icon: <CalendarToday size={14} />,
    children: [
      {
        key: 'reservation/halls',
        label: 'Salões',
      },
      {
        key: 'reservation/experiences',
        label: 'Experiências',
      },
      {
        key: 'reservation/transactions',
        label: 'Transações',
      },
      {
        key: 'reservation/special-dates',
        label: 'Datas especiais',
      },
      {
        key: 'reservation/blocks',
        label: 'Bloqueios',
      },
      {
        key: 'reservation/widgets',
        label: 'Widget de reserva',
      },
      {
        key: 'reservation/custom',
        label: 'Personalizar formulário de reserva',
      },
      {
        key: 'reservation/comunication',
        label: 'Comunicação',
      },
      {
        key: 'reservation/settings',
        label: 'Ajustes',
      },
    ],
  },
  {
    key: 'line',
    label: 'Fila de espera',
    icon: <PeopleOutline size={14} />,
    children: [
      {
        key: 'line/comunication',
        label: 'Comunicação',
      },
      {
        key: 'line/settings',
        label: 'Ajustes',
      },
    ],
  },
  {
    key: 'menu',
    label: 'Cardápios',
    icon: <BookOpen size={14} />,
    children: [
      {
        key: 'menus',
        label: 'Meus cardápios',
      },
      {
        key: 'menus/banners',
        label: 'Banners',
      },
      {
        key: 'menus/settings',
        label: 'Ajustes',
      },
    ],
  },
  {
    key: 'marketing',
    label: 'Marketing',
    icon: <Campaign size={14} />,
    children: [
      {
        key: 'marketing/campaigns',
        label: 'Campanhas',
      },
      {
        key: 'marketing/customers',
        label: 'Clientes',
      },
      {
        key: 'marketing/settings',
        label: 'Ajustes',
        master: true,
      },
    ],
  },
  {
    key: 'nps',
    label: 'Avaliações',
    icon: <EmojiLaughing size={14} />,
    children: [
      {
        key: 'nps/personalization',
        label: 'Personalizar',
      },
      {
        key: 'nps/comunication',
        label: 'Comunicação',
      },
    ],
  },
  {
    key: 'voucher',
    label: 'Giftback',
    icon: <Gift size={14} />,
    children: [
      {
        key: 'voucher/list',
        label: 'Meus Giftbacks',
      },
      {
        key: 'voucher/comunication',
        label: 'Comunicação',
      },
      {
        key: 'voucher/settings',
        label: 'Ajustes',
      },
    ],
  },
  {
    key: 'account',
    label: 'Conta',
    icon: <Store size={14} />,
  },
  {
    key: 'users',
    label: 'Usuários',
    icon: <UserCircle size={14} />,
  },
];
