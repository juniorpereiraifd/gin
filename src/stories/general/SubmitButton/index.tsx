import { useEffect, useState, type FunctionComponent, type PropsWithChildren } from 'react';
import type { FormInstance } from 'antd';
import { Button, ButtonProps } from '../Button';
import { useWatch } from 'src/stories/entry/Form';

type SubmitButtonProps = Omit<ButtonProps, 'form'> & {
  form: FormInstance;
};

export const SubmitButton: FunctionComponent<PropsWithChildren<SubmitButtonProps>> = (props) => {
  const { form, children, disabled, ...rest } = props;
  const [submittable, setSubmittable] = useState<boolean>(false);

  const values = useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable || disabled} {...rest}>
      {children}
    </Button>
  );
};
