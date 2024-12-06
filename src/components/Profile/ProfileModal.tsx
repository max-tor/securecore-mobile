import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';

import {userTitles} from '@/constants';
import {ROUTES} from '@/constants/routes';
import {AuthContext} from '@/contexts/auth';
import {useCurrentUser} from '@/hooks/useCurrentUser';
import {HomeScreenNavigationProp} from '@/navigation/types';

import {avatar, Icon, IconTypes} from '../common/Icon';
import {Modal} from '../common/Modal';
import {
  ProfileAvatar,
  ProfileAvatarImage,
  ProfileAvatarWrapper,
  ProfileMenu,
  ProfileMenuItem,
  ProfileMenuLeft,
  ProfileMenuSeparator,
  ProfileMenuText,
  ProfileName,
  ProfileRole,
} from './styles';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal = ({isOpen, onClose}: ProfileModalProps) => {
  const {signOut} = useContext(AuthContext);
  const currentUser = useCurrentUser();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const openProfile = () => {
    navigation.navigate(ROUTES.MENU_STACK, {
      screen: 'ProfileScreen',
    });
    onClose();
  };

  const openFaq = () => {
    navigation.navigate(ROUTES.MENU_STACK, {
      screen: 'FaqScreen',
    });
    onClose();
  };

  const logout = () => {
    onClose();
    signOut();
  };

  const renderContent = () => (
    <>
      <ProfileAvatarWrapper>
        <ProfileAvatar>
          <ProfileAvatarImage
            source={currentUser?.image ? {uri: currentUser?.image} : avatar}
          />
        </ProfileAvatar>
      </ProfileAvatarWrapper>
      <ProfileName>
        {currentUser?.profile?.firstName} {currentUser?.profile?.lastName}
      </ProfileName>
      <ProfileRole>
        {userTitles.find(item => item.key === currentUser?.title)?.label}
      </ProfileRole>
      <ProfileMenu>
        <ProfileMenuItem onPress={openProfile}>
          <ProfileMenuLeft>
            <Icon name={IconTypes.Gear} size={20} color="#8E8FA1" />
            <ProfileMenuText>Settings</ProfileMenuText>
          </ProfileMenuLeft>
          <Icon name={IconTypes.Forward} size={20} color="#E6E6F0" />
        </ProfileMenuItem>
        <ProfileMenuItem onPress={openFaq}>
          <ProfileMenuLeft>
            <Icon name={IconTypes.Faq} size={20} color="#8E8FA1" />
            <ProfileMenuText>Secure Guides</ProfileMenuText>
          </ProfileMenuLeft>
          <Icon name={IconTypes.Forward} size={20} color="#E6E6F0" />
        </ProfileMenuItem>
        <ProfileMenuSeparator />
        <ProfileMenuItem onPress={logout}>
          <ProfileMenuLeft>
            <Icon name={IconTypes.Logout} size={20} color="#8E8FA1" />
            <ProfileMenuText>Log out</ProfileMenuText>
          </ProfileMenuLeft>
        </ProfileMenuItem>
      </ProfileMenu>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile">
      {renderContent()}
    </Modal>
  );
};
