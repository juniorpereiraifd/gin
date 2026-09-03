import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MenuCreators } from 'src/store/modules/menu/actions';
import { Tabs } from 'src/stories/display/Tabs';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { GeneralInformationsForm } from './GeneralInformationsForm';
import { IntegrationsForm } from './IntegrationsForm';
import type { RootType } from 'src/store/modules/rootReducer';

export const MenuSettingsPage = () => {
  const dispatch = useDispatch();
  const {
    hall: { unity },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (unity !== null) {
      dispatch(MenuCreators.getMenuSettingsRequest());
    }
  }, [unity]);

  return (
    <PageContainer>
      <PageTitle>Configurações de cardápio</PageTitle>
      <Tabs
        defaultActiveKey="general"
        destroyInactiveTabPane
        items={[
          {
            key: 'general',
            label: 'Configurações gerais',
            children: <GeneralInformationsForm />,
          },
          {
            key: 'integrations',
            label: 'Integrações',
            children: <IntegrationsForm />,
          },
        ]}
        className="[&_.ant-tabs-nav]:mb-8"
      />
    </PageContainer>
  );
};
