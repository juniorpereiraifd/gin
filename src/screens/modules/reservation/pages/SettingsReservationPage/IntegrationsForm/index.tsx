import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Creators as SettingCreators } from 'src/store/modules/setting/actions';
import { IntegrationsCreators } from 'src/store/modules/integrations/actions';
import { GoogleReserveIntegrationStatus as GoogleReserveStatus } from 'src/store/modules/setting/reducer';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Form, useForm } from 'src/stories/entry/Form';
import { GOOGLE_INTEGRATION_STATUS, GOOGLE_INTEGRATION_STATUS_TYPE, GOOGLE_RESERVE_URL } from 'src/utils/constants';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Button } from 'src/stories/general/Button';
import { Checkbox } from 'src/stories/entry/Checkbox';
import type { RootType } from 'src/store/modules/rootReducer';
import { Heading } from 'src/ui/Typograph';
import { Divider } from 'antd';

type IntegrationsFormValues = {
  google_reserve_enabled: boolean;
  cena_enabled: boolean;
};

const PARTNER_REFERENCE = import.meta.env.VITE_PARTNER_REFERENCE;

export const IntegrationsForm = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const {
    auth: { user },
    reservation: { settings },
    setting: { reservation, googleReserveStatus, saving },
    integrations: { statusByIntegrator, loadingStatusByIntegrator, togglingByIntegrator },
  } = useSelector((state: RootType) => state);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);

  const partnerStatus = statusByIntegrator[PARTNER_REFERENCE];
  const partnerLoadingStatus = loadingStatusByIntegrator[PARTNER_REFERENCE];
  const partnerToggling = togglingByIntegrator[PARTNER_REFERENCE];
  const [partnerChecked, setPartnerChecked] = useState<boolean>(false);

  useEffect(() => {
    if (settings?.google_reserve_enabled) {
      dispatch(SettingCreators.getGoogleReserveStatusRequest());
    }
  }, [reservation]);

  useEffect(() => {
    form.setFieldsValue(reservation);
  }, [form, reservation]);

  useEffect(() => {
    dispatch(IntegrationsCreators.getIntegratorStatusRequest({ integrator: PARTNER_REFERENCE }));
  }, [dispatch]);

  useEffect(() => {
    if (!partnerToggling) {
      setPartnerChecked(Boolean(partnerStatus?.enabled));
    }
  }, [partnerToggling, partnerStatus?.enabled]);

  const handleFinish = (values: IntegrationsFormValues) => {
    if (!values) {
      return;
    }

    dispatch(SettingCreators.saveSettingRequest(values));

    if (partnerChecked !== Boolean(partnerStatus?.enabled)) {
      dispatch(IntegrationsCreators.toggleIntegratorRequest({ integrator: PARTNER_REFERENCE }));
    }
  };

  const TranslateStatusGoogleReserveIntegration = () =>
    GOOGLE_INTEGRATION_STATUS.find((o) => o.status === googleReserveStatus)?.name;

  return (
    <BoxContrasted>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Heading level="5">Google Reserve</Heading>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6 mt-6">
          <div className="col-span-3 flex items-start gap-2">
            <FormItem name="google_reserve_enabled" valuePropName="checked">
              <Checkbox
                label="Habilitar Google Reserve"
                tooltip="Quando essa opção está ativada, possibilitamos o usuário a fazer reservas através do Google
                                reservas integrado ao Get In."
                onChange={() => setIsFormDirty(true)}
              />
            </FormItem>
            {reservation?.google_reserve_enabled && (
              <div
                className={`flex items-center justify-center px-2 py-1 text-white text-xs leading-5 font-normal rounded-md
                  ${backgroundVariants[googleReserveStatus as GoogleReserveStatus]}
                `}
              >
                {TranslateStatusGoogleReserveIntegration()}
              </div>
            )}
          </div>
          {(googleReserveStatus === GOOGLE_INTEGRATION_STATUS_TYPE.DECLINED ||
            googleReserveStatus === GOOGLE_INTEGRATION_STATUS_TYPE.UNKNOWN) &&
            reservation?.google_reserve_enabled && (
              <div className="col-span-3 flex flex-col gap-2 border border-red-200 rounded-md p-4 bg-red-50">
                <span className="font-semibold text-base text-slate-700">Reprovado</span>
                <p className="text-xs text-slate-600">
                  Ops! Algo deu errado. Por favor, revise as configuraçõess no Google Reserve:
                  <a href={GOOGLE_RESERVE_URL} target="_blank" rel="noreferrer" className="text-blue-500">
                    {' '}
                    {GOOGLE_RESERVE_URL}
                  </a>
                </p>
              </div>
            )}
        </div>
        {user?.master === true && (
          <Fragment>
            <Divider />
            <Heading level="5">Cena</Heading>
            <div className="flex items-start gap-2 mt-4">
              <FormItem name="cena_enabled" valuePropName="checked">
                <Checkbox
                  label="Habilitar unidade na Cena"
                  tooltip="O restaurante estará disponível no site Cena em até 15 minutos após habilitado. O mesmo vale para a desabilitação."
                  onChange={() => setIsFormDirty(true)}
                />
              </FormItem>
            </div>
          </Fragment>
        )}
        <Divider />
        <Heading level="5">iFood</Heading>
        <div className="flex items-start gap-2 mt-4">
          <Checkbox
            label="Habilitar unidade no iFood"
            checked={partnerChecked}
            loading={partnerLoadingStatus || partnerToggling}
            disabled={partnerLoadingStatus || partnerToggling}
            onChange={({ target: { checked } }) => {
              setPartnerChecked(checked);
              setIsFormDirty(true);
            }}
          />
        </div>
        <div className="flex items-center justify-end mt-4">
          <Button htmlType="submit" type="primary" loading={saving} disabled={!isFormDirty}>
            Salvar
          </Button>
        </div>
      </Form>
    </BoxContrasted>
  );
};

const backgroundVariants: Record<GoogleReserveStatus, string> = {
  pending: 'bg-blue-500',
  accepted: 'bg-yellow-500',
  declined: 'bg-red-600',
  unknown: 'bg-red-600',
};
