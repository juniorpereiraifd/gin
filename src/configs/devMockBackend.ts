import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { UnityItemProps } from 'src/store/modules/unity/reducer';
import type {
  CustomerData,
  PromotionData,
} from 'src/store/modules/promotions/reducer';
import type { Pagination } from 'src/types';
import { isMockEnabled } from 'src/configs/mockMode';

/**
 * Fake backend para MODO DE DEMONSTRAÇÃO (dev sem backend OU deploy sem
 * VITE_BASE_URL configurado).
 *
 * Intercepta requisições axios e devolve respostas mockadas SEM rede. Quando há
 * backend real configurado em produção, este módulo não é registrado.
 *
 * Objetivo: permitir ver as telas do admin com dados de exemplo (cards de
 * unidade, promoções, clientes, etc.) sem depender do backend real.
 */

const baseCover = '/assets/back-office-get-in-cover.png';
const baseLogo = '/assets/getin-logo.png';

type UnitSeed = {
  id: string;
  name: string;
  location: string;
  status?: UnityItemProps['status'];
  cover?: string;
  logo?: string;
};

const UNIT_SEEDS: UnitSeed[] = [
  {
    id: '1001',
    name: 'Cantina do Joca',
    location: 'Rua Augusta, 1200 – Consolação, São Paulo/SP',
    status: 'listed',
  },
  {
    id: '1002',
    name: 'La Pergola Trattoria',
    location: 'Av. Paulista, 1500 – Bela Vista, São Paulo/SP',
    status: 'listed',
  },
  {
    id: '1003',
    name: 'Sabor da Serra',
    location: 'Rua das Flores, 88 – Centro, Campos do Jordão/SP',
    status: 'not-listed',
  },
  {
    id: '1004',
    name: 'Beco do Sabor',
    location: 'Rua do Bom Jesus, 220 – Recife Antigo, Recife/PE',
    status: 'listed',
  },
  {
    id: '1005',
    name: 'Sushi Nami',
    location: 'Av. Afonso Pena, 3200 – Savassi, Belo Horizonte/MG',
    status: 'suspended',
  },
  {
    id: '1006',
    name: 'Empório Dona Chica',
    location: 'Rua XV de Novembro, 450 – Centro, Curitiba/PR',
    status: 'listed',
  },
];

function makeUnit(seed: UnitSeed): UnityItemProps {
  const { id, name, location, status = 'listed', cover = baseCover, logo = baseLogo } = seed;

  return {
    id,
    taxpayer_identification: String(10000000000100 + Number(id)),
    average_ticket: 80,
    published_at: new Date().toISOString(),
    name,
    zipcode: '00000-000',
    address: location,
    number: '0',
    complement: '',
    neighborhood: '',
    cover_image: cover,
    profile_image: logo,
    payment_description: '',
    opening_hours_description: '',
    telephone: '(11) 4000-0000',
    city_id: '1',
    state_id: '1',
    logo,
    hall: 3,
    halls: [],
    photos: [],
    location,
    about: '',
    website: '',
    operators: 4,
    status,
    metadata: { apoie_um_restaurante: false, voucher_limit_control: false, voucher_limit: 0 },
    amenities: [],
    cuisines: [],
    occasions: [],
    city_slug: '',
    company_name: 'Get In Restaurantes LTDA',
    company_start_date: new Date().toISOString(),
    slug: '',
    price_range: '$$',
    price_range_description: 'R$ 40 - R$ 100',
    financial_email: 'financeiro@getinapp.com.br',
    full_address: location,
    coordinates: { lat: -23.55, lng: -46.63 },
    timezone: 'America/Sao_Paulo',
    active: status !== 'suspended',
    created_at: new Date(),
    updated_at: new Date(),
  };
}

const units = UNIT_SEEDS.map(makeUnit);

const unitPagination: Pagination = {
  total: UNIT_SEEDS.length,
  current_page: 1,
  next_page: null,
  last_page: 1,
  per_page: 12,
  is_last_page: true,
};

// ---------------------------------------------------------------------------
// Promoções (CRM backoffice)
// ---------------------------------------------------------------------------

function makePromotion(
  seed: Partial<PromotionData> &
    Pick<PromotionData, 'id' | 'title' | 'product' | 'status'>,
  overrides?: Partial<PromotionData>
): PromotionData {
  return {
    start_at: '2026-09-01',
    end_at: '2026-09-30',
    message: 'Aproveite esta promoção especial no seu estabelecimento parceiro.',
    discount: 20,
    item: 'Prato principal',
    banner: baseCover,
    restriction: 'one',
    units: [
      {
        unit_id: '1001',
        name: 'Cantina do Joca',
        rescue_limit: 5,
        participants: 40,
        status: 'active',
        created_at: '2026-08-01',
        updated_at: '2026-09-01',
      },
    ],
    created_at: '2026-08-01',
    updated_at: '2026-09-01',
    ...seed,
    ...overrides,
  };
}

const PROMOTION_SEEDS: PromotionData[] = [
  makePromotion(
    {
      id: 'p-001',
      title: 'Setembro em Dobro',
      product: 'menu',
      status: 'active',
    },
    { discount: 25 }
  ),
  makePromotion(
    {
      id: 'p-002',
      title: 'Happy Hour Estendido',
      product: 'line',
      status: 'active',
    },
    { start_at: '2026-09-01', end_at: '2026-09-15', restriction: 'unlimited' }
  ),
  makePromotion(
    {
      id: 'p-003',
      title: 'Brunch de Domingo',
      product: 'menu',
      status: 'inactive',
    },
    { redirect_url: 'https://exemplo.com/brunch' }
  ),
  makePromotion(
    {
      id: 'p-004',
      title: 'Noite de Reservas VIP',
      product: 'reservation',
      status: 'active',
    },
    { discount: 10 }
  ),
];

const promotionsPagination: Pagination = {
  total: PROMOTION_SEEDS.length,
  current_page: 1,
  next_page: null,
  last_page: 1,
  per_page: PROMOTION_SEEDS.length,
  is_last_page: true,
};

// ---------------------------------------------------------------------------
// Clientes (restaurantes participantes)
// ---------------------------------------------------------------------------

const CUSTOMER_SEEDS: CustomerData[] = [
  {
    unit_id: '1001',
    name: 'Cantina do Joca',
    rescue_limit: 5,
    participants: 40,
    status: 'active',
    created_at: '2026-08-01',
    updated_at: '2026-09-01',
  },
  {
    unit_id: '1002',
    name: 'La Pergola Trattoria',
    rescue_limit: 3,
    participants: 25,
    status: 'active',
    created_at: '2026-08-02',
    updated_at: '2026-09-01',
  },
  {
    unit_id: '1003',
    name: 'Sabor da Serra',
    rescue_limit: 10,
    participants: 120,
    status: 'inactive',
    created_at: '2026-07-15',
    updated_at: '2026-08-20',
  },
  {
    unit_id: '1004',
    name: 'Beco do Sabor',
    rescue_limit: 8,
    participants: 60,
    status: 'active',
    created_at: '2026-08-10',
    updated_at: '2026-09-02',
  },
];

const customersPagination: Pagination = {
  total: CUSTOMER_SEEDS.length,
  current_page: 1,
  next_page: null,
  last_page: 1,
  per_page: 12,
  is_last_page: true,
};

function resolve(method: string = 'get', url: string = ''): { data?: unknown; status: number } {
  // Normaliza removendo barra inicial (alguns sagas chamam sem "/" no começo,
  // ex.: "restaurant/v1/units/1001").
  let u = url.split('?')[0];
  if (u.startsWith('/')) u = u.slice(1);

  // O saga getUnits faz um POST de refresh de token "fire-and-forget" antes de listar.
  if (method.toLowerCase() === 'post' && u.includes('auth/v1/refresh-legacy')) {
    return { status: 200, data: { data: { access_token: 'dev-mode-refreshed-token' } } };
  }

  if (method.toLowerCase() === 'get' && u.endsWith('restaurant/v1/units')) {
    return {
      status: 200,
      data: { data: units, pagination: unitPagination },
    };
  }

  // Detalhe de uma unidade (usado no cabeçalho do modal de cliente). A unidade
  // vem enriquecida com email/telefone para o header exibir dados reais.
  if (method.toLowerCase() === 'get' && /restaurant\/v1\/units\/[^/]+$/.test(u)) {
    const id = u.split('/').pop();
    const found = units.find((unit) => unit.id === id) ?? {
      ...makeUnit({ id: id ?? '1001', name: 'Restaurante', location: '' }),
    };

    const unity = {
      ...found,
      financial_email: 'contato@cantinadojoca.com.br',
      // 13 dígitos (código país + DDD + número) para o header aceitar como válido.
      telephone: '5511987654321',
    };

    return { status: 200, data: { data: unity } };
  }

  // Promoções (lista de promoções do CRM).
  if (method.toLowerCase() === 'get' && u.endsWith('promotion/v1/promotions')) {
    return {
      status: 200,
      data: { success: true, data: PROMOTION_SEEDS, pagination: promotionsPagination },
    };
  }

  // Clientes: lista de unidades que participam de promoções.
  if (method.toLowerCase() === 'get' && u.endsWith('promotion/v1/promotions/units')) {
    return {
      status: 200,
      data: { success: true, data: CUSTOMER_SEEDS, pagination: customersPagination },
    };
  }

  // Detalhe de um cliente (promoções atuais/históricas ao clicar num card).
  // Só quando há um id no final (não confundir com rotas .../csv-export-model e .../csv-export).
  if (method.toLowerCase() === 'get' && /promotion\/v1\/promotions\/units\/[^/]+$/.test(u)) {
    const hasCsv = /promotion\/v1\/promotions\/units\/(csv-export|csv-export-model)/.test(u);

    if (!hasCsv) {
      return {
        status: 200,
        data: { success: true, data: [], pagination: { ...customersPagination, total: 0 } },
      };
    }
  }

  // Qualquer endpoint não mapeado: responde 200 vazio genérico para não estourar
  // erros em telas cujo foco não é este mock. Pode ser ampliado sob demanda.
  return { status: 200, data: { data: [] } };
}

export function enableDevMockBackend(client: AxiosInstance) {
  if (!isMockEnabled) return;

  client.interceptors.request.use((config: AxiosRequestConfig) => {
    // Ignora chamadas sem URL (ex.: axios() para refresh fora da instância api).
    const url = typeof config.url === 'string' ? config.url : '';
    const method = config.method ?? 'get';

    const resolved = resolve(method, url);

    // Log de debug para acompanhar quais chamadas o mock atende.
    if (isMockEnabled) {
      // eslint-disable-next-line no-console
      console.debug(`[mock-backend] ${method.toUpperCase()} ${url} -> ${resolved.status}`);
    }

    // Substitui o fluxo normal por uma resposta sintética.
    config.adapter = async () => ({
      data: resolved.data,
      status: resolved.status,
      statusText: 'OK',
      headers: {},
      config,
    });

    return config;
  });
}

/**
 * Registra o mock em todas as instâncias relevantes.
 * Recebe a instância `api` (que já foi criada no load de src/services/api.ts) e
 * também o axios global (para chamadas avulsas que não usam a instância api).
 */
export function enableDevMockClients(api: AxiosInstance) {
  if (!isMockEnabled) return;

  enableDevMockBackend(api);
  enableDevMockBackend(axios);
}
