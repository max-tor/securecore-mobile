import {
  useGetEmergencyResources,
  useRemoveEmergencyResource,
} from '@securecore-new-application/securecore-datacore';
import {
  EmergencyResource,
  EmergencyResources,
  IndustryTypes,
  OrderBy,
  OrderByDirection,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {List} from 'components/common/List';
import {Flex, HStack, useToast} from 'native-base';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Alert} from 'react-native';

import {useIsTabFocused} from '@/components';
import {ActionSheet} from '@/components/ActionSheet';
import Icon from '@/components/common/Icon/Icon';
import {IconTypes} from '@/components/common/Icon/icons';
import {
  ListHeader,
  ListHeaderLeft,
  ListHeaderLeftText,
  ListItemActionIcon,
  ListItemContentBottomText,
  ListItemContentTop,
  ListItemContentTopText,
  ListItemIconArrow,
  ListItemNarrow,
} from '@/components/common/List/styles';
import {FloatingButton} from '@/components/Company/styles';
import {PER_PAGE} from '@/constants';
import {TAB_NAMES} from '@/constants/tabs';
import {ToastNotifications} from '@/notifications/toasts';
import {pluralize} from '@/utils/text';

import {
  DefaultSortingOptions,
  DefaultSortingValues,
  SortDropdown,
} from '../common/SortDropdown';
import {AddCommunityResourceModal} from './AddCommunityResourceModal';
import {EditCommunityResourceModal} from './EditCommunityResourceModal';
import {ViewCommunityResourceModal} from './ViewCommunityResourceModal';

interface VendorListProps {
  companyId?: number;
  propertyId?: number;
  type: EmergencyResources;
  global: boolean;
  industryType: IndustryTypes;
}

export const CommunityResourcesList: FC<VendorListProps> = ({
  type,
  global,
  companyId,
  propertyId,
  industryType,
}) => {
  const [communityResourceId, setCommunityResourceId] = useState<
    number | null
  >();
  const [emergencyResourceView, setEmergencyResourceView] =
    useState<boolean>(false);
  const toast = useToast();
  const currentPage = useRef(0);
  const [searchParams, setSearchParams] = useState({
    orderBy: OrderBy.CREATED_AT,
    orderByDirection: OrderByDirection.DESC,
  });
  const needPagination = global || type === EmergencyResources.VENDOR;
  const {data, loading, fetchMore, refetch} = useGetEmergencyResources({
    variables: {
      data: {
        type,
        propertyId,
        companyId,
        global,
        pagination: {
          orderBy: searchParams.orderBy,
          orderByDirection: searchParams.orderByDirection,
          ...(needPagination ? {limit: PER_PAGE, offset: 0} : {}),
        },
      },
    },
  });
  const handleSort = useCallback((value: string) => {
    currentPage.current = 0;
    setSearchParams({
      orderBy: DefaultSortingValues[value].value,
      orderByDirection: DefaultSortingValues[value].direction,
    });
  }, []);

  const title = useMemo(
    () =>
      type === EmergencyResources.COMMUNITY_RESOURCE
        ? 'Community Resource'
        : 'Vendor Contact',
    [type],
  );

  const permissions = data?.getEmergencyResources.permissions;

  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const isTabFocused = useIsTabFocused(
    type ? TAB_NAMES.COMMUNITY_RESOURCES : TAB_NAMES.VENDOR_CONTACTS,
  );

  const onRefresh = useCallback(() => {
    currentPage.current = 0;
    refetch?.({
      data: {
        type,
        propertyId,
        companyId,
        global,
        pagination: {
          orderBy: searchParams.orderBy,
          orderByDirection: searchParams.orderByDirection,
          ...(needPagination ? {limit: PER_PAGE, offset: 0} : {}),
        },
      },
    });
  }, [
    companyId,
    global,
    needPagination,
    propertyId,
    refetch,
    searchParams.orderBy,
    searchParams.orderByDirection,
    type,
  ]);

  useEffect(() => {
    if (isTabFocused) {
      onRefresh();
    }
  }, [isTabFocused, onRefresh]);

  const emergencyResources =
    (data?.getEmergencyResources.list as EmergencyResource[]) || [];

  const fetchMoreItems = useCallback(() => {
    if (
      emergencyResources.length === data?.getEmergencyResources.count ||
      !needPagination
    ) {
      return;
    }

    currentPage.current += 1;

    fetchMore?.({
      variables: {
        data: {
          type,
          propertyId,
          companyId,
          global,
          pagination: {
            orderBy: searchParams.orderBy,
            orderByDirection: searchParams.orderByDirection,
            limit: PER_PAGE,
            offset: currentPage.current * PER_PAGE,
          },
        },
      },
      updateQuery: (previousResult, {fetchMoreResult}) => {
        const newEntries = fetchMoreResult.getEmergencyResources.list;

        return {
          getEmergencyResources: {
            list: [...previousResult.getEmergencyResources.list, ...newEntries],
            count: fetchMoreResult.getEmergencyResources.count,
            permissions: fetchMoreResult.getEmergencyResources.permissions,
          },
        };
      },
    });
  }, [
    companyId,
    needPagination,
    data?.getEmergencyResources.count,
    emergencyResources.length,
    fetchMore,
    global,
    propertyId,
    searchParams.orderBy,
    searchParams.orderByDirection,
    type,
  ]);

  const [removeEmergencyResource] = useRemoveEmergencyResource();
  const deleteCommunityResource = useCallback(
    async (emergencyResourceId: number) => {
      try {
        await removeEmergencyResource({
          variables: {emergencyResourceId},
        });
        toast.show({
          title:
            type === EmergencyResources.COMMUNITY_RESOURCE
              ? ToastNotifications.CommunityResourceDeleted
              : ToastNotifications.VendorDeleted,
          placement: 'top',
        });
        refetch?.();
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [refetch, removeEmergencyResource, toast, type],
  );

  const canEditOrDelete = permissions?.update || permissions?.delete;

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const openEdit = (emergencyResourceId: number) => {
    setCommunityResourceId(emergencyResourceId);
    setEditModal(true);
  };

  const openDelete = useCallback(
    (emergencyResourceId: number) => {
      Alert.alert(
        `Delete ${title}`,
        `Are you sure you want to delete this ${title}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => deleteCommunityResource(emergencyResourceId),
          },
        ],
      );
    },
    [deleteCommunityResource, title],
  );

  const getActionOptions = useCallback(
    (emergencyResourceId: number, isGlobal: boolean) => {
      const actions = [];

      if (!isGlobal && permissions?.update) {
        actions.push({
          title: 'Edit',
          action: () => openEdit(emergencyResourceId),
        });
      }

      if (!isGlobal && permissions?.delete) {
        actions.push({
          title: 'Delete',
          action: () => openDelete(emergencyResourceId),
        });
      }

      if (actions.length) {
        actions.push({
          title: 'Cancel',
        });
      }

      return actions;
    },
    [openDelete, permissions?.delete, permissions?.update],
  );

  const openEmergencyResourceView = (emergencyResourceId: number) => {
    setCommunityResourceId(emergencyResourceId);
    setEmergencyResourceView(true);
  };

  const renderItem = ({item}: {item: EmergencyResource; index?: number}) => {
    const isGlobal = item.global;

    return (
      <ListItemNarrow onPress={() => openEmergencyResourceView(item.id)}>
        <Flex flexShrink={1} flexGrow={1}>
          <ListItemContentTop>
            <HStack space={2} justifyContent="center" justifyItems="center">
              <ListItemContentTopText style={{width: 'auto'}}>
                {item.name}
              </ListItemContentTopText>
              {isGlobal && <Icon name={IconTypes.Global} color="#8E8FA1" />}
            </HStack>
          </ListItemContentTop>
          <ListItemContentBottomText numberOfLines={1}>
            {item.industries?.map(industry => industry?.name).join(' \u2022 ')}
          </ListItemContentBottomText>
        </Flex>
        {!isGlobal && canEditOrDelete && (
          <ListItemIconArrow>
            <ActionSheet
              options={getActionOptions(item.id, isGlobal)}
              destructiveButtonIndex={1}
              cancelButtonIndex={2}>
              <ListItemActionIcon
                name={IconTypes.Dots}
                color="#8E8FA1"
                size={16}
              />
            </ActionSheet>
          </ListItemIconArrow>
        )}
      </ListItemNarrow>
    );
  };
  const buttonText = `+ Add ${title}`;

  return (
    <>
      <FloatingButton onPress={() => setAddModal(true)}>
        {buttonText}
      </FloatingButton>
      <List<EmergencyResource>
        data={emergencyResources}
        onRefresh={onRefresh}
        type="narrow"
        loading={loading}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderLeftText>
                {emergencyResources?.length}{' '}
                {pluralize(emergencyResources?.length, 'Emergency Resource')}
              </ListHeaderLeftText>
            </ListHeaderLeft>
            <SortDropdown
              onChange={handleSort}
              sortingOptions={DefaultSortingOptions}
            />
          </ListHeader>
        )}
        onEndReached={fetchMoreItems}
      />
      {addModal && (
        <AddCommunityResourceModal
          closeModal={() => setAddModal(false)}
          propertyId={propertyId as number}
          onSuccess={onSuccess}
          global={global}
          type={type}
          title={title}
          industryType={industryType}
        />
      )}
      {editModal && (
        <EditCommunityResourceModal
          closeModal={() => setEditModal(false)}
          communityResourceId={communityResourceId as number}
          onSuccess={onSuccess}
          title={title}
          type={type}
          industryType={industryType}
        />
      )}
      {emergencyResourceView && (
        <ViewCommunityResourceModal
          closeModal={() => setEmergencyResourceView(false)}
          communityResourceId={communityResourceId as number}
        />
      )}
    </>
  );
};
