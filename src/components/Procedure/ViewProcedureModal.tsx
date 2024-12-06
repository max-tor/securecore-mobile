import {useGetProcedureInfo} from '@securecore-new-application/securecore-datacore';
import React from 'react';

import {HtmlView} from '@/components';

import {Modal} from '../common/Modal';

interface ViewProcedureModalProps {
  closeModal: () => void;
  procedureId: number;
}

export const ViewProcedureModal = ({
  procedureId,
  closeModal,
}: ViewProcedureModalProps) => {
  const {data, loading} = useGetProcedureInfo({
    variables: {id: procedureId},
  });
  const procedure = data?.getProcedureInfo?.procedure;
  const html = procedure?.contentItem.content;

  const renderContent = () => (
    <HtmlView contentHtml={html as string} baseStyle={{padding: 0}} />
  );

  const renderTitle = () => procedure?.name;

  return (
    <Modal isOpen onClose={closeModal} title={renderTitle()} loading={loading}>
      {renderContent()}
    </Modal>
  );
};
