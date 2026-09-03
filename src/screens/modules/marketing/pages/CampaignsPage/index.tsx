import { FunctionComponent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsProps } from 'src/stories/display/Tabs';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { EmailCampaigns } from './EmailCampaigns';
import { SmsCampaigns } from './SmsCampaigns';

export const CampaignsPage: FunctionComponent = () => {
  const [tab, setTab] = useState<string>('email-campaigns');
  const { unitId } = useParams<'marketing.campaigns'>();

  const tabItems: TabsProps['items'] = [
    {
      key: 'email-campaigns',
      label: 'Email',
      children: <EmailCampaigns unitId={unitId} />,
    },
    {
      key: 'sms-campaigns',
      label: 'SMS',
      children: <SmsCampaigns unitId={unitId} />,
    },
  ];

  return (
    <PageContainer>
      <PageTitle>Campanhas</PageTitle>
      <Tabs
        destroyInactiveTabPane
        onTabClick={(newTab: string) => setTab(newTab)}
        defaultActiveKey={tab}
        items={tabItems}
      />
    </PageContainer>
  );
};
