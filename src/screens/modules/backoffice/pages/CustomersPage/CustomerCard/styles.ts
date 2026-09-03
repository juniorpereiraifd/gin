import styled, { css } from 'styled-components';

export const CustomerCard = styled.div<{ withLoading: boolean }>`
  width: 100%;
  min-height: 5.4rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1rem;

  overflow: hidden;

  ${({ theme, withLoading }) => css`
    cursor: ${withLoading ? 'not-allowed' : 'pointer'};

    background: ${theme.colors.white};

    border: 1px solid ${theme.colors.grayLight};
    border-radius: ${theme.border.radius.medium};
  `}
`;

export const TagWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 1rem;
`;

export const Title = styled.h6`
  width: 100%;
  max-width: 12.5rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ theme }) => css`
    font-style: normal;
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.small};
    line-height: ${theme.font.sizes.xlarge};

    color: ${theme.colors.darkSecondary};
  `}
`;

export const Quantity = styled.span`
  width: 100%;
  max-width: 12.5rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ theme }) => css`
    font-style: normal;
    font-weight: ${theme.font.normal};
    font-size: ${theme.font.sizes.xsmall};
    line-height: ${theme.font.sizes.medium};

    color: ${theme.colors.highContrast};
  `}
`;

export const Tag = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0.3rem 0.312rem;

  min-height: 1.25rem;

  ${({ theme }) => css`
    background: ${theme.colors.midContrast};
    border-radius: ${theme.border.radius.normal};

    font-style: normal;
    font-weight: ${theme.font.normal};
    font-size: ${theme.font.sizes.small};
    line-height: ${theme.font.sizes.large};

    color: ${theme.colors.white};
  `}
`;
