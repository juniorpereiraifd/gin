import { ModuleCopy } from '../index';
import * as S from './styles';

export const marketingBentoGridContent: ModuleCopy = {
  title: 'Marketing',
  features: [
    {
      title: 'Segmentações da sua base de clientes',
      description:
        'Conheça o seu público, segmentando seus clientes em diferentes listas com base em suas preferências, dados e comportamentos.',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/clients.svg`}
          />
        </div>
      ),
    },
    {
      title: 'Relatório das Campanhas',
      description:
        'Saiba a performance de todas as campanhas disparadas pelo CRM do Get In.',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/marketing-report.svg`}
          />
        </div>
      ),
    },
    {
      title: 'Campanhas de E-mail e SMS',
      description:
        'Crie e envie conteúdos altamente personalizados, sendo um canal perfeito para nutrir os seus contatos já existentes e atrair novos.',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/communication.svg`}
          />
        </div>
      ),
    },
    {
      title: 'Importe suas bases',
      description:
        'Importe suas bases para o Get In e trabalhe seu marketing dentro da nossa plataforma!',
      content: (
        <S.ContentVideo>
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/marketing-funnel.svg`}
          />
        </S.ContentVideo>
      ),
    },
  ],
};
