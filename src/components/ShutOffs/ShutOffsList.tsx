import {
  useDeleteShutOff,
  useGetShutOffs,
} from '@securecore-new-application/securecore-datacore';
import {
  OrderBy,
  OrderByDirection,
  ShutOff,
  SortOptions,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {List, ListItemFileCount} from 'components/common/List';
import {Flex, useToast} from 'native-base';
import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {useIsTabFocused} from '@/components';
import {ActionSheet} from '@/components/ActionSheet';
import {IconTypes} from '@/components/common/Icon/icons';
import {
  ListHeader,
  ListHeaderLeft,
  ListHeaderLeftText,
  ListItemActionIcon,
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
import {AddShutOffModal} from '@/components/ShutOffs/AddShutOffModal';
import {EditShutOffModal} from '@/components/ShutOffs/EditShutOffModal';
import {ViewShutOffModal} from '@/components/ShutOffs/ViewShutOffModal';
import {TAB_NAMES} from '@/constants/tabs';
import {UploadProgressContext} from '@/contexts/uploadProgress';
import {OnUpload, usePickImage} from '@/hooks/usePickImage';
import {ToastNotifications} from '@/notifications/toasts';
import {pluralize} from '@/utils/text';

interface ShutOffsListProps {
  companyId?: number;
  propertyId: number;
  buildingId?: number;
  tenantSpaceId?: number;
  onUpload?: OnUpload;
}

export const ShutOffsList: FC<ShutOffsListProps> = ({
  companyId,
  propertyId,
  tenantSpaceId,
  buildingId,
  onUpload,
}) => {
  const [sorting, setSorting] = useState<SortOptions>({
    orderBy: OrderBy.CREATED_AT,
    orderByDirection: OrderByDirection.ASC,
  });

  const [deleteShutOffMutation] = useDeleteShutOff();

  const {data, loading, refetch} = useGetShutOffs({
    variables: {
      data: {
        tenantSpaceId,
        propertyId,
        buildingId,
        sorting,
      },
    },
  });

  const toast = useToast();
  const {uploadProgress, setUploadProgress} = useContext(UploadProgressContext);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [shutOffId, setShutOffId] = useState<number | null>(null);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);

  const isTabFocused = useIsTabFocused(TAB_NAMES.SHUTOFFS);

  const handleSort = useCallback((value: string) => {
    setSorting({
      orderBy: DefaultSortingValues[value].value,
      orderByDirection: DefaultSortingValues[value].direction,
    });
  }, []);

  useEffect(() => {
    if (isTabFocused) {
      refetch?.();
    }
  }, [isTabFocused, refetch]);

  const shutOffs = (data?.getShutOffs.shutOffs as ShutOff[]) || [];

  const deleteShutOff = useCallback(
    async (relId: number) => {
      try {
        await deleteShutOffMutation({
          variables: {id: relId},
        });
        toast.show({
          title: ToastNotifications.ShutOffDeleted,
          placement: 'top',
        });
        refetch?.();
        setShutOffId(null);
      } catch (message) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [deleteShutOffMutation, refetch, toast],
  );

  const openEdit = (relId: number) => {
    setShutOffId(relId);
    setEditModal(true);
  };

  const openView = (id: number) => {
    setShutOffId(id);
    setOpenViewModal(true);
  };

  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const openDelete = useCallback(
    (id: number) => {
      Alert.alert(
        'Delete Shut-off',
        'Are you sure you want to delete this Shut-off?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteShutOff(id)},
        ],
      );
    },
    [deleteShutOff],
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
          ...(tenantSpaceId && {tenantSpaceId}),
          shutOffId: id,
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
      companyId,
      getPickImageActionOption,
      onUpload,
      openDelete,
      propertyId,
      tenantSpaceId,
    ],
  );

  const renderItem = ({item}: {item: ShutOff; index?: number}) => {
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
            <ListItemContentTopText>{item.name}</ListItemContentTopText>
          </ListItemContentTop>
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
        + Add Shut-Off
      </FloatingButton>
      <List<ShutOff>
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderLeftText>
                {shutOffs?.length} {pluralize(shutOffs?.length, 'Shut-Off')}
              </ListHeaderLeftText>
            </ListHeaderLeft>
            <SortDropdown
              onChange={handleSort}
              sortingOptions={DefaultSortingOptions}
            />
          </ListHeader>
        )}
        type="narrow"
        onRefresh={() => {
          refetch?.();
        }}
        data={shutOffs}
        loading={loading}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
      />
      {addModal && (
        <AddShutOffModal
          closeModal={() => setAddModal(false)}
          propertyId={propertyId}
          buildingId={buildingId}
          tenantSpaceId={tenantSpaceId}
          onSuccess={onSuccess}
        />
      )}
      {openViewModal && (
        <ViewShutOffModal
          closeModal={() => setOpenViewModal(false)}
          shutOffId={shutOffId as number}
        />
      )}
      {editModal && (
        <EditShutOffModal
          closeModal={() => setEditModal(false)}
          shutOffId={shutOffId as number}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};
