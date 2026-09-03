import { useParams } from 'react-router-dom';
import { NewSMSCampaign } from './NewSMSCampaign';
import { PageContainer } from 'src/components/PageContainer';

export function CreateSMSCampaignPage() {
  const { unitId, campaignId } = useParams<'marketing.campaigns.sms.edit'>();

  return (
    <PageContainer sideColumn>
      <NewSMSCampaign unitId={unitId} campaignId={campaignId} />
    </PageContainer>
  );
}
