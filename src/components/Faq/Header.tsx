import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useHeaderMeasurements} from 'react-native-collapsible-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';

import {avatar, faqBg} from '@/components/common/Icon/icons';
import {
  DashboardAvatarProfile,
  DashboardHeaderBg,
  DashboardHeaderSubTitle,
  DashboardHeaderTitle,
  DashboardHeaderTitleCollapsed,
  DashboardHeaderTitles,
  DashboardProfileButton,
} from '@/components/Dashboard/styles';
import {ROUTES} from '@/constants/routes';
import {HomeScreenNavigationProp} from '@/navigation/types';

const HEADER_HEIGHT = 147;
const styles = StyleSheet.create({
  box: {
    height: 1250,
    width: '100%',
  },
  boxA: {
    backgroundColor: 'white',
  },
  boxB: {
    backgroundColor: '#D8D8D8',
  },
  header: {
    height: HEADER_HEIGHT,
    width: '100%',
    backgroundColor: '#2196f3',
  },
  container: {},
  text: {
    position: 'absolute',
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  root: {
    height: HEADER_HEIGHT,
  },
});

export const Header = () => {
  const {top, height} = useHeaderMeasurements();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const opacityAnimation = useAnimatedStyle(() => {
    const val = HEADER_HEIGHT - 40;

    return {
      opacity: (val - Math.abs(top.value) * 2.8) / val,
    };
  });

  const goToProfile = () => {
    navigation.navigate(ROUTES.MENU_STACK, {
      screen: 'ProfileScreen',
    });
  };

  const slideUpAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          top.value,
          [0, -(height.value || 0 - 40)],
          [0, height.value || 0 - 40],
        ),
      },
    ],
  }));

  const titleOpacity = useAnimatedStyle(() => {
    const val = HEADER_HEIGHT - 40;

    return {
      opacity: Math.abs(top.value) / val === 1 ? 1 : 0,
    };
  });

  return (
    <LinearGradient
      angle={70}
      useAngle
      angleCenter={{x: 0.1, y: 0.1}}
      colors={['#FCFCFF', '#FCF5F9', '#F2F5FB', '#F2F5FB']}
      style={[styles.root]}>
      <Animated.View
        style={[
          opacityAnimation,
          {height: HEADER_HEIGHT, position: 'absolute', bottom: 0, right: 16},
        ]}>
        <DashboardHeaderBg resizeMode="cover" source={faqBg} />
      </Animated.View>
      <Animated.View style={[slideUpAnimation]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 40,
            justifyContent: 'center',
          }}>
          <DashboardProfileButton onPress={() => goToProfile()}>
            <DashboardAvatarProfile resizeMode="cover" source={avatar} />
          </DashboardProfileButton>
          <Animated.View style={[titleOpacity]}>
            <DashboardHeaderTitleCollapsed>
              Secure Guides
            </DashboardHeaderTitleCollapsed>
          </Animated.View>
        </View>
      </Animated.View>
      <DashboardHeaderTitles>
        <Animated.View style={[styles.container, opacityAnimation]}>
          <DashboardHeaderTitle>Secure Guides</DashboardHeaderTitle>
          <DashboardHeaderSubTitle>
            Frequently Asked Questions
          </DashboardHeaderSubTitle>
        </Animated.View>
      </DashboardHeaderTitles>
    </LinearGradient>
  );
};
