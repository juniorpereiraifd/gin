import { useState, useEffect, Fragment } from 'react';
import { Col, Divider, Drawer, Form, Input as AntInput, Radio, Row, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { CurrencyInput, Input, TimePicker } from 'src/stories/entry';
import { Switch } from 'src/stories/entry/Switch';
import { Button } from 'src/stories/general/Button';
import { Creators as SpecialDatesCreators } from 'src/store/modules/specialDate/actions';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { HallItemProps } from 'src/store/modules/hall/reducer';
import * as S from './styles';
import { CustomizeTableBox } from 'src/screens/modules/reservation/components/CustomizeTableBox';
import { AlertBoxBilling } from 'src/screens/modules/reservation/components/AlertBoxBilling';
import dayjs from 'dayjs';
import {
  handlePopulatePrice,
  moneyFormatter,
  notification,
  renderDynamicallyOptions,
  renderFriendlyMinuteValue,
} from 'src/utils/helpers';
import { Creators as SpecialDateCreators } from 'src/store/modules/specialDate/actions';
import Loading from 'src/stories/feedback/Loading';
import { DISCOUNT, MINUTES_IN_ADVANCE, MINUTES_IN_ADVANCE_REFUND, MINUTE_STEP } from 'src/utils/constants';
import { isNumber } from 'lodash';
import { SCHEDULE_BILLING_TYPE, SCHEDULE_TYPE } from 'src/store/modules/schedule/reducer';

const { Option } = Select;

const rules = {
  name: [{ required: true, message: 'Por favor, informe o título!' }],
  sector_id: [{ required: true, message: 'Por favor, selecione o salão!' }],
  date_range: [{ required: true, message: 'Por favor, informe as datas!' }],
  starts_at: [{ required: true, message: 'Por favor, informe o horário de início!' }],
  total_seats: [{ required: true, message: 'Por favor, informe a quantidade de pessoas!' }],
  minute_step: [{ required: true, message: 'Por favor, informe a escala!' }],
  bookingWithChange: {
    description: [{ required: true, message: 'Por favor, informe a descrição!' }],
    price: [{ required: true, message: 'Por favor, informe o preço!' }],
    type_of_charge: [{ required: true, message: 'Por favor, informe o tipo de cobrança!' }],
    billing_type: [{ required: true, message: 'Por favor, informe a modalidade de cobrança!' }],
    refund_hours: [{ required: true, message: 'Por favor, informe a antecedência mínima de estorno!' }],
  },
};

type HallSelected = {
  hasValue: boolean;
  type: 'total-seats' | 'table-map' | string;
};

type ScheduleType = {
  numberOfTable: number | null;
  numberOfPeople: number | string | null;
};

export const SpecialDatesMutationDrawer = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    hall: { data },
    specialDate: { isOpen, editable, errors, saving, loadingOne },
    reservation: { settings },
  } = useSelector((state: RootType) => state);
  const typeOfChargeValue = Form.useWatch('type_of_charge', form) ?? SCHEDULE_TYPE.PAID_GRADE;
  const billingTypeValue = Form.useWatch('billing_type', form) ?? SCHEDULE_BILLING_TYPE.FIXED;
  const [hallSelected, setHallSelected] = useState<HallSelected>({
    hasValue: false,
    type: 'total-seats',
  });
  const [scheduleMap, setScheduleMap] = useState<ScheduleType[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [hallRequestTimes, setHallRequestTimes] = useState(0);
  const [hallNotExist, setHallNotExist] = useState(false);
  const [optionList, setOptionList] = useState<HallItemProps[]>([]);
  const [isBookingWithChange, setIsBookingWithChange] = useState(false);
  const [price, setPrice] = useState(0);
  const [feesGetIn, setFeesGetIn] = useState({
    taxGetIn: 0,
    amountReceivable: 0,
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(
        HallCreators.getHallsRequest({
          page: 1,
          perPage: 99,
          reset: true,
          active: false,
        }),
      );
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (data.length) {
      const dataCopy = [...data];
      const dataOrdered = dataCopy.sort((a, b) => {
        return a.active > b.active ? 1 : a.active < b.active ? 1 : 0;
      });

      setOptionList([...dataOrdered]);
    }
  }, [data]);

  useEffect(() => {
    form.resetFields();
    setHallSelected({ ...hallSelected, hasValue: false });
    setScheduleMap([]);
    setIsBookingWithChange(false);
    setPrice(0);
    setFeesGetIn({ taxGetIn: 0, amountReceivable: 0 });
    editable && setLoadingData(true);

    if (editable && data.length > 0) {
      const valuesSchedule = editable.schedule;
      const valuesScheduleMap = editable.schedule_map.map((schedule) => {
        return {
          numberOfPeople: schedule.number_of_people,
          numberOfTable: schedule.number_of_tables,
        };
      });

      const sectorSelected = data.filter((item) => item.name === valuesSchedule.sector_name);

      if (sectorSelected.length) {
        setHallSelected({ hasValue: true, type: sectorSelected[0].type });
        setScheduleMap(valuesScheduleMap);

        form.setFieldsValue({
          name: valuesSchedule.name,
          sector_id: sectorSelected[0].id,
          minute_step: valuesSchedule.minute_step,
          started_at: dayjs(valuesSchedule.started_at, 'HH:mm'),
          ended_at: dayjs(valuesSchedule.ended_at, 'HH:mm'),
          minutes_in_advance: valuesSchedule.minutes_in_advance,
          total_seats: valuesSchedule.total_seats,
          discount: valuesSchedule.discount,
          ...(editable.schedule_product && {
            description: editable.schedule_product.description,
            price: editable.schedule_product.price,
            type_of_charge: editable.schedule_product.type,
            billing_type: editable.schedule_product.billing_type,
            refund_hours: editable.schedule_product.refund_hours * 60,
          }),
        });

        if (editable.schedule_product) {
          setIsBookingWithChange(true);
          handlePopulatePrice({
            value: editable.schedule_product.price,
            getInTax:
              editable.schedule_product.type === SCHEDULE_TYPE.PAID_GRADE
                ? settings?.getin_tax
                : settings?.noshow_getin_tax,
            setPrice,
            setFeesGetIn,
          });
        }

        setLoadingData(false);
      } else {
        if (hallRequestTimes < 2) {
          dispatch(
            HallCreators.getHallsRequest({
              page: 1,
              perPage: 99,
              reset: true,
              active: true,
            }),
          );
          setHallRequestTimes((value) => value + 1);
        } else {
          setHallNotExist(true);
        }
      }
    }
  }, [data, editable, form, isOpen]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (hallNotExist) {
      notification.error(
        'Erro ao buscar dados da data especial',
        'O salão em que essa data especial foi criada não existe.',
      );
      dispatch(SpecialDatesCreators.hideModal());
    }
  }, [hallNotExist, dispatch]);

  useEffect(() => {
    if (errors instanceof Array) {
      form.setFields(errors);
    }
  }, [errors, form]);

  const onClose = () => {
    dispatch(SpecialDatesCreators.hideModal());
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

  const handleChangeTypeOfCharge = (e: any) => {
    //eslint-disable-line @typescript-eslint/no-explicit-any
    handlePopulatePrice({
      value: price || 0,
      getInTax: e.target.value === SCHEDULE_TYPE.PAID_GRADE ? settings?.getin_tax : settings?.noshow_getin_tax,
      setPrice,
      setFeesGetIn,
    });
  };

  const handleSubmit = (values: any /*eslint-disable-line @typescript-eslint/no-explicit-any*/) => {
    if (scheduleMap.length === 0) {
      return notification.error(
        'Erro ao criar data especial',
        `Certifique-se de informar alguma configuração de mesas para o salão`,
      );
    }

    const { description, ...restValues } = values;

    if (editable) {
      const editValues = {
        schedule: {
          id: editable.schedule.id,
          name: restValues.name,
          sector_id: restValues.sector_id,
          discount: restValues.discount,
          minute_step: restValues.minute_step,
          minutes_in_advance: restValues.minutes_in_advance,
          total_seats: restValues.total_seats ? restValues.total_seats : null,
          started_at: dayjs(restValues.started_at).format('HH:mm'),
          ended_at: dayjs(restValues.ended_at).format('HH:mm'),
          active: true,
          start_date: editable.schedule.date,
          end_date: editable.schedule.date,
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
            type: restValues.type_of_charge,
            billing_type: restValues.billing_type,
            refund_hours: restValues.refund_hours / 60,
          },
        }),
      };

      return dispatch(SpecialDateCreators.editSpecialDateRequest(editValues));
    }

    const newValues = {
      schedule: {
        name: restValues.name,
        sector_id: restValues.sector_id,
        discount: restValues.discount,
        minute_step: restValues.minute_step,
        minutes_in_advance: restValues.minutes_in_advance,
        total_seats: restValues.total_seats ? restValues.total_seats : null,
        start_date: dayjs(restValues.date_range[0]).format('YYYY-MM-DD'),
        end_date: dayjs(restValues.date_range[1]).format('YYYY-MM-DD'),
        started_at: dayjs(restValues.started_at).format('HH:mm'),
        ended_at: dayjs(restValues.ended_at).format('HH:mm'),
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
          type: restValues.type_of_charge,
          billing_type: restValues.billing_type,
          refund_hours: restValues.refund_hours / 60,
        },
      }),
    };

    return dispatch(SpecialDateCreators.createSpecialDateRequest(newValues));
  };

  const handleChangeHallSelected = (id: string) => {
    const hallFiltered = data.filter((hall) => hall.id === id);

    return setHallSelected({ type: hallFiltered[0].type, hasValue: true });
  };

  return (
    <Drawer
      open={!!isOpen}
      title={<Fragment>{editable ? 'Editar data especial' : 'Adicionar data especial'}</Fragment>}
      rootClassName={
        hallSelected.hasValue ? '[&_.ant-drawer-content-wrapper]:!w-3/5' : '[&_.ant-drawer-content-wrapper]:!w-[553px]'
      }
      destroyOnClose
      onClose={onClose}
      footer={
        <div className="flex gap-4 justify-end py-3 px-2">
          <Button htmlType="button" variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button loading={saving} onClick={() => form.submit()}>
            Salvar
          </Button>
        </div>
      }
    >
      <S.ContainerModal loadingHeight={loadingData || loadingOne}>
        {loadingData || loadingOne ? (
          <S.ContainerLoader>
            <Loading /> Carregando
          </S.ContainerLoader>
        ) : (
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            style={{ width: '100%' }}
            initialValues={{
              type_of_charge: SCHEDULE_TYPE.PAID_GRADE,
              billing_type: SCHEDULE_BILLING_TYPE.FIXED,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: hallSelected.hasValue ? '45%' : '100%' }}>
                <Form.Item label="Título" name="name" rules={rules.name}>
                  <Input />
                </Form.Item>
                <Form.Item label="Salão" name="sector_id" rules={rules.sector_id}>
                  <Select onChange={handleChangeHallSelected}>
                    {optionList &&
                      optionList.map((hall) => (
                        <Option value={hall.id} key={hall.name} disabled={!hall.active}>
                          {hall.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                {!editable && (
                  <Form.Item label="Data" name="date_range" rules={rules.date_range}>
                    <S.CustomDatePicker format="DD/MM/YYYY" />
                  </Form.Item>
                )}
                <S.HourWrapper>
                  <Form.Item label="Início" name="started_at" rules={rules.starts_at}>
                    <TimePicker
                      needConfirm={false}
                      placeholder="00:00"
                      showNow={false}
                      format="HH:mm"
                      allowClear={false}
                      inputReadOnly={true}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Final"
                    name="ended_at"
                    rules={[
                      { required: true, message: 'A hora final é obrigatória!' },
                      () => ({
                        validator(_, value) {
                          if (!value) {
                            return Promise.reject();
                          }
                          const startedAt = form.getFieldValue('started_at');
                          if (value.isBefore(startedAt)) {
                            return Promise.reject('O horário final está menor');
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <TimePicker
                      needConfirm={false}
                      placeholder="00:00"
                      showNow={false}
                      format="HH:mm"
                      allowClear={false}
                      inputReadOnly={true}
                    />
                  </Form.Item>
                </S.HourWrapper>
                <Divider />
                {hallSelected.type === 'total-seats' && (
                  <Form.Item label="Quantidade de pessoas" name="total_seats" rules={rules.total_seats}>
                    <Input />
                  </Form.Item>
                )}
                <Form.Item label="Escala" name="minute_step" rules={rules.minute_step}>
                  <Select>
                    {renderDynamicallyOptions(MINUTE_STEP, (value: any) => {
                      //eslint-disable-line @typescript-eslint/no-explicit-any
                      return renderFriendlyMinuteValue(isNumber(value) ? value : parseInt(value));
                    })}
                  </Select>
                </Form.Item>
                <Form.Item label="Antecedência mínima" name="minutes_in_advance">
                  <Select>
                    {renderDynamicallyOptions(MINUTES_IN_ADVANCE, (value: any) => {
                      //eslint-disable-line @typescript-eslint/no-explicit-any
                      return parseInt(value) == 0
                        ? '--'
                        : renderFriendlyMinuteValue(isNumber(value) ? value : parseInt(value));
                    })}
                  </Select>
                </Form.Item>
                <Form.Item label="Desconto" name="discount">
                  <Select>
                    {renderDynamicallyOptions(DISCOUNT, (value: any) => {
                      //eslint-disable-line @typescript-eslint/no-explicit-any
                      return parseInt(value) == 0 ? '--' : value + '%';
                    })}
                  </Select>
                </Form.Item>
              </div>
              {hallSelected.hasValue && (
                <CustomizeTableBox
                  hallType={hallSelected.type}
                  scheduleList={scheduleMap}
                  setScheduleList={setScheduleMap}
                />
              )}
            </div>
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
                {(() => {
                  const colSpan = hallSelected.hasValue ? 12 : 24;
                  return (
                    <>
                      <Row gutter={16}>
                        <Col span={colSpan}>
                          <Form.Item
                            name="type_of_charge"
                            label="Tipo de cobrança"
                            rules={rules.bookingWithChange.type_of_charge}
                          >
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
                          </Form.Item>
                        </Col>
                        <Col span={colSpan}>
                          <Form.Item
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
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={colSpan}>
                          <Form.Item
                            label={`Preço${billingTypeValue === SCHEDULE_BILLING_TYPE.PER_PERSON ? ' por pessoa' : ''}`}
                            name="price"
                            rules={rules.bookingWithChange.price}
                          >
                            <CurrencyInput currency="BRL" config={currencyConfig} onChange={handlePriceChange} />
                          </Form.Item>
                        </Col>
                        <Col span={colSpan}>
                          <Form.Item
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
                                //eslint-disable-line @typescript-eslint/no-explicit-any
                                return parseInt(value) == 0
                                  ? '--'
                                  : renderFriendlyMinuteValue(isNumber(value) ? value : parseInt(value));
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={colSpan}>
                          <Form.Item
                            name="description"
                            rules={rules.bookingWithChange.description}
                            label="Descrição"
                            tooltip="Preencha este campo com a descrição detalhada da reserva e as regras para sua compra."
                          >
                            <AntInput.TextArea
                              showCount
                              maxLength={255}
                              placeholder="A reserva pode ser feita no salão com vista para o jardim do restaurante."
                            />
                          </Form.Item>
                        </Col>
                        <Col span={colSpan}>
                          <div className="flex flex-col items-start text-sm text-slate-600">
                            <p>Taxas totais: {moneyFormatter(feesGetIn.taxGetIn)}</p>
                            <p>Valor a receber: {moneyFormatter(feesGetIn.amountReceivable)}</p>
                          </div>
                        </Col>
                      </Row>
                    </>
                  );
                })()}
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
        )}
      </S.ContainerModal>
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
