import { useEffect, type FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { Input, Divider, Collapse } from 'antd';
import { Button } from 'src/stories/general/Button';
import { Creators as WidgetCreators } from 'src/store/modules/widget/actions';
import { TextArea } from 'src/stories/entry';
import type { WidgetProps } from 'src/store/modules/widget/reducer';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Heading } from 'src/ui/Typograph';
import { Switch } from 'src/stories/entry/Switch';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Form, useForm, useWatch } from 'src/stories/entry/Form';

type PersonalizationSectionProps = {
  selectedWidget: WidgetProps | null;
};

export const PersonalizationSection: FunctionComponent<PersonalizationSectionProps> = (props) => {
  const { selectedWidget } = props;
  const dispatch = useDispatch();
  const [form] = useForm();
  const fieldsWatcher = useWatch([], form) ?? {};
  const initialValues = {
    instructions: '',
    'experience.enabled': false,
    'state.enabled': false,
    'birthdate_field.enabled': false,
    'birthdate_field.required': false,
    'info_field.label': '',
    'info_field.enabled': false,
    'info_field.required': false,
    'occasion_field.enabled': false,
    'occasion_field.required': false,
    'promocode_field.enabled': false,
    'promocode_field.required': false,
    'taxpayer_identification.enabled': false,
    'taxpayer_identification.required': false,
    'zipcode_field.enabled': false,
    'zipcode_field.required': false,
  };

  useEffect(() => {
    if (selectedWidget) {
      const customization = selectedWidget?.metadata?.customization;
      form.resetFields();
      form.setFieldsValue({
        instructions: selectedWidget.instructions || '',
        ['experience.enabled']: selectedWidget.show_products_field || false,
        ['state.enabled']: selectedWidget.show_state_field || false,
        ['birthdate_field.enabled']: customization?.birthdate_field?.enabled || false,
        ['birthdate_field.required']: customization?.birthdate_field?.required || false,
        ['info_field.label']: customization?.info_field?.label || '',
        ['info_field.enabled']: customization?.info_field?.enabled,
        ['info_field.required']: customization?.info_field?.required || false,
        ['occasion_field.enabled']: customization?.occasion_field?.enabled || false,
        ['occasion_field.required']: customization?.occasion_field?.required || false,
        ['promocode_field.enabled']: customization?.promocode_field?.enabled || false,
        ['promocode_field.required']: customization?.promocode_field?.required || false,
        ['taxpayer_identification.enabled']: customization?.taxpayer_identification?.enabled || false,
        ['taxpayer_identification.required']: customization?.taxpayer_identification?.required || false,
        ['zipcode_field.enabled']: customization?.zipcode_field?.enabled || false,
        ['zipcode_field.required']: customization?.zipcode_field?.required || false,
      });
    }
  }, [form, selectedWidget]);

  const saveFieldsCustomization = (fields: { [key: string]: string }) => {
    if (selectedWidget) {
      dispatch(
        WidgetCreators.saveFieldsCustomizationRequest({
          widget: selectedWidget,
          instructions: fields.instructions,
          show_products_field: Boolean(fields['experience.enabled']) || false,
          show_state_field: Boolean(fields['state.enabled']) || false,
          fields_customization: {
            info_field: {
              label: fields['info_field.label'] || '',
              enabled: fields['info_field.enabled'] || false,
              required: fields['info_field.required'] || false,
            },
            zipcode_field: {
              enabled: fields['zipcode_field.enabled'] || false,
              required: fields['zipcode_field.required'] || false,
            },
            occasion_field: {
              enabled: fields['occasion_field.enabled'] || false,
              required: fields['occasion_field.required'] || false,
            },
            birthdate_field: {
              enabled: fields['birthdate_field.enabled'] || false,
              required: fields['birthdate_field.required'] || false,
            },
            promocode_field: {
              enabled: fields['promocode_field.enabled'] || false,
              required: fields['promocode_field.required'] || false,
            },
            taxpayer_identification: {
              enabled: fields['taxpayer_identification.enabled'] || false,
              required: fields['taxpayer_identification.required'] || false,
            },
          },
        })
      );
    }
  };

  return (
    <BoxContrasted>
      <Heading level="5">Personalizar Widget</Heading>
      <p className="text-slate-500 mt-4">Personalize o widget de reserva conforme suas necessidades.</p>
      <Form form={form} onFinish={saveFieldsCustomization} layout="vertical" initialValues={initialValues}>
        <div className="flex flex-col gap-3 mt-6">
          <Heading level="6">Customização dos campos</Heading>
          <Collapse
            items={[
              {
                key: 'name',
                label: 'Nome completo',
                children: (
                  <div>
                    <p className="text-slate-500">
                      As configurações do campo "Nome completo" são <b>pré-definidas e imutáveis</b>.
                    </p>
                  </div>
                ),
              },
              {
                key: 'email',
                label: 'Email',
                children: (
                  <div>
                    <p className="text-slate-500">
                      As configurações do campo "Email" são <b>pré-definidas e imutáveis</b>.
                    </p>
                  </div>
                ),
              },
              {
                key: 'phone',
                label: 'Celular',
                children: (
                  <div>
                    <p className="text-slate-500">
                      As configurações do campo "Celular" são <b>pré-definidas e imutáveis</b>.
                    </p>
                  </div>
                ),
              },
              {
                key: 'experience',
                label: 'Experiência',
                children: (
                  <div className="grid grid-cols-4 gap-4">
                    <FormItem name="experience.enabled" valuePropName="checked" className="mb-0">
                      <Switch
                        label={(fieldsWatcher['experience.enabled'] ?? false) === true ? 'Habilitado' : 'Desabilitado'}
                      />
                    </FormItem>
                  </div>
                ),
              },
              {
                key: 'state',
                label: 'Estado',
                children: (
                  <div className="grid grid-cols-4 gap-4">
                    <FormItem name="state.enabled" valuePropName="checked" className="mb-0">
                      <Switch
                        label={(fieldsWatcher['state.enabled'] ?? false) === true ? 'Habilitado' : 'Desabilitado'}
                      />
                    </FormItem>
                  </div>
                ),
              },
              {
                key: 'occasion',
                label: 'Ocasião',
                children: (
                  <div className="grid grid-cols-4 gap-4">
                    <FormItem name="occasion_field.enabled" valuePropName="checked" className="mb-0">
                      <Switch
                        label={
                          (fieldsWatcher['occasion_field.enabled'] ?? false) === true ? 'Habilitado' : 'Desabilitado'
                        }
                      />
                    </FormItem>
                    <FormItem name="occasion_field.required" valuePropName="checked" className="mb-0">
                      <Switch
                        label={
                          (fieldsWatcher['occasion_field.required'] ?? false) === true ? 'Obrigatório' : 'Opcional'
                        }
                      />
                    </FormItem>
                  </div>
                ),
              },
              {
                key: 'birthdate',
                label: 'Data de nascimento',
                children: (
                  <div className="grid grid-cols-4 gap-4">
                    <FormItem name="birthdate_field.enabled" valuePropName="checked" className="mb-0">
                      <Switch
                        label={
                          (fieldsWatcher['birthdate_field.enabled'] ?? false) === true ? 'Habilitado' : 'Desabilitado'
                        }
                      />
                    </FormItem>
                    <FormItem name="birthdate_field.required" valuePropName="checked" className="mb-0">
                      <Switch
                        label={
                          (fieldsWatcher['birthdate_field.required'] ?? false) === true ? 'Obrigatório' : 'Opcional'
                        }
                      />
                    </FormItem>
                  </div>
                ),
              },
              {
                key: 'document',
                label: 'CPF',
                children: (
                  <div className="grid grid-cols-4 gap-4">
                    <FormItem name="taxpayer_identification.enabled" valuePropName="checked" className="mb-0">
                      <Switch
                        label={
                          (fieldsWatcher['taxpayer_identification.enabled'] ?? false) === true
                            ? 'Habilitado'
                            : 'Desabilitado'
                        }
                      />
                    </FormItem>
                    <FormItem name="taxpayer_identification.required" valuePropName="checked" className="mb-0">
                      <Switch
                        label={
                          (fieldsWatcher['taxpayer_identification.required'] ?? false) === true
                            ? 'Obrigatório'
                            : 'Opcional'
                        }
                      />
                    </FormItem>
                  </div>
                ),
              },
              {
                key: 'cep',
                label: 'CEP',
                children: (
                  <div className="grid grid-cols-4 gap-4">
                    <FormItem name="zipcode_field.enabled" valuePropName="checked" className="mb-0">
                      <Switch
                        label={
                          (fieldsWatcher['zipcode_field.enabled'] ?? false) === true ? 'Habilitado' : 'Desabilitado'
                        }
                      />
                    </FormItem>
                    <FormItem name="zipcode_field.required" valuePropName="checked" className="mb-0">
                      <Switch
                        label={(fieldsWatcher['zipcode_field.required'] ?? false) === true ? 'Obrigatório' : 'Opcional'}
                      />
                    </FormItem>
                  </div>
                ),
              },
              {
                key: 'promotional-code',
                label: 'Código promocional',
                children: (
                  <div className="grid grid-cols-4 gap-4">
                    <FormItem name="promocode_field.enabled" valuePropName="checked" className="mb-0">
                      <Switch
                        label={
                          (fieldsWatcher['promocode_field.enabled'] ?? false) === true ? 'Habilitado' : 'Desabilitado'
                        }
                      />
                    </FormItem>
                    <FormItem name="promocode_field.required" valuePropName="checked" className="mb-0">
                      <Switch
                        label={
                          (fieldsWatcher['promocode_field.required'] ?? false) === true ? 'Obrigatório' : 'Opcional'
                        }
                      />
                    </FormItem>
                  </div>
                ),
              },
              {
                key: 'observation',
                label: 'Observação',
                children: (
                  <div className="grid grid-cols-4 gap-4">
                    <FormItem name="info_field.enabled" valuePropName="checked" className="mb-0">
                      <Switch
                        label={(fieldsWatcher['info_field.enabled'] ?? false) === true ? 'Habilitado' : 'Desabilitado'}
                      />
                    </FormItem>
                    <FormItem name="info_field.required" valuePropName="checked" className="mb-0">
                      <Switch
                        label={(fieldsWatcher['info_field.required'] ?? false) === true ? 'Obrigatório' : 'Opcional'}
                      />
                    </FormItem>
                    <FormItem name="info_field.label" label="Título do Campo" layout="vertical" className="col-span-2">
                      <Input placeholder="Título do Campo" />
                    </FormItem>
                  </div>
                ),
              },
            ]}
          />
        </div>
        <Divider />
        <Heading level="6">Personalização avançada</Heading>
        <div className="grid grid-cols-4 gap-4 mt-6">
          <FormItem
            name="instructions"
            label="Instruções para o cliente"
            layout="vertical"
            className="col-span-2"
            help="Escreva aqui alguma informação ou recado para o seu cliente estar ciente no momento da reserva."
          >
            <TextArea placeholder="Escreva aqui possíveis instruções" />
          </FormItem>
        </div>
      </Form>
      <div className="flex items-center justify-end">
        <Button onClick={() => form.submit()}>Salvar</Button>
      </div>
    </BoxContrasted>
  );
};
