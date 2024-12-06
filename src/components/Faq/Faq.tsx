import {View} from 'native-base';
import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';

import {Header} from '@/components/Faq/Header';
import {TAB_NAMES} from '@/constants/tabs';
import {MainLayout} from '@/layouts';

import {tabScreenStyles} from '../common/TabsScreen/TabBar/styles';
import {FaqList} from './FaqList';

export const Faq = () => (
  <MainLayout title="Secure Guides">
    <Tabs.Container
      lazy
      cancelLazyFadeIn
      headerContainerStyle={tabScreenStyles.headerContainer}
      containerStyle={tabScreenStyles.container}
      renderHeader={() => <Header />}
      minHeaderHeight={40}
      renderTabBar={() => <View style={{paddingTop: 20}} />}>
      <Tabs.Tab name={TAB_NAMES.FAQ}>
        <Tabs.Lazy cancelLazyFadeIn>
          <FaqList />
        </Tabs.Lazy>
      </Tabs.Tab>
    </Tabs.Container>
  </MainLayout>
);
