import { Fragment, useEffect, useState } from 'react';
import { Col, Divider, Input, Radio, Row, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { isNumber } from 'lodash';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as SettingCreators } from 'src/store/modules/setting/actions';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Checkbox } from 'src/stories/entry/Checkbox';
import { CurrencyInput } from 'src/stories/entry';
import { Form, useForm, useWatch } from 'src/stories/entry/Form';
import type { RuleObject } from 'antd/es/form';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Button } from 'src/stories/general/Button';
import { MINUTES_IN_ADVANCE_REFUND, PAYMENT_PROVIDER, type PaymentProviderValues } from 'src/utils/constants';
import { renderDynamicallyOptions, renderFriendlyMinuteValue } from 'src/utils/helpers';
import { SCHEDULE_BILLING_TYPE, type ScheduleBillingTypeValue } from 'src/store/modules/schedule/reducer';
import { Heading } from 'src/ui/Typograph';
import { canConfigureNoshowFallback, NOSHOW_FALLBACK_SECTION_ID, OVERBOOKING_SECTION_ID } from '../utils';
import { useSectionHighlight } from '../useSectionHighlight';

type PaymentFormValues = {
  billing_enabled: boolean;
  credit_card_enabled: boolean;
  pix_enabled: boolean;
  getin_tax: string;
  noshow_getin_tax: string;
  noshow_fallback: {
    enabled: boolean;
    billing_type: ScheduleBillingTypeValue;
    price: number;
    refund_hours: number;
  };
  payment_provider_experience: PaymentProviderValues;
  payment_provider_noshow: PaymentProviderValues;
  seller_token_zoop: string;
  seller_token_iugu: string;
};

export const PaymentForm = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const {
    setting: { reservation, saving },
    auth: { user },
  } = useSelector((state: RootType) => state);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const experiencePaymentProvider = useWatch('payment_provider_experience', form);
  const noshowPaymentProvider = useWatch('payment_provider_noshow', form);
  const billingEnabled = useWatch('billing_enabled', form);
  const pixEnabled = useWatch('pix_enabled', form);
  const creditCardEnabled = useWatch('credit_card_enabled', form);
  const noshowFallbackEnabled = useWatch(['noshow_fallback', 'enabled'], form);
  const noshowFallbackBillingType = useWatch(['noshow_fallback', 'billing_type'], form);
  const isMaster = user?.master ?? false;
  const noshowFallbackFieldsDisabled = !billingEnabled || !noshowFallbackEnabled;
  const noshowFallbackVisible = canConfigureNoshowFallback({ reservation, isMaster, billingEnabled });
  const overbookingEnabled = reservation?.overbook_allowed_for_agent === true;
  const { sectionRef: noshowFallbackSectionRef, isHighlighted: isNoshowFallbackHighlighted } = useSectionHighlight(
    NOSHOW_FALLBACK_SECTION_ID,
    noshowFallbackVisible,
  );

  useEffect(() => {
    form.setFieldsValue({
      ...reservation,
      credit_card_enabled: reservation?.billing_type?.credit,
      pix_enabled: reservation?.billing_type?.pix,
      payment_provider_experience: reservation?.billing_service?.reserve,
      payment_provider_noshow: reservation?.billing_service?.noshow,
      seller_token_zoop: reservation?.billing_provider?.zoop,
      seller_token_iugu: reservation?.billing_provider?.iugu,
      getin_tax: reservation?.getin_tax ?? 10,
      noshow_fallback: {
        enabled: reservation?.noshow_fallback?.enabled ?? false,
        billing_type: reservation?.noshow_fallback?.billing_type ?? SCHEDULE_BILLING_TYPE.FIXED,
        price: reservation?.noshow_fallback?.price,
        refund_hours: (reservation?.noshow_fallback?.refund_hours ?? 0) * 60,
      },
    });
  }, [form, reservation]);

  const handleNoshowFallbackPriceChange = (event?: InputEvent | undefined, value?: number | undefined) => {
    event?.preventDefault();

    form.setFieldValue(['noshow_fallback', 'price'], value);
    setIsFormDirty(true);
  };

  const handleFinish = async (values: PaymentFormValues) => {
    if (!values || !reservation) {
      return;
    }

    const {
      seller_token_zoop,
      seller_token_iugu,
      payment_provider_experience,
      payment_provider_noshow,
      credit_card_enabled,
      pix_enabled,
      noshow_fallback,
      ...rest
    } = values;

    const billingProvider = {
      zoop: seller_token_zoop ?? reservation.billing_provider?.zoop,
      iugu: seller_token_iugu ?? reservation.billing_provider?.iugu,
    };

    dispatch(
      SettingCreators.saveSettingRequest({
        ...rest,
        billing_type: {
          credit: credit_card_enabled ?? reservation.billing_type.credit,
          pix: pix_enabled ?? reservation.billing_type.pix,
        },
        noshow_fallback: {
          enabled: noshow_fallback?.enabled ?? false,
          billing_type: noshow_fallback?.billing_type ?? SCHEDULE_BILLING_TYPE.FIXED,
          price: Number(noshow_fallback?.price ?? 0),
          refund_hours: Number(noshow_fallback?.refund_hours ?? 0) / 60,
        },
        billing_provider: {
          ...(billingProvider.zoop
            ? {
                zoop: billingProvider.zoop,
              }
            : {}),
          ...(billingProvider.iugu
            ? {
                iugu: billingProvider.iugu,
              }
            : {}),
        },
        billing_service: {
          noshow: payment_provider_noshow ?? reservation.billing_service.noshow,
          reserve: payment_provider_experience ?? reservation.billing_service.reserve,
        },
      }),
    );
  };

  return (
    <BoxContrasted>
      <Form
        form={form}
        layout="vertical"
        className="flex flex-col gap-6"
        onFinish={handleFinish}
        onChange={() => setIsFormDirty(true)}
      >
        <Row gutter={24}>
          <Col xs={24} sm={8}>
            <FormItem name="billing_enabled" valuePropName="checked">
              <Checkbox
                disabled={isMaster === false}
                label="Habilitar cobranças"
                tooltip="Quando essa opção está ativada, funcionalidades de cobranças em reservas ficarão disponíveis (ex:
                      taxa de no-show, pré pagamento de reservas, etc). Você precisará de um ID de integração para
                      pagamentos via Zoop."
                onChange={() => setIsFormDirty(true)}
              />
            </FormItem>
          </Col>
          {user?.master && (
            <Fragment>
              {(experiencePaymentProvider === PAYMENT_PROVIDER.ZOOP ||
                noshowPaymentProvider === PAYMENT_PROVIDER.ZOOP) && (
                <Col xs={24} sm={8}>
                  <FormItem
                    name="seller_token_zoop"
                    label="ID integrador de pagamento (Zoop)"
                    rules={rules['seller-token'](billingEnabled && isMaster)}
                  >
                    <Input disabled={!billingEnabled} />
                  </FormItem>
                </Col>
              )}
              {(experiencePaymentProvider === PAYMENT_PROVIDER.IUGU ||
                noshowPaymentProvider === PAYMENT_PROVIDER.IUGU) && (
                <Col xs={24} sm={8}>
                  <FormItem
                    name="seller_token_iugu"
                    label="ID integrador de pagamento (Iugu)"
                    rules={rules['seller-token'](billingEnabled && isMaster)}
                  >
                    <Input disabled={!billingEnabled} />
                  </FormItem>
                </Col>
              )}
            </Fragment>
          )}
        </Row>
        {user?.master && (
          <Fragment>
            <Divider />
            <div className="flex flex-col gap-2">
              <Heading level="6">Reserva paga e Experiências</Heading>
              <Row gutter={24} className="mt-4">
                <Col xs={24} sm={8}>
                  <FormItem
                    name="payment-way"
                    className="m-0"
                    rules={rules['payment-way'](billingEnabled, pixEnabled, creditCardEnabled)}
                  >
                    <FormItem name="credit_card_enabled" valuePropName="checked" className="m-0">
                      <Checkbox
                        disabled={!billingEnabled}
                        label="Cartão de crédito"
                        onChange={() => setIsFormDirty(true)}
                      />
                    </FormItem>
                    <FormItem name="pix_enabled" valuePropName="checked" className="m-0">
                      <Checkbox disabled={!billingEnabled} label="PIX" onChange={() => setIsFormDirty(true)} />
                    </FormItem>
                  </FormItem>
                </Col>
                <Col xs={24} sm={8}>
                  <FormItem
                    label="Provedor de pagamento"
                    rules={rules['payment_provider_experience'](billingEnabled)}
                    name="payment_provider_experience"
                  >
                    <Select
                      onChange={() => setIsFormDirty(true)}
                      disabled={!billingEnabled}
                      options={[
                        { value: PAYMENT_PROVIDER.ZOOP, label: 'Zoop' },
                        { value: PAYMENT_PROVIDER.IUGU, label: 'Iugu' },
                      ]}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} sm={8}>
                  <FormItem name="getin_tax" label="Taxa Get In" rules={rules['getin-tax'](billingEnabled && isMaster)}>
                    <Input suffix="%" type="number" className="medium" disabled={!billingEnabled} />
                  </FormItem>
                </Col>
              </Row>
            </div>
          </Fragment>
        )}

        {noshowFallbackVisible && (
          <Fragment>
            <Divider />
            <div id={NOSHOW_FALLBACK_SECTION_ID} ref={noshowFallbackSectionRef} className="flex flex-col gap-2">
              <Heading level="6">No-show</Heading>
              <div className="flex flex-col gap-2 mt-4">
                {user?.master && (
                  <Row gutter={24}>
                    <Col xs={24} sm={8}>
                      <FormItem
                        label="Provedor de pagamento"
                        name="payment_provider_noshow"
                        rules={rules['payment_provider_noshow'](billingEnabled)}
                      >
                        <Select
                          disabled={!billingEnabled}
                          onChange={() => setIsFormDirty(true)}
                          options={[
                            { value: PAYMENT_PROVIDER.ZOOP, label: 'Zoop' },
                            { value: PAYMENT_PROVIDER.IUGU, label: 'Iugu' },
                          ]}
                        />
                      </FormItem>
                    </Col>
                    <Col xs={24} sm={8}>
                      <FormItem
                        name="noshow_getin_tax"
                        label="Taxa Get In"
                        rules={rules['noshow-getin-tax'](billingEnabled && isMaster)}
                      >
                        <Input suffix="%" type="number" className="full" disabled={!billingEnabled} />
                      </FormItem>
                    </Col>
                  </Row>
                )}
                <Row gutter={24}>
                  <Col xs={24} sm={8}>
                    <FormItem
                      name={['noshow_fallback', 'enabled']}
                      valuePropName="checked"
                      className={`w-fit rounded-md transition-shadow duration-500 ${
                        isNoshowFallbackHighlighted ? 'ring-2 ring-offset-4 ring-blue-400' : ''
                      }`}
                    >
                      <Checkbox
                        disabled={!billingEnabled}
                        label="Habilitar no-show fora de grade"
                        onChange={() => setIsFormDirty(true)}
                        tooltip="Define a cobrança de no-show para reservas feitas fora de qualquer grade horária. Grades com no-show configurado continuam seguindo as próprias regras."
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24} sm={8}>
                    <FormItem
                      name={['noshow_fallback', 'billing_type']}
                      label="Modalidade de cobrança"
                      rules={rules['noshow-fallback-billing-type'](noshowFallbackEnabled && billingEnabled)}
                    >
                      <Radio.Group
                        block
                        options={[
                          { label: 'Fixa', value: SCHEDULE_BILLING_TYPE.FIXED },
                          { label: 'Por pessoa', value: SCHEDULE_BILLING_TYPE.PER_PERSON },
                        ]}
                        defaultValue={SCHEDULE_BILLING_TYPE.FIXED}
                        optionType="button"
                        buttonStyle="outline"
                        disabled={noshowFallbackFieldsDisabled}
                        onChange={() => setIsFormDirty(true)}
                      />
                    </FormItem>
                  </Col>
                  <Col xs={24} sm={8}>
                    <FormItem
                      label={`Preço${
                        noshowFallbackBillingType === SCHEDULE_BILLING_TYPE.PER_PERSON ? ' por pessoa' : ''
                      }`}
                      name={['noshow_fallback', 'price']}
                      rules={rules['noshow-fallback-price'](noshowFallbackEnabled && billingEnabled)}
                      tooltip="Esta taxa será cobrada do cliente em caso de não comparecimento."
                    >
                      <CurrencyInput
                        currency="BRL"
                        config={currencyConfig}
                        disabled={noshowFallbackFieldsDisabled}
                        onChange={handleNoshowFallbackPriceChange}
                      />
                    </FormItem>
                  </Col>
                  <Col xs={24} sm={8}>
                    <FormItem
                      label="Antecedência mínima de cancelamento"
                      name={['noshow_fallback', 'refund_hours']}
                      rules={rules['noshow-fallback-refund-hours'](noshowFallbackEnabled && billingEnabled)}
                      tooltip="Defina até quanto tempo antes da reserva o cliente pode cancelar sem ser cobrado."
                    >
                      <Select disabled={noshowFallbackFieldsDisabled} onChange={() => setIsFormDirty(true)}>
                        {renderDynamicallyOptions(MINUTES_IN_ADVANCE_REFUND, (value: number | string) => {
                          return Number(value) === 0
                            ? '--'
                            : renderFriendlyMinuteValue(isNumber(value) ? value : parseInt(value));
                        })}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                {noshowFallbackEnabled === true && overbookingEnabled === false && (
                  <Row gutter={24}>
                    <Col xs={24} sm={16}>
                      <div className="flex gap-2 rounded-md border border-blue-200 bg-blue-50 p-4 mb-6">
                        <Info className="h-5 w-5 shrink-0 text-blue-500" aria-hidden="true" />
                        <p className="text-xs text-slate-600">
                          O no-show fora de grade só funciona com o overbooking habilitado.{' '}
                          <Link to={`?tab=schedule#${OVERBOOKING_SECTION_ID}`} className="text-blue-900 underline">
                            Habilitar overbooking
                          </Link>
                        </p>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            </div>
          </Fragment>
        )}
        <div className="flex items-center justify-end">
          <Button htmlType="submit" type="primary" loading={saving} disabled={!isFormDirty}>
            Salvar
          </Button>
        </div>
      </Form>
    </BoxContrasted>
  );
};

const currencyConfig = {
  locale: 'pt-BR',
  formats: {
    number: {
      BRL: {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

export const rules = {
  'payment-way': (billingEnabled: boolean, pix: boolean, credit: boolean) => [
    (): RuleObject => ({
      validator() {
        if (!billingEnabled) return Promise.resolve();

        if (!pix && !credit) {
          return Promise.reject('Habilite ao menos uma forma de pagamento (PIX ou Cartão).');
        }

        return Promise.resolve();
      },
    }),
  ],
  payment_provider_experience: (required: boolean) => [
    {
      required: required,
      message: 'O provedor de pagamento é obrigatório.',
    },
  ],
  'seller-token': (required: boolean) => [
    {
      required: required,
      message: 'O ID do integrador é obrigatório.',
    },
  ],
  'getin-tax': (required: boolean) => [
    {
      required: required,
      message: 'A taxa do getin é obrigatória.',
    },
    (): RuleObject => ({
      validator(_, value) {
        if (!value) {
          return Promise.reject();
        }

        if (value < 0) {
          return Promise.reject('O valor mínimo para a taxa do Get In é 0%.');
        }

        if (value > 100) {
          return Promise.reject('O valor máximo para a taxa do Get In é 100%.');
        }

        return Promise.resolve();
      },
    }),
  ],
  'noshow-getin-tax': (required: boolean) => [
    {
      required: required,
      message: 'A taxa do getin é obrigatória.',
    },
    (): RuleObject => ({
      validator(_, value) {
        if (!value) {
          return Promise.reject();
        }

        if (value < 0) {
          return Promise.reject('O valor mínimo para a taxa do Get In é 0%.');
        }

        if (value > 100) {
          return Promise.reject('O valor máximo para a taxa do Get In é 100%.');
        }

        return Promise.resolve();
      },
    }),
  ],
  'installments-max': (required: boolean) => [
    {
      required: required,
      message: 'A quantidade de parcelas é obrigatória.',
    },
  ],
  payment_provider_noshow: (required: boolean) => [
    {
      required: required,
      message: 'O provedor de pagamento é obrigatório.',
    },
  ],
  'noshow-fallback-billing-type': (required: boolean) => [
    {
      required: required,
      message: 'Por favor, informe a modalidade de cobrança!',
    },
  ],
  'noshow-fallback-price': (required: boolean) => [
    {
      required: required,
      message: 'O valor da taxa de no-show é obrigatório.',
    },
  ],
  'noshow-fallback-refund-hours': (required: boolean) => [
    {
      required: required,
      message: 'A antecedência mínima de cancelamento é obrigatória.',
    },
  ],
};
