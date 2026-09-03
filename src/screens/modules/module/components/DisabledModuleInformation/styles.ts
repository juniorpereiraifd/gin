import styled, { css, keyframes } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
`;

export const slideInFromBottom = keyframes`
  from {
    transform: translateY(5%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideInFromRightAndBottom = keyframes`
  from {
    transform: translate(5%, 5%);
    opacity: 0;
  }
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
`;

export const Information = styled.div`
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;

  ${({ theme }) => css`
    .lock {
      padding: 0.625rem;
      border-radius: 50%;
      background: ${`linear-gradient(135deg, #000 0%, ${theme.colors.brand[700]} 100%)`};

      svg {
        color: ${theme.colors.white};
      }
    }

    > h1.title {
      font-size: ${theme.font.sizes.xlarge};
      font-weight: ${theme.font.bold};
    }

    .description {
      margin-bottom: 1rem;
      font-size: ${theme.font.sizes.small};
      color: ${theme.colors.highContrast};
    }

    .feature-list {
      li {
        list-style: none;
        margin-bottom: 1rem;

        svg {
          color: ${theme.colors.darkSuccess};
        }

        span {
          color: ${theme.colors.highContrast};
        }
      }
    }

    div.bento-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.25rem;

      div.feature-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        border: 1px solid ${theme.colors['border-medium']};
        background-color: ${theme.colors.white};
        filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05));

        border-radius: 0.5rem;

        div.info {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          padding: 1.5rem 1.5rem 0rem;

          span.title {
            font-size: ${theme.font.sizes.small};
            font-weight: ${theme.font.bold};
            color: ${theme.colors.textGray};
          }

          p.description {
            font-size: ${theme.font.sizes.xsmall};
          }
        }
      }

      div.feature-box:first-child {
        position: relative;
        overflow: hidden;
        grid-column: 1 / 2;
        grid-row: 1 / 3;

        border-top-left-radius: 28px;
        border-bottom-left-radius: 28px;

        div.content {
          width: 250px;
          height: 350px;
          border-top-left-radius: 18px;
          border-top-right-radius: 18px;
          overflow: hidden;
          margin-top: 1rem;
          animation: ${slideInFromBottom} 0.5s ease-out;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
          }
        }
      }

      div.feature-box:first-child::before {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -30%;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(
            50% 50% at 50% 50%,
            ${theme.colors['brand-secondary-lightest']}20,
            transparent
          );
        }

      div.feature-box:nth-child(2) {
        position: relative;
        overflow: hidden;

        div.content {
          width: 100%;
          height: 100px;
          animation: ${slideInFromBottom} 0.5s ease-out;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      div.feature-box:nth-child(2)::before {
          content: '';
          position: absolute;
          top: -50%;
          right: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(
            50% 50% at 50% 50%,
            ${theme.colors['brand-secondary-lightest']}20,
            transparent
          );
        }

      div.feature-box:nth-child(3) {
        position: relative;
        overflow: hidden;

        div.content {
          width: 100%;
          height: 100px;
          animation: ${slideInFromBottom} 0.5s ease-out;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      div.feature-box:last-child {
        position: relative;
        overflow: hidden;
        grid-column: 3 / 4;
        grid-row: 1 / 3;

        border-top-right-radius: 28px;
        border-bottom-right-radius: 28px;

        div.content {
          width: 300px;
          height: 350px;
          position: absolute;
          z-index: 2;
          bottom: 0;
          right: -10%;
          border-top-left-radius: 18px;
          overflow: hidden;
          margin-top: 1rem;
          animation: ${slideInFromRightAndBottom} 0.5s ease-out;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
          }
        }
      }

      div.feature-box:last-child::before {
        content: '';
        position: absolute;
        z-index: 3;
        top: -30%;
        right: -30%;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(
          50% 50% at 50% 50%,
          ${theme.colors['brand-secondary-lightest']}20,
          transparent
        );
      }
    }
  `}
`;
