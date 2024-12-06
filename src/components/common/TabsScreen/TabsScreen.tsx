import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';

import {TabBar} from '@/components/common/TabsScreen/TabBar';
import {tabScreenStyles} from '@/components/common/TabsScreen/TabBar/styles';
import {
  TabsConfigItem,
  TabsScreenProps,
} from '@/components/common/TabsScreen/types';

export function TabsScreen({
  minHeaderHeight,
  renderHeader,
  tabsConfig,
  initialTabName,
}: TabsScreenProps) {
  const renderTab = ({renderContent, tabLabel}: TabsConfigItem) => (
    <Tabs.Tab name={tabLabel} key={tabLabel}>
      <Tabs.Lazy cancelLazyFadeIn>{renderContent()}</Tabs.Lazy>
    </Tabs.Tab>
  );

  return (
    <Tabs.Container
      lazy
      cancelLazyFadeIn
      initialTabName={initialTabName}
      headerContainerStyle={tabScreenStyles.headerContainer}
      containerStyle={tabScreenStyles.container}
      renderTabBar={props => (
        <TabBar
          {...props}
          scrollEnabled
          tabStyle={tabScreenStyles.tab}
          labelStyle={tabScreenStyles.label}
          activeColor="#323234"
          keepActiveTabCentered
          getLabelText={(text: string) => text}
        />
      )}
      renderHeader={renderHeader}
      minHeaderHeight={minHeaderHeight}>
      {tabsConfig.map(renderTab)}
    </Tabs.Container>
  );
}
