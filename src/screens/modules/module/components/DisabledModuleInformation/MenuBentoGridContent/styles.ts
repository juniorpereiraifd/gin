import styled, { css, keyframes } from 'styled-components';
import { slideInFromBottom } from '../styles';

const beamAnimation = (start: number, middle: number, end: number) => keyframes`
  0% {
    background-position: ${start}%;
  }
  50% {
    background-position: ${middle}%;
  }
  100% {
    background-position: ${end}%;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  padding: 1.25rem;
  animation: ${slideInFromBottom} 0.5s ease-out;

  ${({ theme }) => css`
    div.line {
      width: 2.5rem;
      height: 2px;
      position: relative;
      background-color: black;
      overflow: hidden;
      z-index: 1;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        background-image: linear-gradient(
          to right,
          ${theme.colors.highContrast} 0%,
          ${theme.colors.brandSecondaryPure} 25%,
          ${theme.colors.white} 50%,
          ${theme.colors.brandSecondaryPure} 75%,
          ${theme.colors.highContrast} 100%
        );
        background-size: 400px 4px;
        animation: ${beamAnimation(100, 50, 0)} 1s linear infinite;
      }
    }
  `}
`;

export const MenuEdit = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  ${({ theme }) => css`
    border: 2px solid ${theme.colors['border-medium']};
    border-radius: 8px;
    padding: 0.625rem;

    > span.menu-title {
      font-size: ${theme.font.sizes.xsmall};
      font-weight: ${theme.font.bold};
      color: ${theme.colors.highContrast};
    }

    button.ant-switch {
      min-width: 30px !important;
      height: 15px;

      .ant-switch-handle {
        width: 11px;
        height: 11px;
      }
    }

    .ant-switch-checked .ant-switch-handle {
      left: calc(100% - 11px - 2px) !important;
    }

    .switch-label {
      font-size: ${theme.font.sizes.xsmall};
      margin-left: 0.625rem;
    }

    div.switch-content {
      display: flex;
      flex-direction: column;
      gap: 0.31rem;
    }
  `}
`;

const pulseAnimation = keyframes`
  0% {
      transform: scale(1);
      opacity: 0;
  }
  25% {
      opacity: 0.5;
  }
  100% {
      opacity: 0;
      transform: scale(1.3);
  }
`;

export const Menu = styled.div`
  width: 6.87rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.31rem;

  ${({ theme }) => css`
    border: 2px solid ${theme.colors['border-medium']};
    border-radius: 8px;
    padding: 0.625rem;

    > div {
      display: flex;
      align-items: center;
      gap: 0.31rem;
      padding: 0.31rem;
      position: relative;
      border: 1px solid ${theme.colors['border-medium']};
      border-radius: 4px;

      font-size: ${theme.font.sizes.xsmall};
      color: ${theme.colors.highContrast};

      svg {
        color: ${theme.colors.neutralDark};
      }

      ::after {
        content: "";
        position: absolute;
        opacity: 0;
        border-radius: 4px;
        border-color: ${theme.colors.brandSecondaryPure}50;
        border-style: solid;
        border-width: 1px;
        inset: -1px;
        animation: ${pulseAnimation} 1s;
      }
  `}
`;
