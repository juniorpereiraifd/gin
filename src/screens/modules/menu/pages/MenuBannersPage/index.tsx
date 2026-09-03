import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { Tabs } from 'src/stories/display/Tabs';
import * as S from './styles';
import { MenuBannersList } from './MenuBannersList';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';

export const TabKeysMenuBanners = {
  HOME: 'home',
  CONTENT: 'content',
};

export type ParamProps = {
  unity: string;
};

export const MenuBannersPage = () => {
  const [tab, setTab] = useState(TabKeysMenuBanners.HOME);
  const {
    menu: { bannersHome, bannersContent },
  } = useSelector((state: RootType) => state);

  return (
    <PageContainer>
      <PageTitle>Banners do cardápio</PageTitle>
      <Tabs onTabClick={(tab: string) => setTab(tab)} defaultActiveKey={tab}>
        <S.Pane tab="Banners da home" key={TabKeysMenuBanners.HOME}>
          <MenuBannersList banners={bannersHome} type="home" />
        </S.Pane>
        <S.Pane tab="Banners de conteúdo" key={TabKeysMenuBanners.CONTENT}>
          <MenuBannersList banners={bannersContent} type="content" />
        </S.Pane>
      </Tabs>
    </PageContainer>
  );
};
