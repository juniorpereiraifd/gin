import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Form, Input, DatePicker } from 'antd';
import { Creators as VouchersCreators } from 'src/store/modules/voucher/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { Button } from 'src/stories/general/Button';
import dayjs from 'dayjs';
import { FormInstance } from 'antd/lib/form';
import { RuleObject } from 'antd/es/form';
import * as S from './styles';
import Loading from 'src/stories/feedback/Loading';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { PageContainer } from 'src/components/PageContainer';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { WeekDayDiscountSection } from './WeekDayDiscountSection';

type ValuesForm = {
  prefix_code: string;
  quantity: string;
  starting_date: moment.Moment;
  ending_date: moment.Moment;
  deadline: string;
};

export const VoucherSettingsPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    voucher: { loadingSettings, savingSettings, settings },
  } = useSelector((state: RootType) => state);
  const { unity } = useSelector((state: RootType) => state.hall);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (unity) {
      dispatch(VouchersCreators.getVoucherSettingsRequest());
      dispatch(VouchersCreators.getGiftbackPeriodsRequest());
    }
  }, [unity]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if ((settings || null) !== null) {
      form.setFieldsValue({
        prefix_code: settings!.prefix_code || null,
        quantity: settings!.quantity > 0 ? settings!.quantity : null,
        deadline: settings!.term_of_use > 0 ? settings!.term_of_use : null,
        starting_date: (settings!.starting_date || null) !== null ? dayjs(settings!.starting_date) : null,
        ending_date: (settings!.ending_date || null) !== null ? dayjs(settings!.ending_date) : null,
      });
    }
  }, [settings]); //eslint-disable-line react-hooks/exhaustive-deps

  const dateFormat = 'DD/MM/YYYY';
  const today = Date.now();

  const handleSubmit = (values: ValuesForm) => {
    if (unity !== null && settings !== null) {
      dispatch(
        VouchersCreators.updateVoucherSettingsRequest({
          id: settings.id,
          prefix_code: values.prefix_code,
          quantity: Number(values.quantity),
          starting_date: values.starting_date.format('YYYY-MM-DD'),
          ending_date: values.ending_date.format('YYYY-MM-DD'),
          term_of_use: Number(values.deadline),
        })
      );
    }
  };

  const onChangeForm = () => setDisabled(false);

  return (
    <>
      {loadingSettings === true ? (
        <PageContainer sideColumn>
          <S.LoadingWrapper>
            <Loading size={35} />
          </S.LoadingWrapper>
        </PageContainer>
      ) : (
        <PageContainer sideColumn>
          <PageTitle>Ajustes de Giftback</PageTitle>
          <BoxContrasted className="col-start-1">
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              form={form}
              onChange={onChangeForm}
              initialValues={{ enabled: true }}
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <Form.Item
                  className="col-span-3"
                  name="prefix_code"
                  rules={rules.prefix_code}
                  label="Prefixo do código de giftback"
                >
                  <Input placeholder="ABC" disabled={loadingSettings} onChange={(e) => parseToUpperCase(e, form)} />
                </Form.Item>
                <Form.Item className="col-span-3" name="quantity" label="Quantidade" rules={rules.quantity}>
                  <Input type="number" disabled={loadingSettings} placeholder="20" />
                </Form.Item>
                <Form.Item className="col-span-2" name="deadline" label="Prazo máximo de uso" rules={rules.deadline}>
                  <Input type="number" suffix="dias" min={0} disabled={loadingSettings} placeholder="30" />
                </Form.Item>
                <Form.Item className="col-span-2" name="starting_date" label="Data inicial">
                  <DatePicker
                    className="w-full"
                    format={dateFormat}
                    inputReadOnly
                    disabled={loadingSettings}
                    disabledDate={(date) => date.isBefore(today)}
                    onChange={onChangeForm}
                  />
                </Form.Item>
                <Form.Item className="col-span-2" name="ending_date" label="Data final" rules={rules.ending_date}>
                  <DatePicker
                    className="w-full"
                    format={dateFormat}
                    inputReadOnly
                    disabled={loadingSettings}
                    onChange={onChangeForm}
                    disabledDate={(date) => date.isBefore(form.getFieldValue('starting_date'))}
                  />
                </Form.Item>
              </div>
            </Form>
            <Divider />
            <WeekDayDiscountSection />
            <Divider />
            <div className="flex items-center justify-end">
              <Button disabled={disabled} loading={savingSettings} onClick={form.submit}>
                Salvar alterações
              </Button>
            </div>
          </BoxContrasted>
        </PageContainer>
      )}
    </>
  );
};

const rules = {
  prefix_code: [
    {
      required: true,
      message: 'O campo de Código é obrigatório.',
    },
    (): RuleObject => ({
      validator(_, value) {
        if (value.length > 5) {
          return Promise.reject('O código deve ter no máximo 5 caracteres.');
        }

        if (!/^(?=.*[A-Z])[A-Z\d]+$/g.test(value)) {
          return Promise.reject(
            'O formato do código é inválido, é permitido apenas letras maiúsculas com ou sem número.'
          );
        }

        for (let i = 0; i < value.length; i++) {
          if (/[A-Z]/.test(value[i]) && value[i] !== value[i].toUpperCase()) {
            return Promise.reject('Todas as letras do código devem ser maiúsculas.');
          }
        }

        return Promise.resolve();
      },
    }),
  ],
  deadline: [
    {
      required: true,
      message: 'O prazo máximo de uso é obrigatório.',
    },
    (): RuleObject => ({
      validator(_, value) {
        if (!value) {
          return Promise.reject();
        }

        if (value < 1) {
          return Promise.reject('O valor mínimo para o prazo é de 1 dia.');
        }

        return Promise.resolve();
      },
    }),
  ],
  quantity: [
    (): RuleObject => ({
      validator(_, value) {
        if (typeof value === 'number' && value <= 0) {
          return Promise.reject('O valor mínimo para a quantidade de cupons é 1.');
        }

        return Promise.resolve();
      },
    }),
  ],
  ending_date: [
    ({ getFieldValue }: Pick<FormInstance, 'getFieldValue'>): RuleObject => ({
      validator(_, value) {
        const starting_at = getFieldValue('starting_at');

        if (value && starting_at) {
          const endingAt = dayjs(value);
          const startingAt = dayjs(starting_at);

          if (endingAt.isBefore(startingAt)) {
            return Promise.reject('A data final não pode ser anterior à data inicial.');
          }
        }

        return Promise.resolve();
      },
    }),
  ],
};

const parseToUpperCase = (e: React.ChangeEvent<HTMLInputElement>, form: FormInstance<any>) => {
  return form.setFieldsValue({ code: e.target.value.toUpperCase() });
};
