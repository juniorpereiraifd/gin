import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Divider, Input, Row } from 'antd';
import { FormInstance, RuleObject } from 'antd/es/form';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as AuthCreators } from 'src/store/modules/auth/actions';
import { Button } from 'src/stories/general/Button';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Form, useForm, useWatch } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Reveal } from 'src/stories/display/Reveal';
import { StrongPasswordFieldRequirements } from 'src/stories/feedback/StrongPasswordRequirements';

type ChangePasswordFormValues = {
  old_password: string;
  password: string;
  password_confirmation: string;
};

export const ChangePasswordForm = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const {
    auth: { savingChangePassword },
  } = useSelector((state: RootType) => state);
  const newPasswordValue = useWatch('password', form);
  const [focused, setFocused] = useState(false);

  const onFinish = (values: ChangePasswordFormValues) => dispatch(AuthCreators.changePasswordRequest(values));

  return (
    <BoxContrasted>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row>
          <Col span={24}>
            <FormItem label="Senha antiga" name="old_password" rules={rules.old_password}>
              <Input.Password type="password" />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label="Nova senha" name="password" rules={rules.password}>
              <Input.Password
                type="password"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onBlurCapture={() => setFocused(false)}
              />
            </FormItem>
            <Reveal>
              {(form.getFieldError('password').length > 0 || focused) && typeof newPasswordValue === 'string' && (
                <StrongPasswordFieldRequirements
                  value={newPasswordValue}
                  className="mt-8"
                  requirements={[
                    {
                      description: 'Mínimo de 8 e máximo de 30 caracteres',
                      pattern: /.{8,}/,
                    },
                    {
                      description: 'Números e símbolos',
                      pattern: /^(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~-]).+$/,
                    },
                    {
                      description: 'Letras maiúsculas e minúsculas',
                      pattern: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                    },
                  ]}
                />
              )}
            </Reveal>
          </Col>
          <Col span={12}>
            <FormItem label="Confirmar nova senha" name="password_confirmation" rules={rules.password_confirmation}>
              <Input.Password type="password" />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Divider />
      <div className="w-full flex justify-end mt-6">
        <Button onClick={form.submit} loading={savingChangePassword}>
          Salvar
        </Button>
      </div>
    </BoxContrasted>
  );
};

const rules = {
  old_password: [{ required: true, message: 'A senha antiga é obrigatória!' }],
  password: [
    { required: true, message: 'A senha é obrigatória!' },
    (): RuleObject => ({
      validator(_, value) {
        if (!value) {
          return Promise.resolve();
        }

        if (value.length < 8 || value.length > 30) {
          return Promise.reject('A senha deve ter entre 8 e 30 caracteres');
        }

        if (!/^(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~-]).+$/.test(value)) {
          return Promise.reject('A senha deve conter pelo menos um número e um símbolo');
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(value)) {
          return Promise.reject('A senha deve conter letras maiúsculas e minúsculas');
        }

        return Promise.resolve();
      },
      validateTrigger: 'onSubmit',
    }),
  ],
  password_confirmation: [
    {
      required: true,
      message: 'É obrigatório confirmar a sua senha',
    },
    ({ getFieldValue }: Pick<FormInstance, 'getFieldValue'>): RuleObject => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject('A senha de confirmação não é a mesma digitada acima');
      },
      validateTrigger: 'onSubmit',
    }),
  ],
};
