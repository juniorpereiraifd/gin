import { getRemoteConfig } from 'firebase/remote-config';
import { firebaseConfig } from 'src/configs/firebase';
import { initializeApp } from 'firebase/app';

export const useRemoteConfig = (
  defaultConfig: Record<string, string | number | boolean>
) => {
  const app = initializeApp(firebaseConfig);
  const remoteConfig = getRemoteConfig(app);

  remoteConfig.settings = {
    fetchTimeoutMillis: 60000,
    minimumFetchIntervalMillis: 1,
  };
  remoteConfig.defaultConfig = defaultConfig;

  return remoteConfig;
};
