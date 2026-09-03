import styled, { css } from 'styled-components';

export const Sector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-block: 0.625rem;

  > span.title {
    margin-bottom: 0.625rem;
    font-weight: ${({ theme }) => theme.font.bold};
  }
`;

export const WrapperSwitch = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
`;

export const SwitchLabelDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.312rem;

  ${({ theme }) => css`
    .label-description {
      color: ${theme.colors.highContrast};
      font-size: ${theme.font.sizes.xsmall};
    }
  `}
`;
