import { HTMLAttributes } from 'react';
import { PriceTag3 as PriceTag3Fill } from '@styled-icons/remix-fill/PriceTag3';
import type { CustomerData } from 'src/store/modules/promotions/reducer';

import { theme } from 'src/styles/theme';
import * as S from './styles';
import { Skeleton } from 'antd';

interface CustomerCardProps extends HTMLAttributes<HTMLDivElement> {
  customer?: CustomerData;
  tagName?: 'menu' | 'line' | 'reservation';
  withLoading?: boolean;
}

export function CustomerCard({
  customer,
  tagName,
  withLoading = false,
  ...props
}: CustomerCardProps) {
  const tag =
    (tagName === 'menu' && 'cardápio') ||
    (tagName === 'line' && 'fila') ||
    (tagName === 'reservation' && 'reserva') ||
    '';

  return (
    <S.CustomerCard {...props} withLoading={withLoading}>
      {withLoading ? (
        <Skeleton active />
      ) : (
        <>
          <S.Title>{customer?.name}</S.Title>

          <S.Quantity>{customer?.participants} cadastro(s)</S.Quantity>

          <S.TagWrapper>
            {tagName && <S.Tag>{tag}</S.Tag>}

            {customer?.status === 'active' && (
              <PriceTag3Fill
                size={22}
                color={theme.colors.primary}
                title="Cliente ativo"
              />
            )}
          </S.TagWrapper>
        </>
      )}
    </S.CustomerCard>
  );
}
