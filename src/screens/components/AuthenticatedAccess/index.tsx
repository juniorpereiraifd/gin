import { Fragment, FunctionComponent, ReactNode } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { AUTH_STATUS } from 'src/store/modules/auth/reducer';
import { UnitsListScreenLoading } from '../UnitsListScreenLoading';

type AuthenticatedAccessProps = {
  yes?: ReactNode;
};

export const AuthenticatedAccess: FunctionComponent<AuthenticatedAccessProps> = (props) => {
  const { yes } = props;
  const { authenticationStatus } = useAuth();

  if (authenticationStatus === null) {
    return null;
  }

  if (authenticationStatus === AUTH_STATUS.AUTHENTICATING) {
    return <UnitsListScreenLoading />;
  }

  if (authenticationStatus === AUTH_STATUS.UNAUTHENTICATED) {
    // Em desenvolvimento, sem backend de autenticação, apenas exibe o conteúdo
    // (o useAuth injeta um usuário fictício). Em produção mantém o redirect.
    if (import.meta.env.DEV) {
      return <Fragment>{yes}</Fragment>;
    }

    window.location.href = import.meta.env.VITE_AUTH_BASE_URL;

    return null;
  }

  return <Fragment>{yes}</Fragment>;
};
