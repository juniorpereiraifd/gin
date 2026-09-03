import 'src/configs/reactotron';
// import 'antd/dist/antd.css';
import 'src/styles/global.css';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider, App as AntdApp } from 'antd';
import locale from 'antd/lib/locale/pt_BR';
import { ThemeProvider } from 'styled-components';
import { pdfjs } from 'react-pdf';
import * as Sentry from '@sentry/react';
import { router } from './screens/routes';
import { store, persistor } from 'src/store';
import { theme, antdTheme } from './styles/theme';
import GlobalStyles from './styles/global';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/pt-br';

dayjs.extend(localeData).locale('pt-br');

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.NODE_ENV,
});

const App = () => (
  <ConfigProvider locale={locale}>
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfigProvider locale={locale} theme={antdTheme}>
            <AntdApp>
              <ThemeProvider theme={theme}>
                <GlobalStyles />
                <RouterProvider router={router} />
              </ThemeProvider>
            </AntdApp>
          </ConfigProvider>
        </PersistGate>
      </Provider>
    </Sentry.ErrorBoundary>
  </ConfigProvider>
);

export default App;
