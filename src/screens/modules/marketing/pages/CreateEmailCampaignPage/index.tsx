import dayjs, { Dayjs } from 'dayjs';
import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EmailTemplate, Segmentation } from 'src/store/modules/marketing/reducer';
import { RootType } from 'src/store/modules/rootReducer';
import { EmailContent } from './EmailContent';
import { NewEmailCampaign } from './NewEmailCampaign';

export type MainContent = 'newCampaign' | 'emailContent';
export type CustomButtonContent = 'Fazer uma reserva' | 'Ver cardápio' | 'Ver restaurante' | 'Link personalizado' | '';

export type EmailCampaign = {
  name: string;
  shipping_at_date: Dayjs | null;
  shipping_at_time: Dayjs | null;
  segmentation: Segmentation;
};

export function CreateEmailCampaignPage() {
  const { unitId, campaignId } = useParams<'marketing.campaigns.email.edit'>();

  const today = Date.now();

  const {
    marketing: { emailCampaigns },
  } = useSelector((state: RootType) => state);

  const campaign = emailCampaigns.data.find((email) => email.id === campaignId);

  const shipping_at_date = campaign
    ? dayjs(campaign?.shipping_at_date).isBefore(today)
      ? null
      : dayjs(campaign?.shipping_at_date)
    : null;

  const shipping_at_time = campaign
    ? dayjs(campaign?.shipping_at_date).isBefore(today)
      ? null
      : dayjs(campaign?.shipping_at_time, 'HH:mm')
    : null;

  const [tab, setTab] = useState<MainContent>('newCampaign');
  const [newCampaign, setNewCampaign] = useState<EmailCampaign>({
    name: campaign?.name || '',
    shipping_at_date: shipping_at_date,
    shipping_at_time: shipping_at_time,
    segmentation: {
      name: campaign?.segmentation || '',
      id: null,
    },
  });

  const [emailContent, setEmailContent] = useState<EmailTemplate>({
    title: campaign?.template.title || '',
    model: campaign?.template.model || '',
    subject: campaign?.template.subject || '',
    body: campaign?.template.body || '',
    link: campaign?.template.link || '',
    personalized_button: campaign?.template.personalized_button || false,
    slug_button_name: campaign?.template.slug_button_name,
    button_name: campaign?.template.button_name,
    image: campaign?.template.image || null,
  });

  const handleChangeTab = () => setTab((value) => (value === 'newCampaign' ? 'emailContent' : 'newCampaign'));

  return (
    <Fragment>
      {tab === 'newCampaign' ? (
        <NewEmailCampaign
          unitId={unitId}
          campaignId={campaignId}
          emailContent={emailContent}
          handleChangeTab={handleChangeTab}
          newCampaign={{
            value: newCampaign,
            setValue: setNewCampaign,
          }}
        />
      ) : (
        <EmailContent
          unitId={unitId}
          handleChangeTab={handleChangeTab}
          emailContent={{
            value: emailContent,
            setValue: setEmailContent,
          }}
        />
      )}
    </Fragment>
  );
}
