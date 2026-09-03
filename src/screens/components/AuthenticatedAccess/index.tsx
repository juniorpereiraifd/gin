import { Fragment, FunctionComponent, ReactNode } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { AUTH_STATUS } from 'src/store/modules/auth/reducer';
import { isMockEnabled } from 'src/configs/mockMode';
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
    // No modo demonstração (sem backend) apenas exibe o conteúdo, pois o useAuth
    // injeta um usuário fictício. Quando há backend real em produção, mantém o
    // redirect para o fluxo de autenticação.
    if (isMockEnabled) {
      return <Fragment>{yes}</Fragment>;
    }

    window.location.href = import.meta.env.VITE_AUTH_BASE_URL;

    return null;
  }

  return <Fragment>{yes}</Fragment>;
};
