import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Creators as ComunicationCreators } from 'src/store/modules/comunication/actions';
import { Tabs } from 'src/stories/display/Tabs';
import { ComunicationSettingsSection } from 'src/components/Comunication/CommunicationSettingsSection';
import { ComunicationSettingsSwitches } from 'src/components/Comunication/CommunicationSettingsSwitches';
import * as S from './styles';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';

const TabKeysComunication = {
  COMMUNICATION_SETTINGS: 'communication_settings',
};

export const ComunicationNpsPage = () => {
  const dispatch = useDispatch();
  const { unitId } = useParams<'nps.comunication'>();

  const [tab, setTab] = useState(TabKeysComunication.COMMUNICATION_SETTINGS);

  useEffect(() => {
    dispatch(
      ComunicationCreators.getSettingsMessageRequest({
        unitId,
      })
    );
  }, [dispatch]);

  return (
    <PageContainer>
      <PageTitle>Comunicação</PageTitle>
      <S.Wrapper>
        <Tabs onTabClick={(tab: string) => setTab(tab)} defaultActiveKey={tab}>
          <S.Pane
            tab="Configurações"
            key={TabKeysComunication.COMMUNICATION_SETTINGS}
          >
            <ComunicationSettingsSection>
              <ComunicationSettingsSwitches
                title="Pesquisa de satisfação"
                service="nps"
                unitId={unitId}
                whatsapp={{
                  enabled: true,
                  price: import.meta.env.VITE_WHATSAPP_COMMUNICATION_NPS_PRICE,
                }}
              />
            </ComunicationSettingsSection>
          </S.Pane>
        </Tabs>
      </S.Wrapper>
    </PageContainer>
  );
};
