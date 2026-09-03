import styled, { css } from 'styled-components';

export const Title = styled.h1`
  ${({ theme }) => css`
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.large};
    line-height: 1.56rem;

    color: ${theme.colors.totalBlack};
  `}
`;

export const Description = styled.p`
  margin: 0;

  ${({ theme }) => css`
    font-weight: ${theme.font.medium};
    font-size: 1rem;
    line-height: ${theme.font.sizes.xlarge};
    color: ${theme.colors.highContrast};
  `}
`;

export const Promotion = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    background: ${theme.colors.backgroundGray};
    border-radius: ${theme.border.radius.medium};

    .data {
      display: flex;
      flex-direction: column;
      padding: 0.625rem;
      gap: 0.625rem;
    }
  `}
`;

export const PromotionItem = styled.span`
  ${({ theme }) => css`
    font-weight: ${theme.font.medium};
    font-size: ${theme.font.sizes.xsmall};
    line-height: ${theme.font.sizes.medium};

    color: ${theme.colors.highContrast};

    strong {
      color: ${theme.colors.totalContrast};
    }
  `}
`;

export const ButtonsWrapper = styled.div<{ isMobile: boolean }>`
  display: grid;
  ${({ isMobile }) => css`
    grid-template-columns: repeat(${isMobile ? 1 : 2}, 1fr);
  `};
  place-items: center;
  gap: 0.312rem;

  button {
    padding: 0.625rem 1rem;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
