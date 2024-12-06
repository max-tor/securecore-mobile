import {useContext} from 'react';

import {AppContext, AppContextInterface} from '@/contexts/app';

export const useAppState = (): AppContextInterface => useContext(AppContext);
