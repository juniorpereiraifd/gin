import type { UserProps } from 'src/store/modules/auth/reducer';

/**
 * Usuário fictício usado apenas no modo de desenvolvimento (import.meta.env.DEV)
 * para permitir navegar pelo app sem depender do backend de autenticação.
 * NUNCA é usado em produção (build).
 */
export const mockUser: UserProps = {
  id: 1,
  name: 'Usuário DEV',
  email: 'dev@getinapp.com.br',
  username: 'dev',
  telephone: '',
  avatar: '',
  position: 'DEV',
  scope: 'all',
  master: true,
  favorite_unit: '',
};

/**
 * Token fictício. Em DEV o app não valida o token contra o backend, apenas o
 * utiliza para popular o estado de autenticação e permitir renderizar as telas.
 * É um JWT bem-formado (sem header `version`, para o updateToken não tratá-lo
 * como token legado), mas NUNCA é validado contra servidor algum.
 */
export const mockToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxfQ.dev-mode-token';
