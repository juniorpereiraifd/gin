import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MenuCreators } from 'src/store/modules/menu/actions';
import { GoogleMenuIntegrationStatus } from 'src/store/modules/menu/reducer';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Form, useForm } from 'src/stories/entry/Form';
import { GOOGLE_INTEGRATION_STATUS, GOOGLE_INTEGRATION_STATUS_TYPE } from 'src/utils/constants';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Button } from 'src/stories/general/Button';
import { Switch } from 'src/stories/entry/Switch';
import type { RootType } from 'src/store/modules/rootReducer';
import { Heading } from 'src/ui/Typograph';
import { Divider } from 'antd';

type IntegrationsFormValues = {
  google_menu_enabled: boolean;
};

export const IntegrationsForm = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const {
    menu: { settings, googleMenuStatus, savingSettings },
  } = useSelector((state: RootType) => state);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);

  useEffect(() => {
    form.setFieldsValue({
      google_menu_enabled: settings?.google_menu_enabled,
    });

    if (settings?.google_menu_enabled) {
      dispatch(MenuCreators.getGoogleMenuStatusRequest());
    }
  }, [settings]);

  const handleFinish = (values: IntegrationsFormValues) => {
    if (!values) {
      return;
    }

    dispatch(MenuCreators.updateMenuSettingsRequest({ google_menu_enabled: values.google_menu_enabled }));
  };

  const TranslateStatusGoogleMenuIntegration = () =>
    GOOGLE_INTEGRATION_STATUS.find((o) => o.status === googleMenuStatus)?.name;

  return (
    <BoxContrasted>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Heading level="5">Google Menu</Heading>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6 mt-6">
          <div className="col-span-3 flex items-start gap-2">
            <FormItem name="google_menu_enabled" valuePropName="checked">
              <Switch
                label="Habilitar Google Menu"
                tooltip="Quando esta opção está ativada, o seu cardápio será mostrado na sua Conta do Google."
                onChange={() => setIsFormDirty(true)}
              />
            </FormItem>
            {settings?.google_menu_enabled && (
              <div
                className={`flex items-center justify-center px-2 py-1 text-white text-xs leading-5 font-normal rounded-md
                  ${backgroundVariants[googleMenuStatus as GoogleMenuIntegrationStatus]}
                `}
              >
                {TranslateStatusGoogleMenuIntegration()}
              </div>
            )}
          </div>
          {(googleMenuStatus === GOOGLE_INTEGRATION_STATUS_TYPE.DECLINED ||
            googleMenuStatus === GOOGLE_INTEGRATION_STATUS_TYPE.UNKNOWN) &&
            settings?.google_menu_enabled && (
              <div className="col-span-3 flex flex-col gap-2 border border-red-200 rounded-md p-4 bg-red-50">
                <span className="font-semibold text-base text-slate-700">Reprovado</span>
                <p className="text-xs text-slate-600">
                  Algo deu errado. Por favor, entre em contato com o suporte para revisar as configurações.
                </p>
              </div>
            )}
        </div>
        <Divider />
        <div className="flex items-center justify-end">
          <Button htmlType="submit" type="primary" loading={savingSettings} disabled={!isFormDirty}>
            Salvar
          </Button>
        </div>
      </Form>
    </BoxContrasted>
  );
};

const backgroundVariants: Record<GoogleMenuIntegrationStatus, string> = {
  pending: 'bg-blue-500',
  accepted: 'bg-yellow-500',
  declined: 'bg-red-600',
  unknown: 'bg-red-600',
  error: 'bg-red-600',
};
