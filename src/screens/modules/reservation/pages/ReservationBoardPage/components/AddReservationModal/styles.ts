import styled, { css } from 'styled-components';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  padding-top: 0.5rem;
`;

export const SectionTitle = styled.div`
  margin-top: 0.5rem;

  ${({ theme }) => css`
    h5 {
      margin: 0;
      font-size: ${theme.font.sizes.medium};
    }
  `}
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Label = styled.label`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
    font-weight: ${theme.font.medium};
    color: ${theme.colors.textGrayPrimary};
  `}
`;

export const ErrorText = styled.p`
  margin: 0;

  ${({ theme }) => css`
    color: #c62828;
    font-size: ${theme.font.sizes.small};
  `}
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;

  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors['zinc-100']};
`;
