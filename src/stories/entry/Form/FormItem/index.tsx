import { FunctionComponent, PropsWithChildren } from 'react';
import { FormItemProps as BaseFormItemProps } from 'antd';
import * as S from './styles';

type FormItemProps = BaseFormItemProps;

export const FormItem: FunctionComponent<PropsWithChildren<FormItemProps>> = (
  props
) => {
  return (
    <S.BaseFormItem {...props} hasHelpText={(props.help || null) !== null}>
      {props.children}
    </S.BaseFormItem>
  );
};
