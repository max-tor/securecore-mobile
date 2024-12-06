import {useGetFaqById} from '@securecore-new-application/securecore-datacore';
import React from 'react';

import {HtmlView} from '@/components';

import {Modal} from '../common/Modal';

interface ViewFaqModalProps {
  closeModal: () => void;
  faqId: number;
}

export const ViewFaqModal = ({faqId, closeModal}: ViewFaqModalProps) => {
  const {data, loading} = useGetFaqById({variables: {id: faqId}});
  const faq = data?.getFaqById?.faq;
  const html = faq?.contentItem?.content;

  const renderContent = () => (
    <HtmlView contentHtml={html as string} baseStyle={{padding: 0}} />
  );

  const renderTitle = () => faq?.name;

  return (
    <Modal isOpen onClose={closeModal} title={renderTitle()} loading={loading}>
      {renderContent()}
    </Modal>
  );
};
