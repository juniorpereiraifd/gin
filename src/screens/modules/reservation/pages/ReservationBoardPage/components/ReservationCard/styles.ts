import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding: 1rem 1.25rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors['zinc-200']};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.border.radius.normal};
`;

export const MainRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
`;

export const TimeBlock = styled.div`
  min-width: 4.5rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

export const Time = styled.span`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.xlarge};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.textGrayPrimary};
  `}
`;

export const People = styled.span`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
    color: ${theme.colors.primary};
    font-weight: ${theme.font.bold};
    text-align: center;
  `}
`;

export const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
`;

export const ConfirmedBadge = styled.span`
  padding: 0.1rem 0.5rem;

  ${({ theme }) => css`
    background: ${theme.colors.lightSecondary};
    color: ${theme.colors.primary};
    font-size: ${theme.font.sizes.xxxsmall};
    font-weight: ${theme.font.bold};
    text-transform: uppercase;
    border-radius: ${theme.border.radius.normal};
  `}
`;

export const Subline = styled.span`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
    color: ${theme.colors.textGraySecondary};
  `}
`;

export const HallLine = styled.span`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.medium};
    color: ${theme.colors.textGrayPrimary};
  `}
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors['zinc-100']};
`;

export const MetaLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex-wrap: wrap;

  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
    color: ${theme.colors.textGraySecondary};

    .occasion {
      color: ${theme.colors.textGrayPrimary};
    }

    .note {
      font-style: italic;
    }
  `}
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button<{ danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  padding: 0.375rem 0.625rem;
  border: 1px solid ${({ theme }) => theme.colors['zinc-200']};
  border-radius: ${({ theme }) => theme.border.radius.normal};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  ${({ theme, danger }) => css`
    font-size: ${theme.font.sizes.small};
    font-weight: ${theme.font.medium};
    color: ${danger ? '#c62828' : theme.colors.textGrayPrimary};

    &:hover {
      background: ${({ theme: t }) => t.colors['zinc-100']};
      border-color: ${({ theme: t }) => t.colors.darkSecondary};
    }
  `}

  text-decoration: none;
`;
