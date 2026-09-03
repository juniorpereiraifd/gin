import styled, { css, keyframes } from 'styled-components';
import { slideInFromBottom } from '../styles';

export const RemoteLineContainer = styled.div`
  width: 100%;
  height: 6.25rem;
  animation: ${slideInFromBottom} 0.5s ease-out;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const MenuLineContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: absolute;
  bottom: 15%;
  animation: ${slideInFromBottom} 0.5s ease-out;

  ${({ theme }) => css`
    svg {
      color: ${theme.colors.highContrast};
    }

    > div.menu,
    > div.queue {
      border: 2px solid ${theme.colors.highContrast};
      padding: 0.625rem;
      border-radius: 50%;
    }
  `}
`;

const borderBeam = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const ClockFastContainer = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
  border-radius: 30px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 2px;

  ${({ theme }) => css`
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(
        90deg,
        ${theme.colors.brandSecondaryPure},
        ${theme.colors.brandSecondaryPure},
        ${theme.colors.secondaryChartVariant}80,
        ${theme.colors.brandSecondaryPure},
        ${theme.colors.brandSecondaryPure}
      );
      background-size: 200% 200%;
      animation: ${borderBeam} 2s linear infinite;
    }

    > div.clock-fast {
      position: relative;
      z-index: 1;
      background-color: ${theme.colors.white};
      color: white;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-radius: 30px;
      padding: 0.625rem;
      box-sizing: border-box;

      svg {
        color: ${theme.colors.brandSecondaryPure};
      }
    }
  `}
`;
