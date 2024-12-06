import {useRemoveAttachment} from '@securecore-new-application/securecore-datacore';
import {
  Attachment,
  AttachmentTypes,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {
  Center,
  Flex,
  HStack,
  Text,
  useToast,
  useToken,
  View,
} from 'native-base';
import React, {FC, useCallback, useState} from 'react';
import {Alert, Linking} from 'react-native';

import {List} from '@/components';
import {ActionSheet} from '@/components/ActionSheet';
import {StyledVideo} from '@/components/Attachments/styles';
import {ViewAttachmentModal} from '@/components/Attachments/ViewAttachmentModal';
import {IconTypes, propertyIcon} from '@/components/common/Icon';
import Icon from '@/components/common/Icon/Icon';
import {
  ListHeader,
  ListHeaderLeft,
  ListHeaderLeftText,
  ListItem,
  ListItemActionIcon,
  ListItemAvatar,
  ListItemAvatarWrapper,
  ListItemContentBottom,
  ListItemContentBottomText,
  ListItemContentTop,
  ListItemIconArrow,
} from '@/components/common/List/styles';
import {ToastNotifications} from '@/notifications/toasts';
import {ParentEntities} from '@/types';
import {pluralize, toTitleCase} from '@/utils/text';

import DefaultFileIcon from '../../../assets/svg/defaultFile.svg';
import {EditAttachmentModal} from './EditAttachmentModal';

type AttachmentParent = {__typename?: string; name?: string} | undefined;
interface Props {
  attachments: Attachment[];
  refetch?: () => void;
}

export const getParent = (item?: Attachment): AttachmentParent =>
  item?.alarm ??
  item?.commandCenter ??
  item?.evacuation ??
  item?.hazardousMaterial ??
  item?.mediaContact ??
  item?.policyDetail ??
  item?.procedure ??
  item?.relocation ??
  item?.shelter ??
  item?.shutOff ??
  item?.tenantSpace ??
  item?.building ??
  item?.property ??
  {};

export const AttachmentList: FC<Props> = ({attachments, refetch}) => {
  const [attachmentId, setAttachmentId] = useState<number | null>();
  const [attachmentView, setAttachmentView] = useState<boolean>(false);
  const [editModal, setEditModal] = useState(false);
  const [darkGrey, primaryColor] = useToken('colors', [
    'darkGrey',
    'primary.500',
  ]);

  const toast = useToast();
  const count = attachments.length;

  const openAttachmentView = (fileId: number) => {
    setAttachmentId(fileId);
    setAttachmentView(true);
  };

  const openEdit = (fileId: number) => {
    setAttachmentId(fileId);
    setEditModal(true);
  };

  const getParentTitle = useCallback((parent: AttachmentParent) => {
    const {__typename: type, name} = parent || {};

    if (!type) {
      return 'Company';
    }

    return `${toTitleCase(`${type}`)} • ${name}`;
  }, []);

  const getParentIcon = useCallback(
    (parent: AttachmentParent) => {
      if (!parent?.__typename) {
        return null;
      }

      const isParentEntity = Object.values(ParentEntities).includes(
        parent.__typename?.toLowerCase() as ParentEntities,
      );

      if (isParentEntity) {
        return <Icon name={IconTypes.CaretRight} color={darkGrey} size={12} />;
      }

      return <Icon name={IconTypes.Forward3} color={darkGrey} size={14} />;
    },
    [darkGrey],
  );

  const onDownload = useCallback(
    async (fileId: number) => {
      try {
        const attachment = attachments.filter(item => item.id === fileId)[0];

        await Linking.openURL(attachment.url);
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [attachments, toast],
  );

  const [removeAttachment] = useRemoveAttachment();
  const deleteAttachment = useCallback(
    async (fileId: number) => {
      try {
        await removeAttachment({
          variables: {attachmentId: fileId},
        });
        toast.show({
          title: ToastNotifications.AttachmentDeleted,
          placement: 'top',
        });
        refetch?.();
        setAttachmentId(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [refetch, removeAttachment, toast],
  );
  const openDelete = useCallback(
    (fileId: number) => {
      Alert.alert(
        'Delete Attachment',
        'Are you sure you want to delete this attachment?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteAttachment(fileId)},
        ],
      );
    },
    [deleteAttachment],
  );

  const getActionOptions = useCallback(
    (fileId: number) => [
      {
        title: 'Rename',
        action: () => openEdit(fileId),
      },
      {
        title: 'Download File',
        action: () => onDownload(fileId),
      },
      {
        title: 'Delete File',
        action: () => openDelete(fileId),
      },
      {
        title: 'Cancel',
      },
    ],
    [onDownload, openDelete],
  );

  const renderListItem = ({
    item,
    index,
  }: {
    item: Attachment;
    index?: number;
  }) => {
    const parent = getParent(item);
    const actions = getActionOptions(item.id);
    const destructiveButtonIndex = actions.findIndex(
      ({title}) => title === 'Delete File',
    );
    const cancelButtonIndex = actions.findIndex(
      ({title}) => title === 'Cancel',
    );
    const parentTitle = getParentTitle(parent);

    return (
      <ListItem
        first={index === 0}
        last={(index ?? 0) + 1 === attachments?.length}
        onPress={() => openAttachmentView(item.id)}>
        <ListItemAvatarWrapper>
          {item.type === AttachmentTypes.Image && (
            <ListItemAvatar
              resizeMode="cover"
              source={{uri: item.url}}
              defaultSource={{uri: propertyIcon}}
            />
          )}
          {item.type === AttachmentTypes.Doc && (
            <Center marginRight={3} w={10}>
              <DefaultFileIcon fill={primaryColor} height={40} width={40} />
            </Center>
          )}
          {item.type === AttachmentTypes.Video && (
            <Center marginRight={3} w={10} h="100%">
              <StyledVideo source={{uri: item.url}} />
            </Center>
          )}
        </ListItemAvatarWrapper>
        <Flex flexShrink={1} flexGrow={1} mr={4}>
          <View>
            <ListItemContentTop>
              <Text numberOfLines={1}>{item.name}</Text>
            </ListItemContentTop>
            <ListItemContentBottom>
              <ListItemContentBottomText>
                <HStack space={0} justifyContent="center" justifyItems="center">
                  <Text lineHeight={20}>{getParentIcon(parent)}</Text>
                  <Text
                    fontSize={15}
                    color={darkGrey}
                    lineHeight={20}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {parentTitle}
                  </Text>
                </HStack>
              </ListItemContentBottomText>
            </ListItemContentBottom>
          </View>
        </Flex>
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
      </ListItem>
    );
  };

  return (
    <>
      <List<Attachment>
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ListHeaderLeftText>
                {`${count} ${pluralize(attachments?.length, 'Attachment')}`}
              </ListHeaderLeftText>
            </ListHeaderLeft>
          </ListHeader>
        )}
        data={attachments}
        renderItem={renderListItem}
        keyExtractor={item => `${item.id}`}
      />
      {attachmentView && (
        <ViewAttachmentModal
          closeModal={() => setAttachmentView(false)}
          attachmentId={attachmentId as number}
        />
      )}
      {editModal && (
        <EditAttachmentModal
          closeModal={() => setEditModal(false)}
          attachmentId={attachmentId as number}
        />
      )}
    </>
  );
};
