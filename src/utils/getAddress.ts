import {Address} from '@securecore-new-application/securecore-datacore/lib/types';

export const getAddress = (addr?: Address) => {
  if (!addr) {
    return null;
  }
  const {address, city, state, postalcode} = addr;

  return [address, city, state, postalcode].filter(Boolean).join(', ');
};
