import {useGetShutOffById} from '@securecore-new-application/securecore-datacore';
import React from 'react';

import {HtmlView} from '@/components';
import {HtmlListItem} from '@/components/common/List';

import {
  ListItemRowContent,
  ListItemRowData,
  ListItemRowLabel,
} from '../common/List/styles';
import {Modal} from '../common/Modal';

interface ViewShutOffModalProps {
  closeModal: () => void;
  shutOffId: number;
}

export const ViewShutOffModal = ({
  shutOffId,
  closeModal,
}: ViewShutOffModalProps) => {
  const {data, loading} = useGetShutOffById({
    variables: {id: shutOffId},
  });
  const shutOff = data?.getShutOffById?.shutOff;

  const renderContent = () => (
    <>
      <ListItemRowData col>
        <ListItemRowLabel full>Location:</ListItemRowLabel>
        <ListItemRowContent full>
          <HtmlView
            contentHtml={shutOff?.location as string}
            baseStyle={{
              padding: 0,
            }}
          />
        </ListItemRowContent>
      </ListItemRowData>
      {shutOff?.instructions && (
        <HtmlListItem
          title="Instructions"
          html={shutOff?.instructions as string}
        />
      )}
    </>
  );

  return (
    <Modal isOpen onClose={closeModal} title={shutOff?.name} loading={loading}>
      {renderContent()}
    </Modal>
  );
};
