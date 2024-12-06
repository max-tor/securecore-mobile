import {
  useDeleteAlarm,
  useGetAlarms,
} from '@securecore-new-application/securecore-datacore';
import {
  Alarm,
  OrderBy,
  OrderByDirection,
  SortOptions,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {List, ListItemFileCount} from 'components/common/List';
import {Flex, HStack, useToast} from 'native-base';
import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {useIsTabFocused} from '@/components';
import {ActionSheet} from '@/components/ActionSheet';
import {AddAlarmModal} from '@/components/Alarms/AddAlarmModal';
import {EditAlarmModal} from '@/components/Alarms/EditAlarmModal';
import {ViewAlarmModal} from '@/components/Alarms/ViewAlarmModal';
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
import {
  DefaultSortingOptions,
  DefaultSortingValues,
  SortDropdown,
} from '@/components/common/SortDropdown';
import {FloatingButton} from '@/components/Company/styles';
import {TAB_NAMES} from '@/constants/tabs';
import {UploadProgressContext} from '@/contexts/uploadProgress';
import {OnUpload, usePickImage} from '@/hooks/usePickImage';
import {ToastNotifications} from '@/notifications/toasts';

interface AlarmsListProps {
  companyId?: number;
  propertyId: number;
  buildingId?: number;
  tenantSpaceId?: number;
  onUpload?: OnUpload;
}

export const AlarmsList: FC<AlarmsListProps> = ({
  companyId,
  propertyId,
  buildingId,
  tenantSpaceId,
  onUpload,
}) => {
  const [sorting, setSorting] = useState<SortOptions>({
    orderBy: OrderBy.CREATED_AT,
    orderByDirection: OrderByDirection.ASC,
  });

  const {data, loading, refetch} = useGetAlarms({
    variables: {
      data: {
        propertyId,
        buildingId,
        tenantSpaceId,
        sorting,
      },
    },
  });
  const [deleteAlarmMutation] = useDeleteAlarm();
  const toast = useToast();
  const {uploadProgress, setUploadProgress} = useContext(UploadProgressContext);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [alarmId, setAlarmId] = useState<number | null>(null);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);

  const alarms = (data?.getAlarms?.alarms as Alarm[]) || [];
  const isTabFocused = useIsTabFocused(TAB_NAMES.ALARMS);

  useEffect(() => {
    if (isTabFocused) {
      refetch?.();
    }
  }, [isTabFocused, refetch]);

  const handleSort = useCallback((value: string) => {
    setSorting({
      orderBy: DefaultSortingValues[value].value,
      orderByDirection: DefaultSortingValues[value].direction,
    });
  }, []);

  const openView = (id: number) => {
    setAlarmId(id);
    setOpenViewModal(true);
  };

  const openEdit = (id: number) => {
    setAlarmId(id);
    setEditModal(true);
  };

  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const deleteAlarm = useCallback(
    async (id: number) => {
      try {
        await deleteAlarmMutation({
          variables: {alarmId: id},
        });
        toast.show({
          title: ToastNotifications.AlarmDeleted,
          placement: 'top',
        });
        refetch?.();
        setAlarmId(null);
      } catch (message) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [deleteAlarmMutation, refetch, toast],
  );

  const openDelete = useCallback(
    (id: number) => {
      Alert.alert(
        'Delete Alarm',
        'Are you sure you want to delete this alarm?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteAlarm(id)},
        ],
      );
    },
    [deleteAlarm],
  );

  const {getPickImageActionOption} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const getActionOptions = useCallback(
    (id: number) => [
      getPickImageActionOption(
        {
          companyId,
          propertyId,
          ...(buildingId && {buildingId}),
          ...(tenantSpaceId && {tenantSpaceId}),
          alarmId: id,
        },
        onUpload,
      ),
      {
        title: 'Edit',
        action: () => openEdit(id),
      },
      {
        title: 'Delete',
        action: () => openDelete(id),
      },
      {
        title: 'Cancel',
      },
    ],
    [
      buildingId,
      companyId,
      getPickImageActionOption,
      onUpload,
      openDelete,
      propertyId,
      tenantSpaceId,
    ],
  );

  const renderItem = ({item}: {item: Alarm; index?: number}) => {
    const actions = getActionOptions(item.id);
    const destructiveButtonIndex = actions.findIndex(
      ({title}) => title === 'Delete',
    );
    const cancelButtonIndex = actions.findIndex(
      ({title}) => title === 'Cancel',
    );

    return (
      <ListItemNarrow onPress={() => openView(item.id)}>
        <Flex flexShrink={1} flexGrow={1}>
          <ListItemContentTop>
            <HStack space={2} justifyContent="center" justifyItems="center">
              <ListItemContentTopText style={{width: 'auto'}}>
                {item.name}
              </ListItemContentTopText>
            </HStack>
          </ListItemContentTop>
          <ListItemContentBottomText numberOfLines={1}>
            {item.type}
          </ListItemContentBottomText>
        </Flex>
        <ListItemFileCount count={item.fileCount} />
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
      </ListItemNarrow>
    );
  };

  return (
    <>
      <FloatingButton onPress={() => setAddModal(true)}>
        + Add Alarm
      </FloatingButton>
      <List<Alarm>
        type="narrow"
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderLeftText>
                {alarms?.length} Alarm
                {alarms?.length > 1 ? 's' : ''}
              </ListHeaderLeftText>
            </ListHeaderLeft>
            <SortDropdown
              onChange={handleSort}
              sortingOptions={DefaultSortingOptions}
            />
          </ListHeader>
        )}
        onRefresh={() => {
          refetch?.();
        }}
        data={alarms}
        loading={loading}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
      />
      {openViewModal && (
        <ViewAlarmModal
          closeModal={() => setOpenViewModal(false)}
          alarmId={alarmId as number}
        />
      )}
      {editModal && (
        <EditAlarmModal
          closeModal={() => setEditModal(false)}
          alarmId={alarmId as number}
          onSuccess={onSuccess}
        />
      )}
      {addModal && (
        <AddAlarmModal
          propertyId={propertyId}
          buildingId={buildingId as number}
          tenantSpaceId={tenantSpaceId as number}
          closeModal={() => setAddModal(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};
