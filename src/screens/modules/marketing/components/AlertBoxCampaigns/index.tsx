import { Warning } from '@styled-icons/entypo/Warning';
import * as S from './styles';

export const AlertBoxCampaigns = () => {
  return (
    <S.AlertBox className='col-span-3'>
      <span>
        <Warning size={18} className="warning" />
      </span>
      <p>
        Atenção! A diferença de valores entre o total de consumidores elegíveis e a soma de entregues e não entregues são os registros em que ainda não foram obtidos o retorno sobre o sucesso ou insucesso na entrega.
      </p>
    </S.AlertBox>
  );
};
