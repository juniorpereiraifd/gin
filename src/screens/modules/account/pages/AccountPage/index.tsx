import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { Tabs, TabsProps } from 'src/stories/display/Tabs';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { PageContainer } from 'src/components/PageContainer';
import { Button } from 'src/stories/general/Button';
import { Modal } from 'src/stories/feedback/Modal';
import { ModuleControl } from './ModuleControl';
import Address from './Address';
import { Amenities } from './Amenities';
import Informations from './Informations';
import Photos from './Photos';
import * as S from './styles';

export const AccountPage = () => {
  const { unitId } = useParams<'account'>();
  const tabAccount = localStorage.getItem('account-tab-selected');
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const {
    auth: { user },
  } = useSelector((state: RootType) => state);

  const accountTabs: TabsProps['items'] = [
    {
      key: 'general',
      label: 'Geral',
      children: <Informations />,
    },
    {
      key: 'address',
      label: 'Endereço',
      children: <Address />,
    },
    {
      key: 'photos',
      label: 'Fotos',
      children: <Photos />,
    },
    {
      key: 'amenities',
      label: 'Facilidades',
      children: <Amenities unitId={unitId} />,
    },
    ...(user?.master === true
      ? [
          {
            key: 'module-control',
            label: 'Controle de módulos',
            children: <ModuleControl />,
          },
        ]
      : []),
  ];

  const handleTabClick = (tab: string) => localStorage.setItem('account-tab-selected', tab);

  useEffect(() => {
    return () => {
      localStorage.setItem('account-tab-selected', '');
    };
  }, []);

  return (
    <PageContainer sideColumn>
      <PageTitle>Conta</PageTitle>
      <S.Content>
        <Tabs
          onTabClick={(tab: string) => handleTabClick(tab)}
          defaultActiveKey={tabAccount || 'general'}
          items={accountTabs}
        />
      </S.Content>
      <S.SideColumn>
        <Button onClick={() => setIsStatusModalVisible(true)}>Entenda os status da unidade</Button>
        <Modal
          open={isStatusModalVisible}
          onCancel={() => setIsStatusModalVisible(false)}
          title={<S.StatusModalTitle>Entenda os status da unidade</S.StatusModalTitle>}
          footer={null}
        >
          <S.TextStatus>
            <S.Tag>Listado</S.Tag> Restaurante está ativo, visível nas buscas do site e aplicativo.
            <br /> exemplo:
            <S.ColorStatus> unidades disponíveis para reserva e fila (widget e app e site).</S.ColorStatus>
          </S.TextStatus>
          <S.TextStatus>
            <S.Tag>Não-listado</S.Tag> Restaurante está ativo, com <b>widget ativo</b>, porém <b>não fica visível</b>{' '}
            nas buscas do site e aplicativo.
            <br /> exemplo:
            <S.ColorStatus> unidade teste Get-In, unidade em fase de implementação.</S.ColorStatus>
          </S.TextStatus>
          <S.TextStatus>
            <S.Tag>Suspenso</S.Tag> Restaurante não fica visível nas buscas do site e aplicativo, widget fica
            desabilitado, unidade fica bloqueada para uso no admin e perde o acesso ao painel (manager reserva e fila)
            <br /> exemplo:
            <S.ColorStatus> unidade com pagamento em atraso, unidade com contrato cancelado.</S.ColorStatus>
          </S.TextStatus>
          <S.TextStatus>
            <S.Tag>Desativado</S.Tag> Unidade está desativada em todas suas funções.
            <br /> exemplo:
            <S.ColorStatus>
              {' '}
              unidade duplicada, unidade criada errada pela Get In, unidade não existe mais, unidade faliu.
            </S.ColorStatus>
          </S.TextStatus>
        </Modal>
      </S.SideColumn>
    </PageContainer>
  );
};
