import * as S from './styles';

type CurrencyConfig = {
  locale?: string;
  formats?: {
    number?: {
      BRL?: {
        style?: string;
        currency?: string;
        minimumFractionDigits?: number;
        maximumFractionDigits?: number;
      };
    };
  };
};

type CurrencyInputProps = {
  value?: number | string;
  config?: CurrencyConfig;
  currency?: string;
  disabled?: boolean;
  onChange?: (event?: InputEvent, value?: number, maskedValue?: string) => void;
  max?: number;
};

export const CurrencyInput = (props: CurrencyInputProps) => (
  <S.InputCurrencyCustom
    className="currency-input"
    disabled={props.disabled}
    {...props}
  />
);

export default CurrencyInput;
