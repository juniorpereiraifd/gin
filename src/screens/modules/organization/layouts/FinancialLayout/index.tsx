import { useLocation } from 'react-router-dom';
import { Breadcrumb } from 'src/screens/components/Breadcrumb';
import { OrganizationLayout } from 'src/screens/layouts/OrganizationLayout';
import { routes } from 'src/screens/routes';

export const FinancialLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <OrganizationLayout>
      <Breadcrumb routes={routes} location={location} />
      {children}
    </OrganizationLayout>
  );
};
