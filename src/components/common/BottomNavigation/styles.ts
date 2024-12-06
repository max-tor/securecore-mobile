import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import styled from 'styled-components/native';

export const Tabs = createBottomTabNavigator();

export const StyledTabNavigator = styled(Tabs.Navigator).attrs(({theme}) => {
  const {colors, space} = theme;

  return {
    sceneContainerStyle: {
      marginBottom: 83,
    },
    screenOptions: ({navigation}) => {
      const focused = navigation.isFocused();

      return {
        headerShown: false,
        tabBarInactiveTintColor: colors.darkGrey,
        tabBarActiveTintColor: colors.primary[400],
        tabBarStyle: {
          paddingTop: space[2.5],
          paddingLeft: space[5],
          paddingRight: space[5],
          paddingBottom: space[5],
          height: 83,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarItemStyle: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
        tabBarIconStyle: {
          height: 18,
          marginBottom: 6,
        },
        tabBarLabelStyle: {
          height: 18,
          lineHeight: 18,
          ...(focused && {fontWeight: 'bold'}),
        },
      };
    },
  };
})``;
