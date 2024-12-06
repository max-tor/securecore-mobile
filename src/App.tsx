import {NavigationContainer} from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import React from 'react';
import Config from 'react-native-config';

import {AuthContextProvider} from '@/contexts/auth';
import {navigationRef} from '@/navigation/RootNavigation';
import {ErrorLogger} from '@/services/ErrorLogger';

import ErrorFallback from './components/common/ErrorFallback';
import {AppContextProvider} from './contexts/app';
import {RootStack} from './navigation/RootStack';

const initTracking = async () => {
  const useSentry = !__DEV__;

  if (useSentry) {
    Sentry.init({
      dsn: Config.SENTRY_DSN,
      environment: Config.SENTRY_ENVIRONMENT,
      tracesSampleRate: 1.0,
      enabled: !__DEV__,
    });
  }

  ErrorLogger.init({useSentry});
};

initTracking().then();

const BaseApp = () => (
  <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
    <AppContextProvider>
      <AuthContextProvider>
        <NavigationContainer ref={navigationRef}>
          <RootStack />
        </NavigationContainer>
      </AuthContextProvider>
    </AppContextProvider>
  </Sentry.ErrorBoundary>
);

export default __DEV__ ? BaseApp : Sentry.wrap(BaseApp);
