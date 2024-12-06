import {User} from '@securecore-new-application/securecore-datacore/lib/types';

import {TextInputProps} from '@/components/common/TextInput';

export interface UserAutocompleteProps extends TextInputProps {
  companyId?: number;
  onSelectUser: (arg0: User) => void;
}
