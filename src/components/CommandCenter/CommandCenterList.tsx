import {
  useDeleteCommandCenter,
  useGetCommandCenters,
} from '@securecore-new-application/securecore-datacore';
import {
  CommandCenter,
  OrderBy,
  OrderByDirection,
  SortOptions,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {Flex, useToast} from 'native-base';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {useIsTabFocused} from '@/components';
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
import {TAB_NAMES} from '@/constants/tabs';
import {UploadProgressContext} from '@/contexts/uploadProgress';
import {OnUpload, usePickImage} from '@/hooks/usePickImage';
import {ToastNotifications} from '@/notifications/toasts';
import {pluralize} from '@/utils/text';

import {ActionSheet} from '../ActionSheet';
import {List, ListItemFileCount} from '../common/List';
import {
  DefaultSortingOptions,
  DefaultSortingValues,
  SortDropdown,
} from '../common/SortDropdown';
import {FloatingButton} from '../Company/styles';
import {AddCommandCenterModal} from './AddCommandCenterModal';
import {EditCommandCenterModal} from './EditCommandCenterModal';
import {ViewCommandCenterModal} from './ViewCommandCenterModal';

interface CommandCenterListProps {
  companyId?: number;
  propertyId: number;
  buildingId?: number;
  onUpload?: OnUpload;
}

export const CommandCenterList = ({
  companyId,
  propertyId,
  buildingId,
  onUpload,
}: CommandCenterListProps) => {
  const [contactId, setCommandCenterId] = useState<number | null>();
  const [contactView, setContactView] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortOptions>({
    orderBy: OrderBy.CREATED_AT,
    orderByDirection: OrderByDirection.ASC,
  });
  const toast = useToast();
  const {uploadProgress, setUploadProgress} = useContext(UploadProgressContext);
  const handleSort = useCallback((value: string) => {
    setSorting({
      orderBy: DefaultSortingValues[value].value,
      orderByDirection: DefaultSortingValues[value].direction,
    });
  }, []);

  const {data, loading, refetch} = useGetCommandCenters({
    variables: {
      data: {
        propertyId,
        buildingId,
        sorting,
      },
    },
  });
  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const isTabFocused = useIsTabFocused(TAB_NAMES.COMMAND_CENTERS);

  useEffect(() => {
    if (isTabFocused) {
      refetch?.();
    }
  }, [isTabFocused, refetch]);

  const commandCenters = data?.getCommandCenters?.commandCenters;
  const [removeCommandCenter] = useDeleteCommandCenter();
  const deleteCommandCenter = useCallback(
    async (ccId: number) => {
      try {
        await removeCommandCenter({
          variables: {commandCenterId: ccId},
        });
        toast.show({
          title: ToastNotifications.CommandCenterAdded,
          placement: 'top',
        });
        refetch?.();
        setCommandCenterId(null);
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [refetch, removeCommandCenter, toast],
  );
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const openEdit = (ccId: number) => {
    setCommandCenterId(ccId);
    setEditModal(true);
  };

  const openDelete = useCallback(
    (ccId: number) => {
      Alert.alert(
        'Delete Command Center',
        'Are you sure you want to delete this?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteCommandCenter(ccId)},
        ],
      );
    },
    [deleteCommandCenter],
  );

  const {getPickImageActionOption} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const getActionOptions = useCallback(
    (ccId: number) => [
      getPickImageActionOption(
        {
          companyId,
          propertyId,
          ...(buildingId && {buildingId}),
          commandCenterId: ccId,
        },
        onUpload,
      ),
      {
        title: 'Edit',
        action: () => openEdit(ccId),
      },
      {
        title: 'Delete',
        action: () => openDelete(ccId),
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
    ],
  );

  const openCommandeCenterView = (ccId: number) => {
    setCommandCenterId(ccId);
    setContactView(true);
  };

  const renderListItem = ({item}: {item: CommandCenter}) => {
    const actions = getActionOptions(item.id);
    const destructiveButtonIndex = actions.findIndex(
      ({title}) => title === 'Delete',
    );
    const cancelButtonIndex = actions.findIndex(
      ({title}) => title === 'Cancel',
    );

    return (
      <ListItemNarrow onPress={() => openCommandeCenterView(item.id)}>
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
        + Add Command Center
      </FloatingButton>
      <List<CommandCenter>
        onRefresh={() => {
          refetch?.();
        }}
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderLeftText>
                {commandCenters?.length}{' '}
                {pluralize(commandCenters?.length, 'Command Center')}
              </ListHeaderLeftText>
            </ListHeaderLeft>
            <SortDropdown
              onChange={handleSort}
              sortingOptions={DefaultSortingOptions}
            />
          </ListHeader>
        )}
        data={commandCenters}
        loading={loading}
        renderItem={renderListItem}
        keyExtractor={item => `${item.id}`}
        type="narrow"
      />
      {addModal && (
        <AddCommandCenterModal
          closeModal={() => setAddModal(false)}
          propertyId={propertyId}
          buildingId={buildingId}
          onSuccess={onSuccess}
        />
      )}
      {editModal && (
        <EditCommandCenterModal
          closeModal={() => setEditModal(false)}
          commandCenterId={contactId as number}
          onSuccess={onSuccess}
        />
      )}
      {contactView && (
        <ViewCommandCenterModal
          closeModal={() => setContactView(false)}
          contactId={contactId as number}
        />
      )}
    </>
  );
};
