import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MenuCreators } from 'src/store/modules/menu/actions';
import type { RootType } from 'src/store/modules/rootReducer';
import { Tabs } from 'src/stories/display/Tabs';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { PageContainer } from 'src/components/PageContainer';
import Availability from './AvailabilityTab';
import Menu from './EditMenuTab';
import Optionals from './OptionalsTab';
import * as S from './styles';

const TabKeys = {
  MENU: 'menu',
  OPTIONAL: 'optional',
  AVAILABILITY: 'availability',
};

export const EditMenuPage = () => {
  const [tab, setTab] = useState(TabKeys.MENU);
  const dispatch = useDispatch();
  const { menuId } = useParams<'menu.edit'>();

  const {
    menu: { editable, loading },
    hall: { unity: unity_data },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (menuId && unity_data)
      dispatch(MenuCreators.getMenuRequest({ menu_id: menuId }));
  }, [menuId, unity_data, dispatch]);

  return (
    <PageContainer>
      {loading ? (
        <S.SkeletonWrapper>
          <S.CustomSkeleton active />
        </S.SkeletonWrapper>
      ) : (
        <PageTitle>{editable?.title['pt-br']}</PageTitle>
      )}

      <Tabs onTabClick={(tab: string) => setTab(tab)} defaultActiveKey={tab}>
        <S.Pane tab="Cardápio" key={TabKeys.MENU}>
          <Menu menuId={menuId} />
        </S.Pane>

        <S.Pane tab="Opcionais" key={TabKeys.OPTIONAL}>
          <Optionals menuId={menuId} />
        </S.Pane>

        <S.Pane tab="Disponibilidade" key={TabKeys.AVAILABILITY}>
          <Availability menuId={menuId} />
        </S.Pane>
      </Tabs>
    </PageContainer>
  );
};
