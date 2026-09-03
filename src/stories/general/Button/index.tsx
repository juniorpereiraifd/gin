import { FunctionComponent } from 'react';
import { Button as BaseButton, ButtonProps as BaseButtonProps } from 'antd';

export type ButtonProps = BaseButtonProps;

export const Button: FunctionComponent<ButtonProps> = (props) => {
  const {
    size = 'middle',
    variant = 'solid',
    color = 'default',
    ...rest
  } = props;

  return <BaseButton size={size} variant={variant} color={color} {...rest} />;
};
