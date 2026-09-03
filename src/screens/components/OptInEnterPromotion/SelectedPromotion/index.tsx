import type { PromotionPending } from 'src/store/modules/promotions/reducer';
import * as S from './styles';

interface SelectedPromotionProps {
  promotion: PromotionPending;
}

export function SelectedPromotion({ promotion }: SelectedPromotionProps) {
  return (
    <S.PromotionCard
      hasBanner={!!promotion?.banner}
      title={promotion?.title}
      src={promotion?.banner}
      alt={promotion?.title}
    />
  );
}
