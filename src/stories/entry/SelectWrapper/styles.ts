import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  label {
    position: absolute;
    padding: 0 0.35rem;
    ${({ theme }) => css`
      color: ${theme.colors.black};
      background: ${theme.colors.white};
    `}
    transition: all 0.2s ease-in-out;
    transform-origin: left top;
    cursor: text;
    pointer-events: none;
    transform: translate3d(0, -45.5%, 0) scale(0.9);
    margin-left: 15px;
    font-size: 0.75rem;
    z-index: 10;
  }

  select {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    padding: 0.7rem 0.625rem;
    padding-top: 0.625rem;
    padding-left: 0.625rem;
    padding-right: 1.875rem;
    outline: none;

    background: transparent;
    background-position-x: 244px;

    ${({ theme }) => css`
      font-family: ${theme.font.family};
      font-style: normal;
      font-weight: normal;
      font-size: 1rem;
      border: none;
      width: 100%;

      &::placeholder {
        color: ${theme.colors.midContrast};
        transition: opacity 0.2s cubic-bezier(0.6, 0.04, 0.98, 0.335);
      }

      display: flex;
      align-items: center;
      border: 1px solid ${theme.colors.midContrast};
      border-radius: ${theme.border.radius.medium};

      option {
        background: transparent;
      }
    `}
  }
`;
