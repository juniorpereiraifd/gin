import IntlCurrencyInput from 'react-intl-currency-input';
import styled, { css } from 'styled-components';

export const InputCurrencyCustom = styled(IntlCurrencyInput)`
  ${({ theme, disabled }) => css`
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.85);
    margin: 0;
    width: 100%;
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    position: relative;
    display: inline-block;
    cursor: text;
    border-radius: 6px;
    padding: 4px 11px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(217, 217, 217);

    pointer-events: ${disabled ? 'none' : 'auto'};

    background-color: ${disabled ? '#F2F2F2' : '#FFFFFF'};

    font-family: ${theme.font.family};

    &:focus {
      border-color: #333333;
      outline: 0;
      -webkit-box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.2);
      box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.2);
    }

    &:hover {
      border-color: #333333;
    }

    .ant-picker {
      border-color: #333333 !important;
    }
  `};
`;
