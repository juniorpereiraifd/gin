import styled, { css } from 'styled-components';
import { Drawer, Layout } from 'antd';

export const Sider = styled(Layout.Sider)`
  ${({ theme }) => css`
    height: 100%;
    background-color: ${theme.colors.white};
    border-right: 1px solid ${theme.colors.border};

    .ant-layout-sider-trigger {
      background-color: ${theme.colors.white};
      border-top: 1px solid ${theme.colors.border};
      border-right: 1px solid ${theme.colors.border};

      svg {
        color: ${theme.colors.brandSecondaryPure};
      }
    }
  `}
`;

export const SiderDrawer = styled(Drawer)`
  .ant-drawer-header {
    display: none;
  }
  .ant-drawer-body {
    padding: 0;
  }
`;

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
  position: fixed;
  bottom: 48px;
  padding: 0.625rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.625rem;

  transition: all 0.2s;

  ${({ theme, isSiderCollapsed }) => css`
    width: ${isSiderCollapsed ? '80px' : '255px'};

    border-top: 1px solid ${theme.colors.border};
    border-right: 1px solid ${theme.colors.border};
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

export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 6.25rem;
  cursor: pointer;
  h4 {
    text-align: center;
  }

  b {
    margin-top: 0.625rem;
  }
`;
