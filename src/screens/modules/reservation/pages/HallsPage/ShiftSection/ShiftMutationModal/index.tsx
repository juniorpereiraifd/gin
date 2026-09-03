import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Modal, TimePicker } from 'antd';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as ShiftCreators } from 'src/store/modules/shift/actions';
import Days from 'src/stories/entry/Days';
import { useEffect, useState } from 'react';
import { FormInstance } from 'antd/lib';
import { RuleObject } from 'antd/es/form';
import dayjs from 'dayjs';
import { Button } from 'src/stories/general/Button';

export type ShiftFormProps = {
  weekday: number;
  name: string;
  started_at: string;
  ended_at: string;
};

const format = 'HH:mm';
const fullDateFormat = 'YYYY-MM-DD HH:mm:ss';

export const ShiftMutationModal = () => {
  const dispatch = useDispatch();
  const {
    shift: { saving: savingShift, isOpen, editable },
  } = useSelector((state: RootType) => state);
  const [form] = Form.useForm();
  const [days, setDays] = useState<number[]>([]);

  useEffect(() => {
    if (editable) {
      setDays(editable.weekday);
      form.setFieldsValue({
        ...editable,
        started_at: dayjs(editable.starts_at, format),
        ended_at: dayjs(editable.ends_at, format),
      });
    }
  }, [editable, form]);

  const handleFinish = (values: ShiftFormProps) => {
    if (editable) {
      dispatch(
        ShiftCreators.editShiftRequest({
          id: editable.id,
          ...values,
          weekday: days,
          started_at: dayjs(values.started_at, fullDateFormat).format(format),
          ended_at: dayjs(values.ended_at, fullDateFormat).format(format),
        })
      );
    } else {
      dispatch(
        ShiftCreators.createShiftRequest({
          ...values,
          weekday: days,
          started_at: dayjs(values.started_at, fullDateFormat).format(format),
          ended_at: dayjs(values.ended_at, fullDateFormat).format(format),
        })
      );
    }

    form.resetFields();
  };

  const handleClose = () => {
    form.resetFields();
    setDays([]);
    dispatch(ShiftCreators.closeModal());
  };

  return (
    <Modal
      title={editable ? 'Editar turno' : 'Novo turno'}
      open={!!isOpen}
      destroyOnClose
      afterClose={handleClose}
      width={380}
      footer={false}
      closable={false}
      onCancel={handleClose}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Days
          activeDays={days}
          onChange={(day) => {
            if (days.find((d) => d === day)) {
              setDays([...days.filter((d) => d !== day)]);
            } else {
              setDays([...days, day]);
            }
          }}
        />
        {!days.length && <p style={{ color: '#ff4d4f' }}>É obrigatório pelo menos um dia da semana</p>}
        <Form.Item label="Nome do turno" name="name" rules={rules.title} className="my-4">
          <Input type="name" name="name" />
        </Form.Item>
        <div className="flex items-center">
          <Form.Item className="w-full" label="Início" name="started_at" rules={rules.starts_at}>
            <TimePicker needConfirm={false} placeholder="00:00" className="w-full" showNow={false} format={format} />
          </Form.Item>
          &nbsp;
          <Form.Item className="w-full" label="Final" name="ended_at" rules={rules.ended_at}>
            <TimePicker needConfirm={false} placeholder="00:00" className="w-full" showNow={false} format={format} />
          </Form.Item>
        </div>
      </Form>
      <div className="flex items-center justify-between">
        <Button variant="outlined" onClick={() => dispatch(ShiftCreators.closeModal())}>
          Cancelar
        </Button>
        <Button loading={savingShift} disabled={!days.length} onClick={() => form.submit()}>
          Salvar
        </Button>
      </div>
    </Modal>
  );
};

const rules = {
  title: [{ required: true, message: 'O nome do turno é obrigatório!' }],
  starts_at: [
    {
      required: true,
      message: 'O horário é obrigatório',
    },
    ({ getFieldValue }: Pick<FormInstance, 'getFieldValue'>): RuleObject => ({
      validator(_, value) {
        if (dayjs(value, 'HH:mm').isBefore(dayjs(getFieldValue('ended_at'), 'HH:mm'))) {
          return Promise.resolve();
        }

        return Promise.reject();
      },
    }),
  ],
  ended_at: [
    {
      required: true,
      message: 'O horário é obrigatório',
    },
  ],
};
