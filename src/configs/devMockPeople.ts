/**
 * Pessoas (participantes/reservas) fictícias por restaurante, usadas apenas em
 * MODO DE DESENVOLVIMENTO (import.meta.env.DEV) para demonstrar como a lista de
 * clientes que reservaram aparece no modal de detalhes do restaurante.
 *
 * NUNCA são carregadas em produção (build).
 */

export type PersonReservation = {
  id: string;
  name: string;
  /** Quantidade de pessoas / lugares reservados na mesa. */
  guests: number;
  /** Data da reserva/participação (formato ISO). */
  date: string;
  /** Promoção da qual a pessoa participou. */
  promotion: string;
  /** Status de comparecimento/participação. */
  status: 'confirmed' | 'pending' | 'canceled';
};

export const MOCK_PEOPLE_BY_UNIT: Record<string, PersonReservation[]> = {
  // Cantina do Joca
  '1001': [
    { id: 'c1', name: 'Mariana Alves', guests: 4, date: '2026-09-03', promotion: 'Setembro em Dobro', status: 'confirmed' },
    { id: 'c2', name: 'Roberto Nunes', guests: 2, date: '2026-09-03', promotion: 'Setembro em Dobro', status: 'confirmed' },
    { id: 'c3', name: 'Fernanda Lima', guests: 6, date: '2026-09-04', promotion: 'Setembro em Dobro', status: 'pending' },
    { id: 'c4', name: 'Carlos Menezes', guests: 3, date: '2026-09-05', promotion: 'Happy Hour Estendido', status: 'confirmed' },
    { id: 'c5', name: 'Juliana Castro', guests: 5, date: '2026-09-06', promotion: 'Setembro em Dobro', status: 'canceled' },
    { id: 'c6', name: 'Paulo Henrique Dias', guests: 2, date: '2026-09-07', promotion: 'Setembro em Dobro', status: 'confirmed' },
    { id: 'c7', name: 'Beatriz Rocha', guests: 4, date: '2026-09-08', promotion: 'Happy Hour Estendido', status: 'pending' },
    { id: 'c8', name: 'André Cardoso', guests: 7, date: '2026-09-09', promotion: 'Setembro em Dobro', status: 'confirmed' },
  ],
  // La Pergola Trattoria
  '1002': [
    { id: 'l1', name: 'Tatiane Souza', guests: 2, date: '2026-09-02', promotion: 'Setembro em Dobro', status: 'confirmed' },
    { id: 'l2', name: 'Eduardo Prado', guests: 4, date: '2026-09-04', promotion: 'Noite de Reservas VIP', status: 'confirmed' },
    { id: 'l3', name: 'Renata Farias', guests: 3, date: '2026-09-05', promotion: 'Noite de Reservas VIP', status: 'pending' },
    { id: 'l4', name: 'Gustavo Teles', guests: 6, date: '2026-09-07', promotion: 'Setembro em Dobro', status: 'confirmed' },
  ],
  // Sabor da Serra
  '1003': [
    { id: 's1', name: 'Camila Freitas', guests: 2, date: '2026-08-20', promotion: 'Brunch de Domingo', status: 'confirmed' },
    { id: 's2', name: 'Diego Ramos', guests: 5, date: '2026-08-22', promotion: 'Brunch de Domingo', status: 'canceled' },
  ],
  // Beco do Sabor
  '1004': [
    { id: 'b1', name: 'Larissa Melo', guests: 4, date: '2026-09-01', promotion: 'Happy Hour Estendido', status: 'confirmed' },
    { id: 'b2', name: 'Otávio Brandão', guests: 3, date: '2026-09-02', promotion: 'Happy Hour Estendido', status: 'confirmed' },
    { id: 'b3', name: 'Patrícia Veiga', guests: 8, date: '2026-09-03', promotion: 'Setembro em Dobro', status: 'pending' },
  ],
};

/** Fallback para qualquer unidade sem dados específicos. */
export const MOCK_PEOPLE_FALLBACK: PersonReservation[] = [
  { id: 'g1', name: 'Cliente Demonstração', guests: 2, date: '2026-09-05', promotion: 'Promoção Exemplo', status: 'confirmed' },
];
