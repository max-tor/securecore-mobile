import NetInfo, {
  NetInfoState,
  useNetInfo,
} from '@react-native-community/netinfo';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {AppState, AppStateStatus} from 'react-native';

import {AppContext} from '@/contexts/app/context';
import {AppContextInterface} from '@/contexts/app/types';
import {ErrorLogger} from '@/services/ErrorLogger';

interface AppContextProviderProps {
  children: React.ReactNode;
}
export const AppContextProvider: FC<AppContextProviderProps> = ({children}) => {
  const appStateRef = useRef(AppState.currentState);
  const netInfoCurrentState = useNetInfo();
  const [networkState, setNetworkState] =
    useState<NetInfoState>(netInfoCurrentState);
  const [isConnected, setIsConnected] = useState<boolean>();
  const [appState, setAppState] = useState<AppStateStatus>(appStateRef.current);
  const [liveFromBackground, setLiveFromBackground] = useState<boolean>(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appStateRef.current.match(/background/) &&
        nextAppState === 'active'
      ) {
        setLiveFromBackground(true);
        ErrorLogger.log('App has come to the foreground!');
      } else {
        setLiveFromBackground(false);
      }

      appStateRef.current = nextAppState;
      setAppState(appStateRef.current);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected as boolean);
      setNetworkState(state);
    });

    return () => {
      subscription.remove();
      unsubscribe();
    };
  }, []);

  const toggleConnected = useCallback(() => {
    setIsConnected(!isConnected);
  }, [isConnected]);

  const value = useMemo<AppContextInterface>(
    () => ({
      backgroundState: appState,
      networkState,
      isConnected: isConnected as boolean,
      liveFromBackground,
      toggleConnected,
    }),
    [appState, networkState, isConnected, liveFromBackground, toggleConnected],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
