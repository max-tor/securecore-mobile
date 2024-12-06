import {useNavigation} from '@react-navigation/native';
import {useGetLastEditsInfo} from '@securecore-new-application/securecore-datacore';
import {
  HistoryItemChangeTypes,
  LastEditInfo,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {List} from 'components/common/List';
import React from 'react';
import {View} from 'react-native';

import Icon from '@/components/common/Icon/Icon';
import {IconTypes} from '@/components/common/Icon/icons';
import {
  ListItem,
  ListItemContentBottom,
  ListItemContentBottomDot,
  ListItemContentBottomText,
  ListItemContentTop,
  ListItemContentTopText,
  ListItemIconArrow,
} from '@/components/common/List/styles';
import {
  COMPANY_STACK_SCREENS,
  DASHBOARD_STACK_SCREENS,
} from '@/constants/routes';
import {TAB_NAMES} from '@/constants/tabs';
import {getDateTimeString} from '@/utils/dateTime';
import {toTitleCase} from '@/utils/toTitleCase';

interface NavigationParams {
  screen: string;
  params?: Record<string, unknown>;
}

const PARENT_SCREENS_MAPPING: Record<string, string> = {
  Company: COMPANY_STACK_SCREENS.COMPANY_SCREEN,
  Property: DASHBOARD_STACK_SCREENS.DASHBOARD_PROPERTY_SCREEN,
  Building: DASHBOARD_STACK_SCREENS.DASHBOARD_BUILDING_SCREEN,
  TenantSpace: DASHBOARD_STACK_SCREENS.DASHBOARD_TENANT_SPACE_SCREEN,
};

const CHILD_TAB_MATCHING: Record<string, string> = {
  Alarm: TAB_NAMES.ALARMS,
  Procedure: TAB_NAMES.PROCEDURES,
  Relocation: TAB_NAMES.RELOCATIONS,
  Evacuation: TAB_NAMES.EVACUATIONS,
  CommandCenter: TAB_NAMES.COMMAND_CENTERS,
  ShutOff: TAB_NAMES.SHUTOFFS,
  HazMat: TAB_NAMES.HAZ_MAT,
  Shelter: TAB_NAMES.SHELTER_IN_PLACE,
  TeamMember: TAB_NAMES.TEAM,
  MediaContact: TAB_NAMES.MEDIA,
  ContactItem: TAB_NAMES.CALL_LIST,
};

const getNavigationForItem = (item: LastEditInfo): NavigationParams => {
  const {entityType, parentEntityType, metadata} = item;

  let parentId;

  switch (parentEntityType) {
    case 'Property': {
      parentId = metadata?.parentFields?.propertyId;
      break;
    }
    case 'Building': {
      parentId = metadata?.parentFields?.buildingId;
      break;
    }
    case 'TenantSpace': {
      parentId = metadata?.parentFields?.tenantSpaceId;
      break;
    }
    default: {
      parentId = metadata?.parentFields?.propertyId;
    }
  }

  if (PARENT_SCREENS_MAPPING[entityType]) {
    return {
      screen: PARENT_SCREENS_MAPPING[entityType],
      params: {
        ...metadata?.parentFields,
        id: metadata?.parentFields?.entityId,
      },
    };
  }

  if (CHILD_TAB_MATCHING[entityType]) {
    return {
      screen: PARENT_SCREENS_MAPPING[parentEntityType],
      params: {
        ...metadata?.parentFields,
        id: parentId,
        initialTabName: CHILD_TAB_MATCHING[entityType],
      },
    };
  }

  let tabName = '';

  if (entityType === 'EmergencyResource') {
    tabName = TAB_NAMES.VENDOR_CONTACTS;
    if (
      metadata?.additionalInfo?.emergencyResourceType === 'communityResource'
    ) {
      tabName = TAB_NAMES.COMMUNITY_RESOURCES;
    }
  } else if (entityType === 'PolicyDetail') {
    tabName = TAB_NAMES.MASTER_POLICIES;

    if (metadata?.additionalInfo?.policyDetailType === 'insurance') {
      tabName = TAB_NAMES.INS_POLICIES;
    }
  }

  return {
    screen: PARENT_SCREENS_MAPPING[parentEntityType],
    params: {
      ...metadata?.parentFields,
      id: parentId,
      initialTabName: tabName,
    },
  };
};

export const getReadableEntityType = (
  entityType: string,
  changeType?: HistoryItemChangeTypes,
): string => {
  switch (entityType) {
    case 'ContactItem': {
      return 'Call List';
    }
    case 'User': {
      if (changeType === HistoryItemChangeTypes.INVITE_USER) {
        return 'Add to the Team';
      }

      if (changeType === HistoryItemChangeTypes.EDIT) {
        return 'Update Profile';
      }

      return 'Remove from the Team';
    }
    case 'HazMat': {
      return 'Hazardous Material';
    }
    case 'PolicyDetail': {
      return 'Insurance or Master Policy';
    }
    default: {
      return toTitleCase(entityType);
    }
  }
};

export const LastEdits = () => {
  const navigation = useNavigation();
  const {data, loading, refetch} = useGetLastEditsInfo({});
  const edits = (data?.getLastEditsInfo as LastEditInfo[]) || [];

  const renderItem = ({item, index}: {item: LastEditInfo; index?: number}) => (
    <ListItem
      first={index === 0}
      last={(index || 0) + 1 === data?.getLastEditsInfo.length}
      onPress={() => {
        const navParams = getNavigationForItem(item);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        navigation.navigate(navParams.screen, navParams.params);
      }}>
      <View>
        <ListItemContentTop>
          <ListItemContentTopText>{item.entityName}</ListItemContentTopText>
        </ListItemContentTop>
        <ListItemContentBottom>
          <ListItemContentBottomText>
            {getReadableEntityType(item.entityType as string, item.type)}
          </ListItemContentBottomText>
          <ListItemContentBottomDot />
          <ListItemContentBottomText>
            {item.parentEntityType}
          </ListItemContentBottomText>
          {item.createdAt && (
            <>
              <ListItemContentBottomDot />
              <ListItemContentBottomText>
                {getDateTimeString(item.createdAt)}
              </ListItemContentBottomText>
            </>
          )}
        </ListItemContentBottom>
      </View>
      <ListItemIconArrow>
        <Icon name={IconTypes.Forward} color="#8E8FA1" size={16} />
      </ListItemIconArrow>
    </ListItem>
  );

  return (
    <List<LastEditInfo>
      onRefresh={() => {
        refetch?.();
      }}
      data={edits}
      loading={loading}
      renderItem={renderItem}
      keyExtractor={item => `${item.entityId}`}
    />
  );
};
