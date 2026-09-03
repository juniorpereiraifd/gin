import OnThePhone from 'src/assets/images/on-the-phone.svg';
import dayjs from 'dayjs';
import { PreviewEmail } from '../CreateEmailCampaignPage/EmailContent/PreviewEmail';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import Loading from 'src/stories/feedback/Loading';
import { getPercentage } from 'src/utils/helpers';
import { InfoCard } from '../../components/InfoCard';
import { PageContainer } from 'src/components/PageContainer';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Heading } from 'src/ui/Typograph';
import { BigNumberCard } from '../../components/BigNumberCard';
import { Check, Info } from 'lucide-react';
import { Tooltip } from 'antd';

export function ViewEmailCampaignPage() {
  const {
    marketing: { isLoading, emailCampaignSelected },
  } = useSelector((state: RootType) => state);

  const openRateEmailPercent =
    (typeof emailCampaignSelected?.views?.open !== 'number' || emailCampaignSelected?.views?.open === 0) &&
    (typeof emailCampaignSelected?.views?.received !== 'number' || emailCampaignSelected?.views?.received === 0)
      ? 0
      : Number(
          getPercentage(emailCampaignSelected?.views?.open, emailCampaignSelected?.views?.received, {
            returnType: 'number',
          })
        );

  const uniqueClicksEmailPercent =
    (typeof emailCampaignSelected?.views?.single_clicks !== 'number' ||
      emailCampaignSelected?.views?.single_clicks === 0) &&
    (typeof emailCampaignSelected?.views?.open !== 'number' || emailCampaignSelected?.views?.open === 0)
      ? 0
      : Number(
          getPercentage(emailCampaignSelected?.views?.single_clicks, emailCampaignSelected?.views?.open, {
            returnType: 'number',
          })
        );

  const receivedEmailPercent =
    (typeof emailCampaignSelected?.views?.received !== 'number' || emailCampaignSelected?.views?.received === 0) &&
    (typeof emailCampaignSelected?.views?.sent !== 'number' || emailCampaignSelected?.views?.sent === 0)
      ? 0
      : Number(
          getPercentage(emailCampaignSelected?.views?.received, emailCampaignSelected?.views?.sent, {
            returnType: 'number',
          })
        );

  return (
    <PageContainer className="grid-cols-5 gap-4 h-fit items-start">
      <div className="h-full min-h-[42rem] col-span-3 flex flex-col justify-between">
        <Heading level="4" className="text-lg">
          Detalhes da campanha
        </Heading>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <InfoCard
            loading={isLoading}
            title="Data de envio"
            content={dayjs(emailCampaignSelected?.shipping_at_date).format('DD/MM/YYYY')}
          />
          <InfoCard loading={isLoading} title="Horário de envio" content={emailCampaignSelected?.shipping_at_time} />
          <InfoCard loading={isLoading} title="Nome da campanha" content={emailCampaignSelected?.name} />
          <InfoCard
            loading={isLoading}
            title="Assunto do email"
            className="col-span-3"
            content={emailCampaignSelected?.template?.subject}
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
                Emails recebidos{' '}
                <Tooltip title="É o total de emails que foram entregues com sucesso ao destinatário. Importante lembrar que existem alguns motivos para um email não ser entregue como por exemplo endereço inexistente, caixa de entrada cheia e bloqueios por filtros anti-spam.">
                  <Info size={14} />
                </Tooltip>
              </span>
            }
            value={
              <div className="flex items-end justify-between gap-1 pb-3">
                <span>{`${receivedEmailPercent}%`}</span>
                <span className="text-sm text-slate-500 font-normal">
                  {`${emailCampaignSelected?.views?.received ?? 0}/${emailCampaignSelected?.views?.sent ?? 0}`}
                </span>
              </div>
            }
          />
          <BigNumberCard
            loading={isLoading}
            title={
              <span className="flex items-center gap-2">
                Taxa de abertura{' '}
                <Tooltip title="Indica o número de emails abertos em comparação a quantidade de emails recebidos.">
                  <Info size={14} />
                </Tooltip>
              </span>
            }
            value={
              <div className="flex items-end justify-between gap-1 pb-3">
                <span>{`${openRateEmailPercent}%`}</span>
                <span className="text-sm text-slate-500 font-normal">
                  {`${emailCampaignSelected?.views?.open ?? 0}/${emailCampaignSelected?.views?.received ?? 0}`}
                </span>
              </div>
            }
          />
          <BigNumberCard
            loading={isLoading}
            title={
              <span className="flex items-center gap-2">
                Cliques únicos{' '}
                <Tooltip title="Percentual de emails que tiveram pelo menos um de seus links clicados. É calculada dividindo o total de emails únicos com cliques pelo total de emails abertos.">
                  <Info size={14} />
                </Tooltip>
              </span>
            }
            value={
              <div className="flex items-end justify-between gap-1 pb-3">
                <span>{`${uniqueClicksEmailPercent}%`}</span>
                <span className="text-sm text-slate-500 font-normal">
                  {emailCampaignSelected?.views?.single_clicks ?? 0}/{emailCampaignSelected?.views?.open ?? 0}
                </span>
              </div>
            }
          />
        </div>
        <div className="flex items-center gap-6 mt-auto border border-stone-300 bg-stone-100 rounded-md p-4">
          <div className="w-[130px] h-[130px] [&_svg]:w-full [&_svg]:h-full flex-shrink-0">
            <OnThePhone />
          </div>
          <div className="text-xs text-slate-600">
            <p className="text-sm text-slate-700 font-semibold mb-2">Boas práticas para melhores resultados</p>
            <p className="flex gap-1 mb-2">
              <Check strokeWidth={2.5} size={14} className="flex-shrink-0 text-green-600" /> Garanta que suas fotos
              estejam em uma boa qualidade.
            </p>
            <p className="flex gap-1 mb-2">
              <Check strokeWidth={2.5} size={14} className="flex-shrink-0 text-green-600" /> Escreva uma mensagem clara,
              curta e atrativa em &quot;Assunto de email&quot;, ela pode aumentar sua taxa de abertura.
            </p>
            <p className="flex gap-1 mb-2">
              <Check strokeWidth={2.5} size={14} className="flex-shrink-0 text-green-600" /> Evite inserir sua mensagem
              principal dentro de imagens ou arquivos pdfs, eles podem ser interpretados como spam e diminuir sua
              conversão.
            </p>
          </div>
        </div>
      </div>
      <BoxContrasted className="h-[42rem] min-h-2/3 col-span-2">
        {isLoading ? <Loading /> : <PreviewEmail size="sm" emailContent={emailCampaignSelected?.template} />}
      </BoxContrasted>
    </PageContainer>
  );
}
