import styled, { css } from 'styled-components';

export const PageHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const RestaurantHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const RestaurantLogo = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const RestaurantInfo = styled.div`
  display: flex;
  flex-direction: column;

  h4 {
    margin: 0;
  }
`;

export const RestaurantAddress = styled.span`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
    color: ${theme.colors.textGraySecondary};
  `}
`;

export const BoardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors['zinc-200']};
`;

export const NavTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const NavItem = styled.button<{ active?: boolean; disabled?: boolean }>`
  background: none;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 0.25rem 0;

  ${({ theme, active, disabled }) => css`
    font-size: ${theme.font.sizes.medium};
    font-weight: ${active ? theme.font.bold : theme.font.normal};
    color: ${disabled
      ? theme.colors['zinc-200']
      : active
      ? theme.colors.primary
      : theme.colors.textGrayPrimary};
    border-bottom: ${active ? `2px solid ${theme.colors.primary}` : '2px solid transparent'};
  `}
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  margin-top: 1rem;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  width: 100%;
  max-width: 20rem;

  padding: 0.375rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors['zinc-200']};
  border-radius: ${({ theme }) => theme.border.radius.normal};

  ${({ theme }) => css`
    color: ${theme.colors.textGraySecondary};
  `}
`;

export const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const TabButton = styled.button<{ active?: boolean }>`
  padding: 0.45rem 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors['zinc-200']};
  border-radius: ${({ theme }) => theme.border.radius.normal};
  background: ${({ theme, active }) =>
    active ? theme.colors.lightSecondary : theme.colors.white};
  cursor: pointer;

  ${({ theme, active }) => css`
    font-size: ${theme.font.sizes.small};
    font-weight: ${active ? theme.font.bold : theme.font.normal};
    color: ${active ? theme.colors.primary : theme.colors.textGrayPrimary};

    &:hover {
      border-color: ${theme.colors.darkSecondary};
    }
  `}
`;

export const SummaryLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  margin: 1.25rem 0 0.75rem;

  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
    color: ${theme.colors.textGraySecondary};

    .visualizing b {
      font-weight: ${theme.font.bold};
      color: ${theme.colors.textGrayPrimary};
    }
  `}
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  padding-bottom: 1rem;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;

  padding: 3rem 1rem;

  ${({ theme }) => css`
    strong {
      font-size: ${theme.font.sizes.medium};
      color: ${theme.colors.textGrayPrimary};
    }

    span {
      font-size: ${theme.font.sizes.small};
      color: ${theme.colors.textGraySecondary};
    }
  `}
`;
