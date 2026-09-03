import { useState } from 'react';
import dayjs from 'dayjs';
import { Title } from 'src/stories/typography';
import type { ProductOfCustomer } from 'src/store/modules/promotions/reducer';

import * as S from './styles';

interface PromotionCardProps {
  promotion: ProductOfCustomer;
}

export function PromotionCard({ promotion }: PromotionCardProps) {
  const [showDescription, setShowDescription] = useState<boolean>(false);

  const startDate = dayjs(promotion.start_at).format('DD/MM/YYYY');
  const endDate = dayjs(promotion.end_at).format('DD/MM/YYYY');

  const tag =
    (promotion.product === 'menu' && 'cardápio') ||
    (promotion.product === 'line' && 'fila') ||
    (promotion.product === 'reservation' && 'reserva') ||
    '';

  const toggleShowDescription = () =>
    setShowDescription((oldValue) => !oldValue);

  return (
    <S.PromotionCard title={promotion.title}>
      <S.MainInfo onClick={toggleShowDescription}>
        <Title level={4}>{promotion.title}</Title>

        <S.Flags>
          <span className="product">{tag}</span>
          {promotion.status === 'active' && (
            <span className="status">ativada</span>
          )}
        </S.Flags>
      </S.MainInfo>

      {showDescription && (
        <S.PromotionDescription>
          <S.Line>
            <Title level={5}>Descrição da promoção:</Title>

            <p>{promotion.message}</p>
          </S.Line>

          <S.List>
            <li>{promotion.number_rescued} resgate(s)</li>
            <li>{promotion.number_registered} cadastro(s)</li>
            <li>{promotion.number_vouchers} voucher(s)</li>
          </S.List>

          <S.Line>
            <p>Data de Início: {startDate}</p>
            <p>Data Final: {endDate}</p>
          </S.Line>
        </S.PromotionDescription>
      )}
    </S.PromotionCard>
  );
}
