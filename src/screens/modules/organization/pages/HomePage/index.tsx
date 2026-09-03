import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UnityCard from 'src/stories/general/UnityCard';
import { Button } from 'src/stories/general/Button';
import Input from 'src/stories/entry/Input';
import { Title } from 'src/stories/typography';
import { Creators as UnityCreators } from 'src/store/modules/unity/actions';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { Creators as ContractCreators } from 'src/store/modules/contract/actions';
import { Creators as LayoutCreators } from 'src/store/modules/layout/actions';
import { Store } from '@styled-icons/boxicons-regular/Store';
import debounce from 'lodash/debounce';
import { RootType } from 'src/store/modules/rootReducer';
import MasterCanSee from 'src/components/MasterCanSee';
import { Whatsapp } from '@styled-icons/fa-brands/Whatsapp';
import { PageTitle } from 'src/stories/typography/PageTitle';
import * as S from './styles';
import { List } from 'antd';
import { PageContainer } from 'src/components/PageContainer';

const statusSuspended = 'suspended';

export const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, data: units, pagination } = useSelector((state: RootType) => state.unity);
  const { user } = useSelector((state: RootType) => state.auth);
  const [showAlertSuspended, setShowAlertSuspended] = useState(false);
  const [unityName, setUnityName] = useState('');
  const [unitNameSearch, setUnitNameSearch] = useState('');
  const [unitIdSearch, setUnitIdSearch] = useState('');

  useEffect(() => {
    dispatch(LayoutCreators.setSideMenuCollapsed(false));
  }, []);

  useEffect(() => {
    dispatch(HallCreators.resetHall());
    dispatch(ContractCreators.resetContractState());
    dispatch(UnityCreators.getUnitsRequest({ page: 1 }));
  }, [dispatch]);

  const searchUnit = useMemo(
    () =>
      debounce(({ unitName, unitId }: { unitName?: string; unitId?: string }) => {
        if (unitName) {
          setUnitNameSearch(unitName);
        }

        if (unitId) {
          setUnitIdSearch(unitId);
        }

        dispatch(UnityCreators.resetUnityData());
        dispatch(
          UnityCreators.getUnitsRequest({
            unitName: unitName,
            unitId: unitId,
            page: 1,
          })
        );
      }, 300),
    [dispatch]
  );

  const handleLoadMore = ({ page, perPage }: { page: number; perPage: number }) => {
    dispatch(
      UnityCreators.getUnitsRequest({
        unitName: unitNameSearch || '',
        unitId: unitIdSearch || '',
        page: page,
        per_page: perPage,
      })
    );
  };

  return (
    <PageContainer className="pb-8">
      <S.Modal title={false} open={showAlertSuspended} footer={false} closable={false}>
        <Title level={3}>Acesso bloqueado</Title>O estabelecimento <b>{unityName}</b> está com acesso bloqueado devido
        ao pagamento em atraso. Por favor, entre em contato com nosso financeiro pelo{' '}
        <b>WhatsApp (11) 91412-5214 via mensagem.</b>
        <S.ButtonModal>
          <Button variant="outlined" onClick={() => setShowAlertSuspended(false)}>
            Voltar
          </Button>
          <Button variant="outlined" onClick={() => setShowAlertSuspended(false)} className="whatsapp">
            <Whatsapp size={25} />
            Enviar WhatsApp
          </Button>
        </S.ButtonModal>
      </S.Modal>
      <S.TitleWrapper>
        <PageTitle>Unidades</PageTitle>
        <MasterCanSee>
          <Button icon={<Store size={16} />} onClick={() => navigate('/units/create')}>
            Nova unidade
          </Button>
        </MasterCanSee>
      </S.TitleWrapper>
      <S.Filters>
        <div className="search-input">
          <label htmlFor="unity-search" className="unity-search">
            Buscar unidade
          </label>
          <Input
            id="unity-search"
            placeholder="Digite o nome, slug, Cód. Estabelecimento ou localidade..."
            onChange={(e) => searchUnit({ unitName: e.target.value })}
          />
        </div>
        {user?.master && (
          <S.WrapperFilterById>
            <Input placeholder="Buscar por ID" onChange={(e) => searchUnit({ unitId: e.target.value })} />
          </S.WrapperFilterById>
        )}
      </S.Filters>
      <List
        dataSource={units}
        className="[&_.ant-spin-nested-loading]:h-[36rem]"
        pagination={{
          current: pagination?.current_page,
          pageSize: pagination?.per_page,
          total: pagination?.total,
          showSizeChanger: true,
          pageSizeOptions: ['12', '15', '30', '50'],
          showTotal: (total) => `Total de ${total} unidades`,
          onChange: (page, perPage) => handleLoadMore({ page, perPage }),
        }}
        loading={loading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        renderItem={(unity) => (
          <List.Item>
            <UnityCard
              loading={loading}
              key={unity.id}
              name={unity.name}
              location={unity.location}
              cover={unity.cover_image}
              logo={unity.profile_image}
              halls={unity.hall}
              status={unity.status}
              href={
                unity.status === statusSuspended && (user?.master ?? false) === false
                  ? undefined
                  : `/units/${unity.id}/dashboard/flow`
              }
              onClick={() => {
                if (unity.status === statusSuspended && (user?.master ?? false) === false) {
                  setUnityName(unity.name);
                  setShowAlertSuspended(true);
                  return;
                }
              }}
            />
          </List.Item>
        )}
      />
    </PageContainer>
  );
};
