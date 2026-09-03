import { FunctionComponent, useEffect, useRef } from 'react';
import { Input, DatePicker, Drawer, Row, Col } from 'antd';
import { RootType } from 'src/store/modules/rootReducer';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { FormInstance } from 'antd/lib/form';
import { RuleObject } from 'antd/es/form';
import { Button } from 'src/stories/general/Button';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';

type PromoCodeWriteModalProps = {
  open: boolean;
  onCancel: () => void;
};

export const PromoCodeWriteModal: FunctionComponent<PromoCodeWriteModalProps> = (props) => {
  const { open, onCancel } = props;
  const {
    bookingExperiences: { editablePromoCode },
  } = useSelector((state: RootType) => state);
  const [form] = useForm();
  const dateFormat = 'DD/MM/YYYY';
  const today = Date.now();

  useEffect(() => {
    if (editablePromoCode !== null) {
      const { code, discount, quantity, starting_at, ending_at } = editablePromoCode;

      form.setFieldsValue({
        code,
        discount: discount,
        quantity: quantity,
        starting_at: starting_at ? dayjs(starting_at) : undefined,
        ending_at: ending_at ? dayjs(ending_at) : undefined,
      });
    }
  }, [editablePromoCode, form, open]);

  useResetFormOnCloseModal({ form, open });

  return (
    <Drawer
      open={open}
      title={`${editablePromoCode !== null ? 'Editar' : 'Criar'} código promocional`}
      onClose={onCancel}
      footer={
        <div className="flex items-center justify-end gap-4 py-2">
          <Button variant="outlined" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={() => form.submit()}>{editablePromoCode !== null ? 'Editar' : 'Adicionar'} código</Button>
        </div>
      }
    >
      <Form name="promoCodeForm" layout="vertical" form={form}>
        <Row>
          <Col span={24}>
            <FormItem name="code" label="Código promocional" rules={rules.code}>
              <Input placeholder="EXEMPLO10" onChange={(e) => parseToUpperCase(e, form)} />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem name="discount" label="Desconto" rules={rules.discount}>
              <Input suffix="%" type="number" min={0} max={100} placeholder="10%" />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem name="quantity" label="Quantidade" rules={rules.quantity}>
              <Input type="number" placeholder="20" />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem name="starting_at" label="Data inicial">
              <DatePicker
                className="w-full"
                format={dateFormat}
                inputReadOnly
                disabledDate={(date) => date.isBefore(today)}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem name="ending_at" label="Data final" rules={rules.ending_at}>
              <DatePicker
                className="w-full"
                format={dateFormat}
                inputReadOnly
                disabledDate={(date) => date.isBefore(form.getFieldValue('starting_at'))}
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

const useResetFormOnCloseModal = ({ form, open }: { form: FormInstance; open: boolean }) => {
  const prevOpenRef = useRef<boolean>();

  useEffect(() => {
    prevOpenRef.current = open;
  }, [open]);

  const prevOpen = prevOpenRef.current;

  useEffect(() => {
    if (!open && prevOpen) {
      form.resetFields();
    }
  }, [form, prevOpen, open]);
};

const rules = {
  code: [
    {
      required: true,
      message: 'O campo de Código é obrigatório.',
    },
    (): RuleObject => ({
      validator(_, value) {
        if (value.length > 20) {
          return Promise.reject('O código deve ter no máximo 20 caracteres.');
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
  discount: [
    {
      required: true,
      message: 'O desconto do código é obrigatório.',
    },
    (): RuleObject => ({
      validator(_, value) {
        if (!value) {
          return Promise.reject();
        }

        if (value < 1) {
          return Promise.reject('O valor mínimo para o desconto é 1%.');
        }

        if (value > 100) {
          return Promise.reject('O valor máximo para o desconto é 100%.');
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
  ending_at: [
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
