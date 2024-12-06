import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';

import {ROUTES} from '@/constants/routes';

export interface Tab {
  component: () => JSX.Element;
  name: ROUTES;
  options: BottomTabNavigationOptions;
  listeners?: unknown;
}

export interface BottomNavigationProps {
  tabs: Tab[];
}
