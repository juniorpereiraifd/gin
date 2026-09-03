import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Creators as AuthCreators } from 'src/store/modules/auth/actions';
import { Tabs } from 'src/stories/display/Tabs';
import { PageContainer } from 'src/components/PageContainer';
import { InformationAccountForm } from './InformationAccountForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { PreferencesForm } from './PreferencesForm';

export const ProfilePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AuthCreators.getManagerRequest());
  }, []);

  return (
    <PageContainer className="flex">
      <div className="mx-auto mt-10 mb-14 w-full max-w-3xl">
        <Tabs
          destroyInactiveTabPane
          defaultActiveKey="informations"
          className="[&_.ant-tabs-nav]:mb-8"
          items={[
            {
              key: 'informations',
              label: 'Informações gerais de conta',
              children: <InformationAccountForm />,
            },
            {
              key: 'general',
              label: 'Preferências',
              children: <PreferencesForm />,
            },
            {
              key: 'change-password',
              label: 'Alterar senha',
              children: <ChangePasswordForm />,
            },
          ]}
        />
      </div>
    </PageContainer>
  );
};
