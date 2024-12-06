import {
  useGetContactItems,
  useRemoveContactItem,
} from '@securecore-new-application/securecore-datacore';
import {
  ContactItem,
  ContactListParentType,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {useToast} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, View} from 'react-native';

import {List, useIsTabFocused} from '@/components';
import {IconTypes} from '@/components/common/Icon/icons';
import {
  ListHeader,
  ListHeaderLeft,
  ListHeaderLeftText,
  ListItemActionIcon,
  ListItemContentBottom,
  ListItemContentBottomText,
  ListItemContentTop,
  ListItemContentTopText,
  ListItemIconArrow,
  ListItemNarrow,
} from '@/components/common/List/styles';
import {TAB_NAMES} from '@/constants/tabs';
import {ToastNotifications} from '@/notifications/toasts';
import {pluralize} from '@/utils/text';

import {ActionSheet} from '../ActionSheet';
import {FloatingButton} from '../Company/styles';
import {AddContactItemModal} from './AddContactItemModal';
import {EditContactItemModal} from './EditContactItemModal';
import {ViewContactItemModal} from './ViewContactItemModal';

interface CallListProps {
  propertyId: number;
  companyId?: number;
  tenantSpaceId?: number;
}

export const CallList = ({
  tenantSpaceId,
  propertyId,
  companyId,
}: CallListProps) => {
  const [contactId, setContactId] = useState<number | null>();
  const [contactView, setContactView] = useState<boolean>(false);
  const toast = useToast();

  const {data, loading, refetch} = useGetContactItems({
    variables: {
      data: {
        propertyId,
        tenantSpaceId,
        parentType: ContactListParentType.CALL_LIST,
      },
    },
  });
  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const isTabFocused = useIsTabFocused(TAB_NAMES.CALL_LIST);

  useEffect(() => {
    if (isTabFocused) {
      refetch?.();
    }
  }, [isTabFocused, refetch]);

  const contactItems = data?.getContactItems?.contactItems;
  const [removeContact] = useRemoveContactItem();
  const deleteContact = useCallback(
    async (cntId: number) => {
      try {
        await removeContact({
          variables: {id: cntId},
        });
        toast.show({
          title: ToastNotifications.CallListItemDeleted,
          placement: 'top',
        });
        refetch?.();
        setContactId(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [refetch, removeContact, toast],
  );
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const openEdit = (cntId: number) => {
    setContactId(cntId);
    setEditModal(true);
  };

  const openDelete = useCallback(
    (cntId: number) => {
      Alert.alert(
        'Delete Contact',
        'Are you sure you want to delete this contact?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteContact(cntId)},
        ],
      );
    },
    [deleteContact],
  );

  const getActionOptions = useCallback(
    (cntId: number) => [
      {
        title: 'Edit',
        action: () => openEdit(cntId),
      },
      {
        title: 'Delete',
        action: () => openDelete(cntId),
      },
      {
        title: 'Cancel',
      },
    ],
    [openDelete],
  );

  const openContactView = (cntId: number) => {
    setContactId(cntId);
    setContactView(true);
  };

  const renderListItem = ({item}: {item: ContactItem}) => (
    <ListItemNarrow onPress={() => openContactView(item.id)}>
      <View>
        <ListItemContentTop>
          <ListItemContentTopText>
            {item.profile?.firstName} {item.profile?.lastName}
          </ListItemContentTopText>
        </ListItemContentTop>
        <ListItemContentBottom>
          {item.title && (
            <ListItemContentBottomText>{item.title}</ListItemContentBottomText>
          )}
        </ListItemContentBottom>
      </View>
      <ListItemIconArrow>
        <ActionSheet
          options={getActionOptions(item.id)}
          destructiveButtonIndex={1}
          cancelButtonIndex={2}>
          <ListItemActionIcon name={IconTypes.Dots} color="#8E8FA1" size={16} />
        </ActionSheet>
      </ListItemIconArrow>
    </ListItemNarrow>
  );

  return (
    <>
      <FloatingButton onPress={() => setAddModal(true)}>
        + Add Contact Item
      </FloatingButton>
      <List<ContactItem>
        onRefresh={() => {
          refetch?.();
        }}
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderLeftText>
                {contactItems?.length}{' '}
                {pluralize(contactItems?.length, 'Contact')}
              </ListHeaderLeftText>
            </ListHeaderLeft>
          </ListHeader>
        )}
        data={contactItems}
        loading={loading}
        renderItem={renderListItem}
        keyExtractor={item => `${item.id}`}
        type="narrow"
      />
      {addModal && (
        <AddContactItemModal
          closeModal={() => setAddModal(false)}
          tenantSpaceId={tenantSpaceId}
          propertyId={propertyId}
          companyId={companyId}
          onSuccess={onSuccess}
        />
      )}
      {editModal && (
        <EditContactItemModal
          closeModal={() => setEditModal(false)}
          contactId={contactId as number}
          onSuccess={onSuccess}
        />
      )}
      {contactView && (
        <ViewContactItemModal
          closeModal={() => setContactView(false)}
          contactId={contactId as number}
        />
      )}
    </>
  );
};
