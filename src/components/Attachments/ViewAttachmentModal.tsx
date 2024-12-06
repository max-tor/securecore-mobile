import {useGetAttachmentById} from '@securecore-new-application/securecore-datacore';
import React from 'react';

import {Attachment} from '@/components/Attachments/Attachment';
import {getParent} from '@/components/Attachments/AttachmentList';
import {IconTypes} from '@/components/common/Icon';
import Icon from '@/components/common/Icon/Icon';
import {
  ListItemRowContent,
  ListItemRowData,
  ListItemRowLabel,
} from '@/components/common/List/styles';
import {naLabel} from '@/constants';
import {getDateTimeString} from '@/utils/dateTime';
import {toHumanSize} from '@/utils/files';
import {toTitleCase} from '@/utils/text';

import {Modal} from '../common/Modal';

interface ViewAttachmentModalProps {
  closeModal: () => void;
  attachmentId: number;
}

export const ViewAttachmentModal = ({
  attachmentId,
  closeModal,
}: ViewAttachmentModalProps) => {
  const {data, loading} = useGetAttachmentById({
    variables: {id: attachmentId},
  });
  const attachment = data?.getAttachmentById;
  const {firstName, lastName} = attachment?.user?.profile || {};
  const uploadedBy = [firstName, lastName].filter(Boolean).join(' ') || naLabel;
  const {filesize} = JSON.parse(attachment?.metadata || '{}');
  const parent = getParent(attachment);

  const renderContent = () => (
    <>
      {!!parent?.__typename && (
        <ListItemRowData>
          <ListItemRowLabel>Allocation</ListItemRowLabel>
          <ListItemRowContent>
            <Icon name={IconTypes.Forward3} size={12} />
            {toTitleCase(parent?.__typename)} • {parent?.name}
          </ListItemRowContent>
        </ListItemRowData>
      )}
      {!!attachment?.user && (
        <ListItemRowData>
          <ListItemRowLabel>Uploaded by</ListItemRowLabel>
          <ListItemRowContent>{uploadedBy}</ListItemRowContent>
        </ListItemRowData>
      )}
      {!!attachment?.createdAt && (
        <ListItemRowData>
          <ListItemRowLabel>Uploaded date</ListItemRowLabel>
          <ListItemRowContent>
            {getDateTimeString(attachment.createdAt)}
          </ListItemRowContent>
        </ListItemRowData>
      )}
      {!!filesize && (
        <ListItemRowData>
          <ListItemRowLabel>File Size</ListItemRowLabel>
          <ListItemRowContent>{toHumanSize(filesize)}</ListItemRowContent>
        </ListItemRowData>
      )}
    </>
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title={attachment?.name || Attachment.name}
      loading={loading}>
      {renderContent()}
    </Modal>
  );
};
