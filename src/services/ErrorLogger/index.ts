import * as Sentry from '@sentry/react-native';

interface LoggerInitConfig {
  useSentry: boolean;
}

export class ErrorLogger {
  static useSentry = false;

  static init({useSentry}: LoggerInitConfig): void {
    ErrorLogger.useSentry = useSentry;
  }

  public static logError(error: Error, info?: Record<string, unknown>): void {
    if (__DEV__) {
      // eslint-disab/**/le-next-line no-console
      console.log(info);
      // eslint-disable-next-line no-console
      console.error(error);
    }

    if (ErrorLogger.useSentry) {
      Sentry.captureException(error);
    }
  }

  // eslint-disable-next-line
  public static log(message?: any, ...optionalParams: any[]): void {
    // eslint-disable-next-line no-console
    if (__DEV__) {
      console.log(message, ...optionalParams);
    }
  }
}
