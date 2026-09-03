import dayjs, { type Dayjs } from 'dayjs';
import { Fragment, useEffect, useState, type FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Divider,
  Form,
  Input,
  Checkbox,
  Row,
  Col,
  DatePicker,
  Select,
  TimePicker,
  Drawer,
  Dropdown,
  Tooltip,
  type UploadProps,
  message,
  Skeleton,
} from 'antd';
import { FormFinishInfo } from 'rc-field-form/lib/FormContext';
import { Button } from 'src/stories/general/Button';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as BookingExperiencesCreators } from 'src/store/modules/bookingExperiences/actions';
import { PromoCode, SectorsProps, type MutableExperience } from 'src/store/modules/bookingExperiences/reducer';
import { notification, renderDynamicallyOptions, renderFriendlyMinuteValue } from 'src/utils/helpers';
import { currencyConfig, rules } from '../utils';
import { CurrencyInput } from 'src/stories/entry';
import { HallItemProps } from 'src/store/modules/hall/reducer';
import { handlePopulatePrice, moneyFormatter } from 'src/utils/helpers';
import { AlertBoxBilling } from 'src/screens/modules/reservation/components/AlertBoxBilling';
import * as S from './styles';
import { PromoCodeSection } from './PromoCodeSection';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { normFile, Upload } from 'src/stories/entry/Upload';
import { EllipsisVertical, Star, Trash, TriangleAlert } from 'lucide-react';
import type { ItemType } from 'antd/lib/menu/interface';
import api from 'src/services/api';
import { Reveal } from 'src/stories/display/Reveal';
import { fileToBase64, getFileNameFromUrl, urlToUploadFile } from 'src/utils/file';
import { MINUTES_IN_ADVANCE_REFUND } from 'src/utils/constants';
import { isNumber } from 'lodash';

export interface BookingExperienceValuesInputFields {
  cover?: Array<File & { uid: string; status: string; response: { id: string; image: string; is_cover: boolean } }>;
  hall: string[];
  id: string;
  title: string;
  description: string;
  rules: string;
  initialDate: Dayjs;
  finalDate: Dayjs;
  initialTime: Dayjs;
  finalTime: Dayjs;
  price: number;
  allowSimpleBooking: boolean;
  limit?: number;
  promo_codes?: PromoCode[];
  categories?: string[];
  refund_hours?: number;
}

dayjs.extend(customParseFormat);

const format = 'HH:mm';
const dateFormat = 'DD/MM/YYYY';
const fullDateFormat = 'YYYY-MM-DD HH:mm:ss';

type ExperienceMutationDrawerProps = {
  unitId: string;
};

export const ExperienceMutationDrawer: FunctionComponent<ExperienceMutationDrawerProps> = (props) => {
  const { unitId } = props;
  const { TextArea } = Input;
  const today = Date.now();
  const [form] = Form.useForm();
  const coverValue = Form.useWatch('cover', form);
  const finalDateValue = Form.useWatch('finalDate', form);
  const finalTimeValue = Form.useWatch('finalTime', form);
  const dispatch = useDispatch();
  const [price, setPrice] = useState(0);
  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const [isOpenPromoCodeModal, setIsOpenPromoCodeModal] = useState(false);
  const [feesGetIn, setFeesGetIn] = useState({
    taxGetIn: 0,
    amountReceivable: 0,
  });

  const {
    hall: { data: hallData },
    bookingExperiences: {
      selectedExperience,
      isMutationDrawerOpen,
      editablePromoCode,
      saving,
      loadingSelectedExperience,
      loadingExperienceCategories,
      experienceCategories,
    },
    setting: { reservation },
    reservation: { settings },
  } = useSelector((state: RootType) => state);

  const handleCloseModal = () => {
    dispatch(BookingExperiencesCreators.setMutationDrawerOpen({ open: false }));
    setIsDisabledButton(true);
  };

  const handleSubmitForm = (values: BookingExperienceValuesInputFields) => {
    const {
      cover,
      initialDate,
      finalDate,
      initialTime,
      finalTime,
      allowSimpleBooking,
      hall,
      promo_codes,
      refund_hours,
      ...restExperienceData
    } = values;

    const promoCodesFormatted = (promo_codes ?? []).map((promoCode) => {
      const promoCodeFormatted: Partial<PromoCode> = {};

      Object.entries(promoCode).forEach(([key, value]) => {
        if ((value || undefined) === undefined) {
          return;
        }

        if (key === 'starting_at' || key === 'ending_at') {
          Object.defineProperty(promoCodeFormatted, key, {
            value: dayjs(value).format('YYYY-MM-DD'),
            enumerable: true,
          });

          return;
        }

        Object.defineProperty(promoCodeFormatted, key, {
          value,
          enumerable: true,
        });
      });

      return {
        ...promoCodeFormatted,
      } as PromoCode;
    });

    const starting_at = dayjs(
      `${initialDate.format(dateFormat)} ${initialTime.format(format)}`,
      'DD/MM/YYYY HH:mm',
    ).format(fullDateFormat);

    const ending_at = dayjs(`${finalDate.format(dateFormat)} ${finalTime.format(format)}`, 'DD/MM/YYYY HH:mm').format(
      fullDateFormat,
    );

    const imagesData = (cover ?? []).map((file) => ({
      id: file.response?.id,
      image: file.response?.image,
      is_cover: file.response?.is_cover || false,
    }));

    const experienceParams = {
      ...(selectedExperience && { id: selectedExperience.id }),
      ...restExperienceData,
      images: imagesData,
      sectors: hall,
      starting_at,
      ending_at,
      price,
      is_required: allowSimpleBooking,
      promo_codes: promoCodesFormatted,
      refund_hours: (refund_hours ?? 0) / 60,
    } satisfies MutableExperience;

    if (selectedExperience) {
      dispatch(
        BookingExperiencesCreators.editExperienceRequest({
          ...experienceParams,
        }),
      );

      return;
    }

    dispatch(BookingExperiencesCreators.createExperienceRequest(experienceParams));
  };

  const handlePopulateInputFields = () => {
    if (selectedExperience) {
      const { sectors, starting_at, ending_at, ...experience } = selectedExperience;

      const hallIds = sectors.map((item) => item.id);

      form.setFieldsValue({
        title: experience.title,
        description: experience.description,
        rules: experience.rules,
        price: experience.price,
        limit: experience.limit,
        refund_hours: experience.refund_hours ? experience.refund_hours * 60 : undefined,
        initialDate: dayjs(starting_at, fullDateFormat),
        finalDate: dayjs(ending_at, fullDateFormat),
        initialTime: dayjs(starting_at, fullDateFormat),
        finalTime: dayjs(ending_at, fullDateFormat),
        hall: hallIds,
        allowSimpleBooking: experience.is_required,
        promo_codes: experience.promo_codes ?? [],
        categories: experience.categories?.map((category) => category.id) ?? [],
        cover: (experience.images || []).map((file) => ({
          ...urlToUploadFile(
            file.image,
            getFileNameFromUrl(file.image) || 'experience-image.jpg',
            `image/${file.image.split('.').pop() || 'jpg'}`,
            file.id,
          ),
          response: { id: file.id, image: file.image, is_cover: file.is_cover },
        })),
      });

      setIsDisabledButton(false);
      handlePopulatePrice({
        value: experience.price,
        getInTax: reservation?.getin_tax,
        setPrice,
        setFeesGetIn,
      });
    }
  };

  useEffect(() => {
    if (isMutationDrawerOpen) {
      dispatch(BookingExperiencesCreators.getExperienceCategoriesRequest());

      if (!selectedExperience) {
        form.resetFields();

        if (hallData.length === 1 && selectedExperience === null) {
          form.setFieldsValue({
            hall: [hallData[0].id],
          });
        }

        setIsDisabledButton(true);
        setFeesGetIn({
          taxGetIn: 0,
          amountReceivable: 0,
        });
      } else {
        handlePopulateInputFields();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMutationDrawerOpen, selectedExperience]);

  const handlePriceChange = (event?: InputEvent | undefined, value?: number | undefined) => {
    event?.preventDefault();

    handlePopulatePrice({
      value: value || 0,
      getInTax: reservation?.getin_tax,
      setPrice,
      setFeesGetIn,
    });
  };

  const handleVerifyForm = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    const fields = form.getFieldsValue([
      'hall',
      'title',
      'description',
      'rules',
      'initialDate',
      'finalDate',
      'initialTime',
      'finalTime',
      'refund_hours',
    ]);

    const emptyFieldValue =
      hasErrors ||
      !fields.title ||
      !fields.description ||
      !fields.rules ||
      !fields.initialDate ||
      !fields.finalDate ||
      (fields.hall ?? null) === null ||
      ((fields.hall ?? null) !== null && fields.hall.length === 0) ||
      price === 0 ||
      !fields.initialTime ||
      !fields.finalTime ||
      !fields.refund_hours;

    setIsDisabledButton(emptyFieldValue);
  };

  const formProviderFinish = (name: string, { values, forms }: FormFinishInfo) => {
    if (name === 'promoCodeForm') {
      const { experienceForm } = forms;

      const promoCodes = (experienceForm.getFieldValue('promo_codes') || []) as PromoCode[];

      if (
        promoCodes.some((promoCode) => promoCode.code === values.code) &&
        values.code !== (editablePromoCode?.code ?? '')
      ) {
        notification.error(
          `Erro ao ${editablePromoCode !== null ? 'editar' : 'criar'} código promocional`,
          'O código informado já existe, por favor, insira um novo código.',
        );

        return;
      }

      if (editablePromoCode !== null) {
        const newPromoCodes = promoCodes.map((promoCode) => {
          if (promoCode.code === editablePromoCode.code) {
            return values;
          }

          return promoCode;
        });

        experienceForm.setFieldsValue({ promo_codes: newPromoCodes });
        dispatch(BookingExperiencesCreators.setEditablePromoCode(null));
      } else {
        experienceForm.setFieldsValue({ promo_codes: [...promoCodes, values] });
      }

      setIsOpenPromoCodeModal(false);
    }
  };

  const handleCustomRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;

    try {
      const base64 = await fileToBase64(file as File);

      if (!base64) {
        throw new Error('Houve um erro ao converter o arquivo.');
      }

      const { data: response } = await api.post(`/reservation/v1/units/${unitId}/products/images`, {
        image: { name: (file as File).name, content: base64 },
      });

      const { id, image } = response.data;

      onSuccess?.({ id, image, is_cover: coverValue.length === 1 }, file as any);
    } catch (e) {
      onError?.(new Error('Houve um erro ao enviar o arquivo. Remova a imagem com erro e tente novamente.'));
    }
  };

  return (
    <Drawer
      open={isMutationDrawerOpen}
      title={
        loadingSelectedExperience ? (
          <Skeleton.Button active className="!w-64 !h-6" />
        ) : (
          <Fragment>{selectedExperience ? 'Editar Experiência' : 'Adicionar Experiência'}</Fragment>
        )
      }
      destroyOnClose
      afterOpenChange={(open) => {
        if (open === false) {
          dispatch(BookingExperiencesCreators.setSelectedExperience(null));
        }
      }}
      onClose={handleCloseModal}
      loading={loadingSelectedExperience}
      width="553px"
      footer={
        <div className="flex flex-col gap-4 py-3 px-2">
          {settings !== null && settings?.billing_enabled === false && <AlertBoxBilling />}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button onClick={() => form.submit()} disabled={isDisabledButton} loading={saving}>
              Salvar
            </Button>
          </div>
        </div>
      }
    >
      <Form.Provider onFormFinish={formProviderFinish}>
        <Form
          name="experienceForm"
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          onFieldsChange={handleVerifyForm}
        >
          <Form.Item label="Imagens" name="cover" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              customRequest={handleCustomRequest}
              onChange={({ file }) => {
                if (file.status === 'done') {
                  message.success(`${file.name} enviado com sucesso.`);
                }
                if (file.status === 'error') {
                  message.error(`${file.name} falhou ao enviar.`);
                }
              }}
              typeUpload="image"
              details={['PNG ou JPG', 'Até 1.8MB', 'Até 6 imagens']}
              maxSizeMB={1.8}
              listType="picture"
              multiple
              maxCount={6}
              aria-label="Banner do evento"
              className="[&_.ant-upload-list-item-name]:relative [&_.ant-upload-list-item-name]:block [&_.ant-upload-list-item-name]:!pr-16 [&_.ant-upload-list-item-name]:!py-2 [&_.ant-upload-list-item-name]:overflow-hidden [&_.ant-upload-list-item-name]:text-ellipsis [&_.ant-upload-list-item-name]:whitespace-nowrap [&_.ant-upload-list-item-extra]:absolute [&_.ant-upload-list-item-extra]:right-0 [&_.ant-upload-list-item-extra]:top-1/2 [&_.ant-upload-list-item-extra]:-translate-y-1/2 [&_.ant-upload-list-item-extra]:shrink-0"
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: false,
                extra: (file) => {
                  const isFileCoverImage = file.response?.is_cover || false;

                  return (
                    <div className="flex items-center gap-3">
                      <Reveal>
                        {isFileCoverImage === true && file.status !== 'error' && (
                          <Tooltip title="Essa é a imagem de capa da sua experiência.">
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          </Tooltip>
                        )}
                      </Reveal>
                      <Dropdown
                        menu={{
                          items: [
                            ...(isFileCoverImage === false && file.status !== 'error'
                              ? [
                                  {
                                    label: 'Definir imagem como capa',
                                    key: 'cover',
                                    icon: <Star size={14} className="text-slate-600" />,
                                    onClick: (e: any) => {
                                      e.domEvent.stopPropagation();
                                      form.setFieldValue('cover', [
                                        ...coverValue.map((f: any) => ({
                                          ...f,
                                          response: {
                                            ...f.response,
                                            is_cover: f.uid === file.uid,
                                          },
                                        })),
                                      ]);
                                    },
                                  },
                                  {
                                    type: 'divider',
                                  } as ItemType,
                                ]
                              : []),
                            {
                              label: 'Remover imagem',
                              key: 'remove',
                              icon: <Trash size={14} className="text-slate-600" />,
                              onClick: (e) => {
                                e.domEvent.stopPropagation();
                                const filteredFiles = coverValue.filter((f: any) => f.uid !== file.uid);

                                if (isFileCoverImage && filteredFiles.length > 0) {
                                  filteredFiles[0].response.is_cover = true;
                                }

                                form.setFieldValue('cover', filteredFiles);
                              },
                            },
                          ],
                        }}
                        trigger={['click']}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          icon={<EllipsisVertical size={14} className="text-slate-500" />}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Dropdown>
                    </div>
                  );
                },
              }}
            />
          </Form.Item>

          <Form.Item label="Salões" name="hall" rules={rules.hall}>
            <Select
              mode="multiple"
              allowClear
              placeholder="Selecione um ou mais salões"
              options={
                selectedExperience !== null
                  ? getOptions(hallData, selectedExperience.sectors ?? [])
                  : getOptions(hallData, [])
              }
            />
          </Form.Item>

          <Form.Item name="title" rules={rules.title} label="Título">
            <Input placeholder="Nome da experiência" />
          </Form.Item>

          <Form.Item name="description" rules={rules.description} label="Descrição">
            <TextArea showCount rows={4} maxLength={510} placeholder="Adicione uma descrição para a experiência" />
          </Form.Item>

          <Form.Item name="rules" rules={rules.rules} label="Regras e condições">
            <TextArea showCount rows={4} maxLength={510} placeholder="Adicione regras e condições para a experiência" />
          </Form.Item>
          <Form.Item name="categories" label="Categorias">
            <Select
              loading={loadingExperienceCategories}
              disabled={loadingExperienceCategories}
              mode="multiple"
              placeholder="Selecione uma ou mais categorias"
              options={experienceCategories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
            />
          </Form.Item>

          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name="initialDate" rules={rules.initialDate} label="Data inicial">
                <DatePicker
                  format={dateFormat}
                  className="w-full"
                  inputReadOnly
                  disabledDate={(date) => date.isBefore(today)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="finalDate" rules={rules.finalDate} label="Data final">
                <DatePicker
                  format={dateFormat}
                  className="w-full"
                  inputReadOnly
                  disabledDate={(date) => date.isBefore(today)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="initialTime" rules={rules.initialTime} label="Horário inicial">
                <TimePicker
                  needConfirm={false}
                  placeholder="00:00"
                  className="w-full"
                  showNow={false}
                  format={format}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="finalTime" rules={rules.finalTime} label="Horário final">
                <TimePicker
                  needConfirm={false}
                  placeholder="00:00"
                  className="w-full"
                  showNow={false}
                  format={format}
                />
              </Form.Item>
            </Col>
            <Reveal className="w-full">
              {finalDateValue && finalTimeValue && (
                <Col span={24}>
                  <div className="w-full flex gap-2 bg-gray-50 p-2 rounded-md border border-gray-200 mb-6">
                    <TriangleAlert size={14} className="text-amber-600 flex-shrink-0" />
                    <p className="text-gray-600 text-xs">
                      O último horário para comprar a sua experiência, caso possua na grade horária, será no dia{' '}
                      {finalDateValue.format(dateFormat)} às {finalTimeValue.format(format)}.
                    </p>
                  </div>
                </Col>
              )}
            </Reveal>
            <Col span={12}>
              <Form.Item name="price" rules={rules.price} label="Preço por pessoa">
                <CurrencyInput currency="BRL" config={currencyConfig} onChange={handlePriceChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="allowSimpleBooking" valuePropName="checked">
                <Checkbox onChange={() => setIsDisabledButton(false)}>Não permitir reserva simples</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Antecedência mínima de estorno"
                name="refund_hours"
                rules={rules.refund_hours}
                tooltip="Defina até quanto tempo antes da reserva o cliente pode cancelar e ter direito ao reembolso. Nota: Compras online têm estorno garantido por lei até 7 dias após o pagamento."
              >
                <Select>
                  {renderDynamicallyOptions(MINUTES_IN_ADVANCE_REFUND, (value: any) => {
                    return parseInt(value) == 0
                      ? '--'
                      : renderFriendlyMinuteValue(isNumber(value) ? value : parseInt(value));
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <PromoCodeSection
            form={form}
            isOpenPromoCodeModal={isOpenPromoCodeModal}
            setIsOpenPromoCodeModal={setIsOpenPromoCodeModal}
          />
        </Form>
      </Form.Provider>
      <Row>
        <S.HelperTextContainer span={16}>
          <p>Taxas totais: {moneyFormatter(feesGetIn.taxGetIn)}</p>
          <p>Valor a receber: {moneyFormatter(feesGetIn.amountReceivable)}</p>
        </S.HelperTextContainer>
      </Row>
    </Drawer>
  );
};

type Option = {
  label: string;
  value: string;
};

const getOptions = (hallData: HallItemProps[], editableSectors: SectorsProps[]) => {
  const options: Option[] = [];

  hallData.forEach((item) => {
    options.push({
      label: item.name,
      value: item.id,
    });
  });

  editableSectors.forEach((item) => {
    if (options.some((option) => option.value === item.id)) {
      return;
    }

    options.push({
      label: item.name,
      value: item.id,
    });
  });

  return options;
};
