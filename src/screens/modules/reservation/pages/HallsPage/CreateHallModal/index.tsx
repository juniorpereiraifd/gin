import { type Dispatch, type FunctionComponent, type SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, Input, Radio } from 'antd';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Button } from 'src/stories/general/Button';
import { HALLS_TYPE } from 'src/utils/constants';
import type { RootType } from 'src/store/modules/rootReducer';
import { TriangleAlert } from 'lucide-react';

type CreateHallModalFormValues = {
  title: string;
  type: string;
};

type CreateHallModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const CreateHallModal: FunctionComponent<CreateHallModalProps> = (props) => {
  const { open, setOpen } = props;
  const dispatch = useDispatch();
  const {
    hall: { saving },
  } = useSelector((state: RootType) => state);
  const [form] = useForm();

  const handleClose = () => {
    setOpen(false);
  };

  const handleFinish = (value: CreateHallModalFormValues) => {
    dispatch(
      HallCreators.createHallRequest({
        hall: {
          name: value.title,
          type: value.type,
        },
        onSuccessCallback: () => {
          handleClose();
          form.resetFields();
        },
      })
    );
  };

  return (
    <Drawer
      title="Criar Salão"
      open={open}
      onClose={handleClose}
      footer={
        <div className="flex flex-col gap-4 py-3 px-2">
          <div className="flex gap-2 bg-amber-100 p-3 rounded-md border border-amber-200">
            <TriangleAlert size={16} className="text-amber-700 " />
            <p className="text-amber-700 text-xs">Depois de criado, o tipo de salão não pode ser alterado.</p>
          </div>
          <div className="flex items-center justify-end gap-4">
            <Button variant="outlined" htmlType="button" onClick={handleClose}>
              Cancelar
            </Button>
            <Button loading={saving} onClick={() => form.submit()}>
              Criar Salão
            </Button>
          </div>
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <FormItem label="Nome do salão" name="title" rules={rules.title}>
          <Input type="title" name="title" />
        </FormItem>
        <FormItem name="type" label="Tipo de salão" rules={rules.type}>
          <Radio.Group className="flex flex-col gap-4 [&_.ant-radio-wrapper-checked]:border-brand-400">
            <Radio value={HALLS_TYPE.TOTAL_SEATS} className="border border-stone-200 p-3 rounded-md">
              <span className="text-slate-800 font-medium">Lotação pelo número de pessoas</span>
              <p className="text-slate-500 text-xs">A capacidade do salão é definida pelo total de pessoas.</p>
            </Radio>
            <Radio value={HALLS_TYPE.TABLE_MAP} className="border border-stone-200 p-3 rounded-md">
              <span className="text-slate-800 font-medium">Lotação pelo número de lugares</span>
              <p className="text-slate-500 text-xs">
                A capacidade do salão é definida pelo número de mesas e lugares disponíveis no salão.
              </p>
            </Radio>
          </Radio.Group>
        </FormItem>
      </Form>
    </Drawer>
  );
};

const rules = {
  title: [{ required: true, message: 'O nome do salão é obrigatório.' }],
  type: [{ required: true, message: 'O tipo do salão é obrigatório.' }],
};
