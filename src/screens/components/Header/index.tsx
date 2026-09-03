import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useWindowSize } from 'react-use';
import { useNavigate, useLocation } from 'react-router-dom';
import { Creators as AuthCreators } from 'src/store/modules/auth/actions';
import { ExternalLinkOutline } from 'styled-icons/evaicons-outline';
import { Menu as MenuIcon } from '@styled-icons/entypo/Menu';
import { User } from '@styled-icons/boxicons-solid/User';
import { Support } from '@styled-icons/boxicons-regular/Support';
import { Creators as LayoutCreators } from 'src/store/modules/layout/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { Menu } from 'src/stories/navigation/Menu';
import Logo from 'src/stories/utils/Logo';
import { toggleOctadeskChat } from 'src/services/octadesk';
import packageJson from 'src/../package.json';
import * as S from './styles';
import { Button } from 'src/stories/general/Button';
import { CircleQuestionMark } from 'lucide-react';

const Header = () => {
  const {
    auth: { user },
    layout: { isSideMenuOpen, isSideMenuCollapsed },
  } = useSelector((state: RootType) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { width } = useWindowSize();
  const isUnitsPage = location.pathname === '/units';
  const isMobile = width <= 1200;

  const goToHome = () => navigate('/units');

  const handleOpenSideMenu = () => {
    dispatch(LayoutCreators.setSideMenuOpen(!isSideMenuOpen));
  };

  const handleLogout = () => dispatch(AuthCreators.logoutRequest());

  const handleHelpClick = () => toggleOctadeskChat();

  const profileItems: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={() => navigate('/profile')}>Configurações de conta</div>,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: <div onClick={handleLogout}>Sair</div>,
    },
  ];

  const profileItemsMobile: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a
          href={`${import.meta.env.VITE_PAINEL_BASE_URL}/reservation?mode=1`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Painel operacional
        </a>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: <div onClick={() => navigate('/units')}>Unidades</div>,
    },
    {
      key: '3',
      label: <div onClick={() => navigate('/backoffice-get-in/crm/promotions')}>Back Office</div>,
    },
    {
      key: '4',
      label: <div onClick={() => navigate('/profile')}>Configurações de conta</div>,
    },
    {
      key: '6',
      label: <div onClick={handleLogout}>Sair</div>,
    },
  ];

  return (
    <S.Header>
      <S.ActionsGroup>
        {isMobile === true && !isUnitsPage && (
          <Button type="text" icon={<MenuIcon size={20} />} onClick={handleOpenSideMenu} />
        )}
        <S.LogoWrapper onClick={goToHome} isSideMenuCollapsed={isSideMenuCollapsed}>
          {isSideMenuCollapsed || isMobile === true ? (
            <img src={`${import.meta.env.VITE_CDN_BASE_URL}/frontend/shared/short-logo.svg`} alt="Getin" />
          ) : (
            <Logo size="large" />
          )}
        </S.LogoWrapper>
        {isMobile === false && (
          <a
            href={`${import.meta.env.VITE_PAINEL_BASE_URL}/reservation?mode=1`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="middle"
              variant="outlined"
              icon={<ExternalLinkOutline size={16} />}
              className="text-slate-600"
            >
              Painel Operacional
            </Button>
          </a>
        )}
      </S.ActionsGroup>
      {isMobile === false ? (
        <S.ActionsGroup>
          <Button onClick={handleHelpClick} variant="outlined" icon={<CircleQuestionMark size={14} />} size="small">
            Ajuda
          </Button>
          <S.Divider type="vertical" />
          {packageJson.version !== undefined && <span className="app-version">{packageJson.version}</span>}
          <Menu username={user?.name} items={profileItems} />
        </S.ActionsGroup>
      ) : (
        <S.MobileActions>
          <Support size={18} className="cursor-pointer" onClick={handleHelpClick} />
          <S.Divider type="vertical" />
          <Dropdown menu={{ items: profileItemsMobile }} trigger={['click']}>
            <User size={18} />
          </Dropdown>
        </S.MobileActions>
      )}
    </S.Header>
  );
};

export default Header;
