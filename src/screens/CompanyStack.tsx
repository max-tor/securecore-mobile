import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {Building, Company, Property, TenantSpace} from '@/components';
import {COMPANY_STACK_SCREENS} from '@/constants/routes';
import {AttachmentsScreen} from '@/screens/Attachments';

const Stack = createNativeStackNavigator();

export const CompanyStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{headerShown: false}}
      name={COMPANY_STACK_SCREENS.COMPANY_SCREEN}
      component={Company}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={COMPANY_STACK_SCREENS.PROPERTY_SCREEN}
      component={Property}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={COMPANY_STACK_SCREENS.BUILDING_SCREEN}
      component={Building}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={COMPANY_STACK_SCREENS.TENANT_SPACE_SCREEN}
      component={TenantSpace}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={COMPANY_STACK_SCREENS.ATTACHMENTS_SCREEN}
      component={AttachmentsScreen}
    />
  </Stack.Navigator>
);
