import {useGetContactItemById} from '@securecore-new-application/securecore-datacore';
import React from 'react';

import {ActionLink} from '@/components';
import {
  ListItemRowContent,
  ListItemRowData,
  ListItemRowLabel,
} from '@/components/common/List/styles';
import {naLabel} from '@/constants';

import {Modal} from '../common/Modal';

interface ViewContactModalItemProps {
  closeModal: () => void;
  contactId: number;
}

export const ViewContactItemModal = ({
  contactId,
  closeModal,
}: ViewContactModalItemProps) => {
  const {data, loading} = useGetContactItemById({
    variables: {id: contactId},
  });
  const contact = data?.getContactItemById?.contactItem;

  const renderContent = () => (
    <>
      <ListItemRowData>
        <ListItemRowLabel>Title/Role:</ListItemRowLabel>
        <ListItemRowContent>{contact?.title || naLabel}</ListItemRowContent>
      </ListItemRowData>
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
          <ListItemRowContent action={Boolean(contact?.profile?.phone)}>
            {contact?.profile?.phone || naLabel}
          </ListItemRowContent>
        </ActionLink>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Alternate Phone:</ListItemRowLabel>
        <ActionLink
          type="phone"
          link={contact?.profile?.alternatePhone as string}>
          <ListItemRowContent
            action={Boolean(contact?.profile?.alternatePhone)}>
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
    </>
  );

  return (
    <Modal isOpen onClose={closeModal} title="Contact Item" loading={loading}>
      {renderContent()}
    </Modal>
  );
};
