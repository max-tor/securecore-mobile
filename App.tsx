import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {DataCoreProvider} from '@securecore-new-application/securecore-datacore';
import * as Sentry from '@sentry/react-native';
import {ErrorBoundary} from '@sentry/react-native';
import {NativeBaseProvider} from 'native-base';
import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {ThemeProvider} from 'styled-components';

import {UploadProgressProvider} from '@/contexts/uploadProgress';
import {dataCoreClient} from '@/helpers/dataCoreClient';

import App from './src/App';
import theme from './src/theme';

RNBootSplash.hide().then();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
console.reportErrorsAsExceptions = false;

export default () => (
  <Sentry.TouchEventBoundary>
    <ErrorBoundary>
      <DataCoreProvider client={dataCoreClient.httpClient}>
        <ThemeProvider theme={theme}>
          <UploadProgressProvider>
            <NativeBaseProvider theme={theme}>
              <ActionSheetProvider>
                <App />
              </ActionSheetProvider>
            </NativeBaseProvider>
          </UploadProgressProvider>
        </ThemeProvider>
      </DataCoreProvider>
    </ErrorBoundary>
  </Sentry.TouchEventBoundary>
);
