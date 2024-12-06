import {useGetPolicyDetailById} from '@securecore-new-application/securecore-datacore';
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

interface ViewPolicyDetailsModalProps {
  closeModal: () => void;
  policyId: number;
}

export const ViewPolicyDetailsModal = ({
  policyId,
  closeModal,
}: ViewPolicyDetailsModalProps) => {
  const {data, loading} = useGetPolicyDetailById({
    variables: {id: policyId},
  });
  const policyDetail = data?.getPolicyDetailById?.policyDetail;

  const renderContent = () => (
    <>
      <ListItemRowData>
        <ListItemRowLabel>First Name:</ListItemRowLabel>
        <ListItemRowContent>
          {policyDetail?.profile?.firstName || naLabel}
        </ListItemRowContent>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Last Name:</ListItemRowLabel>
        <ListItemRowContent>
          {policyDetail?.profile?.lastName || naLabel}
        </ListItemRowContent>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Primary Phone:</ListItemRowLabel>
        <ActionLink type="phone" link={policyDetail?.profile?.phone as string}>
          <ListItemRowContent action={!!policyDetail?.profile?.phone}>
            {policyDetail?.profile?.phone || naLabel}
          </ListItemRowContent>
        </ActionLink>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Email:</ListItemRowLabel>
        <ActionLink type="email" link={policyDetail?.profile?.email as string}>
          <ListItemRowContent action={Boolean(policyDetail?.profile?.email)}>
            {policyDetail?.profile?.email || naLabel}
          </ListItemRowContent>
        </ActionLink>
      </ListItemRowData>
      <HtmlListItem
        title="Procedure"
        html={(policyDetail?.procedure as string) || naLabel}
      />
    </>
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title={policyDetail?.name}
      loading={loading}>
      {renderContent()}
    </Modal>
  );
};
