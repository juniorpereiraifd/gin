import styled, { css } from 'styled-components';

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 1.25rem;
`;

export const Text = styled.p`
  margin: 0;

  ${({ theme }) => css`
    font-size: ${theme.font.sizes.xsmall};
    color: ${theme.colors.highContrast};
  `}
`;

export const Footer = styled.div`
  width: 100%;

  margin-top: 1.25rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  gap: 1rem;

  ${({ theme }) => css`
    > button {
      width: 100%;

      border-radius: ${theme.border.radius.medium};

      transition: 350ms;
    }
  `}
`;
