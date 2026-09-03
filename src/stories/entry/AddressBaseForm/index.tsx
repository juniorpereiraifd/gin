import { Col, Input, Row, type FormInstance } from 'antd';
import { Fragment, useState, type FocusEvent, type FunctionComponent } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import * as Response from 'src/utils/response';
import { FormItem } from '../Form/FormItem';
import Select from '../Select';
import { BRAZIL_STATES } from 'src/utils/constants';
import { cepMask } from 'src/utils/helpers';

type AddressBaseFormProps = {
  form: FormInstance<any>;
  fields: {
    zip_code: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
  };
  rules?: Record<string, any[]>;
};

export const AddressBaseForm: FunctionComponent<AddressBaseFormProps> = (props) => {
  const { form, fields, rules } = props;
  const [searchingAddress, setSearchingAddress] = useState(false);

  const onSearchAddressData = async (data: FocusEvent<HTMLInputElement>): Promise<void> => {
    if ((data.target.value ?? null) === null || data.target.value.length !== 9) {
      return;
    }

    setSearchingAddress(true);

    const valueFormatted = data.target.value.replace(/[^0-9]+/g, '');

    const { status, data: addressData } = await axios.get(
      `${import.meta.env.VITE_VIA_CEP_BASE_URL}/${valueFormatted}/json`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    setSearchingAddress(false);

    if (status !== Response.HTTP_OK) {
      return;
    }

    form.setFieldsValue({
      [fields.street]: addressData.logradouro,
      [fields.district]: addressData.bairro,
      [fields.city]: addressData.localidade,
      [fields.state]: addressData.uf,
    });

    form.validateFields([fields.street, fields.district, fields.city, fields.state]);
  };

  return (
    <Fragment>
      <Row>
        <Col span={12}>
          <FormItem
            label={
              <span className="flex items-center gap-2">
                CEP {searchingAddress && <Loader2 className="animate-spin text-slate-500" size={14} />}
              </span>
            }
            name={fields.zip_code}
            rules={rules?.[fields.zip_code]}
          >
            <Input
              disabled={searchingAddress}
              onBlur={onSearchAddressData}
              onChange={(e) => form.setFieldsValue({ [fields.zip_code]: cepMask(e.target.value) })}
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="Logradouro" name={fields.street} rules={rules?.[fields.street]}>
            <Input />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem label="Número" name={fields.number} rules={rules?.[fields.number]}>
            <Input />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Complemento" name={fields.complement} rules={rules?.[fields.complement]}>
            <Input />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="Bairro" name={fields.district} rules={rules?.[fields.district]}>
            <Input />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem label="Cidade" name={fields.city} rules={rules?.[fields.city]}>
            <Input />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Estado" name={fields.state} rules={rules?.[fields.state]}>
            <Select>
              {BRAZIL_STATES.map((state) => (
                <Select.Option key={state.UF} value={state.UF}>
                  {state.name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Fragment>
  );
};
