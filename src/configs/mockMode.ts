/**
 * Indica se o app deve usar a autenticação fictícia + o fake backend com dados
 * mockados (sem depender de servidor real).
 *
 * Fica LIGADO quando:
 *  - roda em desenvolvimento (`import.meta.env.DEV`); OU
 *  - não há backend configurado (`VITE_BASE_URL` vazio) — por exemplo, um
 *    deploy de preview na Vercel sem variáveis de ambiente.
 *
 * Fica DESLIGADO apenas quando há backend real configurado em produção, caso em
 * que o app usa o fluxo normal de autenticação/API.
 */
export const isMockEnabled: boolean =
  import.meta.env.DEV || !import.meta.env.VITE_BASE_URL;
