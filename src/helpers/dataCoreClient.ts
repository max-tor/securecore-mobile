import {DataCoreClient} from '@securecore-new-application/securecore-datacore';
import Config from 'react-native-config';

import {loadFromStorage} from './asyncStorage';

export const dataCoreClient = new DataCoreClient({
  apiUrl: Config.API_URL || '',
  apolloDefaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
    },
  },
  getToken: async () => {
    try {
      const token = await loadFromStorage('TOKEN_KEY');

      return token;
    } catch (e) {
      // error reading value
    }
  },
  onError: error => console.error(error),
});
