import {useGetEmergencyResourceById} from '@securecore-new-application/securecore-datacore';
import React from 'react';

import {ActionLink} from '@/components';
import {HtmlListItem} from '@/components/common/List';
import {
  ListItemRowContent,
  ListItemRowData,
  ListItemRowLabel,
} from '@/components/common/List/styles';
import {naLabel} from '@/constants';
import {getAddress} from '@/utils/getAddress';

import {Modal} from '../common/Modal';

interface ViewCommunityResourceModalProps {
  closeModal: () => void;
  communityResourceId: number;
}

export const ViewCommunityResourceModal = ({
  communityResourceId,
  closeModal,
}: ViewCommunityResourceModalProps) => {
  const {data, loading} = useGetEmergencyResourceById({
    variables: {id: communityResourceId},
  });
  const emergencyResource = data?.getEmergencyResourceById?.emergencyResource;

  const renderContent = () => (
    <>
      <ListItemRowData>
        <ListItemRowLabel>Name:</ListItemRowLabel>
        <ListItemRowContent>
          {emergencyResource?.name || naLabel}
        </ListItemRowContent>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Industries:</ListItemRowLabel>
        <ListItemRowContent>
          {emergencyResource?.industries
            ?.map(industry => industry?.name)
            .join(' \u2022 ')}
        </ListItemRowContent>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Phone:</ListItemRowLabel>
        <ActionLink
          type="phone"
          link={emergencyResource?.profile?.phone as string}>
          <ListItemRowContent action={!!emergencyResource?.profile?.phone}>
            {emergencyResource?.profile?.phone || naLabel}
          </ListItemRowContent>
        </ActionLink>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Alternate Phone:</ListItemRowLabel>
        <ActionLink
          type="phone"
          link={emergencyResource?.profile?.alternatePhone as string}>
          <ListItemRowContent
            action={!!emergencyResource?.profile?.alternatePhone}>
            {emergencyResource?.profile?.alternatePhone || naLabel}
          </ListItemRowContent>
        </ActionLink>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Email:</ListItemRowLabel>
        <ActionLink
          type="email"
          link={emergencyResource?.profile?.email as string}>
          <ListItemRowContent
            action={Boolean(emergencyResource?.profile?.email)}>
            {emergencyResource?.profile?.email || naLabel}
          </ListItemRowContent>
        </ActionLink>
      </ListItemRowData>
      <ListItemRowData>
        <ListItemRowLabel>Address:</ListItemRowLabel>
        <ListItemRowContent>
          {getAddress(emergencyResource?.address) || naLabel}
        </ListItemRowContent>
      </ListItemRowData>
      {emergencyResource?.specialNotes && (
        <HtmlListItem
          title="Special Notes"
          html={emergencyResource?.specialNotes}
        />
      )}
    </>
  );

  const renderTitle = () => emergencyResource?.name || 'Community Resource';

  return (
    <Modal isOpen onClose={closeModal} title={renderTitle()} loading={loading}>
      {renderContent()}
    </Modal>
  );
};
