import { useCallback, useEffect, useState, type FunctionComponent } from 'react';
import axios from 'axios';
import { Col, Collapse, Divider, Input, InputNumber, Row } from 'antd';
import { Select, InputMask } from 'src/stories/entry';
import { cepFormatter, removeNonNumeric, roundHighPrecisionDecimals } from 'src/utils/helpers';
import * as Response from 'src/utils/response';
import { TimezoneSelect } from 'src/stories/entry/TimezoneSelect';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Button } from 'src/stories/general/Button';
import { Form, useForm, useWatch } from 'src/stories/entry/Form';
import api from 'src/services/api';
import { BoxContrasted } from 'src/components/BoxContrasted';
import type { RuleObject } from 'antd/es/form';
import { Switch } from 'src/stories/entry/Switch';

const { Option } = Select;

export type AddressFormValue = {
  address: string;
  neighborhood: string;
  number: string;
  state_id: string;
  city_id: string;
  zipcode: string;
  is_forced_coordinates?: boolean;
  lat?: string;
  lng?: string;
};

type AddressFormProps = {
  saving?: boolean;
  onFinish: (values: AddressFormValue) => void;
  disabled: boolean;
  setDisabled: (disabled: boolean) => void;
};

export const AddressForm: FunctionComponent<AddressFormProps> = (props) => {
  const { saving, onFinish, disabled, setDisabled } = props;
  const [form] = useForm();
  const [states, setStates] = useState<Array<{ id: string; code: string; name: string }>>([]);
  const [cities, setCities] = useState<Array<{ id: number | string; name: string }>>([]);
  const [hasFeedback, setHasFeedback] = useState(false);
  const isForcedCoordinates = useWatch('is_forced_coordinates', form);
  const [isCoordinatesCollapseOpen, setIsCoordinatesCollapseOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: state_response } = await api.get('/restaurant/v1/states?pagination=0');

      setStates(state_response.data);
    })();
  }, []);

  const getAddress = async (value: string) => {
    const cepFormatted = cepFormatter(value);

    if (cepFormatted !== null) {
      form.setFieldsValue({
        zipcode: cepFormatted,
      });

      getAddressByCep(cepFormatted);
    }
  };

  const getAddressByCep = useCallback(
    async (cep: string) => {
      if (cep.length === 9) {
        try {
          setHasFeedback(true);

          const { status, data } = await axios.get(`https://viacep.com.br/ws/${removeNonNumeric(cep)}/json/`);

          if (status === Response.HTTP_OK) {
            const state = states.find((state: { code: string }) => state.code === data.uf);

            form.setFieldsValue({
              address: data.logradouro,
              neighborhood: data.bairro,
              state_id: state?.id,
            });

            const { status, data: response } = await api.get(
              `/restaurant/v1/cities?pagination=0&state_id=${state?.id || ''}`
            );

            if (status === Response.HTTP_OK && response.data.length > 0) {
              setCities(response.data);
              const city = response.data.find(
                (city: { id: number | string; name: string }) => city.name === data.localidade
              );

              form.setFieldsValue({
                city_id: city?.id.toString(),
              });
            }
          }

          setHasFeedback(false);
        } catch {
          setHasFeedback(false);
        }
      }
    },
    [form, states]
  );

  const onSelectState = async (value: unknown) => {
    const { status, data: response } = await api.get(`/restaurant/v1/cities?pagination=0&state_id=${value}`);

    if (status === Response.HTTP_OK && response.data.length > 0) {
      setCities(response.data);
    }
  };

  const onChangeForm = () => {
    setDisabled(false);
  };

  const handleFinish = (values: AddressFormValue) => {
    if (onFinish) {
      if (values.is_forced_coordinates && ((values.lat && !values.lng) || (!values.lat && values.lng))) {
        form.setFields([
          {
            name: 'lat',
            errors: !values.lat ? ['Informe a latitude para completar as coordenadas.'] : [],
          },
          {
            name: 'lng',
            errors: !values.lng ? ['Informe a longitude para completar as coordenadas.'] : [],
          },
        ]);

        return;
      }

      onFinish({
        ...values,
        zipcode: !values.zipcode ? '' : removeNonNumeric(values.zipcode),
        is_forced_coordinates: values.is_forced_coordinates,
        ...(values.lat && values.lng && { coordinates: `${parseFloat(values.lat)},${parseFloat(values.lng)}` }),
      });
    }
  };

  const handleChangeForcedCoordinates = (value: boolean) => {
    if (value === false) {
      setIsCoordinatesCollapseOpen(false);
    }

    setDisabled(false);
  };

  const handleChangeCoordinateField = (val: string | null, field: 'lat' | 'lng') => {
    if (val === null) {
      form.setFieldValue(field, undefined);
      return;
    }

    const cleaned = val.replace(/[^\d.-]/g, '');
    const rounded = roundHighPrecisionDecimals(cleaned, 10);

    form.setFieldValue(field, rounded);
  };

  const handleBlurCoordinateField = (field: 'lat' | 'lng') => {
    const fieldValue = form.getFieldValue(field);

    if (fieldValue !== undefined) {
      const rounded = roundHighPrecisionDecimals(fieldValue, 10);
      form.setFieldValue(field, rounded);
    }
  };

  return (
    <BoxContrasted>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          state_id: '',
          city_id: '',
          timezone: 'America/Sao_Paulo',
        }}
        onChange={onChangeForm}
        onFinish={handleFinish}
      >
        <div className="mb-6">
          <span className="text-slate-700 font-medium text-base">Endereço e localização</span>
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              label="CEP"
              name="zipcode"
              hasFeedback={hasFeedback}
              validateStatus="validating"
              rules={rules.zipcode(isForcedCoordinates)}
            >
              <InputMask mask="99999-999" onChange={(e) => getAddress(e.target.value)} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Timezone" name="timezone">
              <TimezoneSelect />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label="Endereço" name="address" rules={rules.address(isForcedCoordinates)}>
              <Input />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Número" name="number">
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label="Complemento" name="complement">
              <Input />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Bairro" name="neighborhood" rules={rules.neighborhood(isForcedCoordinates)}>
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              label="Estado"
              name="state_id"
              hasFeedback={hasFeedback}
              validateStatus="validating"
              rules={rules.state_id}
            >
              <Select onChange={(value) => onSelectState(value)}>
                <Option>Selecione o estado</Option>
                {states.map((state: { id: string; name: string }) => (
                  <Option key={state.id} value={state.id}>
                    {state.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="Cidade"
              name="city_id"
              hasFeedback={hasFeedback}
              validateStatus="validating"
              rules={rules.city_id}
            >
              <Select onChange={() => setDisabled(false)}>
                <Option>Selecione a cidade</Option>
                {cities.map((city: { id: string | number; name: string }) => (
                  <Option key={city.id} value={city.id.toString()}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <FormItem name="is_forced_coordinates" valuePropName="checked">
          <Switch label="Ajustar coordenadas manualmente" onChange={handleChangeForcedCoordinates} />
        </FormItem>
        <Collapse
          collapsible={isForcedCoordinates ? undefined : 'disabled'}
          onChange={(keys) => {
            setIsCoordinatesCollapseOpen(keys.includes('coordinates'));
          }}
          activeKey={isForcedCoordinates ? (isCoordinatesCollapseOpen ? ['coordinates'] : []) : []}
          className={
            '[&_.ant-collapse-header-text]:!font-semibold [&_.ant-collapse-header[aria-disabled="true"]]:text-gray-400' +
            ' [&_.ant-collapse-content-box]:!p-0 [&_.ant-collapse-header[aria-disabled="false"]]:text-slate-600'
          }
          items={[
            {
              key: 'coordinates',
              label: 'Coordenadas',
              children: (
                <div className="w-full grid grid-cols-2 gap-4 p-4">
                  <FormItem name="lat" label="Latitude">
                    <InputNumber<string>
                      className="w-full"
                      placeholder="Ex: -23.5505"
                      min="-90"
                      max="90"
                      step="0.0000000001"
                      stringMode
                      value={form.getFieldValue('lat')}
                      onChange={(value) => handleChangeCoordinateField(value, 'lat')}
                      onBlur={() => handleBlurCoordinateField('lat')}
                    />
                  </FormItem>
                  <FormItem name="lng" label="Longitude">
                    <InputNumber<string>
                      className="w-full"
                      placeholder="Ex: -46.6333"
                      min="-180"
                      max="180"
                      step="0.0000000001"
                      stringMode
                      value={form.getFieldValue('lng')}
                      onChange={(value) => handleChangeCoordinateField(value, 'lng')}
                      onBlur={() => handleBlurCoordinateField('lng')}
                    />
                  </FormItem>
                </div>
              ),
            },
          ]}
        />
        <Divider />
        <div className="flex items-center justify-end">
          <Button loading={saving} disabled={disabled} onClick={() => form.submit()}>
            Confirmar dados
          </Button>
        </div>
      </Form>
    </BoxContrasted>
  );
};

const rules = {
  zipcode: (isOpcional?: boolean) => [
    {
      required: !isOpcional,
      message: 'O CEP é obrigatório',
    },
  ],
  address: (isOpcional?: boolean) => [
    {
      required: !isOpcional,
      message: 'O Endereço é obrigatório',
    },
  ],
  neighborhood: (isOpcional?: boolean) => [
    {
      required: !isOpcional,
      message: 'O Bairro é obrigatório',
    },
  ],
  city_id: [
    {
      required: true,
      message: 'A cidade é obrigatória',
    },
  ],
  state_id: [
    {
      required: true,
      message: 'O estado é obrigatório',
    },
  ],
  lat: [
    {
      validator(_: RuleObject, value: string) {
        if (!value) return Promise.resolve();

        const num = parseFloat(value);
        if (isNaN(num) || num < -90 || num > 90) {
          return Promise.reject(new Error('Latitude deve ser um número entre -90 e 90'));
        }

        return Promise.resolve();
      },
    },
  ],
  lng: [
    {
      validator(_: RuleObject, value: string) {
        if (!value) return Promise.resolve();

        const num = parseFloat(value);
        if (isNaN(num) || num < -180 || num > 180) {
          return Promise.reject(new Error('Longitude deve ser um número entre -180 e 180'));
        }

        return Promise.resolve();
      },
    },
  ],
};
