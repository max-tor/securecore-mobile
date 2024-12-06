import {BIOMETRY_TYPE} from 'react-native-keychain';

import {BiometryDecision} from '@/contexts/auth/types';

export const initialValue = {
  token: null as string | null,
  isLoading: true,
  isSignedIn: false,
  role: null as string | null,
  biometryEnabled: BiometryDecision.NOT_DEFINED,
  biometryType: null,
};
// types
export type AuthState = {
  token: null | string;
  isLoading: boolean;
  isSignedIn: boolean;
  role: string | null;
  biometryEnabled: BiometryDecision;
  biometryType: BIOMETRY_TYPE | null;
};
export type SignInPayload = {
  token: string | null;
  role: string | null;
};

type Action =
  | ({
      type: 'RESTORE_TOKEN' | 'SIGN_IN';
    } & SignInPayload)
  | {
      type: 'SIGN_OUT';
    }
  | ({
      type: 'SET_BIOMETRY_ENABLED';
    } & {biometryEnabled: BiometryDecision})
  | ({
      type: 'SET_BIOMETRY_TYPE';
    } & {biometryType: BIOMETRY_TYPE | null});

export const authReducer = (
  prevState: AuthState,
  action: Action,
): AuthState => {
  switch (action.type) {
    case 'SET_BIOMETRY_ENABLED': {
      return {
        ...prevState,
        biometryEnabled: action.biometryEnabled,
      };
    }
    case 'SET_BIOMETRY_TYPE': {
      return {
        ...prevState,
        biometryType: action.biometryType,
      };
    }
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        token: action.token,
        isLoading: false,
        role: action.role,
        isSignedIn: action.token !== null,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignedIn: true,
        token: action.token,
        role: action.role,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignedIn: false,
        token: '',
      };
    default:
      return prevState;
  }
};
