import { Title } from 'src/stories/typography';
import { Whatsapp } from '@styled-icons/fa-brands/Whatsapp';
import { Chair } from '@styled-icons/fa-solid/Chair';
import { CalendarTimes } from '@styled-icons/fa-regular/CalendarTimes';
import { Edit } from '@styled-icons/fa-regular/Edit';
import { getWhatsappLink } from 'src/utils/helpers';
import dayjs from 'dayjs';
import type { ReservationData } from 'src/configs/devMockReservations';
import * as S from './styles';

interface ReservationCardProps {
  reservation: ReservationData;
  onSeat: (id: string) => void;
  onCancel: (id: string) => void;
  onEdit: (reservation: ReservationData) => void;
}

export function ReservationCard({
  reservation,
  onSeat,
  onCancel,
  onEdit,
}: ReservationCardProps) {
  const createdAtTime = dayjs(reservation.createdAt).format('DD/MM [às] HH:mm');

  return (
    <S.Wrapper>
      <S.MainRow>
        <S.TimeBlock>
          <S.Time>{reservation.time}</S.Time>
          <S.People>
            {reservation.guests} {reservation.guests === 1 ? 'pessoa' : 'pessoas'}
          </S.People>
        </S.TimeBlock>

        <S.Info>
          <S.NameRow>
            <Title level={4}>{reservation.name}</Title>
            <S.ConfirmedBadge>Confirmado</S.ConfirmedBadge>
          </S.NameRow>

          <S.Subline>via Painel • criado {createdAtTime}</S.Subline>

          <S.HallLine>{reservation.hall}</S.HallLine>
        </S.Info>
      </S.MainRow>

      <S.Footer>
        <S.MetaLine>
          {reservation.phone && (
            <span className="phone">{reservation.phone}</span>
          )}
          {reservation.occasion && (
            <span className="occasion">Ocasião: {reservation.occasion}</span>
          )}
          {!reservation.occasion && <span className="muted">Ocasião não informada</span>}
          {reservation.note && <span className="note">{reservation.note}</span>}
        </S.MetaLine>

        <S.Actions>
          <S.ActionButton title="Editar" onClick={() => onEdit(reservation)}>
            <Edit size={15} />
            Editar
          </S.ActionButton>

          {reservation.phone && (
            <S.ActionButton
              as="a"
              href={getWhatsappLink(reservation.phone)}
              target="_blank"
              rel="noreferrer"
              title="Enviar WhatsApp"
            >
              <Whatsapp size={15} />
              WhatsApp
            </S.ActionButton>
          )}

          <S.ActionButton title="Sentar cliente" onClick={() => onSeat(reservation.id)}>
            <Chair size={15} />
            Sentar
          </S.ActionButton>

          <S.ActionButton
            danger
            title="Cancelar cliente"
            onClick={() => onCancel(reservation.id)}
          >
            <CalendarTimes size={15} />
            Cancelar
          </S.ActionButton>
        </S.Actions>
      </S.Footer>
    </S.Wrapper>
  );
}
