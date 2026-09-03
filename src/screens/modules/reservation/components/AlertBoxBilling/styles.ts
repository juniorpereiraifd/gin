import styled, { css } from 'styled-components';

export const AlertBox = styled.div`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.primary};
    color: ${theme.colors.highContrast};

    svg.warning {
      color: ${theme.colors.warningPure};
    }
  `};

  display: flex;
  justify-content: space-between;
  gap: 1rem;

  padding: 0.625rem;
  border-radius: 8px;

  font-size: 0.75rem;
  text-align: left;

  p {
    margin: 0;
  }
`;
