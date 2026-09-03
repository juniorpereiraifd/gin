import styled, { css } from 'styled-components';

export const Section = styled.section`
  ${({ theme }) => css`
    > p.description {
      color: ${theme.colors.highContrast};
      font-size: ${theme.font.sizes.small};
    }
  `};
`;

export const SectorWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
  `};
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;

  margin-bottom: 1.25rem;

  svg {
    margin: 0;
  }
`;
