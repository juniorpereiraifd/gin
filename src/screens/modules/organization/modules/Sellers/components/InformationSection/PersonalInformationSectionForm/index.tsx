import { Fragment, type FunctionComponent } from 'react';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Col, DatePicker, Divider, Input, InputNumber, Row, Select, type FormInstance } from 'antd';
import { Heading } from 'src/ui/Typograph';
import { cpfMask, currencyMask, phoneMask } from 'src/utils/helpers';
import { AddressBaseForm } from 'src/stories/entry/AddressBaseForm';
import type { Rule } from 'antd/es/form';
import type { Dayjs } from 'dayjs';
import { sellerSegments } from '../../../utils/constants';

type PersonalInformationSectionFormProps = {
  form: FormInstance<any>;
  sellerType: 'business' | 'individual';
};

export const PersonalInformationSectionForm: FunctionComponent<PersonalInformationSectionFormProps> = (props) => {
  const { form, sellerType } = props;

  return (
    <Fragment>
      <Divider />
      <div className="mb-8">
        <Heading level="4">Informações pessoais</Heading>
      </div>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem label="Nome" name="first_name" rules={rules.first_name}>
            <Input />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Sobrenome" name="last_name" rules={rules.last_name}>
            <Input />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem label="E-mail" name="email" rules={rules.email}>
            <Input />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Telefone" name="phone" rules={rules.phone}>
            <Input onChange={(e) => form.setFieldsValue({ phone: phoneMask(e.target.value) })} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem label="CPF" name="cpf" rules={rules.cpf}>
            <Input onChange={(e) => form.setFieldsValue({ cpf: cpfMask(e.target.value) })} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Data de nascimento" name="birth_date" rules={rules.birth_date}>
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem label="Receita" name="revenue" rules={rules.revenue}>
            <InputNumber<number>
              className="w-full"
              controls={false}
              defaultValue={0}
              formatter={currencyMask}
              parser={(value) => Number(currencyMask(value ?? '').replace(/[^0-9]+/g, ''))}
            />
          </FormItem>
        </Col>
        {sellerType === 'individual' && (
          <Col span={12}>
            <FormItem label="Segmento" name="mcc" rules={rules.mcc}>
              <Select
                placeholder="Selecione o segmento do negócio"
                options={sellerSegments.map((segment) => ({ label: segment.name, value: segment.value }))}
              />
            </FormItem>
          </Col>
        )}
      </Row>
      <div className="my-6">
        <Heading level="6">Endereço</Heading>
      </div>
      <AddressBaseForm
        form={form}
        fields={{
          zip_code: 'zip_code',
          street: 'street',
          number: 'number',
          complement: 'complement',
          district: 'district',
          city: 'city',
          state: 'state',
        }}
        rules={rules}
      />
    </Fragment>
  );
};

export type PersonalInformationFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cpf: string;
  revenue: number;
  birth_date: Dayjs;
  zip_code: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
};

const rules: Record<string, Rule[]> = {
  first_name: [{ required: true, message: 'Campo obrigatório' }],
  last_name: [{ required: true, message: 'Campo obrigatório' }],
  email: [
    { type: 'email', message: 'Informe um e-mail válido.' },
    { required: true, message: 'Campo obrigatório' },
  ],
  phone: [
    { required: true, message: 'Campo obrigatório' },
    { pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/, message: 'Informe um telefone válido.' },
  ],
  mcc: [{ required: true, message: 'Campo obrigatório' }],
  cpf: [{ required: true, message: 'Campo obrigatório' }],
  revenue: [{ required: true, message: 'Campo obrigatório' }],
  birth_date: [{ required: true, message: 'Campo obrigatório' }],
  zip_code: [{ required: true, message: 'Campo obrigatório' }],
  street: [{ required: true, message: 'Campo obrigatório' }],
  number: [{ required: true, message: 'Campo obrigatório' }],
  district: [{ required: true, message: 'Campo obrigatório' }],
  city: [{ required: true, message: 'Campo obrigatório' }],
  state: [{ required: true, message: 'Campo obrigatório' }],
};
