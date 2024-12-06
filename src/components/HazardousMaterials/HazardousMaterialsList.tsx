import {
  useDeleteHazMat,
  useGetHazMats,
} from '@securecore-new-application/securecore-datacore';
import {
  HazMat,
  OrderBy,
  OrderByDirection,
  SortOptions,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {List, ListItemFileCount} from 'components/common/List';
import {Flex, useToast} from 'native-base';
import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
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
import {
  DefaultSortingOptions,
  DefaultSortingValues,
  SortDropdown,
} from '../common/SortDropdown';
import {FloatingButton} from '../Company/styles';
import {AddHazardousMaterialModal} from './AddHazardousMaterialModal';
import {EditHazardousMaterialModal} from './EditHazardousMaterialModal';
import {ViewHazardousMaterialModal} from './ViewHazardousMaterialModal';

interface HazardousMaterialsListListProps {
  companyId?: number;
  propertyId: number;
  onUpload?: OnUpload;
}

export const HazardousMaterialsList: FC<HazardousMaterialsListListProps> = ({
  companyId,
  propertyId,
  onUpload,
}) => {
  const [hazMatId, setHazMatId] = useState<number | null>();
  const [hazMatView, setHazMatView] = useState<boolean>(false);
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
  const {data, loading, refetch} = useGetHazMats({
    variables: {
      data: {
        propertyId,
        sorting,
      },
    },
  });

  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const isTabFocused = useIsTabFocused(TAB_NAMES.HAZ_MAT);

  useEffect(() => {
    if (isTabFocused) {
      refetch?.();
    }
  }, [isTabFocused, refetch]);

  const materialsList = (data?.getHazMats.hazMats as HazMat[]) || [];
  const [removeHazMat] = useDeleteHazMat();
  const deleteHazMat = useCallback(
    async (materialId: number) => {
      try {
        await removeHazMat({
          variables: {id: materialId},
        });
        toast.show({
          title: ToastNotifications.HazMatDeleted,
          placement: 'top',
        });
        refetch?.();
        setHazMatId(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [refetch, removeHazMat, toast],
  );
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const openEdit = (materialId: number) => {
    setHazMatId(materialId);
    setEditModal(true);
  };

  const openDelete = useCallback(
    (materialId: number) => {
      Alert.alert(
        'Delete Hazardous Material',
        'Are you sure you want to delete this?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteHazMat(materialId)},
        ],
      );
    },
    [deleteHazMat],
  );

  const {getPickImageActionOption} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const getActionOptions = useCallback(
    (materialId: number) => [
      getPickImageActionOption(
        {
          companyId,
          hazardousMaterialId: materialId,
        },
        onUpload,
      ),
      {
        title: 'Edit',
        action: () => openEdit(materialId),
      },
      {
        title: 'Delete',
        action: () => openDelete(materialId),
      },
      {
        title: 'Cancel',
      },
    ],
    [companyId, getPickImageActionOption, onUpload, openDelete],
  );

  const openHazMatView = (materialId: number) => {
    setHazMatId(materialId);
    setHazMatView(true);
  };

  const renderItem = ({item}: {item: HazMat; index?: number}) => {
    const actions = getActionOptions(item.id);
    const destructiveButtonIndex = actions.findIndex(
      ({title}) => title === 'Delete',
    );
    const cancelButtonIndex = actions.findIndex(
      ({title}) => title === 'Cancel',
    );

    return (
      <ListItemNarrow onPress={() => openHazMatView(item.id)}>
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
        + Add Hazardous Material
      </FloatingButton>
      <List<HazMat>
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderLeftText>
                {materialsList?.length}{' '}
                {pluralize(materialsList?.length, 'Material')}
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
        data={materialsList}
        loading={loading}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
        type="narrow"
      />
      {addModal && (
        <AddHazardousMaterialModal
          closeModal={() => setAddModal(false)}
          propertyId={propertyId}
          onSuccess={onSuccess}
        />
      )}
      {editModal && (
        <EditHazardousMaterialModal
          closeModal={() => setEditModal(false)}
          hazMatId={hazMatId as number}
          onSuccess={onSuccess}
        />
      )}
      {hazMatView && (
        <ViewHazardousMaterialModal
          closeModal={() => setHazMatView(false)}
          hazMatId={hazMatId as number}
        />
      )}
    </>
  );
};
