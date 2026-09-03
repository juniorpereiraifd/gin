import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as AuthCreators } from 'src/store/modules/auth/actions';
import { type AuthStatusValues, AUTH_STATUS } from 'src/store/modules/auth/reducer';
import { mockToken, mockUser } from 'src/configs/devMock';
import { isMockEnabled } from 'src/configs/mockMode';

type UseAuthResponse = {
  authenticationStatus: AuthStatusValues | null;
};

export const useAuth = (): UseAuthResponse => {
  const dispatch = useDispatch();
  const [authStatus, setAuthStatus] = useState<AuthStatusValues | null>(null);
  const {
    auth: { user, searchingUserData },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    const runAuthFlow = async () => {
      let accessToken: string | null | undefined = localStorage.getItem('access_token');

      if (!accessToken) {
        accessToken = Cookies.get('access_token_ad');

        if (!accessToken) {
          if (!isMockEnabled) {
            setAuthStatus(AUTH_STATUS.UNAUTHENTICATED);
            return;
          }

          // ----- Modo demonstração (dev sem backend, ou deploy sem API) -----
          // Se já houver um usuário mock no store (persistido em sessão), apenas
          // marca como autenticado. Senão, injeta o usuário fictício direto no
          // estado (sem passar pelo saga, que dependeria de VITE_BASE_URL).
          if (user !== null) {
            setAuthStatus(AUTH_STATUS.AUTHENTICATED);
            return;
          }

          dispatch(AuthCreators.loginSuccess({ token: mockToken, user: mockUser }));
          localStorage.setItem('access_token', mockToken);
          setAuthStatus(AUTH_STATUS.AUTHENTICATED);
          return;
          // ---------------------------------------------------
        } else {
          localStorage.setItem('access_token', accessToken);
          Cookies.remove('access_token_ad');
        }
      }

      if (user === null && searchingUserData === false) {
        dispatch(AuthCreators.loginRequest());
      }

      setAuthStatus(AUTH_STATUS.AUTHENTICATED);
    };

    runAuthFlow();
  }, [searchingUserData, user]);

  return {
    authenticationStatus: authStatus,
  };
};
