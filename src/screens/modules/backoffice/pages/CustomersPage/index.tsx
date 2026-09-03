import { CalendarAlt } from '@styled-icons/boxicons-regular/CalendarAlt';
import { Download } from '@styled-icons/boxicons-regular/Download';
import { Search } from '@styled-icons/evil/Search';
import { Checkbox, Input, Switch } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { PromotionCreators } from 'src/store/modules/promotions/actions';
import type {
  CustomerData,
  QueryFilterCustomers,
} from 'src/store/modules/promotions/reducer';
import type { RootType } from 'src/store/modules/rootReducer';
import { FormItem, Select } from 'src/stories/entry';
import Loading from 'src/stories/feedback/Loading';
import { Button } from 'src/stories/general/Button';
import { Paragraph, Title } from 'src/stories/typography';
import { notification } from 'src/utils/helpers';
import { CustomerCard } from './CustomerCard';
import { CustomerDetailsModal } from './CustomerDetailsModal';
import * as S from './styles';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { PageContainer } from 'src/components/PageContainer';
import { BoxContrasted } from 'src/components/BoxContrasted';

type FilteringCustomer = {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  status: 'active' | 'inactive';
  productType: 'menu' | 'line' | 'reservation';
  campaign: string | null;
};

type CustomerDetails = {
  showModal: boolean;
  selectedCustomer: CustomerData | null;
};

export function CustomersPage() {
  const dispatch = useDispatch();
  const currentDate = dayjs().format('DD.MM.YYYY');

  const {
    promotions: { isLoading, customers, promotions },
    hall: { unity },
  } = useSelector((state: RootType) => state);

  const downloadCustomersCSVRef = useRef<HTMLAnchorElement | null>(null);

  const [customersPage, setCustomersPage] = useState<number>(1);
  const [allCustomers, setAllCustomers] = useState<CustomerData[]>([]);
  const [searchedCustomer, setSearchedCustomer] = useState<string>('');
  const [customerFiltered, setCustomerFiltered] = useState<FilteringCustomer>({
    startDate: null,
    endDate: null,
    status: 'active',
    productType: 'menu',
    campaign: null,
  });

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    showModal: false,
    selectedCustomer: null,
  });

  const hasSomeValueValid =
    !!customerFiltered.startDate ||
    !!customerFiltered.endDate ||
    !!customerFiltered.status;

  const shouldShowLoadMoreCustomersButton =
    allCustomers.length >= 1 &&
    !isLoading &&
    !customers.pagination?.is_last_page;
  const shouldShowLoading = isLoading && !customers.pagination?.is_last_page;

  const nextCustomersPage = customersPage + 1;

  const customersData = allCustomers.length ? (
    allCustomers.map((customer) => (
      <CustomerCard
        key={customer.unit_id}
        customer={customer}
        tagName="menu"
        onClick={() => {
          setCustomerDetails({
            showModal: true,
            selectedCustomer: customer,
          });
          getSelectedCustomerInfo(customer.unit_id);
        }}
      />
    ))
  ) : (
    <Paragraph>Não há clientes no momento</Paragraph>
  );

  const params = Object.assign(
    {
      product: customerFiltered.productType,
      status: customerFiltered.status,
    } as Partial<QueryFilterCustomers>,
    searchedCustomer && { query: searchedCustomer.trim() },
    customerFiltered.campaign && { campaign: customerFiltered.campaign },
    customerFiltered.startDate && {
      start_at: dayjs(customerFiltered.startDate).format('YYYY-MM-DD'),
    },
    customerFiltered.endDate && {
      end_at: dayjs(customerFiltered.endDate).format('YYYY-MM-DD'),
    }
  );

  const handleLoadMore = () => {
    if (customers.pagination?.is_last_page) {
      notification.success('Todas as unidades foram carregadas!', '');
      return;
    }
    setCustomersPage(nextCustomersPage);
    dispatch(
      PromotionCreators.getCustomersRequest({ page: nextCustomersPage, params })
    );
  };

  const resetCustomers = () => {
    setAllCustomers([]);
    setCustomersPage(1);
  };

  const handleResetFilteringValues = () =>
    setCustomerFiltered({
      startDate: null,
      endDate: null,
      status: 'active',
      productType: 'menu',
      campaign: null,
    });

  const handleFilterCustomer = () => {
    resetCustomers();
    dispatch(PromotionCreators.getCustomersRequest({ page: 1, params }));
  };

  useEffect(() => {
    dispatch(PromotionCreators.getCustomersRequest({ page: 1, params }));
    dispatch(PromotionCreators.getPromotionsRequest());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (customers.data && customers?.pagination) {
      setAllCustomers(
        customers?.pagination.current_page > 1
          ? (oldValues) => [...oldValues, ...customers.data]
          : customers.data
      );
    }
  }, [customers.data, customers?.pagination]);

  const getSelectedCustomerInfo = (id: string) => {
    dispatch(HallCreators.getUnityRequest({ id }));
    dispatch(
      PromotionCreators.getPromotionDetailsRequest({
        id,
        type: 'current',
        pagination: 0,
      })
    );
    dispatch(
      PromotionCreators.getPromotionDetailsRequest({
        id,
        type: 'historic',
        pagination: 0,
      })
    );
  };

  useEffect(() => {
    if (customers.csv) {
      downloadCustomersCSVRef.current?.click();
      dispatch(PromotionCreators.resetCustomersCsv());
    }
  }, [customers.csv]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageContainer>
      <PageTitle>Clientes</PageTitle>

      <BoxContrasted>
        <div className="grid grid-cols-[1fr_3fr] gap-8">
          <S.FilterBy>
            <Title level={4}>Filtrar por</Title>

            <S.ViewByDate>
              <div className="title-wrapper">
                <CalendarAlt size={18} />
                <Title level={5}>Visualizar por data</Title>
              </div>

              <S.CustomDatePicker
                placeholder={['Data inicial', 'Data final']}
                format="DD/MM/YYYY"
                value={[customerFiltered.startDate, customerFiltered.endDate]}
                onChange={(value) =>
                  setCustomerFiltered((oldValues) => {
                    return {
                      ...oldValues,
                      status:
                        oldValues.status === 'inactive' ? 'active' : 'inactive',
                      startDate: value?.[0] ?? null,
                      endDate: value?.[1] ?? null,
                    };
                  })
                }
              />
            </S.ViewByDate>

            <FormItem
              rowDirection
              label={`Promoção ${
                customerFiltered.status === 'active' ? 'ativa' : 'inativa'
              }`}
              labelPosition="right"
              title="Promoção Ativa/Inativa"
              onClickOnLabel={() =>
                setCustomerFiltered((oldValues) => {
                  return {
                    ...oldValues,
                    status:
                      oldValues.status === 'inactive' ? 'active' : 'inactive',
                  };
                })
              }
            >
              <Switch
                title="Ativar/Inativar"
                checked={customerFiltered.status === 'active'}
                onChange={(checked: boolean) =>
                  setCustomerFiltered((oldValues) => {
                    return {
                      ...oldValues,
                      status: checked ? 'active' : 'inactive',
                    };
                  })
                }
              />
            </FormItem>

            <FormItem label="Buscar campanhas">
              <Select
                showSearch
                placeholder="Nome da campanha"
                value={customerFiltered.campaign ?? undefined}
                onChange={(value) =>
                  setCustomerFiltered((oldValues) => {
                    return {
                      ...oldValues,
                      campaign: (value as string) ?? null,
                    };
                  })
                }
              >
                {promotions.data.map((promotion) => (
                  <Select.Option value={promotion.title} key={promotion.id}>
                    {promotion.title}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>

            <FormItem heading={<Title level={5}>Por produto</Title>}>
              <FormItem rowDirection label="Cardápio" labelPosition="right">
                <Checkbox checked={customerFiltered.productType === 'menu'} />
              </FormItem>

              <S.ButtonsWrapper>
                <Button
                  variant="outlined"
                  onClick={handleResetFilteringValues}
                  disabled={isLoading || !hasSomeValueValid}
                >
                  Limpar
                </Button>

                <Button
                  type="primary"
                  onClick={handleFilterCustomer}
                  disabled={isLoading || !hasSomeValueValid}
                >
                  Aplicar filtro
                </Button>
              </S.ButtonsWrapper>
            </FormItem>
          </S.FilterBy>
          <S.ClientsList>
            <Title level={4}>Lista de Clientes</Title>

            <S.InputWrapper>
              <FormItem label="Busca">
                <Input
                  value={searchedCustomer}
                  onChange={({ target: { value } }) => {
                    setSearchedCustomer(value.trim());
                    if (!value) {
                      delete params.query;
                      resetCustomers();
                      dispatch(
                        PromotionCreators.getCustomersRequest({
                          page: 1,
                          params,
                        })
                      );
                    }
                  }}
                  placeholder="Digite o nome do restaurante"
                />
              </FormItem>

              <Button
                type="primary"
                htmlType="button"
                icon={<Search size={22} />}
                onClick={handleFilterCustomer}
                disabled={isLoading || !searchedCustomer}
              >
                Buscar
              </Button>
            </S.InputWrapper>

            <S.SearchBox>
              <S.SearchBoxDescriptionWrapper>
                <S.SearchBoxDescription>
                  {allCustomers.length} restaurante(s)
                </S.SearchBoxDescription>

                <S.SearchBoxDescriptionButtons>
                  <Button
                    variant="outlined"
                    icon={<Download size={22} />}
                    onClick={() =>
                      !customers.csv
                        ? dispatch(PromotionCreators.getCustomersCsvRequest())
                        : downloadCustomersCSVRef.current?.click()
                    }
                  >
                    Exportar base (CSV)
                  </Button>

                  {customers.csv && (
                    <a
                      ref={downloadCustomersCSVRef}
                      href={window.URL.createObjectURL(customers.csv)}
                      target="_blank"
                      rel="noreferrer"
                      download={`lista-de-clientes-${currentDate}.csv`}
                      hidden
                    />
                  )}
                </S.SearchBoxDescriptionButtons>
              </S.SearchBoxDescriptionWrapper>

              <S.SearchBoxResultWrapper>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <CustomerCard key={index} withLoading />
                    ))
                  : customersData}

                {shouldShowLoadMoreCustomersButton && (
                  <Button
                    type="primary"
                    htmlType="button"
                    size="small"
                    icon={<Search size={22} />}
                    onClick={handleLoadMore}
                  >
                    Carregar mais
                  </Button>
                )}

                {shouldShowLoading && (
                  <S.LoadingWrapper>
                    <Loading /> Carregando
                  </S.LoadingWrapper>
                )}
              </S.SearchBoxResultWrapper>
            </S.SearchBox>
          </S.ClientsList>
        </div>
      </BoxContrasted>

      <CustomerDetailsModal
        showModal={
          customerDetails.showModal &&
          !!customerDetails.selectedCustomer &&
          !!unity
        }
        onCloseModal={() => {
          setCustomerDetails({
            showModal: false,
            selectedCustomer: null,
          });
          dispatch(HallCreators.resetHall());
        }}
        customer={customerDetails.selectedCustomer}
      />
    </PageContainer>
  );
}
