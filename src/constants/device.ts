import {Platform} from 'react-native';
import {getDeviceName, getUniqueId} from 'react-native-device-info';

enum OS {
  IOS = 'ios',
  ANDROID = 'android',
}

export const isAndroid = () => Platform.OS === OS.ANDROID;
export const isIOS = () => Platform.OS === OS.IOS;

export const getFullDeviceName = async () => {
  const deviceName = await getDeviceName();
  const deviceId = await getUniqueId();

  return `${deviceName}-${deviceId}`;
};
