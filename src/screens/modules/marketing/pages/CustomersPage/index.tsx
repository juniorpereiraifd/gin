import { FunctionComponent, PropsWithChildren, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Upload } from 'lucide-react';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { CustomersImportModal } from 'src/screens/modules/marketing/components/CustomersImportModal';
import { Tabs, TabsProps } from 'src/stories/display/Tabs';
import { Button } from 'src/ui/Button';
import { CustomerList } from './CustomerList';
import { CustomerSegmentation } from './CustomerSegmentation';

export const CustomersPage: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { unitId } = useParams<'marketing.customers'>();
  const [customersImportOpen, setCustomersImportOpen] =
    useState<boolean>(false);
  const handleOpenCustomersImport = () => {
    setCustomersImportOpen(true);
  };

  const handleCloseCustomersImport = () => {
    setCustomersImportOpen(false);
    dispatch(MarketingCreators.resetImportCsvCustomers());
    dispatch(MarketingCreators.getListsRequest());
    dispatch(MarketingCreators.getCustomersRequest());
  };

  const items: TabsProps['items'] = [
    {
      key: 'customer-list',
      label: 'Lista de clientes',
      children: (
        <TabContainer>
          <CustomerList unitId={unitId} />
        </TabContainer>
      ),
    },
    {
      key: 'segmentation',
      label: 'Segmentação da base',
      children: (
        <TabContainer>
          <CustomerSegmentation unitId={unitId} />
        </TabContainer>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageTitle>Clientes</PageTitle>
      {customersImportOpen && (
        <CustomersImportModal
          open={customersImportOpen}
          onCancel={handleCloseCustomersImport}
        />
      )}
      <Tabs
        destroyInactiveTabPane
        defaultActiveKey="general"
        items={items}
        className="[&_.ant-tabs-nav]:mb-8"
        tabBarExtraContent={
          <Button
            className="flex items-center gap-4 mb-2"
            variant="outline"
            size="sm"
            onClick={handleOpenCustomersImport}
          >
            <Upload size={16} />
            Importar clientes
          </Button>
        }
      />
    </PageContainer>
  );
};

const TabContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return <div className="flex flex-col gap-8">{children}</div>;
};
