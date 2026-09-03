import { CalendarDate } from '@styled-icons/bootstrap/CalendarDate';
import { CurrencyDollar } from '@styled-icons/bootstrap/CurrencyDollar';
import { BookmarkStar } from '@styled-icons/bootstrap/BookmarkStar';
import type { ModuleCopy } from '../index';
import * as S from './styles';

export const reservationBentoGridContent: ModuleCopy = {
  title: 'Reserva',
  features: [
    {
      title: 'Reservas',
      description:
        'Aceite reservas no seu estabelecimento para aumentar seu fluxo e atrair clientes novos através do aplicativo Get In.',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/chef-reservation.webp`}
          />
        </div>
      ),
    },
    {
      title: 'Taxa No-show',
      description:
        'Seja recompensado com um valor caso o cliente deixe de comparecer à reserva.',
      content: (
        <S.NoShowMiddleContent>
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/no-show.svg`}
          />
        </S.NoShowMiddleContent>
      ),
    },
    {
      title: 'Reserva Paga e Experiências',
      description:
        'Cobre pelas reservas em dias mais concorridos e garanta uma receita adicional. Você também pode vender experiências em seu estabelecimento pelo Get In.',
      content: (
        <S.ExperienceMiddleContent>
          <div className="reservation">
            <CalendarDate size={25} />
          </div>
          <div className="line left" />
          <div className="money">
            <CurrencyDollar size={30} />
          </div>
          <div className="line right" />
          <div className="experience">
            <BookmarkStar size={25} />
          </div>
        </S.ExperienceMiddleContent>
      ),
    },
    {
      title: 'Reserve with Google',
      description:
        'Amplie sua receita e gere engajamento com a sua marca. Criar experiências memoráveis pode gerar lealdade e aumentar a probabilidade de recomendações.',
      content: (
        <S.ContentVideoReserveWithGoogle>
          <video
            loop
            autoPlay
            controls={false}
            style={{
              height: '110%',
            }}
          >
            <source
              type="video/mp4"
              src={`${
                import.meta.env.VITE_CDN_BASE_URL
              }/frontend/shared/modules/reserve-with-google.mp4`}
            />
          </video>
        </S.ContentVideoReserveWithGoogle>
      ),
    },
  ],
};
