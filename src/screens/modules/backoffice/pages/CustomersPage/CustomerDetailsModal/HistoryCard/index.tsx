import dayjs from 'dayjs';
import { Title, Paragraph } from 'src/stories/typography';
import type { ProductOfCustomer } from 'src/store/modules/promotions/reducer';

import * as S from './styles';

interface HistoryCardProps {
  promotion?: ProductOfCustomer;
  withoutData?: boolean;
}

export const HistoryCard = ({ promotion, withoutData }: HistoryCardProps) => {
  const startDate = dayjs(promotion?.start_at).format('DD/MM/YYYY');
  const endDate = dayjs(promotion?.end_at).format('DD/MM/YYYY');

  const tag =
    (promotion?.product === 'menu' && 'cardápio') ||
    (promotion?.product === 'line' && 'fila') ||
    (promotion?.product === 'reservation' && 'reserva') ||
    '';

  return (
    <S.HistoryCard title={promotion?.title}>
      {withoutData ? (
        <Paragraph className="withoutData">
          Não há histórico no momento
        </Paragraph>
      ) : (
        <>
          <div className="first-line">
            <Title level={4}>{promotion?.title}</Title>
            <span className="flag-product">{tag}</span>
          </div>

          <div className="second-line">
            <Title level={6}>
              {promotion?.number_rescued}/{promotion?.number_vouchers}{' '}
              resgate(s)
            </Title>
            <p>
              {startDate} até {endDate}
            </p>
          </div>
        </>
      )}
    </S.HistoryCard>
  );
};
