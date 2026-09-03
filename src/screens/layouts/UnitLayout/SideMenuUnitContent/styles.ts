import styled, { css } from "styled-components";

export const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
`;

type CopyActionProps = {
  isSiderCollapsed: boolean;
};

export const CopyAction = styled.div<CopyActionProps>`
  width: 100%;
  flex: 0 0 auto;
  padding: 0.625rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.625rem;

  transition: all 0.2s;

  ${({ theme, isSiderCollapsed }) => css`
    border-top: 1px solid ${theme.colors.border};
    background-color: ${theme.colors.white};

    > .code {
      font-size: ${theme.font.sizes.small};
      color: ${theme.colors.highContrast};
    }

    button {
      width: ${isSiderCollapsed ? '100%' : 'auto'};
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.312rem;
      padding: 0 0.312rem;
      border-radius: ${theme.border.radius.medium};

      font-size: ${theme.font.sizes.xsmall};
    }
  `}
`;