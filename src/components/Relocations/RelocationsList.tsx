import {
  useDeleteRelocation,
  useGetRelocations,
} from '@securecore-new-application/securecore-datacore';
import {
  OrderBy,
  OrderByDirection,
  Relocation,
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
import {AddRelocationModal} from '@/components/Relocations/AddRelocationModal';
import {EditRelocationModal} from '@/components/Relocations/EditRelocationModal';
import {ViewRelocationModal} from '@/components/Relocations/ViewRelocationModal';
import {TAB_NAMES} from '@/constants/tabs';
import {UploadProgressContext} from '@/contexts/uploadProgress';
import {OnUpload, usePickImage} from '@/hooks/usePickImage';
import {ToastNotifications} from '@/notifications/toasts';
import {pluralize} from '@/utils/text';

interface RelocationsListProps {
  companyId?: number;
  propertyId: number;
  onUpload?: OnUpload;
}

export const RelocationsList: FC<RelocationsListProps> = ({
  companyId,
  propertyId,
  onUpload,
}) => {
  const isTabFocused = useIsTabFocused(TAB_NAMES.RELOCATIONS);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [relocationId, setRelocationId] = useState<number | null>(null);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [deleteRelocationMutation] = useDeleteRelocation();
  const toast = useToast();
  const {uploadProgress, setUploadProgress} = useContext(UploadProgressContext);
  const [sorting, setSorting] = useState<SortOptions>({
    orderBy: OrderBy.CREATED_AT,
    orderByDirection: OrderByDirection.ASC,
  });
  const {data, loading, refetch} = useGetRelocations({
    variables: {
      data: {
        propertyId,
        sorting,
      },
    },
  });

  const relocations = (data?.getRelocations.relocations as Relocation[]) || [];
  const permissions = data?.getRelocations.permissions;

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

  const deleteRelocation = useCallback(
    async (relId: number) => {
      try {
        await deleteRelocationMutation({
          variables: {id: relId},
        });
        toast.show({
          title: ToastNotifications.RelocationDeleted,
          placement: 'top',
        });
        refetch?.();
        setRelocationId(null);
      } catch (message) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [deleteRelocationMutation, refetch, toast],
  );

  const openEdit = (relId: number) => {
    setRelocationId(relId);
    setEditModal(true);
  };

  const openView = (id: number) => {
    setRelocationId(id);
    setOpenViewModal(true);
  };

  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const openDelete = useCallback(
    (relId: number) => {
      Alert.alert(
        'Delete Relocation',
        'Are you sure you want to delete this relocation?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteRelocation(relId)},
        ],
      );
    },
    [deleteRelocation],
  );
  const {getPickImageActionOption} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const getActionOptions = useCallback(
    (relId: number) => {
      const actions = [];

      actions.push(
        getPickImageActionOption(
          {
            companyId,
            propertyId,
            relocationId: relId,
          },
          onUpload,
        ),
      );

      if (permissions?.update) {
        actions.push({
          title: 'Edit',
          action: () => openEdit(relId),
        });
      }

      if (permissions?.delete) {
        actions.push({
          title: 'Delete',
          action: () => openDelete(relId),
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
      onUpload,
      openDelete,
      permissions?.delete,
      permissions?.update,
      propertyId,
    ],
  );

  const renderItem = ({item}: {item: Relocation; index?: number}) => {
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
        + Add Relocation
      </FloatingButton>
      <List<Relocation>
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderLeftText>
                {relocations?.length}{' '}
                {pluralize(relocations?.length, 'Relocation')}
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
        data={relocations}
        loading={loading}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
      />
      {addModal && (
        <AddRelocationModal
          closeModal={() => setAddModal(false)}
          propertyId={propertyId}
          onSuccess={onSuccess}
        />
      )}
      {openViewModal && (
        <ViewRelocationModal
          closeModal={() => setOpenViewModal(false)}
          relocationId={relocationId as number}
        />
      )}
      {editModal && (
        <EditRelocationModal
          closeModal={() => setEditModal(false)}
          relocationId={relocationId as number}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};
