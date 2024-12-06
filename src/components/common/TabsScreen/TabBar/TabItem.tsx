import React, {useMemo} from 'react';
import {Platform, Pressable} from 'react-native';
import {TabName} from 'react-native-collapsible-tab-view/src/types';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';

import {tabItemStyles} from '@/components/common/TabsScreen/TabBar/styles';

import {TabItemProps} from './types';

export const TABBAR_HEIGHT = 70;
const DEFAULT_COLOR = 'rgba(0, 0, 0, 1)';

/**
 * Any additional props are passed to the pressable component.
 */
export const TabItem = <T extends TabName = string>(
  props: TabItemProps<T>,
): React.ReactElement => {
  const {
    name,
    index,
    onPress,
    onLayout,
    scrollEnabled,
    indexDecimal,
    label,
    style,
    labelStyle,
    activeColor = DEFAULT_COLOR,
    inactiveColor = DEFAULT_COLOR,
    pressColor = '#DDDDDD',
    pressOpacity = Platform.OS === 'ios' ? 0.2 : 1,
    ...rest
  } = props;

  const stylez = useAnimatedStyle(() => {
    const isActive = Math.abs(index - indexDecimal.value) < 0.5;

    return {
      color: isActive ? activeColor : inactiveColor,
      fontWeight: isActive ? '600' : 'normal',
    };
  });

  const wrapperStyles = useAnimatedStyle(() => {
    const isActive = Math.abs(index - indexDecimal.value) < 0.5;

    return {
      color: isActive ? activeColor : inactiveColor,
      borderWidth: isActive ? 1 : 0,
      backgroundColor: isActive ? '#f6f6fa' : 'transparent',
    };
  });

  const renderedLabel = useMemo(() => {
    if (typeof label === 'string') {
      return (
        <Animated.View
          style={[
            {
              paddingLeft: 12,
              paddingRight: 12,
              borderRadius: 20,
              height: 40,
              justifyContent: 'center',
              backgroundColor: 'none',
              borderColor: 'rgba(230, 230, 240, 0.5)',
            },
            wrapperStyles,
          ]}>
          <Animated.Text style={[tabItemStyles.label, stylez, labelStyle]}>
            {label}
          </Animated.Text>
        </Animated.View>
      );
    }

    return label(props);
  }, [label, labelStyle, props, stylez, wrapperStyles]);

  return (
    <Pressable
      onLayout={onLayout}
      style={({pressed}) => [
        {opacity: pressed ? pressOpacity : 1},
        !scrollEnabled && tabItemStyles.grow,
        tabItemStyles.item,
        style,
      ]}
      onPress={() => onPress(name)}
      android_ripple={{
        borderless: true,
        color: pressColor,
      }}
      {...rest}>
      {renderedLabel}
    </Pressable>
  );
};
