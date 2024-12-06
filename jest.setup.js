// import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
// import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';
//
// jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('@sentry/react-native', () => ({
  init: () => jest.fn(),
  wrap: () => jest.fn(),
}));
// jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
// jest.mock('react-native-reanimated', () => {
//   // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
//   const Reanimated = require('react-native-reanimated/mock');
//
//   // The mock for `call` immediately calls the callback which is incorrect
//   // So we override it with a no-op
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   Reanimated.default.call = () => {};
//
//   return Reanimated;
// });
//
// // Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
//
// jest.mock('react-native-bootsplash', () => ({
//   hide: jest.fn().mockResolvedValueOnce(),
//   getVisibilityStatus: jest.fn().mockResolvedValue('hidden'),
// }));
