import styled, { css } from 'styled-components';
import { Menu as CustomMenu, Divider as CustomDivider } from 'antd';

export const Menu = styled(CustomMenu)`
  width: 100%;
  flex: 1 1 0;
  min-height: 0;
  border: none;
  overflow-y: auto;
  border-inline-end: none !important;

  ${({ theme }) => css`
    .ant-menu-submenu-title {
      color: ${theme.colors['slate-600']} !important;
    }

    .ant-menu-item {
      color: ${theme.colors['slate-600']};
    }

    .ant-menu-item-selected {
      color: ${theme.colors.brand['500']} !important;
    }

    .ant-menu-item-selected:not(.ant-menu-item-only-child) {
      background-color: ${theme.colors.brand['50']} !important;
    }
  
    .ant-menu-submenu-selected {
      > div {
        background-color: ${theme.colors.brand['50']} !important;
        color: ${theme.colors.brand['500']} !important;
      }
    }

    .ant-menu-item-only-child {
      font-size: ${theme.font.sizes.xsmall} !important;
    }
  `}
`;

type ItemProps = {
  itemDisabled?: boolean;
};

export const Item = styled(CustomMenu.Item)<ItemProps>`
  ${({ theme, itemDisabled }) => css`
    ${itemDisabled &&
    css`
      display: flex;
      align-items: center;
      color: ${theme.colors.darkGray} !important;
      
      > span {
        width: 100%;
        color: ${theme.colors.darkGray} !important;
      }

      &:hover {
        span {
          color: ${theme.colors.midContrast} !important;
        }
      }
    `}
  `}
`;

type SubMenuProps = {
  menuDisabled: boolean;
};

export const Submenu = styled(CustomMenu.SubMenu)<SubMenuProps>`
  ${({ menuDisabled }) => css`

    ${menuDisabled &&
    css`
      > div {
        display: flex;
        align-items: center;

        padding-right: 1rem !important;
      }

      i {
        display: none;
      }
    `}
  `}
`;

export const SubMenuTitle = styled.div`
  .ant-tooltip-inner {
    border-radius: 5px;
  }

  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  
  ${({ theme }) => css`
    &:hover {
      span {
        color: ${theme.colors.midContrast} !important;
      }
    }
    > svg {
      color: ${theme.colors.error};
    }
  `}
`;

export const ImageModal = styled.img`
  width: 100%;
`;

export const Divider = styled(CustomDivider)`
  margin: 0.625rem 0 !important;
`;

export const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem;
`;
