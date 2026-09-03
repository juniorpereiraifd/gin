import { Divider, Switch, Tooltip, Input } from 'antd';
import { RuleObject } from 'antd/es/form';
import { format } from 'date-fns';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from 'src/services/api';
import { CurrencyDollar } from '@styled-icons/bootstrap/CurrencyDollar';
import { InfoOutline } from '@styled-icons/evaicons-outline/InfoOutline';
import { Creators as InformationCreators } from 'src/store/modules/information/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { CurrencyInput, InputMask, Select } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { UNITY_STATUS } from 'src/utils/constants';
import {
  convertCurrency,
  getPhoneNumberUnformatted,
  getPhoneNumberWithNationalCode,
  removeNonNumeric,
  validateCnpj,
} from 'src/utils/helpers';
import * as S from './styles';
import { Cuisine, Occasion } from 'src/store/modules/unity/reducer';
import { TimezoneSelect } from 'src/stories/entry/TimezoneSelect';
import { BoxContrasted } from 'src/components/BoxContrasted';

const { Option } = Select;
const { TextArea } = Input;

export type InformationsFormProps = {
  name: string;
  company_name: string;
  about: string;
  telephone: string;
  zipcode: string;
  address: string;
  number: string;
  taxpayer_identification: string | null;
  website: string | null;
  average_ticket?: number;
  cuisines?: string[];
};

const rules = {
  zipcode: [
    {
      required: true,
      message: 'O CEP é obrigatório',
    },
  ],
  address: [
    {
      required: true,
      message: 'O Endereço é obrigatório',
    },
  ],
  telephone: [
    {
      required: true,
      message: 'O Telefone é obrigatório',
    },
    (): RuleObject => ({
      validator(_, value) {
        if (getPhoneNumberUnformatted(value).length >= 10) {
          return Promise.resolve();
        }

        return Promise.reject('O telefone informado não é válido!');
      },
    }),
  ],
  cuisine: [{ required: true, message: 'É obrigatório determinar o tipo de cozinha' }],
  cnpj: [
    { required: true, message: 'O cnpj é obrigatório' },
    (): RuleObject => ({
      validator(_, value) {
        if (!value || (getPhoneNumberUnformatted(value).length === 14 && validateCnpj(value))) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('O CNPJ é inválido!'));
      },
    }),
  ],
};

const disableStatus = 'disabled';
const suspendedStatus = 'suspended';

type ActiveMoneySignProps = {
  [key: number]: boolean;
};

const Informations: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [showAlertStatus, setShowAlertStatus] = useState(false);
  const {
    hall: { unity },
    information: { saving },
    auth: { user },
  } = useSelector((state: RootType) => state);

  const [disabled, setDisabled] = useState(true);
  const [showListingNewInGetIn, setShowListingNewInGetIn] = useState(false);
  const [activeMoneySign, setActiveMoneySign] = useState<ActiveMoneySignProps>({
    0: false,
    1: false,
    2: false,
    3: false,
  });
  const isActiveListingNewInGetIn = !!unity?.published_at;

  const onFinish = (values: InformationsFormProps) => {
    if (showListingNewInGetIn) {
      api.put(`/restaurant/v1/units/${unity?.id}/publish`);
    }

    dispatch(
      InformationCreators.saveInformationRequest({
        ...values,
        cuisines: (values.cuisines as Array<Cuisine | string> | undefined)?.map((cuisine) =>
          typeof cuisine === 'string' ? cuisine : cuisine.id,
        ),
        ...(values.taxpayer_identification && {
          taxpayer_identification: removeNonNumeric(values.taxpayer_identification),
        }),
        ...(values.average_ticket !== undefined
          ? {
              average_ticket: convertCurrency(values.average_ticket, {
                type: 'cents',
              }),
            }
          : {}),
        telephone: getPhoneNumberWithNationalCode(values.telephone),
      }),
    );
  };

  async function getCuisines() {
    const { data: resp } = await api.get('/restaurant/v1/cuisines?pagination=0');

    setCuisines(resp.data);
  }

  async function getOccasions() {
    const { data: resp } = await api.get('/restaurant/v1/occasion?pagination=0');

    setOccasions(resp.data);
  }

  useEffect(() => {
    if (unity) {
      updateActiveMoneySign(convertCurrency(unity?.average_ticket ?? 0));

      form.setFieldsValue({
        ...unity,
        average_ticket: convertCurrency(unity?.average_ticket ?? 0),
        telephone: unity?.telephone.substring(2),
        state_id: '',
        city_id: '',
        cuisines: unity?.cuisines.map((cuisine) => cuisine.id),
        occasions: unity?.occasions.map((occasion) => occasion.id),
      });
    }
  }, [unity, form]);

  useEffect(() => {
    getCuisines();
    getOccasions();
  }, []);

  const handleChangeActiveMoneySign = (currencyValue: number) => {
    form.setFieldsValue({ average_ticket: currencyValue });

    updateActiveMoneySign(currencyValue);
  };

  const updateActiveMoneySign = (currencyValue: number) => {
    const checkpoints = [60, 120, 180];
    const newActiveMoneySign: ActiveMoneySignProps = {
      0: false,
      1: false,
      2: false,
      3: false,
    };

    if (currencyValue > 0) {
      checkpoints.forEach((checkpoint, index) => {
        if (currencyValue >= checkpoint) {
          newActiveMoneySign[index + 1] = true;
        }
      });

      newActiveMoneySign[0] = true;
    }

    setActiveMoneySign(newActiveMoneySign);
  };

  return (
    <>
      <S.Modal title={false} open={showAlertStatus} footer={false} closable={false}>
        <Title level={3}>Atenção</Title>
        Ao suspender ou desativar uma unidade você <b>estará bloqueando</b> todos os acessos dos gerentes e operadores
        (admin e painel).
        <S.ButtonModal>
          <Button variant="outlined" onClick={() => setShowAlertStatus(false)}>
            Entendi
          </Button>
        </S.ButtonModal>
      </S.Modal>
      <Form layout="vertical" form={form} onChange={() => setDisabled(false)} onFinish={onFinish}>
        <BoxContrasted>
          {user?.master && (
            <Fragment>
              <S.InputWrapper>
                <FormItem label="Status" name="status" help="Controle quando a unidade estará visível.">
                  <Select
                    onChange={(value) => {
                      setDisabled(false);
                      if (value == disableStatus || value == suspendedStatus) {
                        setShowAlertStatus(true);
                      }
                    }}
                  >
                    {UNITY_STATUS.map((status) => (
                      <Option
                        key={status.value}
                        value={status.value}
                        style={status.value == 'disabled' ? { color: '#dd4f50' } : {}}
                      >
                        {status.label}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </S.InputWrapper>

              <S.SwitchNewInGetInWrapper isDisabled={isActiveListingNewInGetIn}>
                <Switch
                  disabled={isActiveListingNewInGetIn}
                  defaultChecked={false}
                  {...(isActiveListingNewInGetIn && { checked: false })}
                  onChange={(checked) => {
                    setShowListingNewInGetIn(checked);
                    setDisabled(!checked);
                  }}
                />{' '}
                {isActiveListingNewInGetIn ? (
                  <span>
                    Exibido em {format(new Date(unity?.published_at), 'dd/MM/yyyy')} no &quot;Novos no Get In&quot;.
                  </span>
                ) : (
                  <span>Exibir na listagem &quot;Novos no Get In&quot;.</span>
                )}
              </S.SwitchNewInGetInWrapper>
            </Fragment>
          )}

          <S.InputWrapper>
            <FormItem name="company_name" label="Nome do restaurante">
              <Input />
            </FormItem>
          </S.InputWrapper>
          <S.InputWrapper>
            <FormItem name="name" label="Nome da unidade" tooltip="Nome exibido no aplicativo Get In.">
              <Input />
            </FormItem>
          </S.InputWrapper>
          <S.InputWrapper>
            <FormItem label="CNPJ" name="taxpayer_identification" rules={rules.cnpj}>
              <InputMask mask="99.999.999/9999-99" />
            </FormItem>
          </S.InputWrapper>
          <S.InputWrapper>
            <FormItem name="about" label="Descrição" tooltip="Descrição do seu estabelecimento no aplicativo Get In.">
              <TextArea rows={5} />
            </FormItem>
          </S.InputWrapper>
          <S.InputWrapper>
            <FormItem
              name="telephone"
              label="Telefone"
              rules={rules.telephone}
              tooltip="Telefone que os clientes podem utilizar para entrar em contato."
            >
              <InputMask mask="(99) 99999-9999" />
            </FormItem>
          </S.InputWrapper>
          <S.InputWrapper>
            <FormItem name="website" label="Website">
              <Input />
            </FormItem>
          </S.InputWrapper>
          {cuisines.length > 0 && (
            <S.InputWrapper>
              <FormItem name="cuisines" label="Tipo de cozinha" rules={rules.cuisine}>
                <Select
                  mode="multiple"
                  tokenSeparators={[',', ' ']}
                  onChange={() => setDisabled(false)}
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={cuisines.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </FormItem>
            </S.InputWrapper>
          )}
          {occasions.length > 0 && (
            <S.InputWrapper>
              <FormItem name="occasions" label="Ocasião">
                <Select
                  mode="multiple"
                  tokenSeparators={[',', ' ']}
                  onChange={() => setDisabled(false)}
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={occasions.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </FormItem>
            </S.InputWrapper>
          )}
          <S.InputWrapper>
            <FormItem
              name="opening_hours_description"
              label="Horário de funcionamento"
              tooltip="Descreva os dias e horários que seu estabelecimento está aberto."
            >
              <TextArea rows={5} />
            </FormItem>
          </S.InputWrapper>
          <S.InputWrapper>
            <FormItem label="Timezone" name="timezone">
              <TimezoneSelect onChange={() => setDisabled(false)} />
            </FormItem>
          </S.InputWrapper>
          <S.InputWrapper>
            <S.CurrencyFieldWrapper>
              <FormItem
                name="average_ticket"
                help="Essa informação é importante para o cálculo do faturamento que
              está disponível no relatório de fluxo de clientes."
                label={
                  <S.FormItemLabel>
                    Ticket médio{' '}
                    <Tooltip
                      placement="top"
                      color="#1f2937"
                      title={
                        <div className="tooltip-content">
                          Valor estimado gasto por pessoa no seu restaurante.
                          <br />
                          <br />
                          Os crifrões são uma representação visual do ticket de acordo com os seguintes intervalos de
                          valores:
                          <br />
                          $: 1 - 60
                          <br />
                          $$: 61 - 120
                          <br />
                          $$$: 121 - 180
                          <br />
                          $$$$: +180
                        </div>
                      }
                    >
                      <InfoOutline size={14} />
                    </Tooltip>
                  </S.FormItemLabel>
                }
              >
                <CurrencyInput
                  onChange={(_, value) => handleChangeActiveMoneySign(value ?? 0)}
                  currency="BRL"
                  config={{
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
                  }}
                />
              </FormItem>
              <div className="money-sign-content">
                {Array.from({ length: 4 }).map((_, index) => (
                  <CurrencyDollar
                    className={`currency-dollar ${activeMoneySign[index] === true && 'active'}`}
                    key={index}
                    size={20}
                  />
                ))}
              </div>
            </S.CurrencyFieldWrapper>
          </S.InputWrapper>
          <S.InputWrapper>
            <FormItem
              name="payment_description"
              label="Formas de Pagamento"
              tooltip="Insira quais formas de pagamento você aceita. Essa informação será
              exibida na página do seu perfil no aplicativo Get In."
            >
              <TextArea rows={5} />
            </FormItem>
          </S.InputWrapper>
          <S.InputWrapper>
            <FormItem name="financial_email" label="Email financeiro">
              <Input />
            </FormItem>
          </S.InputWrapper>
          <Divider />
          <S.Footer>
            <Title level={4}>Tudo pronto? É só salvar!</Title>
            <Button disabled={disabled} loading={saving} htmlType="submit">
              Salvar alterações
            </Button>
          </S.Footer>
        </BoxContrasted>
      </Form>
    </>
  );
};

export default Informations;
