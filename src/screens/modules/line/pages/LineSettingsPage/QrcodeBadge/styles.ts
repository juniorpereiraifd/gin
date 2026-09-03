import styled, { css } from 'styled-components';

export const Container = styled.div`
  padding: 1rem;

  ${({ theme }) => css`
    background-color: ${theme.colors.white};
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  `}
`;

export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 1.25rem;
`;

export const Text = styled.p`
  font-size: 1rem;
  margin: 0;
`;

export const Footer = styled.div`
  width: 100%;

  margin-top: 1.25rem;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;
