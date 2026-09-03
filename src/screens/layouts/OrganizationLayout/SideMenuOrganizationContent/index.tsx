import { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Creators as LayoutCreators } from 'src/store/modules/layout/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { SideMenu as BaseSideMenu, ItemsProps } from 'src/stories/navigation/SideMenu';
import { SideMenu } from 'src/screens/components/SideMenu';
import { DollarSign, House, MonitorCog } from 'lucide-react';

export const SideMenuOrganizationContent: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {
    layout: { isSideMenuOpen },
    auth: { user },
  } = useSelector((state: RootType) => state);

  const handleOpenSideMenu = () => {
    dispatch(LayoutCreators.setSideMenuOpen(!isSideMenuOpen));
  };

  const items: ItemsProps[] = [
    {
      key: 'units',
      label: 'Unidades',
      icon: <House size={14} />,
    },
    ...(user?.master === true
      ? [
          {
            key: 'backoffice-get-in',
            label: 'Back Office',
            icon: <MonitorCog size={14} />,
            children: [
              {
                key: 'crm',
                label: 'CRM',
                children: [
                  {
                    key: 'backoffice-get-in/crm/promotions',
                    label: 'Promoções',
                  },
                  {
                    key: 'backoffice-get-in/crm/customers',
                    label: 'Clientes',
                  },
                ],
              },
            ],
          },
          {
            key: 'financial',
            label: 'Financeiro',
            icon: <DollarSign size={14} />,
            children: [
              {
                key: 'sellers',
                label: 'Vendedores',
                children: [
                  {
                    key: 'financial/sellers/zoop',
                    label: 'Zoop',
                  },
                ],
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <SideMenu isSideMenuOpen={isSideMenuOpen} handleOpenSideMenu={handleOpenSideMenu}>
      <div className="w-full h-full relative flex flex-col pt-4">
        <BaseSideMenu baseUrl="/" loading={false} hiddenOptions={[]} items={items} />
      </div>
    </SideMenu>
  );
};
