import styled, { css, keyframes } from 'styled-components';
import { slideInFromBottom } from '../styles';

export const ContentVideo = styled.div`
  width: 300px;
  height: 400px;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  overflow: hidden;
  position: relative;
  animation: ${slideInFromBottom} 0.5s ease-out;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
`;

export const Campaign = styled.div`
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

    > div.email,
    > div.sms {
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

export const Customer = styled.div`
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

    > div.customer-satisfied {
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
