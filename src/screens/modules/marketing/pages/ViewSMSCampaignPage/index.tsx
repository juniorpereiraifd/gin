import { Text } from '@getlove/react';
import { useSelector } from 'react-redux';
import type { RootType } from 'src/store/modules/rootReducer';
import Loading from 'src/stories/feedback/Loading';
import { getFormattedDate, getPercentage } from 'src/utils/helpers';
import * as S from './styles';
import { PageContainer } from 'src/components/PageContainer';
import { Heading } from 'src/ui/Typograph';
import { InfoCard } from '../../components/InfoCard';
import { BigNumberCard } from '../../components/BigNumberCard';
import { Tooltip } from 'antd';
import { Info } from 'lucide-react';
import { AlertBoxCampaigns } from '../../components/AlertBoxCampaigns';

interface CardProps {
  title: string;
  description: string;
  gap: 'sm' | 'lg';
  isLoading: boolean;
}

export const Card = ({ title, description, gap, isLoading }: CardProps) => (
  <S.Card gap={gap}>
    <Text className="title" style="base-mini-bold">
      {title}
    </Text>
    <Text className="description" style="base-mini-default">
      {isLoading ? <Loading /> : description}
    </Text>
  </S.Card>
);

export function ViewSMSCampaignPage() {
  const {
    marketing: { isLoading, smsCampaignSelected },
  } = useSelector((state: RootType) => state);

  const receivedSMSPercent =
    (typeof smsCampaignSelected?.delivered_total !== 'number' || smsCampaignSelected?.delivered_total === 0) &&
    (typeof smsCampaignSelected?.customers_total !== 'number' || smsCampaignSelected?.customers_total === 0)
      ? '0%'
      : String(
          getPercentage(smsCampaignSelected?.delivered_total, smsCampaignSelected?.customers_total, {
            returnType: 'string',
          })
        );

  const cantBeDeliveredPercent =
    (typeof smsCampaignSelected?.failed_total !== 'number' || smsCampaignSelected?.failed_total === 0) &&
    (typeof smsCampaignSelected?.customers_total !== 'number' || smsCampaignSelected?.customers_total === 0)
      ? '0%'
      : String(
          getPercentage(smsCampaignSelected?.failed_total, smsCampaignSelected?.customers_total, {
            returnType: 'string',
          })
        );

  const hour = smsCampaignSelected?.shipping_at_time.split(':').splice(0, 2).join(':') || '';

  return (
    <PageContainer sideColumn>
      <div className="col-start-1">
        <Heading level="4" className="text-lg">
          Detalhes da campanha
        </Heading>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <InfoCard loading={isLoading} title="Nome da campanha" content={smsCampaignSelected?.name ?? ''} />
          <InfoCard
            loading={isLoading}
            title="Data de envio"
            content={getFormattedDate(smsCampaignSelected?.shipping_at_date as string)}
          />
          <InfoCard loading={isLoading} title="Horário de envio" content={hour} />
          <InfoCard
            loading={isLoading}
            title="Mensagem"
            className="col-span-3"
            content={smsCampaignSelected?.template.body ?? ''}
          />
        </div>
        <Heading level="4" className="text-lg my-6">
          Resultados da campanha
        </Heading>
        <div className="grid grid-cols-3 gap-4">
          <BigNumberCard
            loading={isLoading}
            title={
              <span className="flex items-center gap-2">
                Consumidores Elegíveis
                <Tooltip title="É o total de consumidores que foram considerados válidos de acordo com as condições da segmentação escolhida para a campanha no momento da criação.">
                  <Info size={14} />
                </Tooltip>
              </span>
            }
            value={
              <div className="flex items-end justify-between gap-1 pb-3">
                <span>{smsCampaignSelected?.customers_total}</span>
              </div>
            }
          />
          <BigNumberCard
            loading={isLoading}
            title={
              <span className="flex items-center gap-2">
                SMS entregues{' '}
                <Tooltip title="É o total de SMS que foram entregues com sucesso ao destinatário.">
                  <Info size={14} />
                </Tooltip>
              </span>
            }
            value={
              <div className="flex items-end justify-between gap-1 pb-3">
                <span>{receivedSMSPercent}</span>
                <span className="text-sm text-slate-500 font-normal">
                  {`${smsCampaignSelected?.delivered_total ?? 0}/${smsCampaignSelected?.customers_total ?? 0}`}
                </span>
              </div>
            }
          />
          <BigNumberCard
            loading={isLoading}
            title={
              <span className="flex items-center gap-2">
                SMS não entregues{' '}
                <Tooltip title="Existem alguns motivos para um sms não ser entregue como por exemplo número inexistente, bloqueios por filtros anti-spam, ou falhas de sinal da operadora.">
                  <Info size={14} />
                </Tooltip>
              </span>
            }
            value={
              <div className="flex items-end justify-between gap-1 pb-3">
                <span>{cantBeDeliveredPercent}</span>
                <span className="text-sm text-slate-500 font-normal">
                  {smsCampaignSelected?.failed_total ?? 0}/{smsCampaignSelected?.customers_total ?? 0}
                </span>
              </div>
            }
          />
          <AlertBoxCampaigns />
        </div>
      </div>
    </PageContainer>
  );
}
