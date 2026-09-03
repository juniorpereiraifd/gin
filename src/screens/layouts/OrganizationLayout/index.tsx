import { FunctionComponent, ReactNode } from 'react';
import { SideMenuOrganizationContent } from './SideMenuOrganizationContent';
import { Layout } from 'antd';

type OrganizationLayoutProps = {
  children: ReactNode;
};

export const OrganizationLayout: FunctionComponent<OrganizationLayoutProps> = (props) => {
  const { children } = props;

  return (
    <div className="h-[calc(100vh-3.75rem)] w-full flex">
      <SideMenuOrganizationContent />
      <div className="w-full overflow-y-auto">
        <Layout className="max-w-[1280px] h-full flex flex-col gap-[1.875rem] p-6 mx-auto bg-background-50">
          {children}
        </Layout>
      </div>
    </div>
  );
};
