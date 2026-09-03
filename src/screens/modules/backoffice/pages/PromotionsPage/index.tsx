import { Add } from '@styled-icons/ionicons-outline/Add';
import { PromotionAdditionModal } from './PromotionAdditionModal';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PromotionCreators } from 'src/store/modules/promotions/actions';
import type { PromotionData } from 'src/store/modules/promotions/reducer';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as UnityCreators } from 'src/store/modules/unity/actions';
import { Tabs, TabsProps } from 'src/stories/display/Tabs';
import { Button } from 'src/stories/general/Button';
import { Paragraph } from 'src/stories/typography';
import { getLinkWithHttpsProtocol, notification } from 'src/utils/helpers';
import { PromotionCard } from './PromotionCard';
import { PromotionEditModal } from './PromotionEditModal';
import { PromotionTypeModal } from './PromotionTypeModal';
import { PromotionVisualizationModal } from './PromotionVisualizationModal';
import * as S from './styles';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { PageContainer } from 'src/components/PageContainer';
import { BoxContrasted } from 'src/components/BoxContrasted';

type ExistingPromotionModal = {
  showModal: 'visualization' | 'edition' | '';
  selectedPromotion: PromotionData | null;
};

export type PromotionType = 'get-in' | 'external-link' | '';

export function PromotionsPage() {
  const dispatch = useDispatch();
  const { isLoading, promotions } = useSelector(
    (state: RootType) => state.promotions
  );
  const [tab, setTab] = useState<string>('menus');
  const [promotionType, setPromotionType] = useState<PromotionType>('');
  const [showPromotionTypeModal, setShowPromotionTypeModal] =
    useState<boolean>(false);
  const [showPromotionAddModal, setShowPromotionAddModal] =
    useState<boolean>(false);
  const [existingPromotionModal, setExistingPromotionModal] =
    useState<ExistingPromotionModal>({
      showModal: '',
      selectedPromotion: null,
    });

  const showVisualizationModal =
    existingPromotionModal.showModal === 'visualization' &&
    !!existingPromotionModal.selectedPromotion;

  const showEditionModal =
    existingPromotionModal.showModal === 'edition' &&
    !!existingPromotionModal.selectedPromotion;

  const handleOpenEditModal = (promotion: PromotionData) => {
    if (promotion.status === 'active') {
      setExistingPromotionModal({
        showModal: 'edition',
        selectedPromotion: promotion,
      });
      return;
    }
    notification.warning('Você só pode editar uma promoção ativa', '');
  };

  const promotionsData = promotions.data.length ? (
    promotions.data?.map((promotion) => (
      <PromotionCard
        title={`${promotion.title} - Promoção ${
          promotion.redirect_url ? 'externa' : 'Get In'
        }`}
        key={promotion.id}
        promotion={promotion}
        handleOpenEditModal={() => handleOpenEditModal(promotion)}
        onClick={() => {
          promotion.redirect_url
            ? window.open(
                getLinkWithHttpsProtocol(promotion.redirect_url),
                '__blank'
              )
            : setExistingPromotionModal({
                showModal: 'visualization',
                selectedPromotion: promotion,
              });
        }}
      />
    ))
  ) : (
    <Paragraph>Não há promoções no momento</Paragraph>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'menus',
      label: 'Cardápios',
      children: (
        <BoxContrasted>
          <S.LabelWrapper className="mb-4">
            <S.Label variant="primary">
              Crie e monitore suas promoções abaixo
            </S.Label>

            <Button
              icon={<Add size={20} title="add-icon" />}
              onClick={() => setShowPromotionTypeModal(true)}
            >
              Adicionar promoção
            </Button>
          </S.LabelWrapper>

          <S.ContentWrapper>
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <PromotionCard key={index} withLoading />
                ))
              : promotionsData}
          </S.ContentWrapper>
        </BoxContrasted>
      ),
    },
  ];

  const handleClosePromotionTypeModal = () => {
    setShowPromotionTypeModal(false);
    setPromotionType('');
  };

  const handleCloseExistingPromotionModal = () =>
    setExistingPromotionModal({
      showModal: '',
      selectedPromotion: null,
    });

  useEffect(() => {
    dispatch(UnityCreators.resetUnityData());
    dispatch(PromotionCreators.getPromotionsRequest());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const validPromotionTypes: PromotionType[] = ['get-in', 'external-link'];
    const hasValidPromotionType = validPromotionTypes.includes(promotionType);

    if (hasValidPromotionType) {
      setShowPromotionAddModal(true);
      setShowPromotionTypeModal(false);
    }
  }, [promotionType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageContainer>
      <PageTitle>Promoções</PageTitle>
      <Tabs
        onTabClick={(newTab: string) => {
          if (tab !== newTab) setTab(newTab);
        }}
        defaultActiveKey={tab}
        destroyInactiveTabPane
        items={tabItems}
      />

      <PromotionTypeModal
        showModal={showPromotionTypeModal}
        onCloseModal={handleClosePromotionTypeModal}
        promotionType={{
          value: promotionType,
          setValue: setPromotionType,
        }}
      />

      <PromotionAdditionModal
        showModal={showPromotionAddModal}
        setShowModal={setShowPromotionAddModal}
        promotionType={promotionType}
        handleClosePromotionTypeModal={handleClosePromotionTypeModal}
      />

      <PromotionVisualizationModal
        showModal={showVisualizationModal}
        onCloseModal={handleCloseExistingPromotionModal}
        promotion={existingPromotionModal.selectedPromotion}
      />

      <PromotionEditModal
        showModal={showEditionModal}
        onCloseModal={handleCloseExistingPromotionModal}
        promotion={existingPromotionModal.selectedPromotion}
      />
    </PageContainer>
  );
}
