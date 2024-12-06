import {extendTheme, Theme} from 'native-base';

import * as colors from './colors';
import * as components from './components';

const theme: Theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: 'light',
  },
  fontConfig: {
    'SF Pro Text': {
      100: {normal: 'sf-pro-text-regular'},
      200: {normal: 'sf-pro-text-medium'},
      300: {normal: 'sf-pro-text-semibold'},
      400: {normal: 'sf-pro-text-bold'},
      500: {normal: 'sf-pro-display-regular'},
      600: {normal: 'sf-pro-display-bold'},
    },
    'SF Pro Display': {
      500: {normal: 'sf-pro-display-regular'},
      600: {normal: 'sf-pro-display-bold'},
    },
  },
  ...colors,
  components,
});

export default theme;
