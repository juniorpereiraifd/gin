import styled, { css } from 'styled-components';

export const PromotionCard = styled.img<{ hasBanner: boolean }>`
  display: flex;
  flex-direction: column;

  gap: 0.312rem;

  width: 100%;
  max-width: 34.5rem;
  max-height: 14.2rem;

  object-fit: cover;
  object-position: center;

  margin: 0 auto;

  position: relative;

  ${({ theme, hasBanner }) => css`
    height: ${hasBanner ? '100%' : '14.2rem'};

    background: ${theme.colors.white};

    box-shadow: ${theme.box.shadow};
    border-radius: ${theme.border.radius.medium};
  `}
`;
