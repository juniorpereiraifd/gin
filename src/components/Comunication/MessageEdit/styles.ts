import styled, { css } from 'styled-components';
import { Select as CustomSelect, Tooltip } from 'antd';
import ContentEditable from 'react-contenteditable';

type ContentEditableWrapperProps = {
  disabled?: boolean;
  textSize: number;
};

type VariantProps = {
  disabled?: boolean;
};

type ContentSizeDescriptionProps = {
  descriptionSize: number;
  disabled: boolean;
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 1.25rem;

  > strong.title {
    margin-bottom: 1rem;
  }
`;

export const Select = styled(CustomSelect)`
  width: 11.87rem !important;

  ${({ theme }) => css`
    border-radius: ${theme.border.radius.medium} !important;
  `}
`;

export const WrapperSwitch = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 1.25rem;

  > div {
    margin: 0;
  }

  > span {
    margin-left: 1rem;
  }
`;

export const WrapperTextArea = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  > div.ant-form-item {
    margin: 0;
  }

  ${({ theme }) => css`
    background-color: ${theme.colors.stone[50]};

    border: 1px solid ${theme.colors.grayNeutralDark};
    border-radius: 0.37rem;

    padding: 1rem 0.625rem;
  `}
`;

export const TextArea = styled.div`
  width: 100%;
  height: 3.125rem;

  transition: 200ms;

  ${({ theme }) => css`
    background-color: ${theme.colors.white};

    &:hover {
      cursor: text;
    }
  `}
`;

export const WrapperVariants = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  flex-flow: row wrap;
  gap: 0.625rem;
`;

export const ContentVariantsInfo = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 1rem;

  ${({ theme }) => css`
    font-weight: ${theme.font.bold};

    > span.variantText {
      min-width: 10%;
    }
  `}
`;

export const Variant = styled.div<VariantProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0.4rem 0.625rem;

  transition: 250ms;

  ${({ theme, disabled }) => css`
    background-color: ${disabled
      ? theme.colors.monoHighDark
      : theme.colors['slate-500']};

    cursor: ${disabled ? 'not-allowed' : 'pointer'};

    border-radius: 0.37rem;

    > span.name {
      font-size: ${theme.font.sizes.xsmall};
      font-weight: ${theme.font.normal};

      color: ${theme.colors.white};
    }

    &:hover {
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      background-color: ${theme.colors['slate-600']};
    }
  `}
`;

export const Footer = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  margin-top: 1rem;
  gap: 0.625rem;
`;

export const ContentEditableWrapper = styled(
  ContentEditable
)<ContentEditableWrapperProps>`
  width: 100%;
  height: 6.875rem;

  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 0.312rem;

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px transparent;
    background-color: transparent;
  }
  ::-webkit-scrollbar {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  @media (min-width: 1441px) {
    max-width: 104rem;
  }

  ${({ theme, disabled, textSize }) => css`
    caret-color: ${theme.colors.darkGray};
    background-color: ${disabled
      ? theme.colors.backgroundGray
      : theme.colors.white};

    color: ${disabled ? theme.colors.midContrast : theme.colors.black};

    white-space: normal;
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;

    line-height: 1.875rem;
    padding: 0.625rem 1rem;

    border: 1px solid
      ${disabled
        ? theme.colors.gray
        : (textSize < 120 && theme.colors.gray) ||
          (textSize >= 150 && theme.colors.error) ||
          theme.colors.warningPure};

    border-radius: ${theme.border.radius.normal};

    transition: 350ms;

    &:hover {
      border-color: ${disabled
        ? theme.colors.gray
        : (textSize < 120 && theme.colors.gray) ||
          (textSize >= 150 && theme.colors.error) ||
          theme.colors.warningPure};
    }

    &:focus-visible {
      outline: 2px solid
        ${(textSize < 120 && 'rgba(38, 66, 148, 0.3)') ||
        (textSize >= 150 && 'rgba(224, 101, 74, 0.2)') ||
        'rgba(233, 187, 99, 0.3)'};
    }

    > span.variant {
      padding: 0.312rem 0.625rem;
      white-space: nowrap;

      border-radius: 0.37rem;

      background-color: ${disabled
        ? theme.colors.monoHighDark
        : theme.colors['slate-500']};
      color: ${theme.colors.white};
    }
  `}
`;

export const ContentSizeDescription = styled.div<ContentSizeDescriptionProps>`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 0.312rem;

  margin-bottom: 1rem;

  ${({ theme, descriptionSize, disabled }) => css`
    > span.description {
      font-size: ${theme.font.sizes.xsmall};

      color: ${disabled
        ? theme.colors.monoHighDark
        : (descriptionSize < 120 && theme.colors.highContrast) ||
          (descriptionSize >= 150 && theme.colors.error) ||
          theme.colors.warningPure};

      font-weight: ${theme.font.bold};
    }

    > svg {
      color: ${disabled
        ? theme.colors.monoHighDark
        : (descriptionSize < 120 && theme.colors.highContrast) ||
          (descriptionSize >= 150 && theme.colors.error) ||
          theme.colors.warningPure};
    }
  `}
`;

export const TooltipInfo = styled(Tooltip)`
  ${({ theme }) => css`
    color: ${theme.colors.highContrast};
  `}

  margin-left: 0.312rem;

  .ant-tooltip-inner {
    border-radius: 5px;
  }
`;
