import {
  useDeletePolicyDetail,
  useGetPolicyDetails,
} from '@securecore-new-application/securecore-datacore';
import {
  OrderBy,
  OrderByDirection,
  PolicyDetail,
  PolicyDetailTypes,
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
// eslint-disable-next-line import/no-unresolved
import {EditPolicyDetailsModal} from '@/components/PolicyDetails/EditPolicyDetailsModal';
import {TAB_NAMES} from '@/constants/tabs';
import {UploadProgressContext} from '@/contexts/uploadProgress';
import {OnUpload, usePickImage} from '@/hooks/usePickImage';
import {ToastNotifications} from '@/notifications/toasts';
import {pluralize} from '@/utils/text';

import {AddPolicyDetailsModal} from './AddPolicyDetailsModal';
import {ViewPolicyDetailsModal} from './ViewPolicyDetailsModal';

interface PolicyDetailsListListProps {
  companyId?: number;
  propertyId?: number;
  type: PolicyDetailTypes;
  onUpload?: OnUpload;
}

export const PolicyDetailsList: FC<PolicyDetailsListListProps> = ({
  companyId,
  propertyId,
  type,
  onUpload,
}) => {
  const isTabFocused = useIsTabFocused(TAB_NAMES.EVACUATIONS);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [policyDetailsId, setPolicyDetailsId] = useState<number | null>(null);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [deletePolicyDetailsMutation] = useDeletePolicyDetail();
  const toast = useToast();
  const {uploadProgress, setUploadProgress} = useContext(UploadProgressContext);
  const mainTitlePrefix =
    type === PolicyDetailTypes.INSURANCE ? 'Insurance policy' : 'Master Policy';

  const [sorting, setSorting] = useState<SortOptions>({
    orderBy: OrderBy.CREATED_AT,
    orderByDirection: OrderByDirection.ASC,
  });
  const {data, loading, refetch} = useGetPolicyDetails({
    variables: {
      data: {
        propertyId,
        sorting,
        type,
      },
    },
  });

  useEffect(() => {
    if (isTabFocused) {
      refetch?.();
    }
  }, [isTabFocused, refetch]);

  const policyDetails =
    (data?.getPolicyDetails.policyDetails as PolicyDetail[]) || [];
  const permissions = data?.getPolicyDetails.permissions;

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

  const deletePolicyDetails = useCallback(
    async (relId: number) => {
      try {
        await deletePolicyDetailsMutation({
          variables: {id: relId},
        });
        toast.show({
          title: ToastNotifications.PolicyDetailsDeleted,
          placement: 'top',
        });
        refetch?.();
        setPolicyDetailsId(null);
      } catch (message) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [deletePolicyDetailsMutation, refetch, toast],
  );

  const openEdit = (id: number) => {
    setPolicyDetailsId(id);
    setEditModal(true);
  };

  const openView = (id: number) => {
    setPolicyDetailsId(id);
    setOpenViewModal(true);
  };

  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const openDelete = useCallback(
    (relId: number) => {
      Alert.alert(
        `Delete ${mainTitlePrefix}`,
        `Are you sure you want to delete this ${mainTitlePrefix}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deletePolicyDetails(relId)},
        ],
      );
    },
    [deletePolicyDetails, mainTitlePrefix],
  );

  const {getPickImageActionOption} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const getActionOptions = useCallback(
    (policyId: number) => {
      const actions = [];

      actions.push(
        getPickImageActionOption(
          {
            companyId,
            propertyId,
            policyDetailId: policyId,
          },
          onUpload,
        ),
      );

      if (permissions?.update) {
        actions.push({
          title: 'Edit',
          action: () => openEdit(policyId),
        });
      }

      if (permissions?.delete) {
        actions.push({
          title: 'Delete',
          action: () => openDelete(policyId),
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

  const renderItem = ({item}: {item: PolicyDetail; index?: number}) => {
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
        {`+ Add ${mainTitlePrefix}`}
      </FloatingButton>
      <List<PolicyDetail>
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderLeftText>
                {policyDetails?.length > 0 &&
                  pluralize(policyDetails?.length, 'Item')}
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
        data={policyDetails}
        loading={loading}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
      />
      {addModal && (
        <AddPolicyDetailsModal
          closeModal={() => setAddModal(false)}
          propertyId={propertyId as number}
          type={type}
          onSuccess={onSuccess}
        />
      )}
      {openViewModal && (
        <ViewPolicyDetailsModal
          closeModal={() => setOpenViewModal(false)}
          policyId={policyDetailsId as number}
        />
      )}
      {editModal && (
        <EditPolicyDetailsModal
          closeModal={() => setEditModal(false)}
          policyDetailsId={policyDetailsId as number}
          onSuccess={onSuccess}
          type={type}
        />
      )}
    </>
  );
};
