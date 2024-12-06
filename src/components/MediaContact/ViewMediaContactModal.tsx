import {useGetMediaContactById} from '@securecore-new-application/securecore-datacore';
import React from 'react';

import {ActionLink} from '@/components';
import {HtmlListItem} from '@/components/common/List';
import {
  ListItemRowContent,
  ListItemRowData,
  ListItemRowLabel,
} from '@/components/common/List/styles';
import {naLabel} from '@/constants';

import {Modal} from '../common/Modal';

interface ViewMediaContactModalProps {
  closeModal: () => void;
  contactId: number;
}

export const ViewMediaContactModal = ({
  contactId,
  closeModal,
}: ViewMediaContactModalProps) => {
  const {data, loading} = useGetMediaContactById({
    variables: {id: contactId},
  });
  const contact = data?.getMediaContactById?.mediaContact;

  const renderContent = () => (
    <>
      <ListItemRowData>
        <ListItemRowLabel>First Name:</ListItemRowLabel>
        <ListItemRowContent>
          {contact?.profile?.firstName || naLabel}
        </ListItemRowContent>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Last Name:</ListItemRowLabel>
        <ListItemRowContent>
          {contact?.profile?.lastName || naLabel}
        </ListItemRowContent>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Phone:</ListItemRowLabel>
        <ActionLink type="phone" link={contact?.profile?.phone as string}>
          <ListItemRowContent action>
            {contact?.profile?.phone || naLabel}
          </ListItemRowContent>
        </ActionLink>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Alternate Phone:</ListItemRowLabel>
        <ActionLink
          type="phone"
          link={contact?.profile?.alternatePhone as string}>
          <ListItemRowContent action>
            {contact?.profile?.alternatePhone || naLabel}
          </ListItemRowContent>
        </ActionLink>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Email:</ListItemRowLabel>
        <ActionLink type="email" link={contact?.profile?.email as string}>
          <ListItemRowContent>
            {contact?.profile?.email || naLabel}
          </ListItemRowContent>
        </ActionLink>
      </ListItemRowData>
      {contact?.procedure && (
        <HtmlListItem title="Procedure" html={contact?.procedure} />
      )}
    </>
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title={`Contact ${contact?.name}`}
      loading={loading}>
      {renderContent()}
    </Modal>
  );
};
