import { Tabs } from 'src/stories/display/Tabs';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { PageContainer } from 'src/components/PageContainer';
import ManagersTab from './ManagersTab';
import OperatorsTab from './OperatorsTab';

export const UsersPage = () => {
  return (
    <PageContainer sideColumn>
      <PageTitle>Usuários</PageTitle>
      <div className="row-start-2 col-start-1">
        <Tabs
          defaultActiveKey="managers"
          items={[
            {
              key: 'managers',
              label: 'Gerentes',
              children: <ManagersTab />,
            },
            {
              key: 'operator',
              label: 'Operadores',
              children: <OperatorsTab />,
            },
          ]}
        />
      </div>
    </PageContainer>
  );
};
