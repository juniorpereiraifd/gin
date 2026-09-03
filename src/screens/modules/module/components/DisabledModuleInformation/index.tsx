import { FunctionComponent, ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { Unlock } from '@styled-icons/octicons/Unlock';
import { Module } from 'src/store/modules/unity/reducer';
import { Button } from 'src/stories/general/Button';
import { GETIN_WHATSAPP_CONTACT } from 'src/utils/constants';
import { reservationBentoGridContent } from './ReservationBentoGridContent';
import { lineBentoGridContent } from './LineBentoGridContent';
import { menuBentoGridContent } from './MenuBentoGridContent';
import { marketingBentoGridContent } from './MarketingBentoGridContent';
import { npsBentoGridContent } from './NpsBentoGridContent';
import { voucherBentoGridContent } from './VoucherBentoGridContent';
import * as S from './styles';

type DisabledModuleInformationProps = {
  module: keyof Module;
};

export const DisabledModuleInformation: FunctionComponent<
  DisabledModuleInformationProps
> = (props) => {
  const { module } = props;

  return (
    <S.Container>
      <S.Information>
        <div className="lock">
          <Lock size={25} />
        </div>
        <h1 className="title">
          Módulo de {modulesCopy[module].title} bloqueado
        </h1>
        <p className="description">
          Para habilitar o módulo, entre em contato com a nossa equipe comercial
          e aproveite diversas funcionalidades:
        </p>
        <div className="bento-grid">
          {modulesCopy[module].features.map((feature) => (
            <div className="feature-box" key={feature.title}>
              <div className="info">
                <span className="title">{feature.title}</span>
                <p className="description">{feature.description}</p>
              </div>
              {feature.content}
            </div>
          ))}
        </div>
        <Button
          color="primary"
          icon={<Unlock size={16} />}
          onClick={() => window.open(GETIN_WHATSAPP_CONTACT, '_blank')}
        >
          Desbloquear módulo
        </Button>
      </S.Information>
    </S.Container>
  );
};

export type ModuleCopy = {
  title: string;
  features: {
    title: string;
    description: string;
    content: ReactNode;
  }[];
};

const modulesCopy: Record<keyof Module, ModuleCopy> = {
  reservation: reservationBentoGridContent,
  line: lineBentoGridContent,
  menu: menuBentoGridContent,
  marketing: marketingBentoGridContent,
  nps: npsBentoGridContent,
  voucher: voucherBentoGridContent,
};
