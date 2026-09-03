import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { Creators as UnitCreators } from 'src/store/modules/unity/actions';
import { routes } from 'src/screens/routes';
import { NewsBanner } from './NewsBanner';
import * as S from './styles';
import { Breadcrumb } from 'src/screens/components/Breadcrumb';
import { SideMenuUnitContent } from './SideMenuUnitContent';

type UnityLayoutProps = {
  children: React.ReactNode;
};

export const UnitLayout = ({ children }: UnityLayoutProps) => {
  const dispatch = useDispatch();
  const { unitId } = useParams<'unit'>();
  const location = useLocation();
  const {
    hall: { unity },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if ((unitId || null) !== null) {
      dispatch(HallCreators.getUnityRequest({ id: unitId, forceUpdate: false }));
    }
  }, [dispatch, unitId]);

  useEffect(() => {
    if (unity && unity.id) {
      dispatch(UnitCreators.getUnitModulesSettingsRequest());
    }
  }, [dispatch, unity]);

  return (
    <div className="h-[calc(100vh-3.75rem)] w-full flex">
      <SideMenuUnitContent unitId={unitId} />
      <div className="w-full overflow-y-auto">
        <S.BodyLayout>
          <Breadcrumb routes={routes} location={location} />
          <S.Content>{children}</S.Content>
        </S.BodyLayout>
      </div>
      <NewsBanner unitId={unity?.id} />
    </div>
  );
};
