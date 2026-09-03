import { useEffect, useState, type FunctionComponent } from 'react';
import { Col, Divider, Drawer, Input, notification, Radio, Row, Select, TimePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { isNumber } from 'lodash';
import dayjs from 'dayjs';
import { Form, useForm, useWatch } from 'src/stories/entry/Form';
import Days from 'src/stories/entry/Days';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as ScheduleCreators } from 'src/store/modules/schedule/actions';
import { DISCOUNT, HALLS_TYPE, MINUTE_STEP, MINUTES_IN_ADVANCE, MINUTES_IN_ADVANCE_REFUND } from 'src/utils/constants';
import {
  handlePopulatePrice,
  moneyFormatter,
  renderDynamicallyOptions,
  renderFriendlyMinuteValue,
} from 'src/utils/helpers';
import { CustomizeTableBox } from 'src/screens/modules/reservation/components/CustomizeTableBox';
import { Switch } from 'src/stories/entry/Switch';
import { AlertBoxBilling } from 'src/screens/modules/reservation/components/AlertBoxBilling';
import { CurrencyInput } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import { ModalStateEnum } from 'src/types';
import {
  SCHEDULE_BILLING_TYPE,
  SCHEDULE_TYPE,
  type ScheduleBillingTypeValue,
  type ScheduleTypeValue,
} from 'src/store/modules/schedule/reducer';

export type ScheduleFormValues = {
  id?: string | number;
  sector_id: string | number;
  started_at: string;
  ended_at: string;
  weekday: number;
  minute_step: number;
  discount: number;
  minutes_in_advance: number;
  schedule_map: Array<{ number_of_tables: number; number_of_people: number }>;
  description: string;
  price: number;
  type_of_charge: ScheduleTypeValue;
  billing_type: ScheduleBillingTypeValue;
  refund_hours: number;
};

type ScheduleType = {
  numberOfTable: number | null;
  numberOfPeople: number | string | null;
};

type MutationScheduleDrawerProps = {
  day: string;
  hallId: string;
};

export const MutationScheduleDrawer: FunctionComponent<MutationScheduleDrawerProps> = (props) => {
  const { day, hallId } = props;
  const dispatch = useDispatch();
  const {
    hall: { hall },
    reservation: { settings },
    schedule: { isOpen, saving, editable },
  } = useSelector((state: RootType) => state);
  const [form] = useForm();
  const typeOfChargeValue = useWatch('type_of_charge', form) ?? SCHEDULE_TYPE.PAID_GRADE;
  const billingTypeValue = useWatch('billing_type', form) ?? SCHEDULE_BILLING_TYPE.FIXED;
  const [days, setDays] = useState<Array<number>>([parseInt(day)]);
  const [scheduleMap, setScheduleMap] = useState<ScheduleType[]>([]);
  const [isBookingWithChange, setIsBookingWithChange] = useState(false);
  const [price, setPrice] = useState(0);
  const [feesGetIn, setFeesGetIn] = useState({
    taxGetIn: 0,
    amountReceivable: 0,
  });

  useEffect(() => {
    if (isOpen === ModalStateEnum.OPENED && editable !== null) {
      if (editable.schedule_map) {
        const schedule = editable.schedule_map.map((item) => {
          return {
            numberOfTable: item.number_of_tables,
            numberOfPeople: item.number_of_people,
          };
        });

        setScheduleMap(schedule);
      }

      form.setFieldsValue({
        started_at: dayjs(editable.started_at, 'HH:mm'),
        ended_at: dayjs(editable.ended_at, 'HH:mm'),
        minute_step: editable.minute_step,
        minutes_in_advance: editable.minutes_in_advance,
        discount: editable.discount,
        total_seats: editable.total_seats,
        ...(editable.schedule_product && {
          description: editable.schedule_product.description,
          price: editable.schedule_product?.price,
          type_of_charge: editable.schedule_product?.type,
          billing_type: editable.schedule_product?.billing_type,
          refund_hours: editable.schedule_product?.refund_hours * 60,
        }),
      });

      if (editable.schedule_product) {
        handlePopulatePrice({
          value: editable.schedule_product.price,
          getInTax:
            editable.schedule_product?.type === SCHEDULE_TYPE.PAID_GRADE
              ? settings?.getin_tax
              : settings?.noshow_getin_tax,
          setPrice,
          setFeesGetIn,
        });
      }

      setIsBookingWithChange(editable.schedule_product !== undefined);
    }

    if (isOpen === ModalStateEnum.CLOSED) {
      setDays([parseInt(day)]);
      setScheduleMap([]);
      setIsBookingWithChange(false);
      setPrice(0);
      setFeesGetIn({
        taxGetIn: 0,
        amountReceivable: 0,
      });
      form.resetFields();
    }
  }, [isOpen, editable]);

  const handleClose = () => {
    dispatch(ScheduleCreators.hideModal());
  };

  const handleChangeDay = (day: number) => {
    if (days.find((d) => d === day)) {
      setDays([...days.filter((d) => d !== day)]);
    } else {
      setDays([...days, day]);
    }
  };

  const handlePriceChange = (event?: InputEvent | undefined, value?: number | undefined) => {
    event?.preventDefault();

    handlePopulatePrice({
      value: value || 0,
      getInTax: typeOfChargeValue === SCHEDULE_TYPE.PAID_GRADE ? settings?.getin_tax : settings?.noshow_getin_tax,
      setPrice,
      setFeesGetIn,
    });
  };

  const handleFinish = (values: ScheduleFormValues) => {
    const { description, ...restScheduleData } = values;

    if (!scheduleMap || scheduleMap.length === 0) {
      notification.error({
        message: 'Dados inválidos!',
        description: 'É necessário cadastrar o mapa das mesas.',
      });

      return;
    }

    if (editable) {
      dispatch(
        ScheduleCreators.editScheduleRequest({
          schedule: {
            ...restScheduleData,
            id: editable.id,
            sector_id: hallId,
            weekday: days[0],
            started_at: dayjs(values.started_at).format('HH:mm'),
            ended_at: dayjs(values.ended_at).format('HH:mm'),
            active: true,
          },
          schedule_map: scheduleMap.map((item) => {
            return {
              number_of_tables: item.numberOfTable,
              number_of_people: item.numberOfPeople as number,
            };
          }),
          ...(isBookingWithChange && {
            schedule_product: {
              description,
              price,
              type: values.type_of_charge,
              billing_type: values.billing_type,
              refund_hours: values.refund_hours / 60,
            },
          }),
          dayRequest: day ? day : '',
        }),
      );

      return;
    }

    days
      .filter((item, index) => days.indexOf(item) === index)
      .map((day) =>
        dispatch(
          ScheduleCreators.createScheduleRequest({
            days: days.filter((item, index) => days.indexOf(item) === index),
            schedule: {
              ...restScheduleData,
              weekday: day,
              sector_id: hallId,
              started_at: dayjs(values.started_at).format('HH:mm'),
              ended_at: dayjs(values.ended_at).format('HH:mm'),
              active: true,
            },
            schedule_map: scheduleMap.map((item) => {
              return {
                number_of_tables: item.numberOfTable,
                number_of_people: item.numberOfPeople as number,
              };
            }),
            ...(isBookingWithChange && {
              schedule_product: {
                description,
                price,
                type: values.type_of_charge,
                billing_type: values.billing_type,
                refund_hours: values.refund_hours / 60,
              },
            }),
            dayRequest: day ? day.toString() : '',
          }),
        ),
      );
  };

  const handleChangeTypeOfCharge = (e: any) => {
    handlePopulatePrice({
      value: price || 0,
      getInTax: e.target.value === SCHEDULE_TYPE.PAID_GRADE ? settings?.getin_tax : settings?.noshow_getin_tax,
      setPrice,
      setFeesGetIn,
    });
  };

  return (
    <Drawer
      open={isOpen === ModalStateEnum.OPENED}
      onClose={handleClose}
      title={editable ? 'Editar horário' : 'Adicionar novo horário'}
      rootClassName="[&_.ant-drawer-content-wrapper]:!w-3/5"
      footer={
        <div className="flex items-center justify-end gap-4 p-3">
          <Button htmlType="button" variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button loading={saving} onClick={() => form.submit()} type="primary" htmlType="submit">
            Salvar
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{
          started_at: dayjs('08:00:00', 'HH:mm:ss'),
          ended_at: dayjs('18:00:00', 'HH:mm:ss'),
          schedule_map: [],
          minute_step: MINUTE_STEP[0],
          minutes_in_advance: MINUTES_IN_ADVANCE[0],
          discount: DISCOUNT[0],
          type_of_charge: SCHEDULE_TYPE.PAID_GRADE,
          billing_type: SCHEDULE_BILLING_TYPE.FIXED,
        }}
      >
        {editable?.has_reservations === true && (
          <div className="flex flex-col gap-2 bg-amber-50 border border-amber-200 p-4 mb-6 rounded-md text-slate-600">
            <p>
              Na inclusão ou edição de mesas, considere a quantidade de lugares <b>já reservados</b> para não causar
              overbooking:
            </p>
            <div className="flex flex-col gap-1">
              <span>
                <b>{editable.reservation_count}</b> Reservas na grade
              </span>
              <span>
                <b>{editable.chair_count}</b> Lugares reservados
              </span>
            </div>
          </div>
        )}
        <Row gutter={16}>
          <Col span={10}>
            {!editable && (
              <Row className="mb-8">
                <Days activeDays={days} onChange={handleChangeDay} />
              </Row>
            )}
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label="Início" name="started_at" rules={rules.startAt}>
                  <TimePicker
                    className="w-full"
                    needConfirm={false}
                    placeholder="00:00"
                    showNow={false}
                    format="HH:mm"
                    allowClear={false}
                    minuteStep={5}
                    inputReadOnly={true}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Final" name="ended_at" rules={rules.endAt}>
                  <TimePicker
                    className="w-full"
                    needConfirm={false}
                    placeholder="00:00"
                    showNow={false}
                    format="HH:mm"
                    allowClear={false}
                    minuteStep={5}
                    inputReadOnly={true}
                  />
                </FormItem>
              </Col>
            </Row>
            <Divider />
            {hall?.type == HALLS_TYPE.TOTAL_SEATS && (
              <Row>
                <Col span={24}>
                  <FormItem label={'Quantidade de pessoas'} name="total_seats" rules={rules.totalSeats}>
                    <Input type="number" min={0} />
                  </FormItem>
                </Col>
              </Row>
            )}
            <Row>
              <Col span={24}>
                <FormItem
                  rules={rules.minuteStep}
                  label="Escala"
                  tooltip={`A escala representa a divisão do tempo dentro da janela de horário. Ex: Em uma escala de 15 minutos os horários serão exibidos assim: ”10:00, 10:15, 10: 30, 10:45", etc.`}
                  name="minute_step"
                >
                  <Select>
                    {renderDynamicallyOptions(MINUTE_STEP, (value: any) => {
                      return renderFriendlyMinuteValue(isNumber(value) ? value : parseInt(value));
                    })}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label="Antecedência mínima (min)"
                  name="minutes_in_advance"
                  tooltip="A antecedência representa a quantidade de minutos que seu cliente precisa reservar antes do horário que deseja. Ex: Se o cliente quiser fazer uma reserva ás 11:00 e a antecedência estiver de 30 minutos, ele poderá fazer a reserva até às 10:29."
                >
                  <Select>
                    {renderDynamicallyOptions(MINUTES_IN_ADVANCE, (value: any) => {
                      return parseInt(value) == 0
                        ? '--'
                        : renderFriendlyMinuteValue(isNumber(value) ? value : parseInt(value));
                    })}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="Desconto" name="discount">
                  <Select>
                    {renderDynamicallyOptions(DISCOUNT, (value: any) => {
                      return parseInt(value) == 0 ? '--' : value + '%';
                    })}
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={14}>
            <CustomizeTableBox
              hallType={hall?.type as string}
              scheduleList={scheduleMap}
              setScheduleList={setScheduleMap}
              size="large"
            />
          </Col>
        </Row>
        <Divider />
        <Row className="mb-6">
          <Col span={24}>
            <Switch
              label="Reserva com cobrança"
              checked={isBookingWithChange}
              onChange={(checked: boolean) => setIsBookingWithChange(checked)}
            />
          </Col>
        </Row>
        {isBookingWithChange && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem name="type_of_charge" label="Tipo de cobrança" rules={rules.bookingWithChange.type_of_charge}>
                  <Radio.Group
                    block
                    options={[
                      { label: 'Grade paga', value: SCHEDULE_TYPE.PAID_GRADE },
                      { label: 'No-Show', value: SCHEDULE_TYPE.NOSHOW },
                    ]}
                    defaultValue={SCHEDULE_TYPE.PAID_GRADE}
                    optionType="button"
                    buttonStyle="outline"
                    onChange={handleChangeTypeOfCharge}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  name="billing_type"
                  label="Modalidade de cobrança"
                  rules={rules.bookingWithChange.billing_type}
                >
                  <Radio.Group
                    block
                    options={[
                      { label: 'Fixa', value: SCHEDULE_BILLING_TYPE.FIXED },
                      { label: 'Por pessoa', value: SCHEDULE_BILLING_TYPE.PER_PERSON },
                    ]}
                    defaultValue={SCHEDULE_BILLING_TYPE.FIXED}
                    optionType="button"
                    buttonStyle="outline"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  label={`Preço${billingTypeValue === SCHEDULE_BILLING_TYPE.PER_PERSON ? ' por pessoa' : ''}`}
                  name="price"
                  rules={rules.bookingWithChange.price}
                >
                  <CurrencyInput currency="BRL" config={currencyConfig} onChange={handlePriceChange} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label={
                    typeOfChargeValue === SCHEDULE_TYPE.PAID_GRADE
                      ? 'Antecedência mínima de estorno'
                      : 'Antecedência mínima de cancelamento'
                  }
                  name="refund_hours"
                  rules={rules.bookingWithChange.refund_hours}
                  tooltip={
                    typeOfChargeValue === SCHEDULE_TYPE.PAID_GRADE
                      ? 'Defina até quanto tempo antes da reserva o cliente pode cancelar e ter direito ao reembolso. Nota: Compras online têm estorno garantido por lei até 7 dias após o pagamento.'
                      : 'Defina até quanto tempo antes da reserva o cliente pode cancelar sem ser cobrado.'
                  }
                >
                  <Select>
                    {renderDynamicallyOptions(MINUTES_IN_ADVANCE_REFUND, (value: any) => {
                      return parseInt(value) == 0
                        ? '--'
                        : renderFriendlyMinuteValue(isNumber(value) ? value : parseInt(value));
                    })}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  name="description"
                  rules={rules.bookingWithChange.description}
                  label="Descrição"
                  tooltip="Preencha este campo com a descrição detalhada da reserva e as regras para sua compra."
                >
                  <Input.TextArea
                    showCount
                    maxLength={255}
                    placeholder="A reserva pode ser feita no salão com vista para o jardim do restaurante."
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <div className="flex flex-col items-start text-sm text-slate-600">
                  <p>Taxas totais: {moneyFormatter(feesGetIn.taxGetIn)}</p>
                  <p>Valor a receber: {moneyFormatter(feesGetIn.amountReceivable)}</p>
                </div>
              </Col>
            </Row>
            {(settings?.billing_enabled ?? false) === false && (
              <Row className="mt-6">
                <Col span={24}>
                  <AlertBoxBilling />
                </Col>
              </Row>
            )}
          </>
        )}
      </Form>
    </Drawer>
  );
};

const currencyConfig = {
  locale: 'pt-BR',
  formats: {
    number: {
      BRL: {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

const rules = {
  startAt: [
    {
      required: true,
      message: 'O horário inicial é obrigatório',
    },
  ],
  endAt: [
    {
      required: true,
      message: 'O horário final é obrigatório',
    },
  ],
  totalSeats: [
    {
      required: true,
      message: 'A quantidade de pessoas é obrigatório',
    },
  ],
  minuteStep: [
    {
      required: true,
      message: 'A escala é obrigatória',
    },
  ],
  bookingWithChange: {
    description: [{ required: true, message: 'Por favor, informe a descrição!' }],
    price: [{ required: true, message: 'Por favor, informe o preço por pessoa!' }],
    type_of_charge: [{ required: true, message: 'Por favor, informe o tipo de cobrança!' }],
    billing_type: [{ required: true, message: 'Por favor, informe a modalidade de cobrança!' }],
    refund_hours: [{ required: true, message: 'Por favor, informe a antecedência mínima de estorno!' }],
  },
};
