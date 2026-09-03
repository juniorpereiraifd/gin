import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Collapse, Divider, InputNumber, Row } from 'antd';
import axios from 'axios';
import { RuleObject } from 'antd/es/form';
import api from 'src/services/api';
import * as Response from 'src/utils/response';
import { Creators as InformationCreators } from 'src/store/modules/information/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { Input, InputMask, Select } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import {
  cepFormatter,
  getPhoneNumberUnformatted,
  removeNonNumeric,
  roundHighPrecisionDecimals,
  validateCnpj,
} from 'src/utils/helpers';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Switch } from 'src/stories/entry/Switch';
import { Form, useForm, useWatch } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';

const { Option } = Select;

export type InformationsFormProps = {
  name: string;
  about: string;
  telephone: string;
  zipcode: string;
  address: string;
  number: string;
  taxpayer_identification: string | null;
  website: string | null;
  complement: string;
  city_id?: string;
  state_id?: string;
  neighborhood: string;
  is_forced_coordinates?: boolean;
  lat?: string;
  lng?: string;
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

const Address = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const {
    hall: { unity },
    information: { saving },
  } = useSelector((state: RootType) => state);
  const [disabled, setDisabled] = useState(true);
  const [hasFeedback, setHasFeedback] = useState(false);
  const isForcedCoordinates = useWatch('is_forced_coordinates', form);
  const [isCoordinatesCollapseOpen, setIsCoordinatesCollapseOpen] = useState(false);

  const onFinish = (values: InformationsFormProps) => {
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

    if (unity) {
      dispatch(
        InformationCreators.saveInformationRequest({
          name: unity.name,
          company_name: unity.company_name,
          about: unity.about,
          cuisines: unity.cuisines,
          telephone: unity.telephone,
          zipcode: removeNonNumeric(values.zipcode),
          address: values.address,
          number: values.number,
          complement: values.complement,
          neighborhood: values.neighborhood,
          city_id: values.city_id,
          state_id: values.state_id,
          taxpayer_identification: unity.taxpayer_identification,
          website: unity.website,
          is_forced_coordinates: values.is_forced_coordinates,
          ...(values.lat &&
            values.lng && {
              coordinates: `${parseFloat(values.lat)},${parseFloat(values.lng)}`,
            }),
        })
      );

      form.setFields([
        { name: 'lat', errors: [] },
        { name: 'lng', errors: [] },
      ]);
    }
  };

  const getAddressByCep = useCallback(
    async (cep: string) => {
      if (cep.length === 9) {
        try {
          setHasFeedback(true);

          const { status, data } = await axios.get(`https://viacep.com.br/ws/${removeNonNumeric(cep)}/json/`);

          if (status === Response.HTTP_OK) {
            const states = await getStates();

            const selectedState = states.find((state) => state.code === data.uf);

            setStates(states);

            if (data.logradouro != '' && unity?.zipcode != cep) {
              form.setFieldsValue({
                address: data.logradouro,
              });
            }

            if (data.state_id != '') {
              form.setFieldsValue({
                state_id: selectedState?.id,
              });
            }

            if (data.bairro != '' && unity?.zipcode != cep) {
              form.setFieldsValue({
                neighborhood: data.bairro,
              });
            }

            const cities = await getCities(selectedState?.id || '');

            if (cities.length > 0) {
              setCities(cities);

              const city = cities.find((city: { id: string; name: string }) => city.name === data.localidade);

              form.setFieldsValue({
                city_id: city?.id,
              });
            }
          }
          setHasFeedback(false);
        } catch {
          setHasFeedback(false);
        }
      }
    },
    [form, unity?.zipcode]
  );

  useEffect(() => {
    if (unity) {
      form.setFieldsValue({
        zipcode: unity.zipcode,
        address: unity.address,
        number: unity.number,
        complement: unity.complement,
        neighborhood: unity.neighborhood,
        lat: unity.coordinates?.lat || '',
        lng: unity.coordinates?.lng || '',
        is_forced_coordinates: unity.is_forced_coordinates || false,
      });

      if (unity.state_id) {
        (async () => {
          setIsLoadingStates(true);
          const states = await getStates();
          setStates(states);

          const selectedState = states.find((state) => state.id === unity.state_id);

          setIsLoadingStates(false);
          if (selectedState) {
            form.setFieldsValue({
              state_id: selectedState?.id,
            });

            if (unity.city_id) {
              setIsLoadingCities(true);
              const cities = await getCities(selectedState.id);
              setCities(cities);

              const selectedCity = cities.find((city) => city.id === unity.city_id);

              setIsLoadingCities(false);
              if (selectedCity) {
                form.setFieldsValue({
                  city_id: selectedCity.id,
                });
              }
            }
          }
        })();
      }
    }
  }, [unity, form]);

  const getAddress = async (value: string) => {
    const cepFormatted = cepFormatter(value);

    if (cepFormatted !== null) {
      form.setFieldsValue({
        zipcode: cepFormatted,
      });

      getAddressByCep(cepFormatted);
    }
  };

  const onSelectState = async (value: unknown) => {
    setHasFeedback(true);
    const cities = await getCities(value as string);

    if (cities.length > 0) {
      setCities(cities);

      form.setFieldsValue({
        city_id: '',
      });

      setDisabled(false);
      setHasFeedback(false);
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
      <Form layout="vertical" form={form} onChange={() => setDisabled(false)} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              name="zipcode"
              label="CEP"
              hasFeedback={hasFeedback}
              validateStatus="validating"
              rules={rules.zipcode(isForcedCoordinates)}
            >
              <InputMask mask="99999-999" onChange={(e) => getAddress(e.target.value)} />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem name="address" label="Endereço" rules={rules.address(isForcedCoordinates)}>
              <Input disabled={hasFeedback} />
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
            <FormItem name="neighborhood" label="Bairro" rules={rules.neighborhood(isForcedCoordinates)}>
              <Input disabled={hasFeedback} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Complemento" name="complement">
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              label="Estado"
              name="state_id"
              hasFeedback={hasFeedback || isLoadingStates}
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
              hasFeedback={hasFeedback || isLoadingCities}
              validateStatus="validating"
              rules={rules.city_id}
            >
              <Select>
                <Option>Selecione a cidade</Option>
                {cities.map((city: { id: string; name: string }) => (
                  <Option key={city.id} value={city.id}>
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
          <Button disabled={disabled} loading={saving} htmlType="submit">
            Salvar alterações
          </Button>
        </div>
      </Form>
    </BoxContrasted>
  );
};

type State = {
  id: string;
  code: string;
  name: string;
  country_id: string;
};

const getStates = async (): Promise<Array<State>> => {
  const { status, data: response } = await api.get('/restaurant/v1/states?pagination=0');

  if (status === Response.HTTP_OK && response.data.length > 0) {
    return response.data;
  }

  return [];
};

type City = {
  id: string;
  name: string;
  state_id: string;
};

const getCities = async (state_id: string): Promise<Array<City>> => {
  const { status, data: response } = await api.get(`/restaurant/v1/cities?pagination=0&state_id=${state_id}`);

  if (status === Response.HTTP_OK && response.data.length > 0) {
    return response.data;
  }

  return [];
};

export default Address;
