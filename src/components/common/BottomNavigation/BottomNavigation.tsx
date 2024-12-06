import * as React from 'react';
import {FC} from 'react';

import {StyledTabNavigator, Tabs} from './styles';
import {BottomNavigationProps} from './types';

export const BottomNavigation: FC<BottomNavigationProps> = ({tabs}) => (
  <StyledTabNavigator>
    {tabs.map(screen => (
      <Tabs.Screen
        key={screen.name}
        name={screen.name}
        component={screen.component}
        options={screen.options}
      />
    ))}
  </StyledTabNavigator>
);
