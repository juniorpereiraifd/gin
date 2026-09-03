import { FoodMenu } from '@styled-icons/boxicons-regular/FoodMenu';
import { Plus } from '@styled-icons/fa-solid/Plus';
import { Equals } from '@styled-icons/fa-solid/Equals';
import { LightningChargeFill } from '@styled-icons/bootstrap/LightningChargeFill';
import { Clock } from '@styled-icons/fa-regular/Clock';
import { Users } from 'lucide-react';
import { ModuleCopy } from '../index';
import * as S from './styles';

export const lineBentoGridContent: ModuleCopy = {
  title: 'Fila',
  features: [
    {
      title: 'Fila de espera',
      description:
        'Organize a fila de espera, controle posições e otimize tempo e recursos, oferecendo transparência e um atendimento melhor ao cliente.',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/line-manager.webp`}
          />
        </div>
      ),
    },
    {
      title: 'Fila Remota',
      description:
        'Permita que seus clientes entrem na fila de onde estiverem. Ofereça conveniência e atraia mais pessoas que antes evitariam o local por causa das grandes filas.',
      content: (
        <S.RemoteLineContainer>
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/remote-queue.webp`}
          />
        </S.RemoteLineContainer>
      ),
    },
    {
      title: 'Cardápio na Fila',
      description:
        'Mostre o cardápio digital na fila e aumente as chances de pedidos mais rápidos.',
      content: (
        <S.MenuLineContainer>
          <div className="queue">
            <Users size={25} />
          </div>
          <Plus size={15} />
          <div className="menu">
            <FoodMenu size={25} />
          </div>
          <Equals size={15} />
          <S.ClockFastContainer>
            <div className="clock-fast">
              <LightningChargeFill size={25} />
              <Clock size={25} />
            </div>
          </S.ClockFastContainer>
        </S.MenuLineContainer>
      ),
    },
    {
      title: 'Fila via QR Code',
      description:
        'Ofereça um QR Code para que os clientes entrem na fila sem ajuda, reduzindo custos e aumentando a satisfação com uma solução rápida e prática.',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/qr-code.webp`}
          />
        </div>
      ),
    },
  ],
};
