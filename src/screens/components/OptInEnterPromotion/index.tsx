import { SelectedPromotion } from './SelectedPromotion';
import { useScreenSize } from 'src/hooks/useScreenSize';
import { useDispatch, useSelector } from 'react-redux';
import { PromotionCreators } from 'src/store/modules/promotions/actions';
import type { UnitParticipating } from 'src/store/modules/promotions/reducer';
import type { RootType } from 'src/store/modules/rootReducer';
import { Button } from 'src/stories/general/Button';
import { Event, getDeviceType, getFormattedDate } from 'src/utils/helpers';
import { Modal } from 'src/stories/feedback/Modal';
import * as S from './styles';

export function OptInEnterPromotion() {
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();

  const {
    hall: { unity },
    promotions: { selectedPromotion, optInEnterPromotionModal, isLoading },
  } = useSelector((state: RootType) => state);

  if (!selectedPromotion) return null;

  const startDate = getFormattedDate(selectedPromotion.start_at as string);
  const finalDate = getFormattedDate(selectedPromotion.end_at as string);
  const itemsAmount = selectedPromotion.unit.rescue_limit;

  const sendGAEvent = (name: string) =>
    Event.push(name, {
      unit_id: unity?.id,
      promotion_id: selectedPromotion?.id,
      device_type: getDeviceType(),
    });

  const answerIfIsAParticipant = (participating: UnitParticipating) => {
    if (unity?.id) {
      sendGAEvent(participating === 'accepted' ? 'admin_promotion_accept' : 'admin_promotion_dont_accept');

      dispatch(
        PromotionCreators.setUnitParticipatingInThePromotionRequest({
          unitId: unity?.id,
          promotionId: selectedPromotion.id,
          participating,
        })
      );
    }
  };

  return (
    <Modal title={<S.Title>Promoção Get In</S.Title>} open={optInEnterPromotionModal} footer={null}>
      <S.Promotion>
        {selectedPromotion && <SelectedPromotion promotion={selectedPromotion} />}

        <div className="data" title={selectedPromotion.title}>
          {selectedPromotion?.message && <S.PromotionItem>{selectedPromotion.message}</S.PromotionItem>}

          <S.PromotionItem>
            <strong>Período da promoção:</strong> {startDate} - {finalDate}
          </S.PromotionItem>

          {selectedPromotion?.item && (
            <S.PromotionItem>
              <strong>Item da promoção:</strong> {selectedPromotion?.item}
            </S.PromotionItem>
          )}

          {itemsAmount && (
            <S.PromotionItem>
              <strong>Quantidade de bonificação:</strong> {itemsAmount} unidades
            </S.PromotionItem>
          )}
        </div>
      </S.Promotion>

      <S.Description>
        Essa promoção é uma iniciativa do <strong>Get In</strong> junto aos nossos parceiros. Participando da promoção,
        o banner acima será exibido no seu cardápio e seus clientes poderão aproveitar!
      </S.Description>

      <S.ButtonsWrapper isMobile={isMobile}>
        <Button variant="outlined" disabled={isLoading} onClick={() => answerIfIsAParticipant('rejected')}>
          Não quero participar
        </Button>

        <Button disabled={isLoading} onClick={() => answerIfIsAParticipant('accepted')}>
          Aceito participar
        </Button>
      </S.ButtonsWrapper>
    </Modal>
  );
}
