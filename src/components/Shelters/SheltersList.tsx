import {
  useDeleteShelter,
  useGetShelters,
} from '@securecore-new-application/securecore-datacore';
import {
  OrderBy,
  OrderByDirection,
  Shelter,
  SortOptions,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {Flex, useToast} from 'native-base';
import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {useIsTabFocused} from '@/components';
import {IconTypes} from '@/components/common/Icon/icons';
import {List, ListItemFileCount} from '@/components/common/List';
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
import {
  DefaultSortingOptions,
  DefaultSortingValues,
  SortDropdown,
} from '../common/SortDropdown';
import {FloatingButton} from '../Company/styles';
import {AddShelterModal} from './AddShelterModal';
import {EditShelterModal} from './EditShelterModal';
import {ViewShelterModal} from './ViewShelterModal';

interface SheltersListListProps {
  companyId?: number;
  propertyId: number;
  onUpload?: OnUpload;
}

export const SheltersList: FC<SheltersListListProps> = ({
  companyId,
  propertyId,
  onUpload,
}) => {
  const [shelterId, setShelterId] = useState<number | null>();
  const [shelterView, setShelterView] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortOptions>({
    orderBy: OrderBy.CREATED_AT,
    orderByDirection: OrderByDirection.ASC,
  });
  const handleSort = useCallback((value: string) => {
    setSorting({
      orderBy: DefaultSortingValues[value].value,
      orderByDirection: DefaultSortingValues[value].direction,
    });
  }, []);
  const toast = useToast();
  const {uploadProgress, setUploadProgress} = useContext(UploadProgressContext);
  const {data, loading, refetch} = useGetShelters({
    variables: {
      data: {
        propertyId,
        sorting,
      },
    },
  });

  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const isTabFocused = useIsTabFocused(TAB_NAMES.SHELTER_IN_PLACE);

  useEffect(() => {
    if (isTabFocused) {
      refetch?.();
    }
  }, [isTabFocused, refetch]);

  const sheltersList = (data?.getShelters?.shelters as Shelter[]) || [];
  const [removeShelter] = useDeleteShelter();
  const deleteShelter = useCallback(
    async (selectedShelterId: number) => {
      try {
        await removeShelter({
          variables: {id: selectedShelterId},
        });
        toast.show({
          title: ToastNotifications.ShelterDeleted,
          placement: 'top',
        });
        refetch?.();
        setShelterId(null);
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [refetch, removeShelter, toast],
  );
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const openEdit = (selectedShelterId: number) => {
    setShelterId(selectedShelterId);
    setEditModal(true);
  };

  const openDelete = useCallback(
    (selectedShelterId: number) => {
      Alert.alert(
        'Delete Shelter In Place',
        'Are you sure you want to delete this?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteShelter(selectedShelterId)},
        ],
      );
    },
    [deleteShelter],
  );

  const {getPickImageActionOption} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const getActionOptions = useCallback(
    (selectedShelterId: number) => [
      getPickImageActionOption(
        {
          companyId,
          propertyId,
          shelterId: selectedShelterId,
        },
        onUpload,
      ),
      {
        title: 'Edit',
        action: () => openEdit(selectedShelterId),
      },
      {
        title: 'Delete',
        action: () => openDelete(selectedShelterId),
      },
      {
        title: 'Cancel',
      },
    ],
    [companyId, getPickImageActionOption, onUpload, openDelete, propertyId],
  );

  const openShelterView = (selectedShelterId: number) => {
    setShelterId(selectedShelterId);
    setShelterView(true);
  };

  const renderItem = ({item}: {item: Shelter; index?: number}) => {
    const actions = getActionOptions(item.id);
    const destructiveButtonIndex = actions.findIndex(
      ({title}) => title === 'Delete',
    );
    const cancelButtonIndex = actions.findIndex(
      ({title}) => title === 'Cancel',
    );

    return (
      <ListItemNarrow onPress={() => openShelterView(item.id)}>
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
        + Add Shelter In Place
      </FloatingButton>
      <List<Shelter>
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderLeftText>
                {pluralize(sheltersList?.length, 'Shelter In Place Protocol')}
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
        data={sheltersList}
        loading={loading}
        renderItem={renderItem}
        keyExtractor={(item: Shelter) => `${item.id}`}
        type="narrow"
      />
      {addModal && (
        <AddShelterModal
          closeModal={() => setAddModal(false)}
          propertyId={propertyId}
          onSuccess={onSuccess}
        />
      )}
      {editModal && (
        <EditShelterModal
          closeModal={() => setEditModal(false)}
          shelterId={shelterId as number}
          onSuccess={onSuccess}
        />
      )}
      {shelterView && (
        <ViewShelterModal
          closeModal={() => setShelterView(false)}
          shelterId={shelterId as number}
        />
      )}
    </>
  );
};
