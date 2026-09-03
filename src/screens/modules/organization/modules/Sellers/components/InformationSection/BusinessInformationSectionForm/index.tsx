import { Fragment, type FunctionComponent } from 'react';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Col, DatePicker, Divider, Input, InputNumber, Row, Select, type FormInstance } from 'antd';
import { Heading } from 'src/ui/Typograph';
import { cnpjMask, currencyMask, phoneMask } from 'src/utils/helpers';
import { AddressBaseForm } from 'src/stories/entry/AddressBaseForm';
import type { Rule } from 'antd/es/form';
import type { Dayjs } from 'dayjs';
import { sellerSegments } from '../../../utils/constants';

type BusinessInformationSectionFormProps = {
  form: FormInstance<any>;
};

export const BusinessInformationSectionForm: FunctionComponent<BusinessInformationSectionFormProps> = (props) => {
  const { form } = props;

  return (
    <Fragment>
      <Divider />
      <div className="mb-8">
        <Heading level="4">Informações do estabelecimento</Heading>
      </div>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem label="Nome" name="business_name" rules={rules.business_name}>
            <Input />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="CNPJ" name="business_document" rules={rules.business_document}>
            <Input onChange={(e) => form.setFieldsValue({ business_document: cnpjMask(e.target.value) })} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="Descrição" name="business_description" rules={rules.business_description}>
            <Input.TextArea />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem label="E-mail" name="business_email" rules={rules.business_email}>
            <Input />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Telefone" name="business_phone" rules={rules.business_phone}>
            <Input onChange={(e) => form.setFieldsValue({ business_phone: phoneMask(e.target.value) })} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <FormItem label="Website" name="business_website" rules={rules.business_website}>
            <Input />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Facebook" name="business_facebook" rules={rules.business_facebook}>
            <Input />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="X (Twitter)" name="business_twitter" rules={rules.business_twitter}>
            <Input />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem
            label="Descritor de fatura"
            name="statement_descriptor"
            tooltip="Texto que aparecerá na fatura do cliente."
            rules={rules.statement_descriptor}
          >
            <Input />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Receita" name="business_revenue" rules={rules.business_revenue}>
            <InputNumber<number>
              className="w-full"
              controls={false}
              defaultValue={0}
              formatter={currencyMask}
              parser={(value) => Number(currencyMask(value ?? '').replace(/[^0-9]+/g, ''))}
            />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem
            label="Data de abertura do negócio"
            name="business_opening_date"
            rules={rules.business_opening_date}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Segmento" name="mcc" rules={rules.mcc}>
            <Select
              placeholder="Selecione o segmento do negócio"
              options={sellerSegments.map((segment) => ({ label: segment.name, value: segment.value }))}
            />
          </FormItem>
        </Col>
      </Row>
      <div className="my-6">
        <Heading level="6">Endereço</Heading>
      </div>
      <AddressBaseForm
        form={form}
        fields={{
          zip_code: 'business_zip_code',
          street: 'business_street',
          number: 'business_number',
          complement: 'business_complement',
          district: 'business_neighborhood',
          city: 'business_city',
          state: 'business_state',
        }}
        rules={rules}
      />
    </Fragment>
  );
};

export type BusinessInformationFormValues = {
  business_name: string;
  business_document: string;
  business_description: string;
  business_email: string;
  business_phone: string;
  business_website: string;
  business_facebook: string;
  business_twitter: string;
  statement_descriptor: string;
  business_revenue: number;
  business_opening_date: Dayjs;
  mcc: string;
  business_zip_code: string;
  business_street: string;
  business_number: string;
  business_complement: string;
  business_neighborhood: string;
  business_city: string;
  business_state: string;
};

const rules: Record<string, Rule[]> = {
  business_name: [{ required: true, message: 'Campo obrigatório' }],
  business_document: [{ required: true, message: 'Campo obrigatório' }],
  business_description: [{ required: true, message: 'Campo obrigatório' }],
  mcc: [{ required: true, message: 'Campo obrigatório' }],
  business_email: [
    { type: 'email', message: 'Informe um e-mail válido.' },
    { required: true, message: 'Campo obrigatório' },
  ],
  business_phone: [
    { pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/, message: 'Informe um telefone válido.' },
    { required: true, message: 'Campo obrigatório' },
  ],
  statement_descriptor: [{ required: true, message: 'Campo obrigatório' }],
  business_revenue: [{ required: true, message: 'Campo obrigatório' }],
  business_opening_date: [{ required: true, message: 'Campo obrigatório' }],
  business_zip_code: [{ required: true, message: 'Campo obrigatório' }],
  business_street: [{ required: true, message: 'Campo obrigatório' }],
  business_number: [{ required: true, message: 'Campo obrigatório' }],
  business_neighborhood: [{ required: true, message: 'Campo obrigatório' }],
  business_city: [{ required: true, message: 'Campo obrigatório' }],
  business_state: [{ required: true, message: 'Campo obrigatório' }],
};
