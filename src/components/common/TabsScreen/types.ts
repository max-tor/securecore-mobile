import React from 'react';
import type {Animated} from 'react-native';

export interface TabsConfigItem {
  tabLabel: string;
  key: string;
  renderContent: () => React.ReactElement;
  visible?: boolean;
}
export interface TabsScreenProps {
  minHeaderHeight: number;
  renderHeader: () => React.ReactElement;
  tabsConfig: TabsConfigItem[];
  initialTabName?: string;
}

export type Route = {
  key: string;
  icon?: string;
  title?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  testID?: string;
};

export interface Event {
  tab: TabsConfigItem;
  defaultPrevented: boolean;
  preventDefault(): void;
}

export type Scene<T extends Route> = {
  route: T;
};

export type NavigationState<T extends Route> = {
  index: number;
  routes: T[];
};

export type Layout = {
  width: number;
  height: number;
};

export type Listener = (value: number) => void;

export type SceneRendererProps = {
  layout: Layout;
  position: Animated.AnimatedInterpolation<string | number>;
};
