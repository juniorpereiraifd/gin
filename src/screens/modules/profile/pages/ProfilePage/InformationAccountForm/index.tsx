import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Input } from 'antd';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as AuthCreators } from 'src/store/modules/auth/actions';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Button } from 'src/stories/general/Button';
import { Switch } from 'src/stories/entry/Switch';
import { InputMask } from 'src/stories/entry';
import { getPhoneNumberWithNationalCode } from 'src/utils/helpers';

type InformationAccountFormValues = {
  name: string;
  email: string;
  telephone: string;
  enabled_2fa: boolean;
};

export const InformationAccountForm = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const {
    auth: { user, saving },
  } = useSelector((state: RootType) => state);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    form.setFieldsValue({
      ...user,
      telephone: user?.telephone?.substring(2),
    });
  }, [user, form]);

  const onFinish = (values: InformationAccountFormValues) => {
    dispatch(
      AuthCreators.updateManagerRequest({ ...values, telephone: getPhoneNumberWithNationalCode(values.telephone) }),
    );
  };

  return (
    <BoxContrasted>
      <Form form={form} layout="vertical" onFinish={onFinish} onChange={() => setDisabled(false)}>
        <div className="grid grid-cols-6 gap-4 mt-6">
          <FormItem noStyle hidden name="id">
            <Input />
          </FormItem>
          <FormItem label="Nome" name="name" rules={rules.name} className="col-span-3">
            <Input />
          </FormItem>
          <FormItem label="E-mail" name="email" rules={rules.email} className="col-span-3">
            <Input disabled type="email" />
          </FormItem>
          <FormItem name="telephone" label="Telefone" className="col-span-3">
            <InputMask mask="(99) 99999-9999" />
          </FormItem>
          <FormItem name="enabled_2fa" valuePropName="checked" className="flex items-end col-span-3">
            <Switch label="Habilitar autenticação em dois fatores" onChange={() => setDisabled(false)} />
          </FormItem>
        </div>
      </Form>
      <Divider />
      <div className="w-full flex justify-end mt-6">
        <Button onClick={form.submit} disabled={disabled} loading={saving}>
          Salvar
        </Button>
      </div>
    </BoxContrasted>
  );
};

const rules = {
  name: [{ required: true, message: 'O nome é obrigatório!' }],
  email: [{ required: true, message: 'O e-mail é obrigatório!' }],
};
