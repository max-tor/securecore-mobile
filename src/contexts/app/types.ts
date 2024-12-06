import {NetInfoState} from '@react-native-community/netinfo';
import {AppStateStatus} from 'react-native';

export interface AppContextInterface {
  networkState: NetInfoState;
  isConnected: boolean;
  liveFromBackground: boolean;
  backgroundState: AppStateStatus;
  toggleConnected: () => void;
}
