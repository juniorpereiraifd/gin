import { useState, useEffect, FunctionComponent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { FormInstance, RuleObject } from 'antd/es/form';
import { Title } from 'src/stories/typography';
import { Button } from 'src/stories/general/Button';
import { RootType } from 'src/store/modules/rootReducer';
import { TimePicker } from 'src/stories/entry';
import { Creators as RestrictionCreators } from 'src/store/modules/restriction/actions';
import Days from 'src/stories/entry/Days';
import Space from 'src/stories/utils/Space';
import { Modal } from 'src/stories/feedback/Modal';
import * as S from './styles';

const rules = {
  starts_at: [
    ({ getFieldValue }: Pick<FormInstance, 'getFieldValue'>): RuleObject => ({
      validator(_, value) {
        if (dayjs(getFieldValue('ends_at')).format('HH:mm') !== dayjs(value).format('HH:mm')) {
          return Promise.resolve();
        }

        return Promise.reject('');
      },
    }),
  ],
};

type NewRestrictionFormProps = {
  menuId: string;
};

const NewRestrictionForm: FunctionComponent<NewRestrictionFormProps> = (props) => {
  const { menuId } = props;

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [days, setDays] = useState<Array<number>>([]);
  const { isOpen, saving } = useSelector((state: RootType) => state.restriction);

  useEffect(() => {
    form.resetFields();
    setDays([]);
  }, [form, isOpen]);

  const handleCloseModal = () => dispatch(RestrictionCreators.hideModal());

  const onFinish = (values: { starts_at: string; ends_at: string }) =>
    dispatch(
      RestrictionCreators.createRestrictionRequest({
        menu: menuId,
        starts_at: dayjs(values.starts_at).format('HH:mm'),
        ends_at: dayjs(values.ends_at).format('HH:mm'),
        weekday: days,
      })
    );

  return (
    <Modal
      title={<Title level={3}>Adicionar horário</Title>}
      open={!!isOpen}
      centered
      destroyOnClose
      footer={null}
      width="27%"
      onCancel={handleCloseModal}
    >
      <Form layout="vertical" onChange={() => setDisabled(false)} onFinish={onFinish} form={form}>
        <Form.Item name="weekday" label="Dia da semana">
          <Days
            activeDays={days}
            onChange={(day) => {
              setDisabled(false);
              if (days.find((d) => d === day)) {
                setDays([...days.filter((d) => d !== day)]);
              } else {
                setDays([...days, day]);
              }
            }}
          />
        </Form.Item>

        <Space direction="vertical" size={15}>
          <Title level={6}> Horário</Title>

          <S.HourWrapper>
            <Form.Item label="Início" name="starts_at" rules={rules.starts_at}>
              <TimePicker
                needConfirm={false}
                placeholder="00:00"
                showNow={false}
                format="HH:mm"
                allowClear={false}
                inputReadOnly={true}
              />
            </Form.Item>
            <Form.Item label="Final" name="ends_at">
              <TimePicker
                needConfirm={false}
                placeholder="00:00"
                showNow={false}
                format="HH:mm"
                allowClear={false}
                inputReadOnly={true}
              />
            </Form.Item>
          </S.HourWrapper>
        </Space>
      </Form>

      <S.Footer>
        <Button variant="outlined" onClick={handleCloseModal}>
          Cancelar
        </Button>
        <Button disabled={disabled || !days.length} loading={saving} onClick={() => form.submit()}>
          Adicionar
        </Button>
      </S.Footer>
    </Modal>
  );
};

export default NewRestrictionForm;
