import {useActionSheet} from '@expo/react-native-action-sheet';
import {useRemoveTeamMember} from '@securecore-new-application/securecore-datacore';
import {
  GET_COMPANY_TEAM,
  GET_PROPERTY_TEAM,
} from '@securecore-new-application/securecore-datacore/lib/queries';
import {
  TeamMember,
  TeamPermissions,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {useToast} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, View} from 'react-native';

import {useIsTabFocused} from '@/components';
import Icon from '@/components/common/Icon/Icon';
import {avatar, IconTypes} from '@/components/common/Icon/icons';
import {
  ListHeader,
  ListHeaderLeft,
  ListHeaderLeftText,
  ListItem,
  ListItemAvatar,
  ListItemContentBottom,
  ListItemContentBottomIcon,
  ListItemContentBottomText,
  ListItemContentTop,
  ListItemContentTopText,
  ListItemFlex,
  ListItemIconArrow,
} from '@/components/common/List/styles';
import {FloatingButton} from '@/components/Company/styles';
import {TAB_NAMES} from '@/constants/tabs';
import {ToastNotifications} from '@/notifications/toasts';
import {pluralize} from '@/utils/text';

import {ActionSheet} from '../ActionSheet';
import {ChangePasswordModal} from '../ChangePasswordModal';
import {List} from '../common/List';
import {CreateTeamMember} from './CreateTeamMember';
import {InviteTeamMember} from './InviteTeamMember';
import {ViewTeamMemberModal} from './ViewTeamMemberModal';

interface TeamListProps {
  team?: TeamMember[];
  permissions?: TeamPermissions;
  companyId?: number;
  propertyId?: number;
  refetch?: () => void;
  loading?: boolean;
}

export const TeamList = ({
  team,
  companyId,
  loading,
  propertyId,
  permissions,
  refetch,
}: TeamListProps) => {
  // const [view, setView] = useState<DataLayout>('list');
  const [userId, setUserId] = useState<number>();
  const toast = useToast();
  const {showActionSheetWithOptions} = useActionSheet();
  const [createModal, setCreateModal] = useState(false);
  const [changeModal, setChangeModal] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);

  const [removeTeamMember] = useRemoveTeamMember();

  const isTabFocused = useIsTabFocused(TAB_NAMES.TEAM);

  useEffect(() => {
    if (isTabFocused) {
      refetch?.();
    }
  }, [isTabFocused, refetch]);

  const deleteMember = useCallback(
    async (memId: number) => {
      try {
        await removeTeamMember({
          variables: {
            id: memId,
          },
          refetchQueries: [
            ...(propertyId
              ? [{query: GET_PROPERTY_TEAM, variables: {propertyId}}]
              : [{query: GET_COMPANY_TEAM, variables: {companyId}}]),
          ],
        });
        toast.show({
          title: ToastNotifications.MemberDeleted,
          placement: 'top',
        });
      } catch (message) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [companyId, propertyId, removeTeamMember, toast],
  );

  const openAlert = (memId: number) => {
    Alert.alert(
      'Delete Member',
      'Are you sure you want to delete this member?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Delete', onPress: () => deleteMember(memId)},
      ],
    );
  };

  const openInvite = () => {
    setInviteModal(true);
  };

  const openCreate = () => {
    setCreateModal(true);
  };

  const openChangePassword = (uId: number) => {
    setUserId(uId);
    setChangeModal(true);
  };

  const openDelete = (memId: number) => {
    openAlert(memId);
  };

  const getActionOptions = (member: TeamMember) => {
    const actions = [];

    if (permissions?.changePassword && member.user.userName) {
      actions.push({
        title: 'Change Password',
        action: () => openChangePassword(member.user.id),
      });
    }

    if (permissions?.delete) {
      actions.push({
        title: 'Delete',
        action: () => openDelete(member.id),
      });
    }

    if (actions.length) {
      actions.push({title: 'Cancel'});
    }

    return actions;
  };

  const getButtonOptions = () => {
    const options = [];

    if (permissions?.create) {
      options.push({
        title: 'Create a New User',
        action: () => openCreate(),
      });
    }
    if (permissions?.invite) {
      options.push({
        title: 'Invite by Email',
        action: () => openInvite(),
      });
    }
    if (options.length) {
      options.push({
        title: 'Cancel',
      });
    }

    return options;
  };

  const renderName = ({user}: TeamMember) => {
    if (user.profile?.firstName) {
      return (
        <ListItemContentTopText numberOfLines={1} ellipsizeMode="tail">
          {user.profile?.firstName} {user.profile?.lastName}
        </ListItemContentTopText>
      );
    }

    return (
      <ListItemFlex>
        <ListItemContentBottomIcon>
          <Icon name={IconTypes.Time} size={14} color="#ea5d21" />
        </ListItemContentBottomIcon>
        <ListItemContentTopText numberOfLines={2} ellipsizeMode="tail">
          {user.profile?.email}
        </ListItemContentTopText>
      </ListItemFlex>
    );
  };

  const canUpdateOrDelete = permissions?.delete || permissions?.changePassword;
  const showMember = (item: TeamMember) => {
    setTeamMember(item);
    setViewModal(true);
  };

  const renderListItem = ({
    item,
    index,
  }: {
    item: TeamMember;
    index?: number;
  }) => (
    <ListItem
      first={index === 0}
      last={(index || 0) + 1 === team?.length}
      onPress={() => showMember(item)}>
      <ListItemAvatar
        resizeMode="cover"
        source={item.user.image ? {uri: item.user.image} : avatar}
      />
      <View>
        <ListItemContentTop>{renderName(item)}</ListItemContentTop>
        <ListItemContentBottom>
          <ListItemContentBottomText>{item.role}</ListItemContentBottomText>
        </ListItemContentBottom>
      </View>
      <ListItemIconArrow>
        {canUpdateOrDelete && (
          <ActionSheet
            options={getActionOptions(item)}
            destructiveButtonIndex={1}
            cancelButtonIndex={2}>
            <Icon name={IconTypes.Dots} color="#8E8FA1" size={16} />
          </ActionSheet>
        )}
      </ListItemIconArrow>
    </ListItem>
  );

  // TODO: this functionality is commented due to https://redmine.gluzdov.com/issues/53777
  // const renderGridItem = ({item}: {item: TeamMember}) => (
  //   <GridItem>
  //     <GridItemAvatar
  //       resizeMode="cover"
  //       source={item.user.image ? {uri: item.user.image} : avatar}
  //     />
  //     {renderName(item)}
  //     <GridItemContentBottom>
  //       <ListItemContentBottomText>{item.role}</ListItemContentBottomText>
  //     </GridItemContentBottom>
  //     <GridViewIconArrow>
  //       {canUpdateOrDelete && (
  //         <ActionSheet
  //           options={getActionOptions(item)}
  //           destructiveButtonIndex={1}
  //           cancelButtonIndex={2}>
  //           <Icon name={IconTypes.Dots} color="#8E8FA1" size={16} />
  //         </ActionSheet>
  //       )}
  //     </GridViewIconArrow>
  //   </GridItem>
  // );
  const addMemberClick = () => {
    showActionSheetWithOptions(
      {
        options: getButtonOptions().map(o => o.title),
        cancelButtonIndex: 2,
      },
      selectedIndex => {
        if (selectedIndex !== undefined) {
          getButtonOptions()[selectedIndex].action?.();
        }
      },
    );
  };

  return (
    <>
      {(permissions?.create || permissions?.invite) && (
        <FloatingButton onPress={addMemberClick}>+ Add Member</FloatingButton>
      )}
      <List<TeamMember>
        onRefresh={() => {
          refetch?.();
        }}
        loading={loading}
        // TODO: this functionality is commented due to https://redmine.gluzdov.com/issues/53777
        // key={view}
        // view={view}
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              {/* TODO: this functionality is commented due to https://redmine.gluzdov.com/issues/53777 */}
              {/* <ViewSwitcher
                setView={setView}
                layout={view}
                entity={LayoutEntityName.TEAM}
              /> */}
              <ListHeaderLeftText>
                {team?.length} {pluralize(team?.length, 'Member')}
              </ListHeaderLeftText>
            </ListHeaderLeft>
          </ListHeader>
        )}
        data={team}
        renderItem={renderListItem}
        // TODO: this functionality is commented due to https://redmine.gluzdov.com/issues/53777
        // renderItem={view === 'list' ? renderListItem : renderGridItem}
        keyExtractor={item => `${item.id}`}
      />
      {changeModal && (
        <ChangePasswordModal
          userId={userId as number}
          closeModal={() => setChangeModal(false)}
        />
      )}
      {inviteModal && (
        <InviteTeamMember
          closeModal={() => setInviteModal(false)}
          companyId={companyId}
          propertyId={propertyId}
        />
      )}
      {createModal && (
        <CreateTeamMember
          closeModal={() => setCreateModal(false)}
          companyId={companyId}
          propertyId={propertyId}
        />
      )}
      {viewModal && teamMember && (
        <ViewTeamMemberModal
          closeModal={() => setViewModal(false)}
          member={teamMember}
        />
      )}
    </>
  );
};
