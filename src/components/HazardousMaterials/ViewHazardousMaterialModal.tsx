import {useGetHazMatById} from '@securecore-new-application/securecore-datacore';
import React from 'react';

import {HtmlView} from '@/components';
import {HtmlListItem} from '@/components/common/List';
import {
  ListItemRowContent,
  ListItemRowData,
  ListItemRowLabel,
} from '@/components/common/List/styles';

import {Modal} from '../common/Modal';

interface ViewHazardousMaterialModalProps {
  closeModal: () => void;
  hazMatId: number;
}

export const ViewHazardousMaterialModal = ({
  hazMatId,
  closeModal,
}: ViewHazardousMaterialModalProps) => {
  const {data, loading} = useGetHazMatById({
    variables: {id: hazMatId},
  });
  const material = data?.getHazMatById?.hazMat;

  const renderContent = () => (
    <>
      <ListItemRowData col>
        <ListItemRowLabel full>Location:</ListItemRowLabel>
        <ListItemRowContent full>
          <HtmlView
            contentHtml={material?.location as string}
            baseStyle={{
              padding: 0,
            }}
          />
        </ListItemRowContent>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Quantity:</ListItemRowLabel>
        <ListItemRowContent>{material?.quantity}</ListItemRowContent>
      </ListItemRowData>
      {material?.specialNotes && (
        <HtmlListItem title="Special Notes" html={material?.specialNotes} />
      )}
    </>
  );

  return (
    <Modal isOpen loading={loading} onClose={closeModal} title={material?.name}>
      {renderContent()}
    </Modal>
  );
};
