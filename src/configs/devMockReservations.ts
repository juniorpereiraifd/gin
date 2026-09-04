/**
 * Tipos e dados de protótipo para o "board de reservas" de uma unidade.
 *
 * Apenas modo demonstração (mock) — o board mantém estado local na tela e não
 * depende de backend. Não é servido por interceptor axios.
 */

export type ReservationStatus = 'received' | 'seated' | 'canceled';

export type ReservationData = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  /** Quantidade de pessoas. */
  guests: number;
  /** Horário da reserva (formato HH:mm). */
  time: string;
  /** Nome do salão. */
  hall: string;
  status: ReservationStatus;
  occasion?: string;
  note?: string;
  /** Timestamp de criação, usado no "via Painel • criado HH:mm". */
  createdAt: string;
};

/** Salões disponíveis no board de demonstração. */
export const BOARD_HALLS = ['Salão Principal', 'Salão Terraço', 'Salão Privê'];

/** Ocasiões sugeridas (opcional no formulário). */
export const BOARD_OCCASIONS = [
  'Aniversário',
  'Encontro',
  'Negócios',
  'Jantar especial',
  'Outro',
];

/** Gera id simples para uma nova reserva local. */
export function createReservationId(): string {
  return `res-${Date.now().toString(36)}`;
}
