import { useEffect, useState } from 'react';
import { Divider, Form, Input, Tooltip, Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { InfoCircle } from '@styled-icons/bootstrap/InfoCircle';
import { Creators as LineCreators } from 'src/store/modules/line/actions';
import { MenuCreators } from 'src/store/modules/menu/actions';
import { LineSettings } from 'src/store/modules/line/reducer';
import { RootType } from 'src/store/modules/rootReducer';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { PageContainer } from 'src/components/PageContainer';
import { QrcodeBadge } from './QrcodeBadge';
import { isEqual } from 'lodash';
import * as S from './styles';

type LineSettingsFormValues = LineSettings & {
  menu_link_enabled?: boolean;
};

export const LineSettingsPage = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {
    hall: { unity },
    line: { settings, saving },
    menu: { settings: menuSettings, savingSettings },
  } = useSelector((state: RootType) => state);

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (unity) {
      dispatch(LineCreators.getLineSettingsRequest());
      dispatch(MenuCreators.getMenuSettingsRequest());
    }
  }, [unity]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }

    if (menuSettings) {
      form.setFieldsValue({
        menu_link_enabled: menuSettings.show_in_line,
      });
    }
  }, [form, settings, menuSettings]);

  const onChangeForm = () => setDisabled(false);

  const onFinish = (values: LineSettingsFormValues) => {
    const { menu_link_enabled, ...lineSettingsValues } = values;

    const lineSettingsPreviousValues = {
      enabled: settings?.enabled,
      max_table_people: settings?.max_table_people,
      max_code: settings?.max_code,
      min_code: settings?.min_code,
      qr_code_enabled: settings?.qr_code_enabled,
      qr_code_priority_modal_enabled: settings?.qr_code_priority_modal_enabled,
      tolerance: settings?.tolerance,
    };

    if (
      menu_link_enabled !== undefined &&
      menu_link_enabled !== menuSettings?.show_in_line
    ) {
      dispatch(
        MenuCreators.updateMenuSettingsRequest({
          ...menuSettings,
          show_in_line: menu_link_enabled,
        })
      );
    }

    if (!isEqual(lineSettingsValues, lineSettingsPreviousValues)) {
      dispatch(LineCreators.updateLineSettingsRequest(lineSettingsValues));
    }
  };

  return (
    <PageContainer sideColumn>
      <PageTitle>Ajustes de fila</PageTitle>
      <S.WrapperForm>
        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          onChange={onChangeForm}
          initialValues={{ remote_enabled: true }}
        >
          <S.ContentSectionForm>
            <S.FormTitle level={3}>Controles - QR Code</S.FormTitle>
            <S.Controls>
              <Form.Item name="qr_code_enabled" valuePropName="checked">
                <Checkbox>Habilitar fila via QR Code</Checkbox>
              </Form.Item>
              <Form.Item name="menu_link_enabled" valuePropName="checked">
                <Checkbox>
                  Habilitar link de cardápio no widget de fila{' '}
                  <Tooltip
                    title={
                      <>
                        Quando esta opção está ativa, exibimos um banner com o
                        seu cardápio na tela de sucesso do widget de fila.{' '}
                        <br />
                        <br />
                        *Você precisa ter um cardápio ativo para habilitar essa
                        função.
                      </>
                    }
                  >
                    <InfoCircle size={16} />
                  </Tooltip>
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="qr_code_priority_modal_enabled"
                valuePropName="checked"
              >
                <Checkbox>Habilitar modal de prioritários</Checkbox>
              </Form.Item>
            </S.Controls>
          </S.ContentSectionForm>
          <S.ContentSectionForm>
            <S.FormTitle level={3}>Configurações gerais</S.FormTitle>
            <S.WrapperInput>
              <Form.Item name="min_code" label="Código mínimo">
                <Input type="number" min="0" />
              </Form.Item>
            </S.WrapperInput>
            <S.WrapperInput>
              <Form.Item name="max_code" label="Código máximo">
                <Input type="number" min="0" />
              </Form.Item>
            </S.WrapperInput>
            <S.WrapperInput>
              <Form.Item name="tolerance" label="Tolerância">
                <Input type="number" min="0" />
              </Form.Item>
              <span>Tempo de tolerância, em minutos.</span>
            </S.WrapperInput>
          </S.ContentSectionForm>
          <S.ContentSectionForm>
            <S.FormTitle level={3}>Entrada remota</S.FormTitle>
            <S.WrapperSwitch>
              <Form.Item name="remote_enabled" valuePropName="checked">
                <Checkbox defaultChecked onChange={onChangeForm}>
                  Habilitar entrada remota na fila de espera
                </Checkbox>
              </Form.Item>
            </S.WrapperSwitch>
            <S.WrapperInput>
              <Form.Item name="max_table_people" label="Limite de pessoas">
                <Input type="number" />
              </Form.Item>
            </S.WrapperInput>
          </S.ContentSectionForm>
          <Divider />
          <S.Footer>
            <Title level={4}>Tudo pronto? É só salvar!</Title>
            <Button
              type="primary"
              htmlType="submit"
              disabled={disabled}
              loading={saving || savingSettings}
            >
              Salvar alterações
            </Button>
          </S.Footer>
        </Form>
      </S.WrapperForm>
      <S.SideMenu>
        <QrcodeBadge />
      </S.SideMenu>
    </PageContainer>
  );
};
