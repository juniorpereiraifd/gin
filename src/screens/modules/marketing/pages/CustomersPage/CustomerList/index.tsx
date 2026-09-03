import { Fragment, FunctionComponent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Table } from 'antd';
import { Download, Ellipsis, Mail, Phone } from 'lucide-react';
import { RootType } from 'src/store/modules/rootReducer';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import { COMING_FROM_SCREEN } from 'src/utils/constants';
import { Event, getDeviceType } from 'src/utils/helpers';
import { Button, Button as NewButton } from 'src/ui/Button';
import * as S from './styles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/ui/DropdownMenu';
import { CustomerData } from 'src/store/modules/marketing/reducer';

const { Column } = Table;

type CustomerListProps = {
  unitId: string;
};

export const CustomerList: FunctionComponent<CustomerListProps> = (props) => {
  const { unitId } = props;
  const dispatch = useDispatch();
  const {
    hall: { unity },
    marketing: { customers, isLoading, csv },
  } = useSelector((state: RootType) => state);
  const downloadCsvRef = useRef<HTMLAnchorElement | null>(null);

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
        segmentation: 'all',
        per_page: perPage,
      })
    );
  };

  const handleDownloadCsv = () => {
    if (!unitId) return;
    Event.push('admin_crm_customer_csv_click', {
      unit_id: unitId,
      device_type: getDeviceType(),
      comingFromScreen: COMING_FROM_SCREEN.allCustomers,
    });
    dispatch(MarketingCreators.getCsvCustomersRequest({ segmentation: 'all' }));
  };

  useEffect(() => {
    if (!unity?.id) return;
    dispatch(MarketingCreators.getCustomersRequest());
    dispatch(MarketingCreators.getListsRequest());
    dispatch(MarketingCreators.resetImportCsvCustomers());
  }, [unity?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!csv?.all) return;
    downloadCsvRef.current?.click();
    dispatch(MarketingCreators.resetCsvCustomers());
  }, [csv?.all]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fragment>
      <S.Table
        bordered
        dataSource={customers?.all?.data}
        loading={isLoading}
        size="large"
        title={() => (
          <div className="w-full flex items-center gap-4 justify-end">
            <NewButton
              className="flex items-center gap-4"
              size="sm"
              disabled={customers?.all?.data.length < 1}
              onClick={handleDownloadCsv}
            >
              <Download size={16} />
              Exportar base (CSV)
            </NewButton>
            {csv.all && (
              <a
                ref={downloadCsvRef}
                href={window.URL.createObjectURL(csv.all)}
                target="_blank"
                rel="noreferrer"
                download={`lista-de-clientes-${dayjs().format(
                  'DD.MM.YYYY'
                )}.csv`}
                hidden
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
          current: customers?.all?.pagination?.current_page,
          pageSize: customers?.all?.pagination?.per_page,
          total: customers?.all?.pagination?.total,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50'],
          showTotal: (total) => `Total de ${total} clientes`,
        }}
      >
        <Column title="Nome do cliente" dataIndex="name" key="name" />
        <Column
          title="Última atividade"
          dataIndex="last_visit_at"
          key="last_visit_at"
          render={(value) => dayjs(value).format('DD/MM/YYYY')}
        />
        <Column
          title="Quantidade de atividades"
          dataIndex="amount_of_visits"
          key="amount_of_visits"
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
      </S.Table>
    </Fragment>
  );
};
