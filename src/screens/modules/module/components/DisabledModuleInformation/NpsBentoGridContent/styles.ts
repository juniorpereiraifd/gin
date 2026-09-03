import styled, { css, keyframes } from 'styled-components';
import { slideInFromBottom } from '../styles';
import { Button, ButtonProps } from 'antd';

export const SatisfactionSurvey = styled.div`
  width: 250px;
  height: 350px;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  overflow: hidden;
  margin-top: 1rem;

  ${({ theme }) => css`
    border-top: 10px solid ${theme.colors['gray-700']};
    border-left: 10px solid ${theme.colors['gray-700']};
    border-right: 10px solid ${theme.colors['gray-700']};

    ::before {
      content: '';
      position: absolute;
      left: calc(50% - 17.5%);
      width: 35%;
      height: 20px;
      background-color: ${theme.colors['gray-700']};
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  `}

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    object-position: top;
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

export const Communication = styled.div`
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
      border: 2px solid ${theme.colors.brandSecondaryPure};
      border-radius: 50%;
      filter: drop-shadow(0px 0px 10px ${theme.colors.brandSecondaryPure});

      svg {
        color: ${theme.colors.brandSecondaryPure};
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
          ${theme.colors.brandSecondaryPure} 25%,
          ${theme.colors.white} 50%,
          ${theme.colors.brandSecondaryPure} 75%,
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

export const CustomQuestionContent = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  overflow-y: auto;
  padding: 1.25rem;
  z-index: 4;
  animation: ${slideInFromBottom} 0.5s ease-out;

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

type QuestionProps = {
  isActive: boolean;
  isEditing: boolean;
};

export const Question = styled.div<QuestionProps>`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.625rem 1rem;
  cursor: pointer;

  ${({ theme, isActive, isEditing }) => css`
    ${isActive === false &&
    css`
      opacity: 0.7;
    `}
    ${isEditing &&
    css`
      box-shadow: 0px 3px 7px 0px #3b82f614, 0px 13px 13px 0px #3b82f612,
        0px 28px 17px 0px #3b82f60a, 0px 50px 20px 0px #3b82f603,
        0px 79px 22px 0px transparent;
    `}

    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};

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

    div.main-content {
      display: flex;
      align-items: flex-start;
      gap: 0.625rem;
    }

    div.question-info {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;

      span.title {
        text-align: start;
        font-size: ${theme.font.sizes.xsmall};
        font-weight: ${theme.font.bold};
        color: ${theme.colors['slate-700']};
        line-height: 1;
      }

      span.question-type {
        width: fit-content;
        padding-inline: 0.5rem;
        font-size: ${theme.font.sizes.xxsmall};
        color: ${theme.colors['slate-400']};
        background-color: ${theme.colors['slate-100']};
        border-radius: ${theme.borderRadius.sm};
      }
    }

    div.question-settings {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;

      .ant-input {
        font-size: ${theme.font.sizes.xsmall};
      }

      .ant-radio-group {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 0.625rem;
      }

      .ant-radio-button-wrapper {
        border-radius: ${theme.borderRadius.md};
        font-size: ${theme.font.sizes.xsmall};
        padding: 0 0.5rem;
        border: 1px solid ${theme.colors['border-medium']};

        ::before {
          display: none;
        }
      }

      .ant-radio-button-wrapper-checked {
        border-color: ${theme.colors.primary};
      }

      .ant-radio-button-wrapper:nth-child(1) {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
      }

      .ant-radio-button-wrapper:nth-child(2) {
        grid-column: 2 / 3;
        grid-row: 1 / 2;
      }

      .ant-radio-button-wrapper:nth-child(3) {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
      }

      .ant-radio-button-wrapper:nth-child(4) {
        grid-column: 2 / 3;
        grid-row: 2 / 3;
      }
    }
  `}
`;

export const Types = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0.625rem;
  button:nth-child(1) {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  button:nth-child(2) {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }

  button:nth-child(3) {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }

  button:nth-child(4) {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }
`;

type TypeButtonProps = ButtonProps & {
  isActive: boolean;
};

export const TypeButton = styled(Button)<TypeButtonProps>`
  ${({ theme, isActive }) => css`
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.font.sizes.xsmall};

    ${isActive &&
    css`
      border: 1px solid ${theme.colors.primary};
      color: ${theme.colors.primary};
    `}
  `}
`;
