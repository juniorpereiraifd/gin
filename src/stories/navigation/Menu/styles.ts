import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  line-height: 1;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;

  ${({ theme }) => css`
    > span {
      font-size: ${theme.font.sizes.small};
      font-weight: ${theme.font.normal};
      color: ${theme.colors.secondary};
      line-height: 1;
    }

    > svg {
      color: ${theme.colors.secondary};
    }

    &:hover {
      > span {
        color: ${theme.colors.brandSecondaryPure};
      }

      > svg {
        color: ${theme.colors.brandSecondaryPure};
      }
    }
  `}
`;
