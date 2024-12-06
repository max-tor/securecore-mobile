import {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';

import {BottomNavigation, NetworkIndicator} from '@/components';
import {Tab} from '@/components/common/BottomNavigation/types';
import {
  CompanyIcon,
  DashboardIcon,
  MenuIcon,
  SearchIcon,
} from '@/components/common/Icon/MenuIcons';
import {ProfileModal} from '@/components/Profile';
import {PushNotifications} from '@/components/PushNotifications';
import {ROUTES} from '@/constants/routes';
import {UserProvider} from '@/contexts/user';
import {CompanyStack, DashboardStack, MenuStack, SearchScreen} from '@/screens';

const ProfileTrigger = ({onPress, ...props}: BottomTabBarButtonProps) => (
  <TouchableOpacity {...props} onPress={onPress} />
);

export const HomeStackScreen = () => {
  const [profileModal, setProfileModal] = useState(false);

  const tabs: Tab[] = [
    {
      name: ROUTES.DASHBOARD_STACK,
      component: DashboardStack,
      options: {
        title: 'Dashboard',
        lazy: false,
        tabBarIcon: DashboardIcon,
      },
    },
    {
      name: ROUTES.COMPANY_STACK,
      component: CompanyStack,
      options: {
        title: 'Company',
        lazy: false,
        tabBarIcon: CompanyIcon,
      },
    },
    {
      name: ROUTES.SEARCH_STACK,
      component: SearchScreen,
      options: {
        title: 'Search',
        lazy: false,
        tabBarIcon: SearchIcon,
      },
    },
    {
      name: ROUTES.MENU_STACK,
      component: MenuStack,
      options: {
        title: 'Menu',
        lazy: false,
        tabBarIcon: MenuIcon,
        tabBarButton: props =>
          ProfileTrigger({
            ...props,
            onPress: () => {
              setProfileModal(true);
            },
          }),
      },
    },
  ];

  return (
    <UserProvider>
      <PushNotifications />

      <NetworkIndicator />

      <ProfileModal
        isOpen={profileModal}
        onClose={() => setProfileModal(false)}
      />
      <BottomNavigation tabs={tabs} />
    </UserProvider>
  );
};
