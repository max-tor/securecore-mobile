import {
  useGetMediaContacts,
  useRemoveMediaContact,
} from '@securecore-new-application/securecore-datacore';
import {
  MediaContact,
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
import {AddMediaContactModal} from './AddMediaContactModal';
import {EditMediaContactModal} from './EditMediaContactModal';
import {ViewMediaContactModal} from './ViewMediaContactModal';

interface MediaContactListProps {
  companyId: number;
  onUpload?: OnUpload;
}

export const MediaContactsList = ({
  companyId,
  onUpload,
}: MediaContactListProps) => {
  const [contactId, setContactId] = useState<number | null>();
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

  const {data, loading, refetch} = useGetMediaContacts({
    variables: {
      data: {
        companyId,
        sorting,
      },
    },
  });
  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const isTabFocused = useIsTabFocused(TAB_NAMES.MEDIA);

  useEffect(() => {
    if (isTabFocused) {
      refetch?.();
    }
  }, [isTabFocused, refetch]);

  const mediaContact = data?.getMediaContacts?.mediaContacts;
  const [removeContact] = useRemoveMediaContact();
  const deleteContact = useCallback(
    async (cntId: number) => {
      try {
        await removeContact({
          variables: {mediaContactId: cntId},
        });
        toast.show({
          title: ToastNotifications.MediaContactDeleted,
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
        'Delete Media Contact',
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

  const {getPickImageActionOption} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const getActionOptions = useCallback(
    (cntId: number) => [
      getPickImageActionOption(
        {
          companyId,
          mediaContactId: cntId,
        },
        onUpload,
      ),
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
    [companyId, getPickImageActionOption, onUpload, openDelete],
  );

  const openContactView = (cntId: number) => {
    setContactId(cntId);
    setContactView(true);
  };

  const renderListItem = ({item}: {item: MediaContact}) => {
    const actions = getActionOptions(item.id);
    const destructiveButtonIndex = actions.findIndex(
      ({title}) => title === 'Delete',
    );
    const cancelButtonIndex = actions.findIndex(
      ({title}) => title === 'Cancel',
    );

    return (
      <ListItemNarrow onPress={() => openContactView(item.id)}>
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
        + Add Media Contact
      </FloatingButton>
      <List<MediaContact>
        onRefresh={() => {
          refetch?.();
        }}
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderLeftText>
                {mediaContact?.length}{' '}
                {pluralize(mediaContact?.length, 'Contact')}
              </ListHeaderLeftText>
            </ListHeaderLeft>
            <SortDropdown
              onChange={handleSort}
              sortingOptions={DefaultSortingOptions}
            />
          </ListHeader>
        )}
        data={mediaContact}
        loading={loading}
        renderItem={renderListItem}
        keyExtractor={item => `${item.id}`}
        type="narrow"
      />
      {addModal && (
        <AddMediaContactModal
          closeModal={() => setAddModal(false)}
          companyId={companyId}
          onSuccess={onSuccess}
        />
      )}
      {editModal && (
        <EditMediaContactModal
          closeModal={() => setEditModal(false)}
          contactId={contactId as number}
          companyId={companyId}
          onSuccess={onSuccess}
        />
      )}
      {contactView && (
        <ViewMediaContactModal
          closeModal={() => setContactView(false)}
          contactId={contactId as number}
        />
      )}
    </>
  );
};
