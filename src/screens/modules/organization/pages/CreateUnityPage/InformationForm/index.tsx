import { useEffect, useState, type FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Divider, Input } from 'antd';
import type { RuleObject } from 'antd/es/form';
import { Cuisine } from 'src/store/modules/unity/reducer';
import { Select, InputMask } from 'src/stories/entry';
import ImageUpload from 'src/stories/entry/ImageUpload';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Button } from 'src/stories/general/Button';
import {
  getPhoneNumberUnformatted,
  getPhoneNumberWithNationalCode,
  removeNonNumeric,
  validateCnpj,
} from 'src/utils/helpers';
import api from 'src/services/api';
import { BoxContrasted } from 'src/components/BoxContrasted';

export type InformationFormValues = {
  id?: string | number;
  taxpayer_identification: string;
  name: string;
  about: string;
  telephone: string;
  cover: {
    name: string;
    content: string;
  } | null;
  logo: {
    name: string;
    content: string;
  } | null;
  website: string | null;
  timezone: string;
};

type InformationFormProps = {
  saving?: boolean;
  onFinish?: (values: InformationFormValues) => void;
};

export const InformationForm: FunctionComponent<InformationFormProps> = (props) => {
  const { saving, onFinish } = props;
  const [disabled, setDisabled] = useState(true);
  const [form] = useForm();
  const navigate = useNavigate();
  const [cover, setCover] = useState<{ name: string; content: string } | null>(null);
  const [logo, setLogo] = useState<{ name: string; content: string } | null>(null);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);

  useEffect(() => {
    (async () => {
      const { data: resp } = await api.get('/restaurant/v1/cuisines?pagination=0');

      setCuisines(resp.data);
    })();
  }, []);

  const onChangeForm = () => {
    setDisabled(false);
  };

  const handleFinish = (values: InformationFormValues) => {
    if (onFinish) {
      onFinish({
        ...values,
        taxpayer_identification: removeNonNumeric(values.taxpayer_identification),
        telephone: getPhoneNumberWithNationalCode(values.telephone),
        logo: logo,
        cover: cover,
      });
    }
  };

  return (
    <BoxContrasted>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          cuisines: [],
          status: 'not-listed',
          timezone: 'America/Sao_Paulo',
        }}
        onChange={onChangeForm}
        onFinish={handleFinish}
      >
        <span className="text-slate-700 font-medium text-base">Perfil da Unidade</span>
        <div className="flex flex-col items-center gap-4 my-6">
          <div className="flex-1 flex items-center justify-center w-full [&_>div]:w-full">
            <ImageUpload
              onChangeCallback={(image: { name: string; content: string }) => setCover(image)}
              onDelete={() => setCover(null)}
            />
          </div>
          <div className="flex-1 flex items-center justify-center w-1/2 [&_>div]:w-full">
            <ImageUpload
              onChangeCallback={(image: { name: string; content: string }) => setLogo(image)}
              onDelete={() => setLogo(null)}
            />
          </div>
        </div>
        <FormItem hidden noStyle name="timezone">
          <Input />
        </FormItem>
        <FormItem hidden noStyle name="status">
          <Input />
        </FormItem>
        <FormItem label="CNPJ" name="taxpayer_identification" rules={rules.cnpj}>
          <InputMask mask="99.999.999/9999-99" />
        </FormItem>
        <FormItem label="Nome da Unidade" name="name" rules={rules.name}>
          <Input />
        </FormItem>
        <FormItem label="Telefone" name="telephone" rules={rules.telephone}>
          <InputMask mask="(99) 99999-9999" />
        </FormItem>
        <FormItem name="website" label="Website">
          <Input />
        </FormItem>
        <FormItem name="cuisines" label="Tipo de cozinha" rules={rules.cuisine}>
          <Select
            mode="multiple"
            tokenSeparators={[',', ' ']}
            onChange={() => setDisabled(false)}
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={cuisines.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </FormItem>
        <FormItem label="Descrição" name="about">
          <Input.TextArea rows={5} />
        </FormItem>
        <Divider />
        <div className="flex items-center gap-4 justify-end">
          <Button htmlType="button" variant="outlined" onClick={() => navigate('/units')}>
            Cancelar
          </Button>
          <Button htmlType="button" disabled={disabled} loading={saving} onClick={() => form.submit()}>
            Criar Unidade
          </Button>
        </div>
      </Form>
    </BoxContrasted>
  );
};

const rules = {
  name: [{ required: true, message: 'O nome da unidade é obrigatório' }],
  telephone: [{ required: true, message: 'O telefone da unidade é obrigatório' }],

  cuisine: [{ required: true, message: 'É obrigatório determinar o tipo de cozinha' }],
  cnpj: [
    { required: true, message: 'O cnpj é obrigatório' },
    (): RuleObject => ({
      validator(_, value) {
        if (!value || (getPhoneNumberUnformatted(value).length === 14 && validateCnpj(value))) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('O CNPJ é inválido!'));
      },
    }),
  ],
};
