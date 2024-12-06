import {TabsConfigItem, TabsScreen} from 'components/common/TabsScreen';
import React from 'react';

import {Header} from '@/components/Dashboard/Header';
import {LastEdits} from '@/components/Dashboard/LastEdits';
import {LastVisits} from '@/components/Dashboard/LastVisits';
import {MainLayout} from '@/layouts';

export const Dashboard = () => {
  const tabsConfig: TabsConfigItem[] = [
    {
      key: 'lastVisits',
      tabLabel: 'Last Visits',
      renderContent: () => <LastVisits />,
    },
    {
      key: 'lastEdits',
      tabLabel: 'Last Edits',
      renderContent: () => <LastEdits />,
    },
  ];

  return (
    <MainLayout title="Dashboard">
      <TabsScreen
        minHeaderHeight={40}
        renderHeader={() => <Header />}
        tabsConfig={tabsConfig}
      />
    </MainLayout>
  );
};
