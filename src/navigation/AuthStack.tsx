import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';

import {ROUTES} from '@/constants/routes';
import {LoginScreen} from '@/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{headerShown: false}}
      component={LoginScreen}
      name={ROUTES.LOGIN_STACK}
    />
  </Stack.Navigator>
);
