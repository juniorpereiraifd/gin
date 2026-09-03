import { useEffect, useState, type FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, Input, Radio } from 'antd';
import { File, List, ScanText } from 'lucide-react';
import { Creators as CustomFieldCreators } from 'src/store/modules/customField/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import { Switch } from 'src/stories/entry/Switch';
import { Form, useForm, useWatch } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Reveal } from 'src/stories/display/Reveal';
import { ListOptions } from 'src/stories/entry/ListOptions';

export type CustomFieldMutationDrawerFormValues = {
  title: string;
  type: 'text' | 'select';
  required: boolean;
  options?: string[];
};

type CustomFieldMutationDrawerProps = {
  unit_id: string;
};

export const CustomFieldMutationDrawer: FunctionComponent<CustomFieldMutationDrawerProps> = (props) => {
  const { unit_id } = props;
  const dispatch = useDispatch();
  const [form] = useForm();
  const {
    customField: { isOpen, editable, saving },
  } = useSelector((state: RootType) => state);
  const [formDirty, setFormDirty] = useState(false);
  const typeFieldValue = useWatch('type', form);

  useEffect(() => {
    if (editable) {
      form.setFieldsValue({
        ...editable,
        options: editable.type === 'select' && editable.metadata?.options ? editable.metadata.options : [],
      });
    }
  }, [editable, isOpen]);

  const handleSubmit = (values: CustomFieldMutationDrawerFormValues) => {
    const payload = {
      type: values.type,
      title: values.title,
      required: values.required || false,
      ...(values.type === 'select' && values.options !== undefined ? { metadata: { options: values.options } } : {}),
    };

    dispatch(
      editable && editable.id
        ? CustomFieldCreators.editCustomFieldRequest(
            {
              customField: payload,
              customFieldId: editable.id,
              unitId: unit_id,
            },
            handleClose
          )
        : CustomFieldCreators.createCustomFieldRequest(
            {
              customField: payload,
              unitId: unit_id,
            },
            handleClose
          )
    );

    setFormDirty(false);
  };

  const handleClose = () => {
    dispatch(CustomFieldCreators.hideModal());
    dispatch(CustomFieldCreators.setEditableItem(null));
    form.resetFields();
    setFormDirty(false);
  };

  return (
    <Drawer
      destroyOnClose
      title={<Title level={3}>{editable ? 'Editar campo personalizado' : 'Novo campo personalizado'}</Title>}
      open={!!isOpen}
      onClose={handleClose}
      width="750px"
      footer={
        <div className="flex items-center justify-end gap-4 p-2">
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={!formDirty} loading={saving} onClick={() => form.submit()}>
            {editable ? 'Editar campo' : 'Criar campo'}
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form} onChange={() => setFormDirty(true)} onFinish={handleSubmit}>
        <FormItem label="Tipo do campo" name="type" rules={rules.type}>
          <Radio.Group className="grid grid-cols-2 gap-4 [&_.ant-radio-wrapper-checked]:border-brand-400 [&_.ant-radio-wrapper-in-form-item]:m-0">
            <Radio value="text" className="border border-stone-200 p-3 rounded-md">
              <span className="flex items-center gap-2 text-slate-800 font-medium">
                <ScanText size={14} />
                Texto
              </span>
              <p className="text-slate-500 text-xs mt-1">Campo simples de texto aberto para escrita</p>
            </Radio>
            <Radio value="select" className="border border-stone-200 p-3 rounded-md">
              <span className="flex items-center gap-2 text-slate-800 font-medium">
                <List size={14} />
                Opções
              </span>
              <p className="text-slate-500 text-xs mt-1">Campo com opções pré-definidas</p>
            </Radio>
            <Radio value="upload" className="border border-stone-200 p-3 rounded-md">
              <span className="flex items-center gap-2 text-slate-800 font-medium">
                <File size={14} />
                Arquivo
              </span>
              <p className="text-slate-500 text-xs mt-1">Campo para salvar arquivos na reserva</p>
            </Radio>
          </Radio.Group>
        </FormItem>
        {typeFieldValue !== undefined && (
          <div className="grid grid-cols-2 gap-4">
            <FormItem
              label="Título do campo"
              name="title"
              rules={rules.title}
              tooltip="Esse será o título do campo exibido no formulário."
            >
              <Input />
            </FormItem>
            <Reveal>
              {typeFieldValue === 'select' && (
                <FormItem label="Opções" name="options" rules={rules.options}>
                  <ListOptions />
                </FormItem>
              )}
            </Reveal>
            <FormItem name="required" className="col-start-1">
              <Switch label="Campo obrigatório" onChange={() => setFormDirty(true)} />
            </FormItem>
          </div>
        )}
      </Form>
    </Drawer>
  );
};

const rules = {
  title: [{ required: true, message: 'Por favor, informe o título!' }],
  type: [{ required: true, message: 'Por favor, selecione o tipo do campo!' }],
  options: [{ required: true, message: 'Por favor, selecione as opções!' }],
};
