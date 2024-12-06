import {useNavigation} from '@react-navigation/native';
import {
  useGetBuildingsByPropertyId,
  useRemoveBuilding,
} from '@securecore-new-application/securecore-datacore';
import {Building} from '@securecore-new-application/securecore-datacore/lib/types';
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
import {AddBuildingModal} from './AddBuildingModal';
import {EditBuildingModal} from './EditBuildingModal';

interface Props {
  companyId?: number;
  id: number;
  onUpload?: OnUpload;
}

export const BuildingsList: FC<Props> = ({companyId, id, onUpload}) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [buildingId, setBuildingId] = useState<number | null>();
  const {data, loading, refetch, fetchMore} = useGetBuildingsByPropertyId({
    variables: {
      propertyId: id,
      pagination: {
        limit: PER_PAGE,
        offset: 0,
      },
    },
  });
  const goTo = (itemId: number) => {
    navigation.navigate(ROUTES.COMPANY_STACK, {
      screen: 'BuildingScreen',
      params: {propertyId: id, id: itemId},
    });
  };
  const toast = useToast();
  const {uploadProgress, setUploadProgress} = useContext(UploadProgressContext);
  const buildings = (data?.getBuildingsByPropertyId.list as Building[]) || [];
  const permissions = data?.getBuildingsByPropertyId.permissions;
  const currentPage = useRef(0);

  const [removeBuilding] = useRemoveBuilding();
  const deleteBuilding = useCallback(
    async (buildId: number) => {
      try {
        await removeBuilding({
          variables: {id: buildId},
        });
        toast.show({
          title: ToastNotifications.BuildingDeleted,
          placement: 'top',
        });
        currentPage.current = 0;
        refetch?.({
          pagination: {
            offset: 0,
            limit: PER_PAGE,
          },
          propertyId: id,
        });
        setBuildingId(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [id, refetch, removeBuilding, toast],
  );
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const openEdit = (buildId: number) => {
    setBuildingId(buildId);
    setEditModal(true);
  };

  const openDelete = useCallback(
    (buildId: number) => {
      Alert.alert(
        'Delete Building',
        'Are you sure you want to delete this building?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteBuilding(buildId)},
        ],
      );
    },
    [deleteBuilding],
  );

  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const {getPickImageActionOption} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const getActionOptions = useCallback(
    (buildId: number) => {
      const actions = [];

      actions.push(
        getPickImageActionOption(
          {
            companyId,
            propertyId: id,
            buildingId: buildId,
          },
          onUpload,
        ),
      );

      if (permissions?.update) {
        actions.push({
          title: 'Edit',
          action: () => openEdit(buildId),
        });
      }

      if (permissions?.delete) {
        actions.push({
          title: 'Delete',
          action: () => openDelete(buildId),
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
      companyId,
      getPickImageActionOption,
      id,
      onUpload,
      openDelete,
      permissions?.delete,
      permissions?.update,
    ],
  );

  const canEditOrDelete = permissions?.update || permissions?.delete;

  const isTabFocused = useIsTabFocused(TAB_NAMES.BUILDINGS);
  const onRefresh = useCallback(() => {
    currentPage.current = 0;
    refetch?.();
  }, [refetch]);

  useEffect(() => {
    if (isTabFocused) {
      onRefresh();
    }
  }, [isTabFocused, onRefresh]);
  const fetchMoreItems = useCallback(() => {
    if (buildings?.length === data?.getBuildingsByPropertyId.count) {
      return;
    }

    currentPage.current += 1;

    fetchMore?.({
      variables: {
        propertyId: id,
        pagination: {
          limit: PER_PAGE,
          offset: currentPage.current * PER_PAGE,
        },
      },
      updateQuery: (previousResult, {fetchMoreResult}) => {
        const newEntries = fetchMoreResult.getBuildingsByPropertyId.list;

        return {
          getBuildingsByPropertyId: {
            list: [
              ...previousResult.getBuildingsByPropertyId.list,
              ...newEntries,
            ],
            count: fetchMoreResult.getBuildingsByPropertyId.count,
            permissions: fetchMoreResult.getBuildingsByPropertyId.permissions,
          },
        };
      },
    });
  }, [buildings?.length, data?.getBuildingsByPropertyId.count, fetchMore, id]);

  const renderItem = ({item, index}: {item: Building; index?: number}) => {
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
        last={(index || 0) + 1 === buildings?.length}
        onPress={() => goTo(item.id)}>
        <ListItemAvatar
          resizeMode="cover"
          source={{uri: item.image ? item.image : propertyIcon}}
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
          + Add Building
        </FloatingButton>
      )}
      <List<Building>
        onRefresh={onRefresh}
        data={buildings}
        loading={loading}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
        onEndReached={fetchMoreItems}
      />
      {editModal && (
        <EditBuildingModal
          closeModal={() => setEditModal(false)}
          buildingId={buildingId as number}
        />
      )}
      {addModal && (
        <AddBuildingModal
          closeModal={() => setAddModal(false)}
          propertyId={id}
        />
      )}
    </>
  );
};
