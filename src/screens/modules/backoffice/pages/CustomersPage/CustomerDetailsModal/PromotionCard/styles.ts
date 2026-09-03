import styled, { css } from 'styled-components';

export const PromotionCard = styled.div`
  width: 100%;
  min-height: 5.8rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${({ theme }) => css`
    background: ${theme.colors.grayLight};
    border-radius: ${theme.border.radius.medium};

    gap: ${theme.spacings.xsmall};
  `}

  .main-info {
    width: 100%;

    ${({ theme }) => css`
      padding: ${theme.font.sizes.medium} ${theme.font.sizes.medium} 0;
    `}

    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .flags {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;

      gap: 0.312rem;

      span {
        padding: 0.3rem 0.312rem;

        min-width: 5.7rem;
        min-height: 1.5rem;

        ${({ theme }) => css`
          border-radius: ${theme.border.radius.normal};

          font-style: normal;
          font-weight: ${theme.font.normal};
          font-size: ${theme.font.sizes.xsmall};
          line-height: ${theme.font.sizes.large};

          color: ${theme.colors.white};

          &.product {
            background: ${theme.colors.midContrast};
          }

          &.status {
            background: ${theme.colors.primary};
          }
        `}
      }
    }
  }
`;

export const MainInfo = styled.div`
  width: 100%;

  ${({ theme }) => css`
    padding: ${theme.font.sizes.medium} ${theme.font.sizes.medium} 0;
  `}

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Flags = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  gap: 0.312rem;

  span {
    padding: 0.3rem 0.312rem;

    min-width: 5.7rem;
    min-height: 1.5rem;

    ${({ theme }) => css`
      border-radius: ${theme.border.radius.normal};

      font-style: normal;
      font-weight: ${theme.font.normal};
      font-size: ${theme.font.sizes.xsmall};
      line-height: ${theme.font.sizes.large};

      color: ${theme.colors.white};

      &.product {
        background: ${theme.colors.midContrast};
      }

      &.status {
        background: ${theme.colors.primary};
      }
    `}
  }
`;

export const PromotionDescription = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    gap: ${theme.font.sizes.medium};
    padding: 0 ${theme.font.sizes.medium} ${theme.font.sizes.medium};
  `}
`;

export const Line = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.312rem;

  p {
    margin: 0;

    ${({ theme }) => css`
      font-style: normal;
      font-weight: ${theme.font.normal};
      font-size: ${theme.font.sizes.small};
      line-height: ${theme.font.sizes.medium};

      color: ${theme.colors.highContrast};
    `}
  }
`;

export const List = styled.ul`
  ${({ theme }) => css`
    margin-left: ${theme.font.sizes.medium};

    li {
      font-style: normal;
      font-weight: ${theme.font.normal};
      font-size: ${theme.font.sizes.small};
      line-height: ${theme.font.sizes.medium};

      color: ${theme.colors.totalContrast};

      &:not(:first-child) {
        margin-top: 0.312rem;
      }
    }
  `}
`;
