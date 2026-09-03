import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Layout, Button, Divider as CustomDivider } from 'antd';

export const Header = styled(Layout.Header)`
  width: 100%;
  height: 3.75rem;
  position: sticky;
  top: 0;
  z-index: 49;
  padding-left: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) => css`
    background-color: ${theme.colors.white};
    border-bottom: 1px solid ${theme.colors.border};
  `}

  @media (max-width: 768px) {
    padding: 0 1.56rem;
  }
`;

type LogoWrapperProps = {
  isSideMenuCollapsed: boolean;
};

export const LogoWrapper = styled.div<LogoWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: all 0.2s;

  ${({ theme, isSideMenuCollapsed }) => css`
    @media (min-width: 1200px) {
      width: ${isSideMenuCollapsed ? '80px' : '255px'};
      border-right: 1px solid ${theme.colors.border};
    }
  `}
`;

export const ActionsGroup = styled.div`
  height: inherit;
  display: flex;
  align-items: center;
  gap: 1.25rem;

  ${({ theme }) => css`
    > span.app-version {
      color: ${theme.colors.highContrast};
      font-size: ${theme.font.sizes.xsmall};
    }
  `}
`;

export const Divider = styled(CustomDivider)`
  ${({ theme }) => css`
    height: 50%;
    border-left-color: ${theme.colors.gray};
  `}
`;

export const MobileActions = styled.div`
  height: inherit;
  display: flex;
  align-items: center;
  gap: 0.625rem;

  > button.support-button {
    padding: 0;
  }
`;

export const DividerDropdown = styled(CustomDivider)`
  margin-block: 0.312rem;
`;

export const MenuNav = styled.div`
  height: 100%;
  display: flex;
  gap: 1.25rem;
`;

export const MenuGroup = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const MenuLink = styled(NavLink)`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    color: ${theme.colors.brandSecondaryPure};
    font-weight: ${theme.font.semiBold};
    position: relative;
    font-size: ${theme.font.sizes.small};
    text-decoration: none;
    text-align: center;
    border-bottom: 2px solid transparent;

    &:hover {
      filter: brightness(1.2);
    }

    &:hover,
    &:focus,
    &:active {
      color: ${theme.colors.brandSecondaryPure};
    }
  `}
`;

export const MenuButton = styled(Button)`
  ${({ theme }) => css`
    height: 100%;
    color: ${theme.colors.brandSecondaryPure};
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.small};
    border: none;
    background-color: transparent;
    padding: 0;
    border-bottom: 2px solid transparent;

    &:hover,
    &:focus {
      color: ${theme.colors.brandSecondaryPure};
      filter: brightness(1.2);
      background-color: transparent;
    }

    &:active,
    &:focus-visible,
    &:focus-within {
      color: ${theme.colors.brandSecondaryPure};
    }
  `}
`;

export const PainelButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  ${({ theme }) => css`
    border-radius: ${theme.border.radius.medium};
    border: 1px solid ${theme.colors.secondaryPure};

    font-size: ${theme.font.sizes.xsmall};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.secondaryPure};

    &:hover,
    &:focus,
    &:active,
    &:focus-visible,
    &:focus-within {
      color: ${theme.colors.secondaryPure};
      border: 1px solid ${theme.colors.secondaryPure};
      box-shadow: 0px 4px 5px rgba(144, 143, 143, 0.3);
      filter: brightness(1.2);
    }
  `}
`;
