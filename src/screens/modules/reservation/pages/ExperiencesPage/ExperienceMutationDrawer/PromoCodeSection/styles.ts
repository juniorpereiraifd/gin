import styled, { css } from 'styled-components';

export const PromoCodeActions = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    border-left: 1px solid ${theme.colors.neutralLight};
  `}
`;

export const DeletePromoCodeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  ${({ theme }) => css`
    background-color: ${theme.colors.white};

    transition: background-color 0.2s;

    > .delete-trigger {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      padding-inline: 0.625rem;
      > svg {
        color: ${theme.colors.primary};
      }
    }

    &:hover {
      background-color: rgba(232, 57, 63, 0.1);
    }
  `}
`;
