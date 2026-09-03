import { Fragment, useEffect, useState, type FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Collapse, Input } from 'antd';
import type { Rule, RuleObject } from 'antd/es/form';
import type { FormInstance } from 'antd/lib';
import { ExternalLink, LoaderCircle } from 'lucide-react';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as OperatorsCreators } from 'src/store/modules/operator/actions';
import { Form, useForm, useWatch } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { MutationUserDrawer } from '../../MutationUserDrawer';
import { getIsArrayEqual, LinkedUnitsDrawer } from 'src/screens/components/LinkedUnitsDrawer';
import type { LinkedUnit } from 'src/store/modules/operator/reducer';
import { CloseConfirmationModal } from 'src/screens/components/CloseConfirmationModal';
import { Switch } from 'src/stories/entry/Switch';

type OperatorsMutationFormValues = {
  name: string;
  username: string;
  password: string;
  password_confirmation: string;
  enabled_2fa?: boolean;
};

export const OperatorsMutationDrawer: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {
    hall: { unity },
    operator: { saving, isMutationDrawerOpen, editable, loadingOperator },
  } = useSelector((state: RootType) => state);
  const [form] = useForm();
  const [isPasswordFieldsRequired, setIsPasswordFieldsRequired] = useState(false);
  const [isLinkedUnitsDrawerOpen, setIsLinkedUnitsDrawerOpen] = useState(false);
  const [isCloseConfirmationModalIsVisible, setIsCloseConfirmationModalIsVisible] = useState(false);
  const [linkedUnits, setLinkedUnits] = useState<LinkedUnit[]>([]);
  const enabled2fa = useWatch('enabled_2fa', form);
  const isEditableAction = editable !== null || loadingOperator;
  const isLinkedUnitsDirty =
    getIsArrayEqual(
      linkedUnits,
      editable !== null ? editable?.units || [] : ([{ id: unity?.id, name: unity?.name }] as LinkedUnit[]),
    ) === false;

  useEffect(() => {
    if (isMutationDrawerOpen === false) {
      dispatch(OperatorsCreators.setOperatorEditable({ operator: null }));
      setIsCloseConfirmationModalIsVisible(false);
      setLinkedUnits([]);
      form.resetFields();
    }
  }, [isMutationDrawerOpen]);

  useEffect(() => {
    if (isMutationDrawerOpen) {
      if (editable) {
        form.setFieldsValue(editable);

        if (editable.units && editable.units.length > 0) {
          setLinkedUnits(editable.units);
        }

        return;
      }

      if (unity) {
        setLinkedUnits([{ id: unity.id, name: unity.name }]);
      }
    }
  }, [isMutationDrawerOpen, editable, unity]);

  const handleClose = () => {
    dispatch(OperatorsCreators.setMutationDrawerOpen({ open: false }));
  };

  const handleChangeEnabledTfa = (value: boolean) => {
    form.setFieldValue('enabled_2fa', value);
  };

  const handleConfirmClose = () => {
    if (isLinkedUnitsDirty) {
      setIsCloseConfirmationModalIsVisible(true);

      return;
    }

    handleClose();
  };

  const handleFinish = (values: OperatorsMutationFormValues) => {
    const payload = { ...values, enabled_2fa: values.enabled_2fa || false };

    if (editable) {
      dispatch(OperatorsCreators.editOperatorRequest({ operator: { ...values, id: editable.id, units: linkedUnits } }));

      return;
    }

    dispatch(OperatorsCreators.createOperatorRequest({ operator: { ...payload, units: linkedUnits } }));
  };

  const handleOpenChangePasswordFields = (openKey: string[]) => {
    if (!openKey || openKey.length === 0) {
      setIsPasswordFieldsRequired(false);

      return;
    }

    setIsPasswordFieldsRequired(true);
  };

  const passwordFields = (required?: boolean) => (
    <Fragment>
      <FormItem
        label={isEditableAction ? 'Nova senha' : 'Senha'}
        name="password"
        rules={rules.password(isEditableAction === false || required === true)}
        tooltip="A senha deve ter no mínimo 8 caracteres, deve ter até 30
                      caracteres, incluir um número, um símbolo, uma letra
                      minúscula e uma maíuscula."
      >
        <Input.Password />
      </FormItem>
      <FormItem
        label={isEditableAction ? 'Confirme a nova senha' : 'Confirme a senha'}
        name="password_confirmation"
        rules={rules.password_confirmation(isEditableAction === false || required === true)}
      >
        <Input.Password />
      </FormItem>
    </Fragment>
  );

  return (
    <MutationUserDrawer
      title={
        <div className="flex items-center gap-3">
          <span>{isEditableAction ? 'Editar' : 'Adicionar'} operador</span>
          {loadingOperator && <LoaderCircle className="animate-spin" size={14} />}
        </div>
      }
      size="default"
      open={isMutationDrawerOpen}
      onClose={handleConfirmClose}
      form={form}
      actions={{
        save: {
          label: 'Salvar',
          onClick: () => form.submit(),
          loading: saving,
          disabled: saving,
        },
        cancel: {
          label: 'Cancelar',
          onClick: handleConfirmClose,
          disabled: saving,
        },
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} disabled={loadingOperator}>
        <FormItem label="Nome completo" name="name" rules={rules.name}>
          <Input />
        </FormItem>
        <FormItem label={enabled2fa ? 'Email' : 'Usuário'} name="username" rules={rules.username(enabled2fa) as Rule[]}>
          <Input />
        </FormItem>
        <FormItem name="enabled_2fa">
          <Switch label="Habilitar autenticação em dois fatores" onChange={handleChangeEnabledTfa} />
        </FormItem>
        {isEditableAction ? (
          <Collapse
            onChange={handleOpenChangePasswordFields}
            className={
              '[&_.ant-collapse-content-box]:!p-0 [&_.ant-collapse-header]:!items-center' +
              ' [&_.ant-collapse-header-text]:!font-semibold [&_.ant-collapse-header-text]:!text-gray-700'
            }
            items={[
              {
                key: 'change-password',
                label: 'Alterar senha',
                children: <div className="p-4">{passwordFields(isPasswordFieldsRequired)}</div>,
              },
            ]}
          />
        ) : (
          passwordFields()
        )}
        <FormItem name="linkUnits">
          <div className="flex items-center justify-between py-3 px-4 mt-4 border border-gray-300 rounded-md">
            <span>Unidades vinculadas</span>
            <Button
              disabled={loadingOperator}
              icon={<ExternalLink size={14} />}
              variant="outlined"
              onClick={() => setIsLinkedUnitsDrawerOpen(true)}
            >
              Visualizar
            </Button>
          </div>
        </FormItem>
        <LinkedUnitsDrawer
          open={isLinkedUnitsDrawerOpen}
          setOpen={setIsLinkedUnitsDrawerOpen}
          onSave={setLinkedUnits}
          linkedUnits={linkedUnits}
          searchHelp="Selecione uma unidade para vincular ao operador"
        />
        <CloseConfirmationModal
          open={isCloseConfirmationModalIsVisible}
          onBack={() => setIsCloseConfirmationModalIsVisible(false)}
          onDiscard={handleClose}
        />
      </Form>
    </MutationUserDrawer>
  );
};

const rules = {
  name: [{ required: true, message: 'O nome completo é obrigatório.' }],
  username: (isEmail?: boolean) => [
    { required: true, message: 'Informe um email válido.', type: isEmail ? 'email' : 'string' },
  ],
  password: (required: boolean) => [{ required: required, message: 'A senha é obrigatória.' }],
  password_confirmation: (required: boolean) => [
    { required: required, message: 'A confirmação da senha é obrigatória.' },
    ({ getFieldValue }: Pick<FormInstance, 'getFieldValue'>): RuleObject => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }

        return Promise.reject('As senhas não coincidem.');
      },
    }),
  ],
};
