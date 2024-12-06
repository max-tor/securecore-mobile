module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!@react-native|react-native|@react-navigation|@sentry/react-native)',
  ],
  moduleNameMapper: {
    '^.+\\.svg': '<rootDir>/__mocks__/svgrMock.ts',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
