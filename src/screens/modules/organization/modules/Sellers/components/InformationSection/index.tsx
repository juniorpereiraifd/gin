import { useEffect, useState, type FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Creators as UnitCreators } from 'src/store/modules/unity/actions';
import { PaymentCreators } from 'src/store/modules/payment/actions';
import { CreatePJSellerRequestPayload, CreatePFSellerRequestPayload } from 'src/store/modules/payment/actions';
import type { RootType } from 'src/store/modules/rootReducer';
import { DebouncedSelect } from 'src/stories/entry/DebouncedSelect';
import { Form, useForm, useWatch } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Col, Divider, Radio, Row, Skeleton } from 'antd';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Button } from 'src/stories/general/Button';
import { BusinessInformationSectionForm, type BusinessInformationFormValues } from './BusinessInformationSectionForm';
import { PersonalInformationSectionForm, type PersonalInformationFormValues } from './PersonalInformationSectionForm';
import type { SellerProps, SellerType } from 'src/store/modules/payment/reducer';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { cepMask, cnpjMask, phoneMask, removeNonAlphanumeric } from 'src/utils/helpers';
import { SellerStatusTag } from '../../utils/constants';
import { RefreshCw } from 'lucide-react';

type InformationSectionProps = {
  editable?: SellerProps;
  loading?: boolean;
};

type InformationFormValues = BusinessInformationFormValues &
  PersonalInformationFormValues & {
    unit: {
      value: string;
    };
    seller_type?: string;
  };

export const InformationSection: FunctionComponent<InformationSectionProps> = (props) => {
  const { editable, loading } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    payment: { saving, refreshingStatus },
    unity: { loading: unitLoading, data: units, pagination },
    hall: { unity },
  } = useSelector((state: RootType) => state);
  const [form] = useForm();
  const sellerType = useWatch('seller_type', form) ?? 'business';
  const [unitNameSearched, setUnitNameSearched] = useState<string | null>(null);

  useEffect(() => {
    dispatch(UnitCreators.getUnitsRequest({ page: 1 }));
  }, []);

  useEffect(() => {
    if (editable) {
      form.setFieldsValue({
        unit: editable.unit_id,
        seller_type: editable.seller_type,
        business_name: editable.seller_type === 'business' ? editable.metadata.business_name : undefined,
        business_document: editable.seller_type === 'business' ? cnpjMask(editable.metadata.ein || null) : undefined,
        business_description: editable.seller_type === 'business' ? editable.metadata.business_description : undefined,
        business_email: editable.seller_type === 'business' ? editable.metadata.business_email : undefined,
        business_phone:
          editable.seller_type === 'business' ? phoneMask(editable.metadata.business_phone || null) : undefined,
        business_website: editable.seller_type === 'business' ? editable.metadata.business_website : undefined,
        business_twitter: editable.seller_type === 'business' ? editable.metadata.business_twitter : undefined,
        business_facebook: editable.seller_type === 'business' ? editable.metadata.business_facebook : undefined,
        statement_descriptor: editable.seller_type === 'business' ? editable.metadata.statement_descriptor : undefined,
        business_revenue: editable.seller_type === 'business' ? editable.metadata.revenue * 100 : undefined,
        business_opening_date:
          editable.seller_type === 'business' ? dayjs(editable.metadata.business_opening_date) : undefined,
        business_street: editable.seller_type === 'business' ? editable.metadata.business_address?.line1 : undefined,
        business_number: editable.seller_type === 'business' ? editable.metadata.business_address?.line2 : undefined,
        business_complement:
          editable.seller_type === 'business' ? editable.metadata.business_address?.line3 : undefined,
        business_neighborhood:
          editable.seller_type === 'business' ? editable.metadata.business_address?.neighborhood : undefined,
        business_city: editable.seller_type === 'business' ? editable.metadata.business_address?.city : undefined,
        business_state: editable.seller_type === 'business' ? editable.metadata.business_address?.state : undefined,
        business_zip_code:
          editable.seller_type === 'business'
            ? cepMask(editable.metadata.business_address?.postal_code || null)
            : undefined,
        mcc: editable.seller_type === 'business' ? editable.metadata.mcc : undefined,

        first_name:
          editable.seller_type === 'business' ? editable.metadata.owner?.first_name : editable.metadata.first_name,
        last_name:
          editable.seller_type === 'business' ? editable.metadata.owner?.last_name : editable.metadata.last_name,
        email: editable.seller_type === 'business' ? editable.metadata.owner?.email : editable.metadata.email,
        phone:
          editable.seller_type === 'business'
            ? phoneMask(editable.metadata.owner?.phone_number || null)
            : editable.metadata.phone_number,
        cpf: editable.seller_type === 'business' ? editable.metadata.owner?.taxpayer : editable.metadata.taxpayer,
        revenue:
          editable.seller_type === 'business'
            ? Number(editable.metadata.owner?.revenue || '0') * 100
            : editable.metadata.revenue * 100,
        birth_date:
          editable.seller_type === 'business'
            ? dayjs(editable.metadata.owner?.birthdate)
            : dayjs(editable.metadata.birthdate),
        street:
          editable.seller_type === 'business'
            ? editable.metadata.owner?.address?.line1
            : editable.metadata.address?.line1,
        number:
          editable.seller_type === 'business'
            ? editable.metadata.owner?.address?.line2
            : editable.metadata.address?.line2,
        complement:
          editable.seller_type === 'business'
            ? editable.metadata.owner?.address?.line3
            : editable.metadata.address?.line3,
        district:
          editable.seller_type === 'business'
            ? editable.metadata.owner?.address?.neighborhood
            : editable.metadata.address?.neighborhood,
        city:
          editable.seller_type === 'business'
            ? editable.metadata.owner?.address?.city
            : editable.metadata.address?.city,
        state:
          editable.seller_type === 'business'
            ? editable.metadata.owner?.address?.state
            : editable.metadata.address?.state,
        zip_code:
          editable.seller_type === 'business'
            ? cepMask(editable.metadata.owner?.address?.postal_code || null)
            : cepMask(editable.metadata.address?.postal_code || null),
      });
    }
  }, [editable]);

  const handleRefreshStatus = () => {
    if (editable) {
      dispatch(PaymentCreators.refreshSellerStatusRequest({ sellerId: editable.id }));
    }
  };

  const handleSearchUnit = (unitName: string) => {
    setUnitNameSearched(unitName);

    dispatch(
      UnitCreators.getUnitsRequest({
        page: 1,
        unitName: unitName,
      }),
    );
  };

  const handleClearUnitSelect = () => {
    setUnitNameSearched(null);
    dispatch(UnitCreators.getUnitsRequest({ page: 1 }));
  };

  const onScrollUnitSelect = async (event: any) => {
    const target = event.target;

    if (!unitLoading && pagination !== null && target.scrollTop + target.offsetHeight === target.scrollHeight) {
      target.scrollTo(0, target.scrollHeight);

      dispatch(
        UnitCreators.getUnitsRequest({
          page: pagination.current_page === 0 ? 1 : pagination.current_page + 1,
          isCumulative: true,
          ...(unitNameSearched !== null && { unitName: unitNameSearched }),
        }),
      );
    }
  };

  const handleSubmit = (values: InformationFormValues) => {
    const payload: Partial<CreatePJSellerRequestPayload | CreatePFSellerRequestPayload> = {
      seller_type: (values.seller_type ?? 'business') as SellerType,
      unit_id: values.unit.value,
      mcc: values.mcc,
    };

    if (sellerType === 'business') {
      Object.defineProperties(payload, {
        business_name: { value: values.business_name, enumerable: true },
        ein: { value: removeNonAlphanumeric(values.business_document), enumerable: true },
        business_description: { value: values.business_description, enumerable: true },
        business_email: { value: values.business_email, enumerable: true },
        business_phone: { value: removeNonAlphanumeric(values.business_phone), enumerable: true },
        business_website: { value: values.business_website, enumerable: true },
        business_twitter: { value: values.business_twitter, enumerable: true },
        business_facebook: { value: values.business_facebook, enumerable: true },
        statement_descriptor: { value: values.statement_descriptor, enumerable: true },
        revenue: { value: (values.business_revenue / 100).toString(), enumerable: true },
        business_opening_date: { value: dayjs(values.business_opening_date).format('YYYY-MM-DD'), enumerable: true },
        business_address: {
          value: {
            line1: values.business_street,
            line2: values.business_number,
            line3: values.business_complement || null,
            neighborhood: values.business_neighborhood,
            city: values.business_city,
            state: values.business_state,
            postal_code: removeNonAlphanumeric(values.business_zip_code),
            country_code: 'BR',
          },
          enumerable: true,
        },
        owner: {
          value: {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone_number: removeNonAlphanumeric(values.phone),
            taxpayer: removeNonAlphanumeric(values.cpf),
            birthdate: dayjs(values.birth_date).format('YYYY-MM-DD'),
          },
          enumerable: true,
        },
        owner_address: {
          value: {
            line1: values.street,
            line2: values.number,
            line3: values.complement || null,
            neighborhood: values.district,
            city: values.city,
            state: values.state,
            postal_code: removeNonAlphanumeric(values.zip_code),
            country_code: 'BR',
          },
          enumerable: true,
        },
      });
    }

    if (sellerType === 'individual') {
      Object.defineProperties(payload, {
        first_name: { value: values.first_name, enumerable: true },
        last_name: { value: values.last_name, enumerable: true },
        email: { value: values.email, enumerable: true },
        phone_number: { value: removeNonAlphanumeric(values.phone), enumerable: true },
        taxpayer: { value: removeNonAlphanumeric(values.cpf), enumerable: true },
        birthdate: { value: dayjs(values.birth_date).format('YYYY-MM-DD'), enumerable: true },
        revenue: { value: (values.revenue / 100).toString(), enumerable: true },
        address: {
          value: {
            line1: values.street,
            line2: values.number,
            line3: values.complement || null,
            neighborhood: values.district,
            city: values.city,
            state: values.state,
            postal_code: removeNonAlphanumeric(values.zip_code),
            country_code: 'BR',
          },
          enumerable: true,
        },
      });
    }

    if (editable) {
      Object.defineProperty(payload, 'id', { value: editable.id, enumerable: true });

      dispatch(
        PaymentCreators.updateSellerRequest({
          sellerId: editable.id,
          data: payload as CreatePJSellerRequestPayload | CreatePFSellerRequestPayload,
        }),
      );
    } else {
      dispatch(
        PaymentCreators.createSellerRequest(
          payload as CreatePJSellerRequestPayload | CreatePFSellerRequestPayload,
          (item) => navigate(`/financial/sellers/zoop/edit/${item.id}?tab=documents`),
        ),
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-center">
        <BoxContrasted className="w-full max-w-3xl">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {editable && (
              <Row gutter={16}>
                <Col span={24}>
                  <div className="w-full flex items-center justify-between">
                    <p>
                      Esse vendedor está com o status{' '}
                      <span className="ml-1">
                        {refreshingStatus ? (
                          <Skeleton.Button active size="small" className="!w-[70px] !h-[22px]" />
                        ) : (
                          SellerStatusTag[editable.status]
                        )}
                      </span>
                    </p>
                    <Button
                      variant="outlined"
                      icon={<RefreshCw size={14} />}
                      loading={refreshingStatus}
                      onClick={handleRefreshStatus}
                    >
                      Atualizar status
                    </Button>
                  </div>
                </Col>
                <Divider />
              </Row>
            )}
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label="Unidade" name="unit">
                  <DebouncedSelect
                    allowClear
                    loading={unitLoading || loading}
                    disabled={loading}
                    handleLoadMore={handleSearchUnit}
                    onClear={handleClearUnitSelect}
                    onPopupScroll={pagination?.is_last_page === false ? onScrollUnitSelect : () => null}
                    data={[...(unity !== null ? [unity] : []), ...units].map((unit) => ({
                      label: unit.name,
                      value: unit.id,
                      image: unit.profile_image,
                    }))}
                    dataRender={(option) => (
                      <div className="flex items-center gap-2 py-1">
                        {option.image ? (
                          <img src={option.image} alt={option.label} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-300" />
                        )}
                        <div className="text-sm text-gray-700">{option.label}</div>
                      </div>
                    )}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="Tipo de vendedor" name="seller_type">
                  <Radio.Group
                    block
                    options={[
                      { label: 'Pessoa Jurídica', value: 'business' },
                      { label: 'Pessoa física', value: 'individual' },
                    ]}
                    defaultValue="business"
                    optionType="button"
                  />
                </FormItem>
              </Col>
            </Row>
            {sellerType === 'business' && <BusinessInformationSectionForm form={form} />}
            <PersonalInformationSectionForm form={form} sellerType={sellerType as 'business' | 'individual'} />
            <Divider />
            <div className="w-full flex items-center gap-4 justify-end">
              <Button variant="outlined">Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                Salvar
              </Button>
            </div>
          </Form>
        </BoxContrasted>
      </div>
    </div>
  );
};
