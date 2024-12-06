import {
  useDeleteEvacuation,
  useGetEvacuations,
} from '@securecore-new-application/securecore-datacore';
import {
  Evacuation,
  OrderBy,
  OrderByDirection,
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
import {EditEvacuationModal} from '@/components/Evacuation/EditEvacuationModal';
import {TAB_NAMES} from '@/constants/tabs';
import {UploadProgressContext} from '@/contexts/uploadProgress';
import {OnUpload, usePickImage} from '@/hooks/usePickImage';
import {ToastNotifications} from '@/notifications/toasts';

import {AddEvacuationModal} from './AddEvacuationModal';
import {ViewEvacuationModal} from './ViewEvacuationModal';

interface EvacuationListListProps {
  companyId?: number;
  propertyId?: number;
  buildingId?: number;
  onUpload?: OnUpload;
}

export const EvacuationList: FC<EvacuationListListProps> = ({
  companyId,
  propertyId,
  buildingId,
  onUpload,
}) => {
  const isTabFocused = useIsTabFocused(TAB_NAMES.EVACUATIONS);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [evacuationId, setEvacuationId] = useState<number | null>(null);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [deleteEvacuationMutation] = useDeleteEvacuation();
  const toast = useToast();
  const {uploadProgress, setUploadProgress} = useContext(UploadProgressContext);
  const [sorting, setSorting] = useState<SortOptions>({
    orderBy: OrderBy.CREATED_AT,
    orderByDirection: OrderByDirection.ASC,
  });
  const {data, loading, refetch} = useGetEvacuations({
    variables: {
      data: {
        propertyId,
        buildingId,
        sorting,
      },
    },
  });

  useEffect(() => {
    if (isTabFocused) {
      refetch?.();
    }
  }, [isTabFocused, refetch]);

  const evacuations = (data?.getEvacuations.evacuations as Evacuation[]) || [];
  const permissions = data?.getEvacuations.permissions;

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

  const deleteEvacuation = useCallback(
    async (relId: number) => {
      try {
        await deleteEvacuationMutation({
          variables: {id: relId},
        });
        toast.show({
          title: ToastNotifications.EvacuationDeleted,
          placement: 'top',
        });
        refetch?.();
        setEvacuationId(null);
      } catch (message) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [deleteEvacuationMutation, refetch, toast],
  );

  const openEdit = (relId: number) => {
    setEvacuationId(relId);
    setEditModal(true);
  };

  const openView = (id: number) => {
    setEvacuationId(id);
    setOpenViewModal(true);
  };

  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const openDelete = useCallback(
    (relId: number) => {
      Alert.alert(
        'Delete Evacuation',
        'Are you sure you want to delete this evacuation?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteEvacuation(relId)},
        ],
      );
    },
    [deleteEvacuation],
  );

  const {getPickImageActionOption} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const getActionOptions = useCallback(
    (evId: number) => {
      const actions = [];

      actions.push(
        getPickImageActionOption(
          {
            companyId,
            propertyId,
            ...(buildingId && {buildingId}),
            evacuationId: evId,
          },
          onUpload,
        ),
      );

      if (permissions?.update) {
        actions.push({
          title: 'Edit',
          action: () => openEdit(evId),
        });
      }

      if (permissions?.delete) {
        actions.push({
          title: 'Delete',
          action: () => openDelete(evId),
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

  const renderItem = ({item}: {item: Evacuation; index?: number}) => {
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
        + Add Evacuation
      </FloatingButton>
      <List<Evacuation>
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderLeftText>
                {evacuations?.length} Evacuation
                {evacuations?.length > 1 ? 's' : ''}
              </ListHeaderLeftText>
            </ListHeaderLeft>
            <SortDropdown
              onChange={handleSort}
              sortingOptions={DefaultSortingOptions}
            />
          </ListHeader>
        )}
        type="narrow"
        onRefresh={() => refetch?.()}
        data={evacuations}
        loading={loading}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
      />
      {addModal && (
        <AddEvacuationModal
          closeModal={() => setAddModal(false)}
          propertyId={propertyId as number}
          buildingId={buildingId as number}
          onSuccess={onSuccess}
        />
      )}
      {openViewModal && (
        <ViewEvacuationModal
          closeModal={() => setOpenViewModal(false)}
          evacuationId={evacuationId as number}
        />
      )}
      {editModal && (
        <EditEvacuationModal
          closeModal={() => setEditModal(false)}
          evacuationId={evacuationId as number}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};
