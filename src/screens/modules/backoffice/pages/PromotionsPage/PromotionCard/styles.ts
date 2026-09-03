import { Trash } from '@styled-icons/bootstrap/Trash';
import { Pencil } from '@styled-icons/heroicons-outline/Pencil';
import styled, { css } from 'styled-components';

export const Label = styled.p<{ variant: 'primary' | 'secondary' }>`
  margin: 0;

  ${({ theme, variant }) => css`
    font-style: normal;
    font-weight: ${theme.font.medium};

    font-size: ${variant === 'primary'
      ? theme.font.sizes.medium
      : theme.font.sizes.xsmall};

    line-height: ${variant === 'primary'
      ? theme.font.sizes.xlarge
      : theme.font.sizes.medium};

    color: ${theme.colors.midContrast};
  `}
`;

export const PromotionCard = styled.div<{
  isActive: boolean;
  withLoading: boolean;
}>`
  display: flex;

  width: 100%;
  height: 100%;
  min-height: 9.6rem;

  overflow: hidden;

  ${({ theme, isActive, withLoading }) => css`
    cursor: ${withLoading ? 'not-allowed' : 'pointer'};

    gap: ${theme.spacings.xsmall};

    padding: ${theme.spacings.xsmall};
    background: ${theme.colors.white};

    border-radius: ${theme.border.radius.medium};
    box-shadow: 0 ${theme.border.radius.normal} ${theme.border.radius.medium}
      rgba(0, 0, 0, 0.1);

    opacity: ${isActive ? 'none' : 0.5};
  `}

  img {
    width: 100%;
    height: 100%;

    max-width: 13.95rem;
    max-height: 6.4rem;

    object-fit: cover;
    object-position: center;

    ${({ theme }) => css`
      border-radius: ${theme.border.radius.normal};
    `}
  }
`;

export const DescriptionWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const Description = styled.div`
  display: flex;
  flex-direction: column;

  cursor: initial;

  ${({ theme }) => css`
    gap: ${theme.spacings.xxxsmall};
  `}
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  ${({ theme }) => css`
    gap: ${theme.spacings.xxxsmall};
  `}
`;

export const EditIcon = styled(Pencil)<{ disabled: boolean }>`
  ${({ disabled }) => css`
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
  `}
`;

export const TrashIcon = styled(Trash)<{ disabled: boolean }>`
  ${({ disabled }) => css`
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
  `}
`;
