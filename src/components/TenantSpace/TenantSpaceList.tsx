import {useNavigation} from '@react-navigation/native';
import {
  useGetTenantSpacesByBuildingId,
  useRemoveTenantSpace,
} from '@securecore-new-application/securecore-datacore';
import {TenantSpace} from '@securecore-new-application/securecore-datacore/lib/types';
import {List, ListItemFileCount} from 'components/common/List';
import {Flex, useToast} from 'native-base';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Alert, View} from 'react-native';

import {useIsTabFocused} from '@/components';
import {IconTypes, propertyIcon} from '@/components/common/Icon/icons';
import {
  ListItem,
  ListItemActionIcon,
  ListItemAvatar,
  ListItemContentBottom,
  ListItemContentBottomText,
  ListItemContentTop,
  ListItemContentTopText,
  ListItemIconArrow,
} from '@/components/common/List/styles';
import {PER_PAGE} from '@/constants';
import {ROUTES} from '@/constants/routes';
import {TAB_NAMES} from '@/constants/tabs';
import {UploadProgressContext} from '@/contexts/uploadProgress';
import {OnUpload, usePickImage} from '@/hooks/usePickImage';
import {HomeScreenNavigationProp} from '@/navigation/types';
import {ToastNotifications} from '@/notifications/toasts';
import {getDateTimeString} from '@/utils/dateTime';

import {ActionSheet} from '../ActionSheet';
import {FloatingButton} from '../Company/styles';
import {AddTenantSpaceModal} from './AddTenantSpaceModal';
import {EditTenantSpaceModal} from './EditTenantSpaceModal';

interface Props {
  buildingId: number;
  propertyId: number;
  companyId: number;
  onUpload?: OnUpload;
}

export const TenantSpaceList: FC<Props> = ({
  buildingId,
  propertyId,
  companyId,
  onUpload,
}) => {
  const [tenantSpaceId, setTenantSpaceId] = useState<number | null>();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const currentPage = useRef(0);
  const {data, loading, fetchMore, refetch} = useGetTenantSpacesByBuildingId({
    variables: {buildingId, pagination: {limit: PER_PAGE, offset: 0}},
  });
  const goTo = (itemId: number) => {
    navigation.navigate(ROUTES.COMPANY_STACK, {
      screen: 'TenantSpaceScreen',
      params: {id: itemId, buildingId, propertyId, companyId},
    });
  };

  const toast = useToast();
  const {uploadProgress, setUploadProgress} = useContext(UploadProgressContext);
  const tenantSpaces =
    (data?.getTenantSpacesByBuildingId.list as TenantSpace[]) || [];
  const permissions = data?.getTenantSpacesByBuildingId.permissions;

  const onRefresh = useCallback(() => {
    currentPage.current = 0;
    refetch?.({buildingId, pagination: {limit: PER_PAGE, offset: 0}});
  }, [buildingId, refetch]);

  const isTabFocused = useIsTabFocused(TAB_NAMES.PROCEDURES);

  useEffect(() => {
    if (isTabFocused) {
      onRefresh();
    }
  }, [isTabFocused, onRefresh]);

  const fetchMoreItems = useCallback(() => {
    if (tenantSpaces?.length === data?.getTenantSpacesByBuildingId.count) {
      return;
    }

    currentPage.current += 1;

    fetchMore?.({
      variables: {
        buildingId,
        pagination: {
          limit: currentPage.current * PER_PAGE,
          offset: 0,
        },
      },
      updateQuery: (previousResult, {fetchMoreResult}) => {
        const newEntries = fetchMoreResult.getTenantSpacesByBuildingId.list;

        return {
          getTenantSpacesByBuildingId: {
            list: newEntries,
            count: fetchMoreResult.getTenantSpacesByBuildingId.count,
            permissions:
              fetchMoreResult.getTenantSpacesByBuildingId.permissions,
          },
        };
      },
    });
  }, [
    buildingId,
    data?.getTenantSpacesByBuildingId.count,
    fetchMore,
    tenantSpaces?.length,
  ]);

  const [removeTenantSpace] = useRemoveTenantSpace();
  const deleteTenantSpace = useCallback(
    async (tsId: number) => {
      try {
        await removeTenantSpace({
          variables: {id: tsId},
        });
        toast.show({
          title: ToastNotifications.BuildingDeleted,
          placement: 'top',
        });
        onRefresh();
        setTenantSpaceId(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [onRefresh, removeTenantSpace, toast],
  );
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const openEdit = (tsId: number) => {
    setTenantSpaceId(tsId);
    setEditModal(true);
  };

  const openDelete = useCallback(
    (tsId: number) => {
      Alert.alert(
        'Delete Tenant Space',
        'Are you sure you want to delete this tenant space?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteTenantSpace(tsId)},
        ],
      );
    },
    [deleteTenantSpace],
  );

  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const {getPickImageActionOption} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const getActionOptions = useCallback(
    (tsId: number) => {
      const actions = [];

      actions.push(
        getPickImageActionOption(
          {
            companyId,
            propertyId,
            buildingId,
            tenantSpaceId: tsId,
          },
          onUpload,
        ),
      );

      if (permissions?.update) {
        actions.push({
          title: 'Edit',
          action: () => openEdit(tsId),
        });
      }

      if (permissions?.delete) {
        actions.push({
          title: 'Delete',
          action: () => openDelete(tsId),
        });
      }

      if (actions.length) {
        actions.push({
          title: 'Cancel',
        });
      }

      return actions;
    },
    [
      buildingId,
      companyId,
      getPickImageActionOption,
      onUpload,
      openDelete,
      permissions?.delete,
      permissions?.update,
      propertyId,
    ],
  );

  const canEditOrDelete = permissions?.update || permissions?.delete;

  const renderItem = ({item, index}: {item: TenantSpace; index?: number}) => {
    const actions = getActionOptions(item.id);
    const destructiveButtonIndex = actions.findIndex(
      ({title}) => title === 'Delete',
    );
    const cancelButtonIndex = actions.findIndex(
      ({title}) => title === 'Cancel',
    );

    return (
      <ListItem
        first={index === 0}
        last={(index || 0) + 1 === tenantSpaces?.length}
        onPress={() => goTo(item.id)}>
        <ListItemAvatar
          resizeMode="cover"
          source={{uri: item.image || propertyIcon}}
        />
        <Flex flexShrink={1} flexGrow={1}>
          <View>
            <ListItemContentTop>
              <ListItemContentTopText>{item.name}</ListItemContentTopText>
            </ListItemContentTop>
            <ListItemContentBottom>
              {!!item.createdAt && (
                <ListItemContentBottomText>
                  {getDateTimeString(item.createdAt)}
                </ListItemContentBottomText>
              )}
            </ListItemContentBottom>
          </View>
        </Flex>
        <ListItemFileCount count={item.fileCount} />
        {canEditOrDelete && (
          <ListItemIconArrow>
            <ActionSheet
              options={actions}
              destructiveButtonIndex={destructiveButtonIndex}
              cancelButtonIndex={cancelButtonIndex}>
              <ListItemActionIcon
                name={IconTypes.Dots}
                color="#8E8FA1"
                size={16}
              />
            </ActionSheet>
          </ListItemIconArrow>
        )}
      </ListItem>
    );
  };

  return (
    <>
      {permissions?.create && (
        <FloatingButton onPress={() => setAddModal(true)}>
          + Add Tenant Space
        </FloatingButton>
      )}
      <List<TenantSpace>
        onRefresh={() => {
          refetch?.();
        }}
        data={tenantSpaces}
        loading={loading}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
        onEndReached={fetchMoreItems}
      />
      {editModal && (
        <EditTenantSpaceModal
          closeModal={() => setEditModal(false)}
          tenantSpaceId={tenantSpaceId as number}
        />
      )}
      {addModal && (
        <AddTenantSpaceModal
          closeModal={() => setAddModal(false)}
          buildingId={buildingId}
        />
      )}
    </>
  );
};
