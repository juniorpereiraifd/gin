import styled, { css } from 'styled-components';
import { Drawer, Layout } from 'antd';

export const Sider = styled(Layout.Sider)`
  ${({ theme }) => css`
    min-height: 100vh;
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

export const BodyLayout = styled(Layout)`
  max-width: 1280px;
  display: flex;
  flex-direction: column;
  gap: 1.875rem;
  padding: 1.5rem;
  margin-inline: auto;

  ${({ theme }) => css`
    background-color: ${theme.colors.backgroundContrast};
  `}
`;

export const Content = styled(Layout.Content)`
  width: 100%;
`;

export const TitleWrapper = styled.div`
  display: flex;
  margin-left: -5px;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => css`
    margin-bottom: ${theme.spacings.xxsmall};
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

export const ImageModal = styled.img`
  width: 100%;
`;

export const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
