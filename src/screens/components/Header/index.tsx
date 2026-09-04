import { useDispatch, useSelector } from 'react-redux';
import { useWindowSize } from 'react-use';
import { useNavigate, useLocation } from 'react-router-dom';
import { Creators as LayoutCreators } from 'src/store/modules/layout/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { Menu as MenuIcon } from '@styled-icons/entypo/Menu';
import Logo from 'src/stories/utils/Logo';
import { Button } from 'src/stories/general/Button';
import * as S from './styles';

const Header = () => {
  const {
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
      </S.ActionsGroup>
    </S.Header>
  );
};

export default Header;
