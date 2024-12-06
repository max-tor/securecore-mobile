import AsyncStorage from '@react-native-async-storage/async-storage';
// eslint-disable-next-line import/no-extraneous-dependencies
import Reactotron, {networking} from 'reactotron-react-native';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({
    name: 'SecureCore v2',
  })
  .use(networking())
  .useReactNative() // add all built-in react native plugins
  .connect();
