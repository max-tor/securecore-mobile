import {useGetRelocationById} from '@securecore-new-application/securecore-datacore';
import React from 'react';

import {ActionLink, Divider} from '@/components';
import {HtmlListItem} from '@/components/common/List';
import {
  ListItemRowContent,
  ListItemRowData,
  ListItemRowLabel,
} from '@/components/common/List/styles';

import {Modal} from '../common/Modal';

interface ViewRelocationModalProps {
  closeModal: () => void;
  relocationId: number;
}

export const ViewRelocationModal = ({
  relocationId,
  closeModal,
}: ViewRelocationModalProps) => {
  const {data, loading} = useGetRelocationById({
    variables: {id: relocationId},
  });
  const relocation = data?.getRelocationById?.relocation;

  const renderContent = () => (
    <>
      <ListItemRowData>
        <ListItemRowLabel>Location:</ListItemRowLabel>
        <ListItemRowContent>{relocation?.location}</ListItemRowContent>
      </ListItemRowData>
      <Divider
        text="Point of Contact"
        _viewStyles={{marginBottom: 12}}
        _text={{
          fontFamily: 'SF Pro Text',
          fontWeight: 600,
          fontSize: 12,
        }}
      />
      {relocation?.pointOfContactName && (
        <ListItemRowData>
          <ListItemRowLabel>Name:</ListItemRowLabel>
          <ListItemRowContent>
            {relocation?.pointOfContactName}
          </ListItemRowContent>
        </ListItemRowData>
      )}
      {relocation?.pointOfContactTitle && (
        <ListItemRowData>
          <ListItemRowLabel>Title:</ListItemRowLabel>
          <ListItemRowContent>
            {relocation?.pointOfContactTitle}
          </ListItemRowContent>
        </ListItemRowData>
      )}
      {relocation?.pointOfContactPhone && (
        <ListItemRowData>
          <ListItemRowLabel>Phone:</ListItemRowLabel>
          <ActionLink type="phone" link={relocation?.pointOfContactPhone}>
            <ListItemRowContent action>
              {relocation?.pointOfContactPhone}
            </ListItemRowContent>
          </ActionLink>
        </ListItemRowData>
      )}
      {relocation?.specialNotes && (
        <HtmlListItem
          title="Special Notes"
          html={relocation?.specialNotes as string}
        />
      )}
    </>
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title={relocation?.name}
      loading={loading}>
      {renderContent()}
    </Modal>
  );
};
