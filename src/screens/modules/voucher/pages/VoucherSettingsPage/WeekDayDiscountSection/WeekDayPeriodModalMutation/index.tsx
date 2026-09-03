import { FunctionComponent, useEffect } from 'react';
import { Button, Form, Input, Modal, ModalProps, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { RuleObject } from 'antd/es/form';
import { FormInstance } from 'antd/lib';
import { Period, WeekdayPeriod } from 'src/store/modules/voucher/reducer';

const format = 'HH:mm';

type WeekDayPeriodModalMutationProps = ModalProps & {
  selectedPeriod?: WeekdayPeriod;
  saving?: boolean;
  onSubmit: (values: Period) => void;
};

export const WeekDayPeriodModalMutation: FunctionComponent<WeekDayPeriodModalMutationProps> = (props) => {
  const { selectedPeriod, saving, ...rest } = props;
  const [form] = Form.useForm();

  const handleFinish = (values: Period) => {
    props.onSubmit(values);
  };

  useEffect(() => {
    if (selectedPeriod !== undefined) {
      form.setFieldsValue({
        name: selectedPeriod.name,
        discount_percentage: selectedPeriod.discount_percentage,
        hour_start: dayjs(selectedPeriod.hour_start, 'HH:mm'),
        hour_end: dayjs(selectedPeriod.hour_end, 'HH:mm'),
      });
    }
  }, [selectedPeriod]);

  return (
    <Modal
      {...rest}
      destroyOnClose
      title={selectedPeriod !== undefined ? 'Editar turno' : 'Criar turno'}
      onCancel={(e) => {
        props.onCancel?.(e);
        form.resetFields();
      }}
      onClose={(e) => {
        props.onClose?.(e);
        form.resetFields();
      }}
      afterOpenChange={(open) => {
        if (open === false) {
          form.resetFields();
        }
      }}
      footer={(_, { CancelBtn }) => (
        <>
          <CancelBtn />
          <Button type="primary" onClick={form.submit} loading={saving}>
            Salvar
          </Button>
        </>
      )}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <div className="grid grid-cols-1 gap-x-6 mt-6 sm:grid-cols-6">
          <Form.Item className="col-span-3" name="name" label="Nome do turno" rules={rules.name}>
            <Input />
          </Form.Item>
          <Form.Item
            className="col-span-3"
            name="discount_percentage"
            label="Desconto"
            rules={rules.discount_percentage}
          >
            <Input suffix="%" type="number" min={0} max={100} placeholder="10%" />
          </Form.Item>
          <Form.Item className="col-span-3" name="hour_start" label="Hora inicial" rules={rules.hour_start}>
            <TimePicker placeholder="00:00" className="w-full" showNow={false} format={format} />
          </Form.Item>
          <Form.Item className="col-span-3" name="hour_end" label="Hora final" rules={rules.hour_end}>
            <TimePicker placeholder="00:00" className="w-full" showNow={false} format={format} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

const rules = {
  name: [
    {
      required: true,
      message: 'O nome do turno é obrigatório.',
    },
  ],
  discount_percentage: [
    {
      required: true,
      message: 'O desconto do turno é obrigatório.',
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
  hour_start: [
    {
      required: true,
      message: 'A hora inicial do turno é obrigatória.',
    },
  ],
  hour_end: [
    {
      required: true,
      message: 'A hora final do turno é obrigatória.',
    },
    ({ getFieldValue }: Pick<FormInstance, 'getFieldValue'>): RuleObject => ({
      validator(_, value) {
        const hourStart = getFieldValue('hour_start');

        if (value && hourStart) {
          const hourEndParsed = dayjs(value);
          const hourStartParsed = dayjs(hourStart);

          if (hourEndParsed.isBefore(hourStartParsed)) {
            return Promise.reject('A hora final não pode ser anterior à hora inicial.');
          }
        }

        return Promise.resolve();
      },
    }),
  ],
};
