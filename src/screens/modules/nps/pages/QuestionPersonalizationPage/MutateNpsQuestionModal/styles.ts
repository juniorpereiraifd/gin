import styled, { css } from 'styled-components';
import { Radio as CustomRadio, Select as BaseSelect } from 'antd';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
`;

export const Select = styled(BaseSelect)`
  width: 15rem !important;
`;

export const RadioGroup = styled(CustomRadio.Group)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  gap: 1.5rem;

  margin-top: 1.5rem;

  ${({ theme }) => css`
    > label {
      display: flex;
      align-items: center;
      padding: 1.5rem;

      border-radius: 8px;

      border: 1px solid ${theme.colors.grayLight};

      .ant-radio {
        margin-right: 1rem;
      }
    }

    .ant-radio-wrapper-checked {
      outline: 1px solid ${theme.colors.brand['500']}50;
    }
  `}
`;

export const TitleContent = styled.div`
  display: flex;

  gap: 1rem;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-block: 1rem;
`;

export const WrapperField = styled.div`
  display: flex;

  > div {
    width: 50%;
  }
`;

export const TitleFieldContent = styled.div`
  display: flex;
  flex-direction: column;

  > span {
    ${({ theme }) => css`
      color: ${theme.colors.highContrast};
    `}
  }
`;

export const WrapperSwitch = styled.div`
  display: flex;
  align-items: center;

  > div {
    margin: 0;
  }

  > span {
    margin-left: 1.5rem;
  }
`;

export const Fields = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 1.5rem;

  ${({ theme }) => css`
    .ant-form-item-extra {
      font-size: ${theme.font.sizes.xsmall};
      margin-top: 0.5rem;
    }
  `}
`;

export const FieldsControl = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3rem;
`;

export const OptionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2.4rem;

  ${({ theme }) => css`
    > label.title {
      ::before {
        display: inline-block;
        margin-right: 4px;
        color: ${theme.colors.primary};
        font-size: ${theme.font.sizes.small};
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
      }
    }
  `}
`;

export const DragHandle = styled.div``;

export const Options = styled.div`
  height: 12rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1rem;
  overflow-y: auto;

  ${({ theme }) => css`
    border: 1px solid ${theme.colors.borderFocused};
    border-radius: ${theme.border.radius.normal};
  `}
`;

export const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
    color: ${theme.colors.highContrast};

    padding: 0.5rem 1rem;
    border: 1px solid ${theme.colors.border};
    background-color: ${theme.colors.white};

    > div.left-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  `}
`;

export const OptionActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${({ theme }) => css`
    svg {
      cursor: pointer;

      &:hover {
        color: ${theme.colors.primary};
      }
    }
  `}
`;

export const InputOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Scale = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ScaleField = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;

  ${({ theme }) => css`
    .base-scale-value {
      font-size: ${theme.font.sizes.small};
      color: ${theme.colors.highContrast};
    }

    .separator {
      font-size: ${theme.font.sizes.small};
      color: ${theme.colors.highContrast};
    }
  `}
`;
