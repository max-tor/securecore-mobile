/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import {BIOMETRY_TYPE} from 'react-native-keychain';

export interface AuthContextProviderProps {
  children: React.ReactNode;
}

export enum BiometryDecision {
  NOT_DEFINED = 'not-defined',
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}
export const initialValue = {
  token: null as string | null,
  isLoading: true,
  isSignedIn: false,
  role: null as string | null,
  signIn: () => {},
  signOut: () => {},
  biometryEnabled: BiometryDecision.NOT_DEFINED,
  biometryType: null,
  checkSupportedBiometryTypes: () => {},
  disableBiometry: () => {},
  enableBiometry: () => {},
  resetBiometry: () => {},
};

export type LogInPayload = {
  token: string;
  role: string;
};

export interface AuthContextState {
  signIn: (data: LogInPayload) => void | Promise<void>;
  signOut: () => void | Promise<void>;
  token: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  role: string | null;
  biometryType: BIOMETRY_TYPE | null;
  biometryEnabled: BiometryDecision;
  checkSupportedBiometryTypes: () => void | Promise<void>;
  disableBiometry: () => void | Promise<void>;
  enableBiometry: () => void | Promise<void>;
  resetBiometry: () => void | Promise<void>;
}
