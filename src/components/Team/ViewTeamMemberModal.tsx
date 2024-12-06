import {TeamMember} from '@securecore-new-application/securecore-datacore/lib/types';
import {Skeleton, View} from 'native-base';
import React from 'react';

import {ActionLink} from '@/components';
import {
  ListItemRowContent,
  ListItemRowData,
  ListItemRowLabel,
} from '@/components/common/List/styles';
import {Modal} from '@/components/common/Modal';
import {naLabel} from '@/constants';

interface ViewTeamMemberModalProps {
  closeModal: () => void;
  member: TeamMember;
}

export const ViewTeamMemberModal = ({
  member,
  closeModal,
}: ViewTeamMemberModalProps) => {
  const renderContent = () => {
    if (!member) {
      return (
        <View>
          <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
          <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
          <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
        </View>
      );
    }

    const {
      user: {profile},
    } = member;

    return (
      <>
        <ListItemRowData>
          <ListItemRowLabel>First Name:</ListItemRowLabel>
          <ListItemRowContent>
            {profile?.firstName || naLabel}
          </ListItemRowContent>
        </ListItemRowData>
        <ListItemRowData>
          <ListItemRowLabel>Last Name:</ListItemRowLabel>
          <ListItemRowContent>
            {profile?.lastName || naLabel}
          </ListItemRowContent>
        </ListItemRowData>
        <ListItemRowData>
          <ListItemRowLabel>Phone:</ListItemRowLabel>
          <ActionLink type="phone" link={profile?.phone as string}>
            <ListItemRowContent action={!!profile?.phone}>
              {profile?.phone || naLabel}
            </ListItemRowContent>
          </ActionLink>
        </ListItemRowData>
        <ListItemRowData>
          <ListItemRowLabel>Alternate Phone:</ListItemRowLabel>
          <ActionLink type="phone" link={profile?.alternatePhone as string}>
            <ListItemRowContent action={!!profile?.alternatePhone}>
              {profile?.alternatePhone || naLabel}
            </ListItemRowContent>
          </ActionLink>
        </ListItemRowData>
        <ListItemRowData>
          <ListItemRowLabel>Email:</ListItemRowLabel>
          <ActionLink type="email" link={profile?.email as string}>
            <ListItemRowContent action={Boolean(profile?.email)}>
              {profile?.email || naLabel}
            </ListItemRowContent>
          </ActionLink>
        </ListItemRowData>
      </>
    );
  };

  return (
    <Modal isOpen onClose={closeModal} title="Member">
      {renderContent()}
    </Modal>
  );
};
