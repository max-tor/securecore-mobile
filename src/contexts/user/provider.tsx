import {useGetMe} from '@securecore-new-application/securecore-datacore';
import React, {FC, useContext, useMemo} from 'react';
import {ActivityIndicator, View} from 'react-native';

import {colors} from '@/theme/colors';

import {AuthContext} from '../auth';
import {UserContext} from './context';

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({children}) => {
  const {data, error, loading} = useGetMe({});
  const value = useMemo(() => ({currentUser: data?.getMe || null}), [data]);
  const {signOut} = useContext(AuthContext);

  if (error) {
    const gqlError = error.graphQLErrors[0];
    const errorCode = gqlError?.extensions?.code;

    if (errorCode === 'UNAUTHENTICATED') {
      signOut();

      return null;
    }
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={colors.primary['400']} />
      </View>
    );
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
