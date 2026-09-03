import type { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Modal } from 'antd';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { Button } from 'src/stories/general/Button';
import type { RootType } from 'src/store/modules/rootReducer';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';

type EditHallModalFormValues = {
  title: string;
};

type EditHallModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  hallId: string;
};

export const EditHallModal: FunctionComponent<EditHallModalProps> = (props) => {
  const { open, setOpen, hallId } = props;
  const dispatch = useDispatch();
  const [form] = useForm();
  const {
    hall: { saving },
  } = useSelector((state: RootType) => state);

  const handleClose = () => {
    setOpen(false);
  };

  const handleFinish = (value: EditHallModalFormValues) => {
    dispatch(
      HallCreators.updateHallRequest({
        hall: {
          id: hallId,
          name: value.title,
        },
        onCallbackSuccess: () => {
          handleClose();
          form.resetFields();
        },
      })
    );
  };

  return (
    <Modal
      title="Editar Salão"
      open={open}
      onCancel={handleClose}
      footer={
        <div className="flex items-center justify-end gap-4">
          <Button variant="outlined" htmlType="button" onClick={handleClose}>
            Cancelar
          </Button>
          <Button loading={saving} onClick={() => form.submit()}>
            Salvar
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <FormItem label="Nome do salão" name="title" rules={rules.title}>
          <Input type="title" name="title" />
        </FormItem>
      </Form>
    </Modal>
  );
};

const rules = {
  title: [{ required: true, message: 'O nome do salão é obrigatório!' }],
};
