import {useGetEvacuationById} from '@securecore-new-application/securecore-datacore';
import React from 'react';

import {HtmlView} from '@/components';
import {
  ListItemRowContent,
  ListItemRowData,
  ListItemRowLabel,
} from '@/components/common/List/styles';

import {Modal} from '../common/Modal';

interface ViewEvacuationModalProps {
  closeModal: () => void;
  evacuationId: number;
}

export const ViewEvacuationModal = ({
  evacuationId,
  closeModal,
}: ViewEvacuationModalProps) => {
  const {data, loading} = useGetEvacuationById({
    variables: {id: evacuationId},
  });
  const evacuation = data?.getEvacuationById?.evacuation;

  const renderContent = () => (
    <>
      <ListItemRowData>
        <ListItemRowLabel>Primary Evacuation Route:</ListItemRowLabel>
        <ListItemRowContent style={{textAlign: 'left'}}>
          <HtmlView
            contentHtml={evacuation?.primaryEvacuationRoute as string}
            baseStyle={{padding: 0}}
          />
        </ListItemRowContent>
      </ListItemRowData>
      {evacuation?.procedure && (
        <ListItemRowData>
          <ListItemRowLabel>Procedure:</ListItemRowLabel>
          <ListItemRowContent style={{textAlign: 'left'}}>
            <HtmlView
              contentHtml={evacuation?.procedure as string}
              baseStyle={{padding: 0}}
            />
          </ListItemRowContent>
        </ListItemRowData>
      )}
    </>
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title={evacuation?.name}
      loading={loading}>
      {renderContent()}
    </Modal>
  );
};
