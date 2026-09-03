import styled, { css } from 'styled-components';

export const Bar = styled.div`
  width: 100%;
  height: 3.75rem;
  position: sticky;
  top: 0;
  z-index: 49;
  padding-left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => css`
    background-color: ${theme.colors.brand['700']};
    border-bottom: 1px solid ${theme.colors.border};
  `}

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;
