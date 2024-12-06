import React, {FC, useCallback, useEffect, useMemo, useReducer} from 'react';
import {getSupportedBiometryType} from 'react-native-keychain';

import {BIO_ENABLED, ROLE_KEY, TOKEN_KEY} from '@/constants/config';
import {loadFromStorage, saveToStorage} from '@/helpers/asyncStorage';

import {AuthContext} from './context';
import {authReducer, initialValue} from './reducer';
import {
  AuthContextProviderProps,
  BiometryDecision,
  LogInPayload,
} from './types';

// eslint-disable-next-line import/no-mutable-exports
let logOut: () => void;

export const AuthContextProvider: FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialValue);

  useEffect(() => {
    const initAsync = async () => {
      const [token, role, biometryEnabled] = await Promise.all([
        loadFromStorage(TOKEN_KEY),
        loadFromStorage(ROLE_KEY),
        loadFromStorage(BIO_ENABLED),
      ]);

      dispatch({type: 'RESTORE_TOKEN', token, role});
      dispatch({
        type: 'SET_BIOMETRY_ENABLED',
        biometryEnabled: biometryEnabled || BiometryDecision.NOT_DEFINED,
      });
    };

    initAsync().then();
  }, []);

  const handleSignOut = async () => {
    await saveToStorage(null, ROLE_KEY);
    await saveToStorage(null, TOKEN_KEY);
    dispatch({type: 'SIGN_OUT'});
  };

  const checkBiometryTypes = useCallback(async () => {
    const biometryType = await getSupportedBiometryType();

    dispatch({type: 'SET_BIOMETRY_TYPE', biometryType});
  }, []);

  const disableBiometry = async () => {
    await saveToStorage(BiometryDecision.DISABLED, BIO_ENABLED);
    dispatch({
      type: 'SET_BIOMETRY_ENABLED',
      biometryEnabled: BiometryDecision.DISABLED,
    });
  };

  const enableBiometry = async () => {
    await saveToStorage(BiometryDecision.ENABLED, BIO_ENABLED);
    dispatch({
      type: 'SET_BIOMETRY_ENABLED',
      biometryEnabled: BiometryDecision.ENABLED,
    });
  };

  const resetBiometry = async () => {
    await saveToStorage(BiometryDecision.NOT_DEFINED, BIO_ENABLED);
    dispatch({
      type: 'SET_BIOMETRY_ENABLED',
      biometryEnabled: BiometryDecision.NOT_DEFINED,
    });
  };

  logOut = handleSignOut;

  const value = useMemo(
    () => ({
      ...state,
      signIn: async ({role, token}: LogInPayload) => {
        await Promise.all([
          saveToStorage(role, ROLE_KEY),
          saveToStorage(token, TOKEN_KEY),
        ]);

        dispatch({
          type: 'SIGN_IN',
          role,
          token,
        });
      },
      signOut: handleSignOut,
      checkSupportedBiometryTypes: checkBiometryTypes,
      disableBiometry,
      enableBiometry,
      resetBiometry,
    }),
    [checkBiometryTypes, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export {logOut};
