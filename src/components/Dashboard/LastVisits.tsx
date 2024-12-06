import {useNavigation} from '@react-navigation/native';
import {useGetLastActivity} from '@securecore-new-application/securecore-datacore';
import {
  LastActivities,
  LastActivity,
} from '@securecore-new-application/securecore-datacore/lib/queries/activity-event/getLastActivityResponse';
import {SectionsList} from 'components/common/SectionsList';
import {match} from 'path-to-regexp';
import React, {useCallback} from 'react';
import {View} from 'react-native';

import Icon from '@/components/common/Icon/Icon';
import {IconTypes} from '@/components/common/Icon/icons';
import {
  ListItem,
  ListItemContentTop,
  ListItemContentTopText,
  ListItemHeader,
  ListItemHeaderTitle,
  ListItemHeaderTitleText,
  ListItemIconArrow,
} from '@/components/common/List/styles';
import {DASHBOARD_STACK_SCREENS, ROUTES} from '@/constants/routes';
import {HomeScreenNavigationProp} from '@/navigation/types';

interface ParsedMatchData {
  propertyId?: number;
  buildingId?: number;
  tenantSpaceId?: number;
}

export const LastVisits = () => {
  const {data, loading, refetch} = useGetLastActivity({});
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const activities = (data?.getLastActivity as LastActivities) || {};
  const sections = [];

  if (activities.property?.length > 0) {
    sections.push({
      title: 'Properties',
      icon: 'houses',
      screen: DASHBOARD_STACK_SCREENS.DASHBOARD_PROPERTY_SCREEN,
      data: activities.property.slice(0, 5),
      sectionUrlPattern: '/company/properties/:propertyId',
    });
  }
  if (activities.building?.length > 0) {
    sections.push({
      title: 'Buildings',
      icon: 'apartment',
      screen: DASHBOARD_STACK_SCREENS.DASHBOARD_BUILDING_SCREEN,
      data: activities.building.slice(0, 5),
      sectionUrlPattern:
        '/company/properties/:propertyId/buildings/:buildingId',
    });
  }
  if ((activities.tenantSpace || []).length > 0) {
    sections.push({
      title: 'Tenant Spaces',
      icon: 'tenant',
      screen: DASHBOARD_STACK_SCREENS.DASHBOARD_TENANT_SPACE_SCREEN,
      data: activities.tenantSpace?.slice(0, 5) || [],
      sectionUrlPattern:
        '/company/properties/:propertyId/buildings/:buildingId/tenant-space/:tenantSpaceId',
    });
  }

  const onRefresh = useCallback(() => {
    refetch?.();
  }, [refetch]);

  return (
    <SectionsList<LastActivity>
      loading={loading}
      sections={sections}
      onRefresh={onRefresh}
      renderItem={({item, section}) => (
        <ListItem
          first={item.visitEntityId === section.data[0].visitEntityId}
          onPress={() => {
            const fn = match<ParsedMatchData>(section.sectionUrlPattern);

            const pathData = fn(item.sectionUrl);
            const {params} = pathData as unknown as Record<
              string,
              Record<string, number>
            >;

            navigation.navigate(ROUTES.DASHBOARD_STACK, {
              screen: section.screen,
              params: {
                id: +item.visitEntityId as number,
                propertyId: +params.propertyId as number,
                buildingId: +params.buildingId as number,
              },
            });
          }}
          last={
            item.visitEntityId ===
            section.data[section.data.length - 1].visitEntityId
          }>
          <View>
            <ListItemContentTop>
              <ListItemContentTopText>{item.name}</ListItemContentTopText>
            </ListItemContentTop>
          </View>
          <ListItemIconArrow>
            <Icon name={IconTypes.Forward} color="#8E8FA1" size={16} />
          </ListItemIconArrow>
        </ListItem>
      )}
      renderSectionHeader={({section}) => (
        <ListItemHeader>
          <ListItemHeaderTitle>
            <Icon name={section.icon} size={22} color="#8E8FA1" />
            <ListItemHeaderTitleText>{section.title}</ListItemHeaderTitleText>
          </ListItemHeaderTitle>
        </ListItemHeader>
      )}
      keyExtractor={item => `${item.visitEntityId}`}
    />
  );
};
