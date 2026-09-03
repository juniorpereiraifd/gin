import type { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'antd';
import type { Rule } from 'antd/es/form';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as UserCreators } from 'src/store/modules/user/actions';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { MutationUserDrawer } from '../../MutationUserDrawer';

type ManagersMutationFormValues = {
  email: string;
};

export const ManagersMutationDrawer: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {
    user: { saving, isMutationDrawerOpen },
  } = useSelector((state: RootType) => state);
  const [form] = useForm();

  const handleClose = () => {
    dispatch(UserCreators.setMutationDrawerOpen({ open: false }));
  };

  const handleFinish = (values: ManagersMutationFormValues) => {
    dispatch(UserCreators.createUserRequest(values));
  };

  return (
    <MutationUserDrawer
      title="Adicionar gerente"
      size="default"
      open={isMutationDrawerOpen}
      onClose={handleClose}
      form={form}
      actions={{
        save: {
          label: 'Salvar',
          onClick: () => form.submit(),
          loading: saving,
          disabled:
            saving || !form.isFieldsTouched(true) || form.getFieldsError().some(({ errors }) => errors.length > 0),
        },
        cancel: {
          label: 'Cancelar',
          onClick: handleClose,
          disabled: saving,
        },
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <FormItem
          label="Email"
          name="email"
          tooltip="Caso o usuário já tenha um cadastro no Get In, ele poderá usar os mesmos dados de acesso."
          rules={rules.email}
        >
          <Input />
        </FormItem>
      </Form>
    </MutationUserDrawer>
  );
};

const rules: Record<string, Rule[]> = {
  email: [
    { required: true, message: 'O e-mail é obrigatório.' },
    { type: 'email', message: 'Informe um e-mail válido.' },
  ],
};
