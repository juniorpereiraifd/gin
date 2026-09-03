import styled, { css } from 'styled-components';

export const HistoryCard = styled.div`
  width: 100%;
  min-height: 8.2rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .withoutData {
    margin: auto;
  }

  ${({ theme }) => css`
    background: ${theme.colors.grayLight};
    border-radius: ${theme.border.radius.medium};

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    padding: ${theme.font.sizes.medium};

    gap: 0.625rem;

    .first-line {
      width: 100%;

      display: flex;
      align-items: flex-start;
      justify-content: flex-start;

      gap: 0.625rem;

      .flag-product {
        padding: 0.3rem 0.312rem;

        min-width: 5.7rem;
        min-height: 1.5rem;

        border-radius: ${theme.border.radius.normal};

        font-style: normal;
        font-weight: ${theme.font.normal};
        font-size: ${theme.font.sizes.xsmall};
        line-height: ${theme.font.sizes.large};

        color: ${theme.colors.white};

        background: ${theme.colors.midContrast};
      }
    }

    .second-line {
      width: 100%;

      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      p {
        margin: 0;

        font-style: normal;
        font-weight: ${theme.font.normal};
        font-size: ${theme.font.sizes.xsmall};
        line-height: ${theme.font.sizes.medium};

        color: ${theme.colors.highContrast};
      }
    }
  `}
`;
