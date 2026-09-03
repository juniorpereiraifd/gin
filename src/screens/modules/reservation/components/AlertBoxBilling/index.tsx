import { Warning } from '@styled-icons/entypo/Warning';
import { ExternalLink } from '@styled-icons/heroicons-outline/ExternalLink';
import { GETIN_WHATSAPP_CONTACT } from 'src/utils/constants';
import * as S from './styles';

export const AlertBoxBilling = () => {
  return (
    <S.AlertBox>
      <span>
        <Warning size={18} className="warning" />
      </span>
      <p>
        Atenção! Para disponibilizar suas experiências aos clientes, é
        necessário ativar a funcionalidade de cobrança.{' '}
        <a href={GETIN_WHATSAPP_CONTACT} target="_blank" rel="noreferrer">
          Entre em contato <ExternalLink size={14} />{' '}
        </a>
        conosco para habilitá-la e ofereça momentos memoráveis em seu
        restaurante.
      </p>
    </S.AlertBox>
  );
};
