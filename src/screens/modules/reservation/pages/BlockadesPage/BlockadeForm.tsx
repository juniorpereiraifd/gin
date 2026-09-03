import { useState, useEffect } from 'react';
import { Col, Row, Form, Switch } from 'antd';
import { Modal } from 'src/stories/feedback/Modal';
import { Title } from 'src/stories/typography';
import { useSelector, useDispatch } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { Input, TimePicker } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import Space from 'src/stories/utils/Space';
import { Creators as BlockadeCreators } from 'src/store/modules/blockade/actions';
import { BlockadeItemProps } from 'src/store/modules/blockade/reducer';
import dayjs from 'dayjs';

import * as S from './styles';

const rules = {
  starts_at: [{ required: true, message: 'A hora de início é obrigatória!' }],
};

const BlockadeForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [blocked, setBlocked] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const { saving, isOpen, editable, errors } = useSelector((state: RootType) => state.blockade);

  useEffect(() => {
    form.resetFields();
    setBlocked(false);
    if (editable) {
      form.setFieldsValue({
        ...editable,
        starts_at: dayjs(editable.starts_at, 'HH:mm'),
        ends_at: dayjs(editable.ends_at, 'HH:mm'),
      });
      setBlocked(editable.ends_at === '23:59' && editable.starts_at === '00:00' ? true : false);
    }
  }, [editable, form, isOpen]);

  const onClose = () => dispatch(BlockadeCreators.hideModal());

  const onFinish = (values: BlockadeItemProps) => {
    return editable
      ? dispatch(
          BlockadeCreators.editBlockadeRequest({
            ...values,
            id: editable.id,
            date: dayjs(editable.date).format('YYYY-MM-DD'),
            starts_at: dayjs(values.starts_at).format('HH:mm'),
            ends_at: dayjs(values.ends_at).format('HH:mm'),
          })
        )
      : dispatch(
          BlockadeCreators.createBlockadeRequest({
            ...values,
            start_date: dayjs(values.date_range[0]).format('YYYY-MM-DD'),
            end_date: dayjs(values.date_range[1]).format('YYYY-MM-DD'),
            starts_at: dayjs(values.starts_at).format('HH:mm'),
            ends_at: dayjs(values.ends_at).format('HH:mm'),
          })
        );
  };

  useEffect(() => {
    if (errors instanceof Array) {
      form.setFields(errors);
    }
  }, [errors, form]);

  return (
    <Modal
      title={<Title level={3}>{editable ? 'Editar exceção' : 'Adicionar exceção'}</Title>}
      open={!!isOpen}
      centered
      destroyOnClose
      footer={null}
      onCancel={onClose}
      width="500px"
    >
      <Form
        layout="vertical"
        form={form}
        onChange={() => setDisabled(false)}
        initialValues={{
          active: true,
          blocked_day: false,
        }}
        onFinish={onFinish}
      >
        <Row justify="space-between">
          <Col xl={24} sm={24} md={12}>
            <Space size={0} direction="vertical">
              <Form.Item label="Título" name="title">
                <Input />
              </Form.Item>
              <Form.Item noStyle hidden name="active">
                <Input />
              </Form.Item>
            </Space>
            {!editable && (
              <Form.Item label="Data" name="date_range">
                <S.CustomDatePicker format="DD/MM/YYYY" />
              </Form.Item>
            )}
            <S.SwitchWrapper>
              <Switch
                checked={blocked}
                onChange={() => {
                  setBlocked(!blocked);

                  if (!blocked) {
                    form.setFieldsValue({
                      starts_at: dayjs('24:00', 'HH/mm'),
                      ends_at: dayjs('23:59', 'HH/mm'),
                    });
                  }
                }}
              />
              <span>Bloquear o dia inteiro</span>
            </S.SwitchWrapper>
            <S.HourWrapper hidden={blocked}>
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
              <Form.Item
                label="Final"
                name="ends_at"
                style={{ maxWidth: '50%' }}
                rules={[
                  { required: true, message: 'A hora final é obrigatória!' },
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      const startAt = form.getFieldValue('starts_at');
                      if (value.isBefore(startAt) && !blocked) {
                        return Promise.reject('O horário final está menor');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
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
          </Col>
        </Row>
        <Row align="middle" justify="center">
          <S.Footer>
            <Button htmlType="button" variant="outlined" onClick={onClose}>
              Cancelar
            </Button>
            <Button disabled={disabled} loading={saving} onClick={() => form.submit()}>
              Salvar
            </Button>
          </S.Footer>
        </Row>
      </Form>
    </Modal>
  );
};

export default BlockadeForm;
