import { useEffect, useState } from 'react';
import { Col, Popover, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as SettingCreators } from 'src/store/modules/setting/actions';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Form, useForm, useWatch } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Checkbox } from 'src/stories/entry/Checkbox';
import { Button } from 'src/stories/general/Button';
import { canConfigureNoshowFallback, NOSHOW_FALLBACK_SECTION_ID, OVERBOOKING_SECTION_ID } from '../utils';
import { useSectionHighlight } from '../useSectionHighlight';

type ScheduleFormValues = {
  overbook_allowed_for_agent: boolean;
};

export const ScheduleForm = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const {
    setting: { reservation, saving },
    auth: { user },
  } = useSelector((state: RootType) => state);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const overbookingEnabled = useWatch('overbook_allowed_for_agent', form);
  const noshowFallbackVisible = canConfigureNoshowFallback({
    reservation,
    isMaster: user?.master ?? false,
    billingEnabled: reservation?.billing_enabled ?? false,
  });
  const { sectionRef: overbookingSectionRef, isHighlighted: isOverbookingHighlighted } =
    useSectionHighlight(OVERBOOKING_SECTION_ID);

  useEffect(() => {
    form.setFieldsValue(reservation);
  }, [form, reservation]);

  const handleFinish = (values: ScheduleFormValues) => {
    if (!values) {
      return;
    }

    dispatch(
      SettingCreators.saveSettingRequest({
        overbook_allowed_for_agent: values.overbook_allowed_for_agent,
      }),
    );
  };

  return (
    <BoxContrasted>
      <Form
        form={form}
        layout="vertical"
        className="flex flex-col"
        onFinish={handleFinish}
        onChange={() => setIsFormDirty(true)}
      >
        <Row gutter={24}>
          <Col xs={24} sm={16}>
            <div className="flex items-center gap-6 mb-6">
              <div id={OVERBOOKING_SECTION_ID} ref={overbookingSectionRef}>
                <FormItem
                  name="overbook_allowed_for_agent"
                  valuePropName="checked"
                  className={`w-fit rounded-md transition-shadow duration-500 mb-0 ${
                    isOverbookingHighlighted ? 'ring-2 ring-offset-4 ring-blue-400' : ''
                  }`}
                >
                  <Checkbox
                    label="Permitir overbooking"
                    tooltip="Com essa opção ativada, o painel de reservas permite criar reservas acima da capacidade do salão. Desativada, a(o) operadora(o) poderá usar apenas a capacidade original da grade horária cadastrada."
                    onChange={() => setIsFormDirty(true)}
                  />
                </FormItem>
              </div>
              <Popover
                trigger={'click'}
                placement="rightBottom"
                content={
                  <p>
                    Com a opção ativada, lá no painel de reservas a(o) operadora(o) <br />
                    pode fazer uma reserva acima da <br />
                    capacidade do salão, permitindo o chamado overbooking. <br />
                    Agora, caso esteja desativado a(o) operadora(o) <br />
                    não conseguirá fazer uma reserva acima da capacidade do salão, <br />
                    ou seja, poderá usar apenas a capacidade original <br />
                    da grade horária cadastrada.
                  </p>
                }
              >
                <Button variant="outlined" icon={<Info className="h-4 w-4" />}>
                  Saiba mais
                </Button>
              </Popover>
            </div>
          </Col>
        </Row>
        {noshowFallbackVisible && overbookingEnabled === true && (
          <Row gutter={24}>
            <Col xs={24} sm={16}>
              <div className="flex gap-2 rounded-md border border-blue-200 bg-blue-50 p-4">
                <Info className="h-5 w-5 text-blue-500" aria-hidden="true" />
                <p className="text-xs text-slate-600">
                  Reservas feitas fora de qualquer grade horária também podem ter cobrança de no-show.{' '}
                  <Link to={`?tab=payment#${NOSHOW_FALLBACK_SECTION_ID}`} className="text-blue-900 underline">
                    Configurar no-show fora de grade
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        )}
        <div className="flex items-center justify-end mt-6">
          <Button htmlType="submit" type="primary" loading={saving} disabled={!isFormDirty}>
            Salvar
          </Button>
        </div>
      </Form>
    </BoxContrasted>
  );
};
