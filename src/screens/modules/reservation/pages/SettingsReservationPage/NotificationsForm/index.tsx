import { notification, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Creators as SettingCreators } from 'src/store/modules/setting/actions';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Form, useForm, useWatch } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Button } from 'src/stories/general/Button';
import { Checkbox } from 'src/stories/entry/Checkbox';
import type { RootType } from 'src/store/modules/rootReducer';
import { isValidEmail } from 'src/utils/helpers';
import { useEffect, useState } from 'react';

type NotificationsFormValues = {
  notification_email_enabled: boolean;
  notification_email: Array<string>;
};

export const NotificationsForm = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const {
    setting: { reservation, saving },
  } = useSelector((state: RootType) => state);
  const enabledNotificationEmail = useWatch('notification_email_enabled', form);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);

  useEffect(() => {
    const getNotificationEmailValue = () => {
      const notificationEmailValue = reservation?.notification_email?.replace(/\s+/g, '');

      if (notificationEmailValue === '' || notificationEmailValue === undefined) {
        return undefined;
      }

      try {
        return JSON.parse(notificationEmailValue);
      } catch {
        return notificationEmailValue.split(',').map((item) => item.trim());
      }
    };

    form.setFieldsValue({
      ...reservation,
      notification_email: getNotificationEmailValue(),
    });
  }, [form, reservation]);

  const handleFinish = (values: NotificationsFormValues) => {
    if (!values) {
      return;
    }

    dispatch(
      SettingCreators.saveSettingRequest({
        notification_email_enabled: values.notification_email_enabled,
        ...(values.notification_email_enabled === true
          ? {
              notification_email: values.notification_email.join(',') ?? reservation?.notification_email,
            }
          : {}),
      })
    );
  };

  const handleEmailNotificationFieldChange = (value: string[]) => {
    setIsFormDirty(true);

    if (value.some((item) => !isValidEmail(item))) {
      notification.warning({ message: 'E-mail inválido', description: 'Por favor, insira um e-mail válido.' });
    }

    const validValues = value.filter((item: string) => isValidEmail(item));

    form.setFieldsValue({
      notification_email: validValues,
    });
  };

  return (
    <BoxContrasted>
      <Form form={form} layout="vertical" className="flex flex-col gap-6" onFinish={handleFinish}>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6 mt-6">
          <FormItem className="col-span-3" name="notification_email_enabled" valuePropName="checked">
            <Checkbox
              checked={enabledNotificationEmail}
              label="Habilitar notificações por e-mail"
              tooltip="Quando essa opção está ativada, o gerente receberá um e-mail de aviso a cada nova reserva
                      efetuada, na caixa de entrada configurada."
              onChange={() => setIsFormDirty(true)}
            />
          </FormItem>
          <FormItem
            className="col-span-3"
            name="notification_email"
            label="E-mail de destino das notificações"
            rules={rules['notification-email'](enabledNotificationEmail)}
          >
            <Select
              mode="tags"
              tokenSeparators={[',', ' ']}
              disabled={!enabledNotificationEmail}
              options={[]}
              onChange={handleEmailNotificationFieldChange}
            />
          </FormItem>
        </div>
        <div className="flex items-center justify-end">
          <Button htmlType="submit" type="primary" loading={saving} disabled={!isFormDirty}>
            Salvar
          </Button>
        </div>
      </Form>
    </BoxContrasted>
  );
};

export const rules = {
  'notification-email': (required: boolean) => [
    {
      required: required,
      message: 'O e-mail de notificação é obrigatório.',
    },
  ],
};
