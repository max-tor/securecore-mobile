import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {Faq} from '@/components/Faq';
import {Profile} from '@/components/Profile';
import {MENU_STACK_SCREENS} from '@/constants/routes';

const Stack = createNativeStackNavigator();

export const MenuStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{headerShown: false}}
      name={MENU_STACK_SCREENS.PROFILE_SCREEN}
      component={Profile}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={MENU_STACK_SCREENS.FAQ_SCREEN}
      component={Faq}
    />
  </Stack.Navigator>
);
