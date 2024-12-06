import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {Building, Dashboard, Property, TenantSpace} from '@/components';
import {DASHBOARD_STACK_SCREENS} from '@/constants/routes';

const Stack = createNativeStackNavigator();

export const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{headerShown: false}}
      name={DASHBOARD_STACK_SCREENS.DASHBOARD_SCREEN}
      component={Dashboard}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={DASHBOARD_STACK_SCREENS.DASHBOARD_PROPERTY_SCREEN}
      component={Property}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={DASHBOARD_STACK_SCREENS.DASHBOARD_BUILDING_SCREEN}
      component={Building}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={DASHBOARD_STACK_SCREENS.DASHBOARD_TENANT_SPACE_SCREEN}
      component={TenantSpace}
    />
  </Stack.Navigator>
);
