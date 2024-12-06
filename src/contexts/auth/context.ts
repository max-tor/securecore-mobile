import {createContext} from 'react';

import {AuthContextState, initialValue} from './types';

export const AuthContext = createContext<AuthContextState>(initialValue);
