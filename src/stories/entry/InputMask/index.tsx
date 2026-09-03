import { Input } from '../Input';
import { InputProps } from 'antd/lib/input';
import ReactInputMask, { Props } from 'react-input-mask';

type InputMaskProps = {
  disabled?: boolean;
} & InputProps &
  Props;

const InputMask = ({ mask, alwaysShowMask, disabled, onChange, value, ...props }: InputMaskProps) => (
  <ReactInputMask
    mask={mask}
    alwaysShowMask={alwaysShowMask}
    onChange={onChange}
    value={value}
    disabled={disabled || false}
  >
    {(inputProps: InputProps) => <Input {...inputProps} {...props} />}
  </ReactInputMask>
);

export default InputMask;
