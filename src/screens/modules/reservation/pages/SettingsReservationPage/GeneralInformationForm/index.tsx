import { Divider, Input, InputNumber } from 'antd';
import type { RuleObject } from 'antd/es/form';
import { useDispatch, useSelector } from 'react-redux';
import { Creators as SettingCreators } from 'src/store/modules/setting/actions';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Heading } from 'src/ui/Typograph';
import { TextArea } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import { useEffect, useState } from 'react';
import type { RootType } from 'src/store/modules/rootReducer';

type GeneralInformationFormValues = {
  days_in_advance: number;
  tolerance: number;
  conditions: string;
  additional_information: string;
};

export const GeneralInformationForm = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const {
    setting: { reservation, saving },
  } = useSelector((state: RootType) => state);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);

  useEffect(() => {
    form.setFieldsValue(reservation);
  }, [form, reservation]);

  const handleFinish = (values: GeneralInformationFormValues) => {
    if (!values) {
      return;
    }

    dispatch(SettingCreators.saveSettingRequest(values));
  };

  return (
    <BoxContrasted>
      <Form form={form} layout="vertical" onFinish={handleFinish} onChange={() => setIsFormDirty(true)}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <FormItem
            className="col-span-2"
            name="days_in_advance"
            label="Janela de reserva no calendário (em dias)"
            tooltip={{
              title: (
                <p>
                  Inclua a quantidade de dias que você quer que os seus clientes vejam disponíveis para reserva no
                  calendário, considerando sempre dias corridos como por exemplo: 30 dias para um mês, 45 dias para um
                  mês e meio, 120 dias para quatro meses.
                  <br />
                  <br />
                  Exemplo: selecionando a disponibilidade para 1 mês e estando em 1 de janeiro, seus clientes poderão
                  fazer reservas até 31 de janeiro.
                </p>
              ),
            }}
            rules={rules['days-in-advance']}
          >
            <Input type="number" min="1" max="255" />
          </FormItem>
        </div>
        <Divider />
        <div className="flex flex-col gap-2 mb-6">
          <Heading level="5">Informações personalizadas</Heading>
          <p className="text-xs text-gray-500">
            Personalize as informações abaixo de acordo com as regras e normas do restaurante. Elas serão exibidas no
            seu widget e em toda a comunicação via email relacionada a novas reservas.{' '}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="col-span-6 grid grid-cols-1 gap-6 sm:grid-cols-6">
            <FormItem className="col-span-1" name="tolerance" label="Tolerância">
              <InputNumber className="w-full" type={'number'} min={1} max={240} placeholder={'15'} suffix={'minutos'} />
            </FormItem>
          </div>
          <FormItem className="col-span-3" name="conditions" label="Regras e Condições">
            <TextArea rows={4} />
          </FormItem>
          <FormItem className="col-span-3" name="additional_information" label="Informações adicionais">
            <TextArea rows={4} maxLength={100} />
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
  'days-in-advance': [
    {
      required: true,
      message: 'O campo Janela de reserva no calendário (em dias) é obrigatório.',
    },
    (): RuleObject => ({
      validator(_, value) {
        if (!value) {
          return Promise.reject();
        }
        if (value < 1) {
          return Promise.reject('Quantidade mínima é 1 dia.');
        }
        if (value > 255) {
          return Promise.reject('Quantidade máxima permitida é 255 dias.');
        }
        return Promise.resolve();
      },
    }),
  ],
};
