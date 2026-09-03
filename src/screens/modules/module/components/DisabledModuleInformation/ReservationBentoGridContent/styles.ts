import styled, { css, keyframes } from 'styled-components';
import { slideInFromBottom } from '../styles';

export const NoShowMiddleContent = styled.div`
  width: 100%;
  animation: ${slideInFromBottom} 0.5s ease-out;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

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

export const ExperienceMiddleContent = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 1.25rem;
  animation: ${slideInFromBottom} 0.5s ease-out;

  ${({ theme }) => css`
    div.reservation,
    div.experience {
      padding: 0.625rem;
      border: 2px solid ${theme.colors.highContrast};
      border-radius: 50%;
    }

    div.money {
      padding: 0.625rem;
      border: 2px solid ${theme.colors.regularWarning};
      border-radius: 50%;
      filter: drop-shadow(0px 0px 10px rgba(127, 211, 132, 0.5));

      svg {
        color: ${theme.colors.regularWarning};
      }
    }

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
          ${theme.colors.regularWarning} 25%,
          ${theme.colors.lightSuccess} 50%,
          ${theme.colors.regularWarning} 75%,
          ${theme.colors.highContrast} 100%
        );
        background-size: 400px 4px;
      }
    }

    div.line.left {
      &::before {
        animation: ${beamAnimation(100, 50, 0)} 1s linear infinite;
      }
    }

    div.line.right {
      &::before {
        animation: ${beamAnimation(0, 50, 100)} 1s linear infinite;
      }
    }

    svg {
      color: ${theme.colors.highContrast};
    }
  `}
`;

export const ContentVideoReserveWithGoogle = styled.div`
  width: 250px;
  height: 350px;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  overflow: hidden;
  position: relative;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
`;
