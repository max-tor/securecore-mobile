import {User} from '@securecore-new-application/securecore-datacore/lib/types';
import {useContext} from 'react';

import {UserContext} from '../contexts/user';

export function useCurrentUser(): User | null {
  const {currentUser} = useContext(UserContext);

  return currentUser;
}
