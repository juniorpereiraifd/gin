import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'antd';
import dayjs from 'dayjs';
import { Download, Ellipsis, Mail, Phone, Trash2 } from 'lucide-react';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import {
  CustomerData,
  CustomerResponse,
  GetCustomersResponse,
  Segmentations,
} from 'src/store/modules/marketing/reducer';
import { PageContainer } from 'src/components/PageContainer';
import { RootType } from 'src/store/modules/rootReducer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { Button } from 'src/ui/Button';
import { Skeleton } from 'src/ui/Skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/ui/DropdownMenu';

const { Column } = Table;

export const ListCustomerDetailPage: FunctionComponent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { segmentation, listId } = useParams<{
    segmentation?: ParsedSegmentations;
    listId?: string;
  }>();
  const {
    hall: { unity },
    marketing: { customers, isLoading, csv, importCsv },
  } = useSelector((state: RootType) => state);
  const downloadCsvRef = useRef<HTMLAnchorElement | null>(null);
  const [dataSource, setDataSource] = useState<CustomerResponse | null>(null);

  useEffect(() => {
    if (unity?.id === undefined) {
      return;
    }

    if (getIsListRoute(location.pathname, listId) === true) {
      dispatch(MarketingCreators.getDetailsListRequest({ listId: listId! }));

      dispatch(
        MarketingCreators.getFilteredCustomersRequest({
          page: 1,
          list_id: listId,
        })
      );
    } else if (
      getIsSegmentationRoute(location.pathname, segmentation) === true
    ) {
      setDataSource(customers[segmentation!]);
    }
  }, [unity?.id, listId]);

  useEffect(() => {
    if (
      getIsListRoute(location.pathname, listId) === true &&
      (customers.list || null) !== null
    ) {
      return setDataSource(customers.list);
    }

    if (
      getIsSegmentationRoute(location.pathname, segmentation) === true &&
      segmentation !== undefined &&
      customers[segmentation] !== undefined
    ) {
      return setDataSource(customers[segmentation]);
    }
  }, [customers]);

  useEffect(() => {
    if (Object.values(csv).every((value) => value === null)) {
      return;
    }

    let url = '';

    if (
      getIsListRoute(location.pathname, listId) === true &&
      (csv.list || null) !== null
    ) {
      url = window.URL.createObjectURL(csv.list!);
    }

    if (
      getIsSegmentationRoute(location.pathname, segmentation) === true &&
      segmentation !== undefined &&
      csv[segmentation] !== null
    ) {
      url = window.URL.createObjectURL(csv[segmentation]!);
    }

    if (downloadCsvRef.current) {
      const downloadLink = downloadCsvRef.current;

      downloadLink.href = url;
      downloadLink.click();

      window.URL.revokeObjectURL(url);
      dispatch(MarketingCreators.resetCsvCustomers());
    }
  }, [csv]);

  const handleDownloadCsv = () => {
    if (unity?.id === undefined) {
      return;
    }

    dispatch(
      MarketingCreators.getCsvCustomersRequest({
        ...(getIsListRoute(location.pathname, listId) === true
          ? { list_id: listId }
          : { ...getSegmentationData(segmentation!) }),
      })
    );
  };

  const handleDeleteList = () => {
    if (unity?.id === undefined || (listId || null) === null) {
      return;
    }

    dispatch(MarketingCreators.deleteListRequest({ listId: listId! }));
  };

  const handleLoadMore = ({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) => {
    dispatch(
      MarketingCreators.getFilteredCustomersRequest({
        page: page,
        per_page: perPage,
        ...(getIsListRoute(location.pathname, listId) === true
          ? {
              list_id: listId,
            }
          : {
              ...(segmentation?.includes('dont_come_back') === true
                ? {
                    segmentation: 'dont_come_back',
                    days: getSegmentationData(segmentation).days,
                  }
                : { segmentation: segmentation! }),
            }),
      })
    );
  };

  return (
    <PageContainer>
      <PageTitle>
        {importCsv.isLoading ? (
          <Skeleton className="h-9 w-80 bg-slate-200" />
        ) : listId !== undefined ? (
          importCsv?.details?.name
        ) : (
          segmentations[segmentation!].title
        )}
      </PageTitle>
      <Table
        bordered
        dataSource={dataSource?.data}
        loading={isLoading}
        size="large"
        title={() => (
          <div className="w-full flex items-center gap-4 justify-end">
            {getIsListRoute(location.pathname, listId) === true && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteList}
              >
                <Trash2 size={16} /> Excluir Lista
              </Button>
            )}
            <Button
              className="flex items-center gap-4"
              size="sm"
              disabled={dataSource !== null && dataSource?.data.length < 1}
              onClick={handleDownloadCsv}
            >
              <Download size={16} />
              Exportar base (CSV)
            </Button>
            {Object.values(csv).some((value) => value !== null) === true && (
              <a
                hidden
                ref={downloadCsvRef}
                href="#"
                target="_blank"
                rel="noreferrer"
                download={`lista-de-clientes-${dayjs().format(
                  'DD.MM.YYYY'
                )}.csv`}
              />
            )}
          </div>
        )}
        onChange={(pagination) =>
          handleLoadMore({
            page: pagination.current ?? 1,
            perPage: pagination.pageSize ?? 15,
          })
        }
        pagination={{
          current: dataSource?.pagination?.current_page,
          pageSize: dataSource?.pagination?.per_page,
          total: dataSource?.pagination?.total,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50'],
          showTotal: (total) => `Total de ${total} clientes`,
        }}
      >
        <Column title="Nome do cliente" dataIndex="name" key="name" />
        <Column
          title="Última visita"
          dataIndex="last_visit_at"
          key="last_visit_at"
          render={(value) => dayjs(value).format('DD/MM/YYYY')}
        />
        <Column
          title="Quantidade de visitas"
          dataIndex="amount_of_visits"
          key="amount_of_visits"
        />
        <Column
          title="Aniversário"
          dataIndex="birthdate"
          key="birthdate"
          render={(value) => {
            if ((value || null) === null) {
              return 'Não informado';
            }

            return dayjs(value).format('DD/MM/YYYY');
          }}
        />
        <Column
          title="Contato"
          dataIndex="contact"
          key="contact"
          render={(_, data) => {
            const customer = data as CustomerData;

            return (
              <div className="w-full flex items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Ellipsis size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="cursor-pointer flex item-center">
                      <a
                        className="flex items-center gap-2"
                        href={`https://web.whatsapp.com/send?phone=+${customer.mobile}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Phone />
                        Whatsapp
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer flex item-center">
                      <a
                        className="flex items-center gap-2"
                        href={`mailto:${customer.email}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Mail />
                        Email
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          }}
        />
      </Table>
    </PageContainer>
  );
};

const getIsLocation = (pathname: string, route: string) => {
  return pathname.includes(route);
};

const getIsSegmentationRoute = (
  pathname: string,
  segmentation: ParsedSegmentations | undefined
) => {
  return getIsLocation(pathname, 'segmentation') && segmentation !== undefined;
};

const getIsListRoute = (pathname: string, listId: string | undefined) => {
  return getIsLocation(pathname, 'list') && listId !== undefined;
};

const getSegmentationData = (
  segmentation: ParsedSegmentations
): {
  segmentation: Segmentations;
  days?: string;
} => {
  switch (segmentation) {
    case 'dont_come_back_thirty':
      return {
        segmentation: 'dont_come_back_thirty',
        days: '30',
      };

    case 'dont_come_back_sixty':
      return {
        segmentation: 'dont_come_back_sixty',
        days: '60',
      };

    case 'dont_come_back_ninety':
      return {
        segmentation: 'dont_come_back_ninety',
        days: '90',
      };

    default:
      return {
        segmentation: segmentation,
      };
  }
};

export type ParsedSegmentations = keyof Omit<GetCustomersResponse, 'list'>;

const segmentations: Record<ParsedSegmentations, { title: string }> = {
  all: {
    title: 'Todos os clientes',
  },
  birthdays: {
    title: 'Aniversariantes',
  },
  reservation_noshow: {
    title: 'Reservas com no-show',
  },
  canceled: {
    title: 'Cancelados',
  },
  dont_come_back_thirty: {
    title: 'Não retornaram em 30 dias',
  },
  dont_come_back_sixty: {
    title: 'Não retornaram em 60 dias',
  },
  dont_come_back_ninety: {
    title: 'Não retornaram em 90 dias',
  },
};
