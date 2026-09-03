import {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
} from 'react';
import { Form, Input, Modal } from 'antd';
import { Rule } from 'antd/lib/form';
import { Button } from 'src/stories/general/Button';
import * as S from './styles';

type GenericField = {
  name: string;
  label?: string;
  placeholder?: string;
  rules?: Rule[];
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type GenericBannerProps = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  width?: string;
  body?: ReactNode;
  form?: {
    onFinish: (values: any) => void;
    fields: GenericField[];
  };
  modalOptions?: {
    maskClosable?: boolean;
    afterClose?: () => void;
  };
  actions?: {
    primary: {
      text: string;
      onClick?: () => void;
      isSubmit?: boolean;
    };
    secondary?: {
      text: string;
      onClick: () => void;
    };
  };
};

export const GenericBanner: FunctionComponent<GenericBannerProps> = (props) => {
  const {
    isVisible,
    setIsVisible,
    title,
    width = '500px',
    actions,
    body,
    form,
    modalOptions,
  } = props;

  const [formInstance] = Form.useForm();

  const handleClose = () => setIsVisible(false);

  return (
    <Modal
      open={isVisible}
      centered
      destroyOnClose
      footer={null}
      onCancel={handleClose}
      width={width}
      closable={false}
      maskClosable={modalOptions?.maskClosable}
      afterClose={modalOptions?.afterClose}
    >
      <S.Title>{title}</S.Title>
      {(body || null) !== null && body}
      {form !== undefined && form.fields.length > 0 && (
        <Form onFinish={form.onFinish} form={formInstance} layout="vertical">
          {form.fields.map((field) => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={field.rules}
            >
              <Input
                id={field.name}
                placeholder={field.placeholder}
                onChange={field.onChange}
              />
            </Form.Item>
          ))}
        </Form>
      )}
      {actions && (
        <S.WrapperButtonActions full={actions.secondary !== undefined}>
          {actions.secondary !== undefined && (
            <Button variant="outlined" onClick={actions.secondary.onClick}>
              {actions.secondary.text}
            </Button>
          )}
          <Button onClick={actions.primary.onClick}>
            {actions.primary.text}
          </Button>
        </S.WrapperButtonActions>
      )}
    </Modal>
  );
};
