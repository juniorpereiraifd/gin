import { FunctionComponent, PropsWithChildren } from 'react';
import { Form as BaseForm, FormProps as BaseFormProps } from 'antd';

type FormProps = BaseFormProps;

export const Form: FunctionComponent<PropsWithChildren<FormProps>> = (props) => {
  return <BaseForm {...props}>{props.children}</BaseForm>;
};

export const useForm = BaseForm.useForm;

export const useWatch = BaseForm.useWatch;
