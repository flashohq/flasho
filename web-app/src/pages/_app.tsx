import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { ChakraProvider, Spinner } from '@chakra-ui/react';
import NotificationProvider from '../Notifications/NotificationProvider';
import { Provider } from 'react-redux';
import { getPersistor } from '@rematch/persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { store } from '../redux/store';
import AuthGuard from '../components/route-guard';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);
  return getLayout(
    <ChakraProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={getPersistor()}>
          <NotificationProvider>
            <Component {...pageProps} />
          </NotificationProvider>
        </PersistGate>
      </Provider>
    </ChakraProvider>
  );
}

export default AuthGuard(MyApp);
