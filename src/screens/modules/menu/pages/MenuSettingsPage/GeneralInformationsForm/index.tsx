import { Fragment, useEffect, useState } from 'react';
import { Col, ColorPicker, Divider, Form, Input, Row, Switch, type ColorPickerProps, type GetProp } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { RootType } from 'src/store/modules/rootReducer';
import { MenuCreators } from 'src/store/modules/menu/actions';
import { Button } from 'src/stories/general/Button';
import { menuDefaultColors } from 'src/utils/constants';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Heading } from 'src/ui/Typograph';

type Color = Extract<GetProp<ColorPickerProps, 'value'>, string | { cleared: any }>;

type Colors = {
  font_primary_color?: string;
  font_secondary_color?: string;
  background_primary_color?: string;
  background_secondary_color?: string;
  miscellaneous_color?: string;
};

type GeneralInformationsFormValues = Colors & {
  external_link?: string;
  menu_with_price?: boolean;
};

export const GeneralInformationsForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {
    hall: { unity },
    menu: { settings, savingSettings },
    auth: { user },
  } = useSelector((state: RootType) => state);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  useEffect(() => {
    if (unity !== null) {
      dispatch(MenuCreators.getMenuSettingsRequest());
    }
  }, [unity]);

  useEffect(() => {
    form.setFieldsValue({
      font_primary_color: settings?.font_primary_color || menuDefaultColors.font_primary_color,
      font_secondary_color: settings?.font_secondary_color || menuDefaultColors.font_secondary_color,
      background_primary_color: settings?.background_primary_color || menuDefaultColors.background_primary_color,
      background_secondary_color: settings?.background_secondary_color || menuDefaultColors.background_secondary_color,
      miscellaneous_color: settings?.miscellaneous_color || menuDefaultColors.miscellaneous_color,
      external_link: settings?.external_link,
      menu_with_price: !settings?.hide_price_enabled,
    });
  }, [form, settings]);

  const handleFinish = (values: GeneralInformationsFormValues) => {
    const payload = {};

    if (values.external_link !== undefined) {
      Object.defineProperty(payload, 'external_link', {
        value: values.external_link,
        enumerable: true,
      });
    }

    if (values.menu_with_price !== undefined) {
      Object.defineProperty(payload, 'hide_price_enabled', {
        value: !values.menu_with_price,
        enumerable: true,
      });
    }

    Object.keys(values).forEach((key) => {
      if (values[key as keyof GeneralInformationsFormValues] !== undefined && key.includes('color')) {
        const value = values[key as keyof GeneralInformationsFormValues] as Color;

        Object.defineProperty(payload, key, {
          value: typeof value === 'string' ? value : value.toHexString(),
          enumerable: true,
        });
      }
    });

    if (settings !== null) {
      dispatch(MenuCreators.updateMenuSettingsRequest({ ...payload }));
    }
  };

  const clearButtonIsDisabled = () => {
    const formValues = form.getFieldsValue();
    const isDefaultColor = (field: keyof Colors) => formValues[field] === menuDefaultColors[field];

    return Object.keys(formValues).every((field) => isDefaultColor(field as keyof Colors));
  };

  const handleRemoveColor = (field: keyof Colors) => {
    form.setFieldsValue({ [field]: menuDefaultColors[field] });
    setSaveButtonDisabled(false);
  };

  const handleClearAllColors = () => {
    form.setFieldsValue(menuDefaultColors);
    setSaveButtonDisabled(false);
  };

  return (
    <BoxContrasted>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        form={form}
        onValuesChange={() => setSaveButtonDisabled(false)}
        initialValues={{ enabled: true }}
      >
        <Fragment>
          <Heading level="5">Configurações gerais</Heading>
          <Row className="mt-6" gutter={16}>
            {user?.master === true && (
              <Col span={12}>
                <Form.Item name="external_link" label="Link externo">
                  <Input />
                </Form.Item>
              </Col>
            )}
            <Col span={12}>
              <Form.Item
                name="menu_with_price"
                label="Cardápio com preço"
                valuePropName="checked"
                tooltip="Exibe ou oculta os preços dos itens no cardápio compartilhado."
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
        </Fragment>
        <Heading level="5">Cores do cardápio</Heading>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6 mt-6">
          <div className="col-span-3 flex items-start">
            <Form.Item name="font_primary_color" label="Cor primária da fonte">
              <ColorPicker disabledFormat showText format="hex" />
            </Form.Item>
            {form.getFieldValue('font_primary_color') !== menuDefaultColors.font_primary_color && (
              <div className="flex items-center justify-center text-red-600">
                <Trash2 className="cursor-pointer" size={16} onClick={() => handleRemoveColor('font_primary_color')} />
              </div>
            )}
          </div>
          <div className="col-span-3 flex items-start">
            <Form.Item name="font_secondary_color" label="Cor secundária da fonte">
              <ColorPicker disabledFormat showText />
            </Form.Item>
            {form.getFieldValue('font_secondary_color') !== menuDefaultColors.font_secondary_color && (
              <div className="flex items-center justify-center text-red-600">
                <Trash2
                  className="cursor-pointer"
                  size={16}
                  onClick={() => handleRemoveColor('font_secondary_color')}
                />
              </div>
            )}
          </div>
          <div className="col-span-3 flex items-start">
            <Form.Item name="background_primary_color" label="Cor primária do fundo">
              <ColorPicker disabledFormat showText />
            </Form.Item>
            {form.getFieldValue('background_primary_color') !== menuDefaultColors.background_primary_color && (
              <div className="flex items-center justify-center text-red-600">
                <Trash2
                  className="cursor-pointer"
                  size={16}
                  onClick={() => handleRemoveColor('background_primary_color')}
                />
              </div>
            )}
          </div>
          <div className="col-span-3 flex items-start">
            <Form.Item name="background_secondary_color" label="Cor secundária do fundo">
              <ColorPicker disabledFormat showText />
            </Form.Item>
            {form.getFieldValue('background_secondary_color') !== menuDefaultColors.background_secondary_color && (
              <div className="flex items-center justify-center text-red-600">
                <Trash2
                  className="cursor-pointer"
                  size={16}
                  onClick={() => handleRemoveColor('background_secondary_color')}
                />
              </div>
            )}
          </div>
          <div className="col-span-3 flex items-start">
            <Form.Item name="miscellaneous_color" label="Cor para elementos diversos">
              <ColorPicker disabledFormat showText />
            </Form.Item>
            {form.getFieldValue('miscellaneous_color') !== menuDefaultColors.miscellaneous_color && (
              <div className="flex items-center justify-center text-red-600">
                <Trash2 className="cursor-pointer" size={16} onClick={() => handleRemoveColor('miscellaneous_color')} />
              </div>
            )}
          </div>
        </div>
        <Divider />
        <div className="flex items-center gap-4 justify-end">
          <Button
            variant="outlined"
            htmlType="button"
            onClick={handleClearAllColors}
            disabled={clearButtonIsDisabled()}
          >
            Limpar todas as cores
          </Button>
          <Button htmlType="submit" disabled={saveButtonDisabled} loading={savingSettings}>
            Salvar alterações
          </Button>
        </div>
      </Form>
    </BoxContrasted>
  );
};
