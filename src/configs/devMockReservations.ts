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

/**
 * Reservas de demonstração para popular o board (caminho feliz já com dados).
 * createdAt é gerado relativo a "agora" para o card exibir "criado hoje HH:mm".
 */
export function buildMockReservations(): ReservationData[] {
  const now = Date.now();
  const min = 60_000;

  return [
    {
      id: 'seed-rec-1',
      name: 'Mariana Alves',
      phone: '(11) 98765-1111',
      email: 'mariana@email.com',
      guests: 2,
      time: '20:00',
      hall: BOARD_HALLS[0],
      status: 'received',
      occasion: 'Jantar especial',
      note: 'Mesa perto da janela',
      createdAt: new Date(now - 15 * min).toISOString(),
    },
    {
      id: 'seed-rec-2',
      name: 'Roberto Nunes',
      phone: '(11) 97654-2222',
      guests: 4,
      time: '21:30',
      hall: BOARD_HALLS[0],
      status: 'received',
      createdAt: new Date(now - 40 * min).toISOString(),
    },
    {
      id: 'seed-rec-3',
      name: 'Fernanda Lima',
      email: 'fernanda@email.com',
      guests: 6,
      time: '19:00',
      hall: BOARD_HALLS[1],
      status: 'received',
      occasion: 'Aniversário',
      note: 'Bolo incluso',
      createdAt: new Date(now - 90 * min).toISOString(),
    },
    {
      id: 'seed-seated-1',
      name: 'Carlos Menezes',
      phone: '(11) 96543-3333',
      guests: 3,
      time: '18:30',
      hall: BOARD_HALLS[0],
      status: 'seated',
      createdAt: new Date(now - 180 * min).toISOString(),
    },
    {
      id: 'seed-canceled-1',
      name: 'Juliana Castro',
      phone: '(11) 95432-4444',
      guests: 5,
      time: '22:00',
      hall: BOARD_HALLS[2],
      status: 'canceled',
      createdAt: new Date(now - 300 * min).toISOString(),
    },
  ];
}
