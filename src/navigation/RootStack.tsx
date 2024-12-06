import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext} from 'react';

import {ROUTES} from '@/constants/routes';
import {AuthContext} from '@/contexts/auth';
import {HomeStackScreen} from '@/navigation/HomeStack';

import {AuthStack} from './AuthStack';

export const RootStack = () => {
  const Stack = createNativeStackNavigator();
  const {isSignedIn, isLoading} = useContext(AuthContext);

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isSignedIn ? (
        <Stack.Screen
          options={{headerShown: false}}
          name={ROUTES.HOME_STACK}
          component={HomeStackScreen}
        />
      ) : (
        <Stack.Screen
          options={{headerShown: false}}
          name={ROUTES.AUTH_STACK}
          component={AuthStack}
        />
      )}
    </Stack.Navigator>
  );
};
