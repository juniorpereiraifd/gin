import axios, { AxiosError, AxiosResponse } from 'axios';
import { store } from 'src/store';
import { Creators as AuthCreators } from 'src/store/modules/auth/actions';
import { notification } from 'src/utils/helpers';

let isAlreadyFetchingAccessToken = false;

type Subscriber = (accessToken: string) => void;

let subscribers: Array<Subscriber> = [];

type AuthResponse = {
  data: {
    access_token: string;
  };
};

export async function resetTokenAndReattemptRequest(error: AxiosError): Promise<AxiosResponse | never> {
  try {
    const errorResponse = error.response as AxiosResponse;

    const retryOriginalRequest = new Promise<AxiosResponse>((resolve) => {
      addSubscriber((accessToken) => {
        errorResponse.config.headers!.Authorization = `Bearer ${accessToken}`;
        resolve(axios(errorResponse.config));
      });
    });

    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;

      const response = await axios.get<AuthResponse>(
        import.meta.env.DEV
          ? import.meta.env.VITE_AUTH_DEV_BASE_URL
          : `${import.meta.env.VITE_AUTH_BASE_URL}/api/system/ping?mode=1`,
        import.meta.env.DEV
          ? undefined
          : {
              withCredentials: true,
            },
      );

      if (response.status !== 200 || !response.data) {
        notification.warning('Sua sessão expirou.', '');
        store.dispatch(AuthCreators.refreshTokenFailed());
        return Promise.reject(error);
      }

      const newToken = response.data.data.access_token;
      localStorage.setItem('access_token', newToken);
      store.dispatch(AuthCreators.refreshTokenSuccess({ token: newToken }));
      isAlreadyFetchingAccessToken = false;
      onAccessTokenFetched(newToken);
    }

    return retryOriginalRequest;
  } catch (err) {
    notification.warning('Sua sessão expirou.', '');
    store.dispatch(AuthCreators.refreshTokenFailed());
    return Promise.reject(err);
  }
}

function onAccessTokenFetched(accessToken: string): void {
  subscribers.forEach((callback) => callback(accessToken));
  subscribers = [];
}

function addSubscriber(callback: Subscriber): void {
  subscribers.push(callback);
}
